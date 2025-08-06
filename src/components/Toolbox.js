import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';

const Toolbox = ({ undo, redo, layerVisibility, toggleLayer }) => (
  <aside className="order-2 md:order-1 w-full md:w-64 bg-gradient-to-b from-white via-gray-50 to-white border-t md:border-t-0 md:border-r border-gray-200 shadow-sm flex flex-row md:flex-col items-center md:items-start justify-center md:justify-start space-x-6 md:space-x-0 md:space-y-6 p-4">
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
    <div className="flex flex-col space-y-3 text-sm text-gray-700 w-full">
      <span className="font-semibold text-gray-800">Calques</span>
      {[
        { key: 'fenetre', label: 'Fenêtre' },
        { key: 'porte', label: 'Porte' },
        { key: 'facade', label: 'Façade' },
        { key: 'baseImage', label: 'Image de base' },
        { key: 'processedImage', label: 'Image traitée' },
      ].map(({ key, label }) => (
        <label
          key={key}
          className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-gray-100"
        >
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            checked={layerVisibility[key]}
            onChange={() => toggleLayer(key)}
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  </aside>
);

export default Toolbox;
