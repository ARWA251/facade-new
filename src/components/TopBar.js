import React from 'react';
import { Image as ImageIcon, Save, Undo2, Redo2 } from 'lucide-react';

const TopBar = ({
  undo,
  redo,
  exportAnnotations,
  handleImageUpload,
}) => (
  <div className="relative w-full bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200 shadow-sm">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-5 gap-4">
      {/* Title Section */}
      <div className="flex items-center space-x-3">
        <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">FACADE 1</h1>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Manuel</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          id="image-upload"
          className="hidden"
        />
        <label
          htmlFor="image-upload"
          className="px-5 py-2 rounded-full bg-white text-gray-700 font-medium text-sm shadow-md border border-gray-200 cursor-pointer hover:bg-gray-50 hover:shadow-lg transition-all duration-200 ease-out transform hover:scale-105"
        >
          <ImageIcon className="inline-block w-4 h-4 mr-2" />
          Image
        </label>

        {/* Undo / Redo */}
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

        {/* Save */}
        <button
          onClick={exportAnnotations}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full font-semibold text-sm shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transition-all duration-200 ease-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Save className="inline-block w-4 h-4 mr-2" />
          Sauvegarder
        </button>
      </div>
    </div>
    {/* Decorative Bottom Border */}
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
  </div>
);

export default TopBar;
