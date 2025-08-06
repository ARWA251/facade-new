import React from 'react';

const Toolbox = ({ undo, redo, layerVisibility, toggleLayer }) => (
  <aside className="order-2 md:order-1 w-full md:w-64 bg-white border-t md:border-t-0 md:border-r flex flex-row md:flex-col items-center md:items-start justify-center md:justify-start space-x-6 md:space-x-0 md:space-y-6 p-4">
    <div className="flex flex-row md:flex-col items-center space-x-4 md:space-x-0 md:space-y-4">
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
    </div>
    <div className="flex flex-col space-y-2 text-sm text-gray-600">
      <span className="font-medium">Calques:</span>
      {[
        { key: 'fenetre', label: 'Fenêtre' },
        { key: 'porte', label: 'Porte' },
        { key: 'facade', label: 'Façade' },
        { key: 'baseImage', label: 'Image de base' },
        { key: 'processedImage', label: 'Image traitée' },
      ].map(({ key, label }) => (
        <label key={key} className="flex items-center space-x-1">
          <input
            type="checkbox"
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
