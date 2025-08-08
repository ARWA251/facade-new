import React from 'react';
import { Ruler } from 'lucide-react';

const Toolbox = ({
  drawingActive,
  polygonActive,
  scaleActive,
  toggleDrawing,
  togglePolygonDrawing,
  toggleScaleMode,
  selectedEntity,
  setSelectedEntity,
}) => (
  <aside className="order-2 md:order-1 w-full md:w-64 bg-gradient-to-b from-white via-gray-50 to-white border-t md:border-t-0 md:border-r border-gray-200 shadow-sm flex flex-row md:flex-col items-center justify-center md:justify-start p-4">
    <div className="flex flex-row md:flex-col items-center space-x-4 md:space-x-0 md:space-y-4">
      {/* Drawing Tools */}
      <div className="flex flex-row md:flex-col items-center bg-gray-100 rounded-full p-1 shadow-inner space-x-2 md:space-x-0 md:space-y-2">
        <button
          onClick={toggleDrawing}
          className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-out transform ${
            drawingActive
              ? 'bg-blue-500 text-white shadow-lg scale-105 hover:bg-blue-600'
              : 'text-gray-700 hover:bg-white hover:shadow-sm'
          }`}
        >
          Rectangle
        </button>
        <button
          onClick={togglePolygonDrawing}
          className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-out transform ${
            polygonActive
              ? 'bg-blue-500 text-white shadow-lg scale-105 hover:bg-blue-600'
              : 'text-gray-700 hover:bg-white hover:shadow-sm'
          }`}
        >
          Polygon
        </button>
        <button
          onClick={toggleScaleMode}
          className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-out transform ${
            scaleActive
              ? 'bg-blue-500 text-white shadow-lg scale-105 hover:bg-blue-600'
              : 'text-gray-700 hover:bg-white hover:shadow-sm'
          }`}
        >
          <Ruler className="inline-block w-4 h-4 mr-1" />
          Échelle
        </button>
      </div>

      {/* Annotation Type Selector */}
      <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-md border border-gray-200">
        <label className="text-sm font-medium text-gray-600">Type:</label>
        <select
          value={selectedEntity}
          onChange={(e) => setSelectedEntity(e.target.value)}
          className="border-0 bg-transparent text-sm font-medium text-gray-800 focus:outline-none cursor-pointer"
        >
          <option value="fenetre">Fenêtre</option>
          <option value="porte">Porte</option>
          <option value="facade">Façade</option>
        </select>
      </div>
    </div>
  </aside>
);

export default Toolbox;
