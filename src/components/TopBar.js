import React from 'react';

const TopBar = ({
  drawingActive,
  polygonActive,
  toggleDrawing,
  togglePolygonDrawing,
  selectedEntity,
  setSelectedEntity,
  exportAnnotations,
  handleImageUpload,
}) => (
  <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
    <div className="text-lg font-semibold text-gray-900">
      FACADE 1 <span className="text-gray-400 text-sm">(MANUAL)</span>
    </div>

    <div className="flex items-center space-x-2">
      <button
        onClick={toggleDrawing}
        className={`px-4 py-1 rounded-full transition duration-200 ease-in-out shadow-sm ${
          drawingActive
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-100'
        }`}
      >
        Rectangle
      </button>
      <button
        onClick={togglePolygonDrawing}
        className={`px-4 py-1 rounded-full transition duration-200 ease-in-out shadow-sm ${
          polygonActive
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-100'
        }`}
      >
        Polygon
      </button>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        id="image-upload"
        className="hidden"
      />
      <label
        htmlFor="image-upload"
        className="px-4 py-1 rounded-full bg-gray-200 text-gray-700 shadow cursor-pointer hover:bg-gray-100 transition duration-200 ease-in-out"
      >
        Image
      </label>

      <label className="text-sm text-gray-500">Type d'annotation:</label>
      <select
        value={selectedEntity}
        onChange={(e) => setSelectedEntity(e.target.value)}
        className="border rounded px-2 py-1 text-sm"
      >
        <option value="fenetre">Fenêtre</option>
        <option value="porte">Porte</option>
        <option value="facade">Façade</option>
      </select>

      <button
        onClick={exportAnnotations}
        className="bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition duration-200 ease-in-out"
      >
        Sauvegarder
      </button>
    </div>
  </div>
);

export default TopBar;
