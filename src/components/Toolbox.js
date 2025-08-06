import React from 'react';

const Toolbox = ({ undo, redo }) => (
  <aside className="w-16 bg-white border-r flex flex-col items-center space-y-4 py-4">
    <button
      onClick={undo}
      className="text-gray-400 hover:text-blue-500 transition duration-200"
    >
      ↶
    </button>
    <button
      onClick={redo}
      className="text-gray-400 hover:text-blue-500 transition duration-200"
    >
      ↷
    </button>
  </aside>
);

export default Toolbox;
