import React, { useState } from 'react';

const Sidebar = ({ selectedEntity, setSelectedEntity, drawingActive, polygonActive, toggleDrawing, togglePolygonDrawing, exportAnnotations }) => {
  const [showPolygonDropdown, setShowPolygonDropdown] = useState(false);
  const [showRectangleDropdown, setShowRectangleDropdown] = useState(false);

  const handlePolygonClick = () => {
    if (polygonActive) {
      togglePolygonDrawing();
    } else {
      setShowPolygonDropdown((prev) => !prev);
    }
  };

  const handleRectangleClick = () => {
    if (drawingActive) {
      toggleDrawing();
    } else {
      setShowRectangleDropdown((prev) => !prev);
    }
  };

  const startPolygonWithType = (type) => {
    setSelectedEntity(type);
    setShowPolygonDropdown(false);
    togglePolygonDrawing();
  };

  const startRectangleWithType = (type) => {
    setSelectedEntity(type);
    setShowRectangleDropdown(false);
    toggleDrawing();
  };

  return (
    <div className="w-72 bg-gray-800 p-5 overflow-auto">
      <div className="bg-gray-700 p-4 rounded mb-5">
        <h3 className="text-white mb-4 text-lg font-bold">FACADE 1 (MANUAL)</h3>

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <button
              onClick={handleRectangleClick}
              className={`w-full p-2 rounded text-white text-xs ${drawingActive ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
              {drawingActive ? 'Stop Rectangle' : 'Rectangle'}
            </button>
            {showRectangleDropdown && !drawingActive && (
              <div className="absolute left-0 mt-1 w-full bg-gray-800 border border-gray-600 rounded z-10">
                <button
                  className="block w-full text-left px-2 py-1 text-white text-xs hover:bg-gray-700"
                  onClick={() => startRectangleWithType('fenetre')}
                >
                  🪟 Fenêtre
                </button>
                <button
                  className="block w-full text-left px-2 py-1 text-white text-xs hover:bg-gray-700"
                  onClick={() => startRectangleWithType('porte')}
                >
                  🚪 Porte
                </button>
                <button
                  className="block w-full text-left px-2 py-1 text-white text-xs hover:bg-gray-700"
                  onClick={() => startRectangleWithType('facade')}
                >
                  🏢 Façade
                </button>
              </div>
            )}
          </div>
          <div className="relative flex-1">
            <button
              onClick={handlePolygonClick}
              className={`w-full p-2 rounded text-white text-xs ${polygonActive ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
              {polygonActive ? 'Stop Polygon' : 'Polygon'}
            </button>
            {showPolygonDropdown && !polygonActive && (
              <div className="absolute left-0 mt-1 w-full bg-gray-800 border border-gray-600 rounded z-10">
                <button
                  className="block w-full text-left px-2 py-1 text-white text-xs hover:bg-gray-700"
                  onClick={() => startPolygonWithType('fenetre')}
                >
                  🪟 Fenêtre
                </button>
                <button
                  className="block w-full text-left px-2 py-1 text-white text-xs hover:bg-gray-700"
                  onClick={() => startPolygonWithType('porte')}
                >
                  🚪 Porte
                </button>
                <button
                  className="block w-full text-left px-2 py-1 text-white text-xs hover:bg-gray-700"
                  onClick={() => startPolygonWithType('facade')}
                >
                  🏢 Façade
                </button>
              </div>
            )}
          </div>
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
};

export default Sidebar;
