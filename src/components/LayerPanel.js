import React from 'react';

const LayerPanel = ({ layerVisibility, toggleLayer, disabled, layerToggleDisabled = {} }) => (
  <aside
    className={`w-64 bg-gradient-to-b from-white via-gray-50 to-white border-l border-gray-200 shadow-sm p-4 ${
      disabled ? 'opacity-50 pointer-events-none' : ''
    }`}
  >
    <div className="flex flex-col space-y-3 text-sm text-gray-700">
      <span className="font-semibold text-gray-800">Calques</span>
      {[
        { key: 'fenetre', label: 'Fenêtre' },
        { key: 'porte', label: 'Porte' },
        { key: 'facade', label: 'Façade' },
        { key: 'processedImage', label: 'Image traitée' },
      ].map(({ key, label }) => {
        const isDisabled = disabled || layerToggleDisabled[key];
        return (
          <label
            key={key}
            className={`flex items-center space-x-2 px-2 py-1 rounded hover:bg-gray-100 ${
              isDisabled ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              checked={layerVisibility[key]}
              onChange={() => toggleLayer(key)}
              disabled={isDisabled}
            />
            <span>{label}</span>
          </label>
        );
      })}
    </div>
  </aside>
);

export default LayerPanel;
