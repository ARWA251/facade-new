import React from 'react';

const Sidebar = ({ selectedEntity, setSelectedEntity, drawingActive, polygonActive, toggleDrawing, togglePolygonDrawing, exportAnnotations }) => (
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
);

export default Sidebar;
