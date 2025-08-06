import React from 'react';

const TopBar = ({ undo, redo, clearBoxes, handleImageUpload }) => (
  <div className="flex justify-between items-center px-5 py-2 bg-gray-800 border-b border-gray-700">
    <div className="flex items-center gap-2">
      <div className="bg-gray-700 px-3 py-2 rounded text-white text-xs cursor-pointer">
        ☰ Menu
      </div>
      <div
        className="bg-gray-700 px-3 py-2 rounded text-white text-xs cursor-pointer"
        onClick={undo}
      >
        ↶ Précédent
      </div>
      <div
        className="bg-gray-700 px-3 py-2 rounded text-white text-xs cursor-pointer"
        onClick={redo}
      >
        ↷ Suivant
      </div>
    </div>
    <div className="flex gap-2">
      <button
        className="bg-gray-700 text-white px-3 py-2 rounded"
        onClick={clearBoxes}
      >
        🗑 Clear
      </button>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        id="file-input"
      />
      <label
        htmlFor="file-input"
        className="bg-gray-700 px-3 py-2 rounded cursor-pointer text-white"
      >
        📁 Image
      </label>
    </div>
  </div>
);

export default TopBar;
