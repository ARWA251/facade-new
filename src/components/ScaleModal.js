import React, { useState } from 'react';

const ScaleModal = ({ isOpen, onSubmit, onCancel }) => {
  const [value, setValue] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    const cm = parseFloat(value);
    if (!isNaN(cm) && cm > 0) {
      onSubmit(cm);
      setValue('');
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl max-w-full sm:max-w-md w-full shadow-2xl border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Définir l'échelle</h3>
          <div className="flex-1"></div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1">✕</button>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Longueur réelle (cm)
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez la longueur"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleSubmit}
            className="group px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold shadow-lg hover:from-green-600 hover:to-green-700 hover:shadow-xl transition-all duration-200 ease-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <span className="flex items-center space-x-2">
              <span>📏</span>
              <span>Valider</span>
            </span>
          </button>
          <button
            onClick={onCancel}
            className="group px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-semibold shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl transition-all duration-200 ease-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <span className="flex items-center space-x-2">
              <span>❌</span>
              <span>Annuler</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScaleModal;