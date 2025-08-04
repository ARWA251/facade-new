import React from 'react';

const Toolbox = ({ drawingActive, polygonActive, toggleDrawing, togglePolygonDrawing }) => (
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
);

export default Toolbox;
