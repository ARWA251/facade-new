import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';

const Toolbox = ({ undo, redo }) => (
  <aside className="order-2 md:order-1 w-full md:w-64 bg-gradient-to-b from-white via-gray-50 to-white border-t md:border-t-0 md:border-r border-gray-200 shadow-sm flex flex-row md:flex-col items-center justify-center md:justify-start p-4">
    <div className="flex flex-row md:flex-col items-center space-x-4 md:space-x-0 md:space-y-4">
      <button
        onClick={undo}
        className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-white shadow-sm transition-all duration-200"
        aria-label="Annuler"
      >
        <Undo2 className="w-5 h-5" />
      </button>
      <button
        onClick={redo}
        className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-white shadow-sm transition-all duration-200"
        aria-label="Rétablir"
      >
        <Redo2 className="w-5 h-5" />
      </button>
    </div>
  </aside>
);

export default Toolbox;
