import React, { useState } from 'react';
import { Ruler, Square, Shapes } from 'lucide-react';

const Toolbox = ({
  drawingActive,
  polygonActive,
  scaleActive,
  toggleDrawing,
  togglePolygonDrawing,
  toggleScaleMode,
  selectedEntity,
  setSelectedEntity,
  scaleSet,
}) => {
  const [showPolygonDropdown, setShowPolygonDropdown] = useState(false);
  const [showRectangleDropdown, setShowRectangleDropdown] = useState(false);

  const handlePolygonClick = () => {
    if (!scaleSet) return;
    if (polygonActive) {
      togglePolygonDrawing();
    } else {
      setShowPolygonDropdown((prev) => !prev);
    }
  };

  const handleRectangleClick = () => {
    if (!scaleSet) return;
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
    <aside className="w-64 bg-gradient-to-b from-white via-gray-50 to-white border-r border-gray-200 shadow-sm flex flex-col items-center justify-start p-4">
        <div className="flex flex-col items-center space-y-4">
          {/* Drawing Tools */}
          <div className="flex flex-col items-center bg-gray-100 rounded-full p-1 shadow-inner space-y-2">
          <div className="relative">
            <button
              onClick={handleRectangleClick}
              disabled={!scaleSet}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-out transform ${
                drawingActive
                  ? 'bg-blue-500 text-white shadow-lg scale-105 hover:bg-blue-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm'
              } ${!scaleSet ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Square className="w-4 h-4" />
              <span>Rectangle</span>
            </button>
            {showRectangleDropdown && !drawingActive && (
              <div className="absolute left-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
                <button
                  className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => startRectangleWithType('fenetre')}
                >
                  🪟 Fenêtre
                </button>
                <button
                  className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => startRectangleWithType('porte')}
                >
                  🚪 Porte
                </button>
                <button
                  className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => startRectangleWithType('facade')}
                >
                  🏢 Façade
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={handlePolygonClick}
              disabled={!scaleSet}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-out transform ${
                polygonActive
                  ? 'bg-blue-500 text-white shadow-lg scale-105 hover:bg-blue-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm'
              } ${!scaleSet ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Shapes className="w-4 h-4" />
              <span>Polygon</span>
            </button>
            {showPolygonDropdown && !polygonActive && (
              <div className="absolute left-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
                <button
                  className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => startPolygonWithType('fenetre')}
                >
                  🪟 Fenêtre
                </button>
                <button
                  className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => startPolygonWithType('porte')}
                >
                  🚪 Porte
                </button>
                <button
                  className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => startPolygonWithType('facade')}
                >
                  🏢 Façade
                </button>
              </div>
            )}
          </div>
          <button
            onClick={toggleScaleMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-out transform ${
              scaleActive
                ? 'bg-blue-500 text-white shadow-lg scale-105 hover:bg-blue-600'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm'
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>Échelle</span>
          </button>
        </div>
        {!scaleSet && (
          <p className="text-center text-xs text-gray-500 mt-2 px-2">
            Cliquez sur <span className="font-medium">Échelle</span> pour activer les outils.
          </p>
        )}
      </div>
    </aside>
  );
};

export default Toolbox;
