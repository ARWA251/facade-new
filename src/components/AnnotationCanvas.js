import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Circle, Line, Rect, Polygon, Image as FabricImage } from 'fabric';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const AnnotationCanvas = () => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [cropMode, setCropMode] = useState(null);
  const cropShapeRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    x: 25,
    y: 25,
    width: 50,
    height: 50
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const isDrawingMode = useRef(false);
  const isPolygonMode = useRef(false);
  const currentPolygonPoints = useRef([]);
  const currentPolygonLines = useRef([]);
  const currentPolygonCircles = useRef([]);
  const previewLine = useRef(null);
  const rectRef = useRef(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const drawing = useRef(false);

  const [drawingActive, setDrawingActive] = useState(false);
  const [polygonActive, setPolygonActive] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState('fenetre');

  const annotationsHistory = useRef([]);
  const redoStack = useRef([]);

  const cropPoints = useRef([]);
  const cropLines = useRef([]);
  const cropCircles = useRef([]);
  const cropPreviewLine = useRef(null);

  const entityColors = {
    fenetre: { 
      fill: 'rgba(255, 0, 255, 0.2)', 
      stroke: '#FF00FF',
      strokeWidth: 2
    },
    porte: { 
      fill: 'rgba(0, 255, 0, 0.2)', 
      stroke: '#00FF00',
      strokeWidth: 2
    },
    facade: { 
      fill: 'rgba(0, 255, 0, 0.3)', 
      stroke: '#00FF00',
      strokeWidth: 3
    }
  };

  const geoBounds = {
    minLon: -6.9,
    maxLon: -6.8,
    minLat: 33.99,
    maxLat: 34.04
  };

  const pixelToGeo = (x, y, imgWidth, imgHeight) => {
    const lon = geoBounds.minLon + (x / imgWidth) * (geoBounds.maxLon - geoBounds.minLon);
    const lat = geoBounds.maxLat - (y / imgHeight) * (geoBounds.maxLat - geoBounds.minLat);
    return [lon, lat];
  };

  const selectedEntityRef = useRef(selectedEntity);

  useEffect(() => {
    selectedEntityRef.current = selectedEntity;
  }, [selectedEntity]);

  const undo = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const annotation = annotationsHistory.current.pop();
    if (annotation) {
      redoStack.current.push(annotation);
      canvas.remove(annotation);
      canvas.renderAll();
    }
  };

  const redo = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const annotation = redoStack.current.pop();
    if (annotation) {
      canvas.add(annotation);
      annotationsHistory.current.push(annotation);
      canvas.renderAll();
    }
  };

  // Allow keyboard shortcuts (Ctrl/Cmd + Z or Y) to trigger undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const cleanupCropMode = () => {
    const canvas = fabricRef.current;
    
    if (cropShapeRef.current) {
      canvas.remove(cropShapeRef.current);
      cropShapeRef.current = null;
    }
    
    cropLines.current.forEach(line => canvas.remove(line));
    cropCircles.current.forEach(circle => canvas.remove(circle));
    
    if (cropPreviewLine.current) {
      canvas.remove(cropPreviewLine.current);
      cropPreviewLine.current = null;
    }
    
    cropPoints.current = [];
    cropLines.current = [];
    cropCircles.current = [];
    
    setCropMode(null);
    canvas.renderAll();
  };

  // Canvas initialisé une seule fois
  useEffect(() => {
    const canvas = new Canvas(canvasRef.current, {
      backgroundColor: '#f5f5f5'
    });
    fabricRef.current = canvas;

    canvas.setWidth(1200);
    canvas.setHeight(800);

    canvas.on('mouse:down', function (opt) {
      const pointer = canvas.getPointer(opt.e);

      if (isPolygonMode.current) {
        const point = new Circle({
          left: pointer.x,
          top: pointer.y,
          radius: 4,
          fill: '#00FF00',
          selectable: false,
          evented: false
        });
        canvas.add(point);
        currentPolygonPoints.current.push([pointer.x, pointer.y]);
        currentPolygonCircles.current.push(point);

        if (currentPolygonPoints.current.length > 1) {
          const [x1, y1] = currentPolygonPoints.current.at(-2);
          const [x2, y2] = currentPolygonPoints.current.at(-1);
          const line = new Line([x1, y1, x2, y2], {
            stroke: '#00FF00',
            strokeWidth: 2,
            selectable: false,
            evented: false
          });
          canvas.add(line);
          currentPolygonLines.current.push(line);
        }

        if (previewLine.current) {
          canvas.remove(previewLine.current);
          previewLine.current = null;
        }

        canvas.renderAll();
        return;
      }

      if (isDrawingMode.current) {
        const color = entityColors[selectedEntityRef.current] || entityColors['facade'];

        startX.current = pointer.x;
        startY.current = pointer.y;
        drawing.current = true;

        const rect = new Rect({
          left: pointer.x,
          top: pointer.y,
          width: 0,
          height: 0,
          fill: color.fill,
          stroke: color.stroke,
          strokeWidth: color.strokeWidth,
          selectable: true,
          objectCaching: false,
          dataType: selectedEntityRef.current,
          cornerStyle: 'rect',
          cornerSize: 6,
          cornerColor: color.stroke,
          borderColor: color.stroke
        });

        rectRef.current = rect;
        canvas.add(rect);
      }
    });

    canvas.on('mouse:move', function (opt) {
      const pointer = canvas.getPointer(opt.e);

      if (isPolygonMode.current && currentPolygonPoints.current.length > 0) {
        const [lastX, lastY] = currentPolygonPoints.current.at(-1);

        if (previewLine.current) {
          canvas.remove(previewLine.current);
        }

        previewLine.current = new Line([lastX, lastY, pointer.x, pointer.y], {
          stroke: '#00FF00',
          strokeWidth: 2,
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false
        });

        canvas.add(previewLine.current);
        canvas.renderAll();
        return;
      }

      if (drawing.current && rectRef.current) {
        const width = pointer.x - startX.current;
        const height = pointer.y - startY.current;

        rectRef.current.set({
          width: Math.abs(width),
          height: Math.abs(height),
          left: width < 0 ? pointer.x : startX.current,
          top: height < 0 ? pointer.y : startY.current
        });

        canvas.renderAll();
      }
    });

    canvas.on('mouse:up', function () {
      drawing.current = false;
      if (rectRef.current) {
        rectRef.current.setCoords();
        annotationsHistory.current.push(rectRef.current);
        redoStack.current = [];
      }
    });

    canvas.on('mouse:dblclick', function () {
      if (!isPolygonMode.current || currentPolygonPoints.current.length < 3) return;

      const color = entityColors[selectedEntityRef.current] || entityColors['facade'];

      const polygon = new Polygon(
        currentPolygonPoints.current.map(p => ({ x: p[0], y: p[1] })),
        {
          fill: color.fill,
          stroke: color.stroke,
          strokeWidth: color.strokeWidth,
          selectable: true,
          objectCaching: false,
          dataType: selectedEntityRef.current,
          cornerStyle: 'rect',
          cornerSize: 6,
          cornerColor: color.stroke,
          borderColor: color.stroke
        }
      );

      canvas.add(polygon);
      annotationsHistory.current.push(polygon);
      redoStack.current = [];

      currentPolygonLines.current.forEach(line => canvas.remove(line));
      currentPolygonCircles.current.forEach(c => canvas.remove(c));
      if (previewLine.current) {
        canvas.remove(previewLine.current);
        previewLine.current = null;
      }

      currentPolygonPoints.current = [];
      currentPolygonLines.current = [];
      currentPolygonCircles.current = [];
      isPolygonMode.current = false;
      setPolygonActive(false);

      canvas.renderAll();
    });

    return () => canvas.dispose();
  }, []);

  const toggleDrawing = () => {
    isDrawingMode.current = !isDrawingMode.current;
    setDrawingActive(isDrawingMode.current);

    if (isDrawingMode.current && isPolygonMode.current) {
      isPolygonMode.current = false;
      setPolygonActive(false);
    }
  };

  const togglePolygonDrawing = () => {
    const canvas = fabricRef.current;
    isPolygonMode.current = !isPolygonMode.current;
    setPolygonActive(isPolygonMode.current);

    currentPolygonPoints.current = [];
    currentPolygonLines.current.forEach(line => canvas.remove(line));
    currentPolygonLines.current = [];

    if (previewLine.current) {
      canvas.remove(previewLine.current);
      previewLine.current = null;
    }

    canvas.renderAll();

    if (isPolygonMode.current && isDrawingMode.current) {
      isDrawingMode.current = false;
      setDrawingActive(false);
    }
  };

  const clearBoxes = () => {
    const canvas = fabricRef.current;
    const objectsToRemove = canvas.getObjects().filter(obj => {
      if (obj.type === 'image') return false;
      if (obj === canvas.backgroundImage) return false;
      return true;
    });
    
    objectsToRemove.forEach(obj => canvas.remove(obj));
    canvas.renderAll();
    annotationsHistory.current = [];
    redoStack.current = [];
  };

  const exportAnnotations = () => {
    const canvas = fabricRef.current;
    const features = [];
    const imgWidth = canvas.getWidth();
    const imgHeight = canvas.getHeight();

    canvas.getObjects().forEach(obj => {
      if (obj === canvas.backgroundImage) return;

      let polygon = [];

      if (obj.type === 'rect') {
        const left = obj.left;
        const top = obj.top;
        const width = obj.width * obj.scaleX;
        const height = obj.height * obj.scaleY;
        polygon = [
          pixelToGeo(left, top, imgWidth, imgHeight),
          pixelToGeo(left + width, top, imgWidth, imgHeight),
          pixelToGeo(left + width, top + height, imgWidth, imgHeight),
          pixelToGeo(left, top + height, imgWidth, imgHeight),
          pixelToGeo(left, top, imgWidth, imgHeight)
        ];
      } else if (obj.type === 'polygon') {
        polygon = obj.points.map(p => pixelToGeo(p.x + obj.left, p.y + obj.top, imgWidth, imgHeight));
        polygon.push(polygon[0]);
      } else {
        return;
      }

      features.push({
        type: "Feature",
        properties: {
          label: obj.dataType || "unknown",
          fill: obj.fill,
          stroke: obj.stroke
        },
        geometry: {
          type: "Polygon",
          coordinates: [polygon]
        }
      });
    });

    const geojson = {
      type: "FeatureCollection",
      features
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/geo+json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "annotations.geojson";
    a.click();
    URL.revokeObjectURL(url);
  };
// Voici où devrait se trouver la fonction addImageToCanvas :

// Fonction pour ajouter l'image directement au canvas

  // Fonction de crop corrigée
 const handleCropValidate = () => {
  if (!completedCrop?.width || !completedCrop?.height || !imgRef.current) {
    console.log('Crop invalide:', { completedCrop, imgRef: imgRef.current });
    return;
  }

  const canvas = document.createElement('canvas');
  const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
  const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

  canvas.width = completedCrop.width;
  canvas.height = completedCrop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    imgRef.current,
    completedCrop.x * scaleX,
    completedCrop.y * scaleY,
    completedCrop.width * scaleX,
    completedCrop.height * scaleY,
    0,
    0,
    completedCrop.width,
    completedCrop.height
  );

  canvas.toBlob((blob) => {
    if (!blob) return;

    const croppedImageUrl = URL.createObjectURL(blob);
    addImageDirectlyTwo(croppedImageUrl); // Ne révoque pas ici !
    
    // Réinitialisation
    setCropMode(null);
    setSelectedImage(null);
    setCrop({ unit: '%', x: 25, y: 25, width: 50, height: 50 });
    setCompletedCrop(null);
  }, 'image/png');
};


  const handleImageUpload = (e) => {
    const canvas = fabricRef.current;
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const imageUrl = event.target.result;
      setSelectedImage(imageUrl);
      setCropMode('cropImage');
      
      // Réinitialiser le crop
      setCrop({ unit: '%', x: 25, y: 25, width: 50, height: 50 });
      setCompletedCrop(null);
    };
    reader.readAsDataURL(file);
  };

  // Fonction pour ajouter l'image directement sans crop
  const addImageDirectly = () => {
    if (!selectedImage) return;

    const canvas = fabricRef.current;

    // Supprimer l'ancienne image et les annotations existantes
    clearBoxes();
    canvas.getObjects('image').forEach((img) => canvas.remove(img));

    const htmlImg = new window.Image();
    htmlImg.src = selectedImage;

    htmlImg.onload = function () {
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();

      const scaleX = canvasWidth / htmlImg.width;
      const scaleY = canvasHeight / htmlImg.height;
      const scale = Math.min(scaleX, scaleY) * 0.9;

      const fabricImg = new FabricImage(htmlImg, {
        scaleX: scale,
        scaleY: scale,
        left: (canvasWidth - htmlImg.width * scale) / 2,
        top: (canvasHeight - htmlImg.height * scale) / 2,
        selectable: false,  // Empêche la sélection
        evented: false,     // Empêche les événements
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        hoverCursor: 'default',
        moveCursor: 'default'
      });

      canvas.add(fabricImg);
      // Envoyer l'image au fond
      // canvas.sendToBack(fabricImg);
      canvas.requestRenderAll();

      setCropMode(null);
      setSelectedImage(null);
    };
  };

const addImageDirectlyTwo = (imageUrl) => {
  if (!imageUrl) return;

  const canvas = fabricRef.current;

  // Supprimer l'ancienne image et les annotations existantes
  clearBoxes();
  canvas.getObjects('image').forEach((img) => canvas.remove(img));

  const htmlImg = new window.Image();

  htmlImg.onload = function () {
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    const scaleX = canvasWidth / htmlImg.width;
    const scaleY = canvasHeight / htmlImg.height;
    const scale = Math.min(scaleX, scaleY) * 0.9;

    const fabricImg = new FabricImage(htmlImg, {
      scaleX: scale,
      scaleY: scale,
      left: (canvasWidth - htmlImg.width * scale) / 2,
      top: (canvasHeight - htmlImg.height * scale) / 2,
      selectable: false,
      evented: false,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      lockScalingX: true,
      lockScalingY: true,
      hoverCursor: 'default',
      moveCursor: 'default'
    });

    canvas.add(fabricImg);
    canvas.requestRenderAll();

    // 🔁 Révoquer après que l’image soit bien ajoutée
    setTimeout(() => {
      URL.revokeObjectURL(imageUrl);
    }, 1000);
  };

  htmlImg.src = imageUrl; // ⚠️ Toujours définir `.src` après `onload`
};


  return (
    <div className="relative w-full h-screen bg-gray-900 flex flex-col">
      {/* Top Toolbar */}
      <div className="flex justify-between items-center px-5 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="bg-gray-700 px-3 py-2 rounded text-white text-xs cursor-pointer">
            ☰ Menu
          </div>
          <div className="bg-gray-700 px-3 py-2 rounded text-white text-xs cursor-pointer" onClick={undo}>
            ↶ Précédent
          </div>
          <div className="bg-gray-700 px-3 py-2 rounded text-white text-xs cursor-pointer" onClick={redo}>
            ↷ Suivant
          </div>
        </div>
        <div className="flex gap-2">
          <button className="bg-gray-700 text-white px-3 py-2 rounded" onClick={clearBoxes}>
            🗑 Clear
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="bg-gray-700 px-3 py-2 rounded cursor-pointer text-white">
            📁 Image
          </label>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-16 bg-gray-800 flex flex-col items-center py-2 gap-2">
          <div
            className={`p-2 rounded text-white cursor-pointer ${drawingActive ? 'bg-blue-500' : 'bg-transparent'}`}
            onClick={toggleDrawing}
          >
            ➤
          </div>
          <div
            className={`p-2 rounded text-white cursor-pointer ${polygonActive ? 'bg-blue-500' : 'bg-transparent'}`}
            onClick={togglePolygonDrawing}
          >
            ⬟
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex justify-center items-center bg-gray-900 p-5">
          <canvas ref={canvasRef} className="border border-gray-700" />
        </div>

        {/* Right Sidebar */}
        <div className="w-72 bg-gray-800 p-5 overflow-auto">
          <div className="bg-gray-700 p-4 rounded mb-5">
            <h3 className="text-white mb-4 text-lg font-bold">FACADE 1 (MANUAL)</h3>
            <div className="mb-4">
              <label className="text-gray-300 text-xs block mb-1">Type d'annotation:</label>
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600 text-sm"
              >
                <option value="fenetre">🪟 Fenêtre</option>
                <option value="porte">🚪 Porte</option>
                <option value="facade">🏢 Façade</option>
              </select>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={toggleDrawing}
                className={`flex-1 p-2 rounded text-white text-xs ${drawingActive ? 'bg-blue-500' : 'bg-gray-600'}`}
              >
                {drawingActive ? 'Stop Rectangle' : 'Rectangle'}
              </button>
              <button
                onClick={togglePolygonDrawing}
                className={`flex-1 p-2 rounded text-white text-xs ${polygonActive ? 'bg-blue-500' : 'bg-gray-600'}`}
              >
                {polygonActive ? 'Stop Polygon' : 'Polygon'}
              </button>
            </div>

            <button
              onClick={exportAnnotations}
              className="w-full py-3 bg-green-600 rounded text-white text-sm"
            >
              💾 Sauvegarder
            </button>
          </div>
        </div>
      </div>

      {/* Interface de Crop */}
      {cropMode === 'cropImage' && selectedImage && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-5 rounded-lg max-w-[80%] max-h-[80%] overflow-auto">
            <h3 className="text-white mb-4">Recadrer l'image</h3>

            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={undefined}
            >
              <img
                ref={imgRef}
                src={selectedImage}
                className="max-w-full max-h-[400px]"
                onLoad={() => {
                  if (imgRef.current) {
                    const { width, height } = imgRef.current;
                    setCompletedCrop({
                      unit: 'px',
                      x: width * 0.25,
                      y: height * 0.25,
                      width: width * 0.5,
                      height: height * 0.5
                    });
                  }
                }}
              />
            </ReactCrop>

            <div className="flex mt-4 gap-3">
              <button
                onClick={handleCropValidate}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                ✅ Valider le crop
              </button>
              <button
                onClick={addImageDirectly}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                📷 Ajouter sans crop
              </button>
              <button
                onClick={() => {
                  setCropMode(null);
                  setSelectedImage(null);
                  setCrop({ unit: '%', x: 25, y: 25, width: 50, height: 50 });
                  setCompletedCrop(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnotationCanvas;