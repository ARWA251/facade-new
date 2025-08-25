import React, { useEffect, useRef, useState } from "react";
import cv from "opencv-ts";

const CropModal = ({
  cropMode,
  selectedImage,
  onCrop,
  addImageDirectly,
  onCancel,
}) => {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [points, setPoints] = useState([]);
  const [draggingPoint, setDraggingPoint] = useState(null);

  // Charger l'image
  useEffect(() => {
    if (!selectedImage) return;
    const img = new Image();
    img.src = selectedImage;
    img.onload = () => {
      setImage(img);
      setPoints([
        { x: 50, y: 50 },
        { x: img.width - 50, y: 50 },
        { x: img.width - 50, y: img.height - 50 },
        { x: 50, y: img.height - 50 },
      ]);
    };
  }, [selectedImage]);

  // Dessiner l'image et les points
  useEffect(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    // Tracer les lignes entre les points
    ctx.strokeStyle = "#00f";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((p, i) => {
      const next = points[(i + 1) % points.length];
      ctx.lineTo(next.x, next.y);
    });
    ctx.closePath();
    ctx.stroke();

    // Dessiner les points
    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#00f";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.stroke();
    });
  }, [image, points]);

  // Gestion du déplacement des points
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const index = points.findIndex(
      (p) => Math.hypot(p.x - x, p.y - y) < 10
    );
    if (index !== -1) setDraggingPoint(index);
  };

  const handleMouseMove = (e) => {
    if (draggingPoint === null) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPoints = [...points];
    newPoints[draggingPoint] = { x, y };
    setPoints(newPoints);
  };

  const handleMouseUp = () => {
    setDraggingPoint(null);
  };

  // Appliquer la transformation perspective avec OpenCV.js
  const handleCropValidate = () => {
    const src = cv.imread(canvasRef.current);
    const dst = new cv.Mat();

    const dsize = new cv.Size(800, 1000);
    const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      points[0].x, points[0].y,
      points[1].x, points[1].y,
      points[2].x, points[2].y,
      points[3].x, points[3].y,
    ]);

    const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      0, 0,
      dsize.width, 0,
      dsize.width, dsize.height,
      0, dsize.height,
    ]);

    const M = cv.getPerspectiveTransform(srcTri, dstTri);
    cv.warpPerspective(src, dst, M, dsize);

    cv.imshow(canvasRef.current, dst);

    // Convertir en blob
    const dataUrl = canvasRef.current.toDataURL("image/jpeg");
    onCrop(dataUrl);

    src.delete();
    dst.delete();
    srcTri.delete();
    dstTri.delete();
    M.delete();
  };

  if (cropMode !== "cropImage" || !selectedImage) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl max-w-[85%] max-h-[90%] shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recadrer l'image</h3>
          <div className="flex-1"></div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Zone de crop */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="rounded-lg shadow-lg cursor-crosshair"
        />

        {/* Boutons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleCropValidate}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Valider le crop
          </button>
          <button
            onClick={addImageDirectly}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Ajouter sans crop
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
