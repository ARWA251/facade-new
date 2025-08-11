import React from 'react';

const LayerPanel = ({ layerVisibility, toggleLayer }) => (
  <aside className="order-3 w-64 bg-gradient-to-b from-white via-gray-50 to-white border-l border-gray-200 shadow-sm p-4">
    <div className="flex flex-col space-y-3 text-sm text-gray-700">
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

export default LayerPanel;
