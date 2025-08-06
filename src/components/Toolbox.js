import React from 'react';

const Toolbox = ({ undo, redo }) => (

  <aside className="order-2 md:order-1 w-full h-16 md:w-16 md:h-auto bg-white border-t md:border-t-0 md:border-r flex flex-row md:flex-col items-center justify-center space-x-4 md:space-x-0 md:space-y-4 py-2 md:py-4">
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
