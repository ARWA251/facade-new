import React, { useState } from 'react';
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
}) => {
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
    <aside className="order-2 md:order-1 w-full md:w-64 bg-gradient-to-b from-white via-gray-50 to-white border-t md:border-t-0 md:border-r border-gray-200 shadow-sm flex flex-row md:flex-col items-center justify-center md:justify-start p-4">
      <div className="flex flex-row md:flex-col items-center space-x-4 md:space-x-0 md:space-y-4">
        {/* Drawing Tools */}
        <div className="flex flex-row md:flex-col items-center bg-gray-100 rounded-full p-1 shadow-inner space-x-2 md:space-x-0 md:space-y-2">
          <div className="relative">
            <button
              onClick={handleRectangleClick}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-out transform ${
                drawingActive
                  ? 'bg-blue-500 text-white shadow-lg scale-105 hover:bg-blue-600'
                  : 'text-gray-700 hover:bg-white hover:shadow-sm'
              }`}
            >
              Rectangle
            </button>
            {showRectangleDropdown && !drawingActive && (
              <div className="absolute left-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
                <button
                  className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => startRectangleWithType('fenetre')}
                >
                  Fenêtre
                </button>
                <button
                  className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => startRectangleWithType('porte')}
                >
                  Porte
                </button>
                <button
                  className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => startRectangleWithType('facade')}
                >
                  Façade
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={handlePolygonClick}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-out transform ${
                polygonActive
                  ? 'bg-blue-500 text-white shadow-lg scale-105 hover:bg-blue-600'
                  : 'text-gray-700 hover:bg-white hover:shadow-sm'
              }`}
            >
              Polygon
            </button>
            {showPolygonDropdown && !polygonActive && (
              <div className="absolute left-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
                <button
                  className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => startPolygonWithType('fenetre')}
                >
                  Fenêtre
                </button>
                <button
                  className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => startPolygonWithType('porte')}
                >
                  Porte
                </button>
                <button
                  className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => startPolygonWithType('facade')}
                >
                  Façade
                </button>
              </div>
            )}
          </div>
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
      </div>
    </aside>
  );
};

export default Toolbox;
