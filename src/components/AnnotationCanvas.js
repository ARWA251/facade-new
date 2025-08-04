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

  const historyStep = useRef(0);
  const history = useRef([]);
  const historyProcessing = useRef(false);

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

  const saveState = () => {
    if (historyProcessing.current) return;
    
    const canvas = fabricRef.current;
    if (!canvas) return;
    
    const currentState = JSON.stringify(canvas.toJSON(['dataType']));
    
    if (historyStep.current < history.current.length - 1) {
      history.current = history.current.slice(0, historyStep.current + 1);
    }
    
    history.current.push(currentState);
    historyStep.current = history.current.length - 1;
    
    if (history.current.length > 50) {
      history.current = history.current.slice(-50);
      historyStep.current = history.current.length - 1;
    }
  };

  const undo = () => {
    if (historyStep.current > 0) {
      historyProcessing.current = true;
      historyStep.current--;
      
      const canvas = fabricRef.current;
      const state = history.current[historyStep.current];
      
      canvas.loadFromJSON(state, () => {
        canvas.renderAll();
        historyProcessing.current = false;
      });
    }
  };

  const redo = () => {
    if (historyStep.current < history.current.length - 1) {
      historyProcessing.current = true;
      historyStep.current++;
      
      const canvas = fabricRef.current;
      const state = history.current[historyStep.current];
      
      canvas.loadFromJSON(state, () => {
        canvas.renderAll();
        historyProcessing.current = false;
      });
    }
  };

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

    setTimeout(() => {
      saveState();
    }, 100);

    canvas.on('object:added', () => {
      if (!historyProcessing.current) {
        setTimeout(saveState, 100);
      }
    });

    canvas.on('object:removed', () => {
      if (!historyProcessing.current) {
        setTimeout(saveState, 100);
      }
    });

    canvas.on('object:modified', () => {
      if (!historyProcessing.current) {
        setTimeout(saveState, 100);
      }
    });

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
      if (rectRef.current) rectRef.current.setCoords();
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
    setTimeout(saveState, 100);
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
      setTimeout(saveState, 100);
    };
  };
const addImageDirectlyTwo = (imageUrl) => {
  if (!imageUrl) return;

  const canvas = fabricRef.current;
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

    setTimeout(saveState, 100);
  };

  htmlImg.src = imageUrl; // ⚠️ Toujours définir `.src` après `onload`
};


  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100vh', 
      backgroundColor: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #444'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            backgroundColor: '#333',
            padding: '8px 12px',
            borderRadius: '4px',
            color: 'white',
            fontSize: '12px',
            cursor: 'pointer'
          }}>
            ☰ Menu
          </div>

          <div style={{
            backgroundColor: '#333',
            padding: '8px 12px',
            borderRadius: '4px',
            color: 'white',
            fontSize: '12px',
            cursor: 'pointer'
          }} onClick={undo}>
            ↶ Précédent
          </div>

          <div style={{
            backgroundColor: '#333',
            padding: '8px 12px',
            borderRadius: '4px',
            color: 'white',
            fontSize: '12px',
            cursor: 'pointer'
          }} onClick={redo}>
            ↷ Suivant
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{
            backgroundColor: '#333',
            border: 'none',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer'
          }} onClick={clearBoxes}>
            🗑 Clear
          </button>
          
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input" style={{
            backgroundColor: '#333',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            color: 'white'
          }}>
            📁 Image
          </label>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        display: 'flex', 
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* Left Sidebar */}
        <div style={{
          width: '60px',
          backgroundColor: '#2a2a2a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '10px 0',
          gap: '10px'
        }}>
          <div style={{
            padding: '10px',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            backgroundColor: drawingActive ? '#4a90e2' : 'transparent'
          }} onClick={toggleDrawing}>
            ➤
          </div>
          
          <div style={{
            padding: '10px',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            backgroundColor: polygonActive ? '#4a90e2' : 'transparent'
          }} onClick={togglePolygonDrawing}>
            ⬟
          </div>
        </div>

        {/* Canvas Area */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: '#1a1a1a',
          padding: '20px'
        }}>
          <canvas ref={canvasRef} style={{ border: '1px solid #444' }} />
        </div>

        {/* Right Sidebar */}
        <div style={{
          width: '300px',
          backgroundColor: '#2a2a2a',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#333',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3 style={{
              color: 'white',
              margin: '0 0 15px 0',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>FACADE 1 (MANUAL)</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{
                color: '#aaa',
                fontSize: '12px',
                display: 'block',
                marginBottom: '5px'
              }}>Type d'annotation:</label>
              <select 
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#222',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '14px'
                }}
              >
                <option value="fenetre">🪟 Fenêtre</option>
                <option value="porte">🚪 Porte</option>
                <option value="facade">🏢 Façade</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <button
                onClick={toggleDrawing}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: drawingActive ? '#4a90e2' : '#444',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {drawingActive ? 'Stop Rectangle' : 'Rectangle'}
              </button>
              
              <button
                onClick={togglePolygonDrawing}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: polygonActive ? '#4a90e2' : '#444',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {polygonActive ? 'Stop Polygon' : 'Polygon'}
              </button>
            </div>

            <button
              onClick={exportAnnotations}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#28a745',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              💾 Sauvegarder
            </button>
          </div>
        </div>
      </div>

      {/* Interface de Crop */}
      {cropMode === 'cropImage' && selectedImage && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#333',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '80%',
            maxHeight: '80%',
            overflow: 'auto'
          }}>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>Recadrer l'image</h3>
            
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={undefined}
            >
              <img
                ref={imgRef}
                src={selectedImage}
                style={{ maxWidth: '100%', maxHeight: '400px' }}
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
            
            <div style={{ display: 'flex', marginTop: '15px', gap: '10px' }}>
              <button 
                onClick={handleCropValidate} 
                style={{ 
                  padding: '10px 20px', 
                  background: '#28a745', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ✅ Valider le crop
              </button>
              
              <button 
                onClick={addImageDirectly} 
                style={{ 
                  padding: '10px 20px', 
                  background: '#007bff', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
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
                style={{ 
                  padding: '10px 20px', 
                  background: '#dc3545', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
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