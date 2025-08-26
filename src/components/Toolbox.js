import React, { useState } from 'react';
import { Ruler, Square, Shapes, Circle, CopyPlus } from 'lucide-react';

const Toolbox = ({
  drawingActive,
  polygonActive,
  arcActive,
  scaleActive,
  toggleDrawing,
  togglePolygonDrawing,
  toggleArcDrawing,
  toggleScaleMode,
  selectedEntity,
  setSelectedEntity,
  disabled,
  duplicateSelected,
}) => {
  const [showPolygonDropdown, setShowPolygonDropdown] = useState(false);
  const [showRectangleDropdown, setShowRectangleDropdown] = useState(false);
  const [duplicationCount, setDuplicationCount] = useState(1);

  const handlePolygonClick = () => {
    if (disabled) return;
    // Close the rectangle dropdown if it's open
    setShowRectangleDropdown(false);
    if (polygonActive) {
      togglePolygonDrawing();
      setShowPolygonDropdown(true);
    } else {
      setShowPolygonDropdown((prev) => !prev);
    }
  };

  const handleRectangleClick = () => {
    if (disabled) return;
    // Close the polygon dropdown if it's open
    setShowPolygonDropdown(false);
    setShowRectangleDropdown((prev) => !prev);
  };

  const startPolygonWithType = (type) => {
    setSelectedEntity(type);
    setShowPolygonDropdown(false);
    togglePolygonDrawing();
  };

  const startRectangleWithType = (type) => {
    setSelectedEntity(type);
    setShowRectangleDropdown(false);
    if (!drawingActive) {
      toggleDrawing();
    }
  };

  const handleDuplicate = () => {
    if (disabled) return;
    const count = Math.max(1, parseInt(duplicationCount, 10) || 1);
    duplicateSelected(count);
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-white via-gray-50 to-white border-r border-gray-200 shadow-sm flex flex-col items-center justify-start p-4">
        <div className="flex flex-col items-center space-y-4">
          {/* Drawing Tools */}
          <div className="flex flex-col items-center bg-gray-100 rounded-full p-1 shadow-inner space-y-2">
          <div className="relative">
            <button
              onClick={handleRectangleClick}
              disabled={disabled}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-out transform ${
                disabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : drawingActive
                    ? 'bg-blue-500 text-white shadow-lg scale-105 hover:bg-blue-600'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              <Square className="w-4 h-4" />
              <span>Rectangle</span>
            </button>
            {showRectangleDropdown && !disabled && (
              <div className="absolute top-0 left-full ml-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
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
              disabled={disabled}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-out transform ${
                disabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : polygonActive
                    ? 'bg-blue-500 text-white shadow-lg scale-105 hover:bg-blue-600'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              <Shapes className="w-4 h-4" />
              <span>Polygon</span>
            </button>
            {showPolygonDropdown && !polygonActive && !disabled && (
              <div className="absolute top-0 left-full ml-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
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
            onClick={toggleArcDrawing}
            disabled={disabled}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-out transform ${
              disabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : arcActive
                  ? 'bg-blue-500 text-white shadow-lg scale-105 hover:bg-blue-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm'
            }`}
          >
            <Circle className="w-4 h-4" />
            <span>Arc</span>
          </button>
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
          <div className="flex items-center gap-2 pt-2">
            <input
              type="number"
              min="1"
              value={duplicationCount}
              onChange={(e) => setDuplicationCount(e.target.value)}
              className="w-16 px-2 py-1 border rounded-md text-sm"
              disabled={disabled}
            />
            <button
              onClick={handleDuplicate}
              disabled={disabled}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-out transform ${
                disabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              <CopyPlus className="w-4 h-4" />
              <span>Dupliquer</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Toolbox;
