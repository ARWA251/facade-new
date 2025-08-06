import React from 'react';
import { Image as ImageIcon, Save, Ruler } from 'lucide-react';

const TopBar = ({
  drawingActive,
  polygonActive,
  scaleActive,
  toggleDrawing,
  togglePolygonDrawing,
  toggleScaleMode,
  selectedEntity,
  setSelectedEntity,
  exportAnnotations,
  handleImageUpload,
}) => (

  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 border-b bg-white gap-2">
    <div className="text-lg font-semibold text-gray-900">
      FACADE 1 <span className="text-gray-400 text-sm">(MANUAL)</span>
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={toggleDrawing}
        className={`px-4 py-1 rounded-full transition duration-200 ease-in-out shadow-sm ${
          drawingActive
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-100'
        }`}
      >
        <RectangleHorizontal className="inline-block mr-1" size={16} /> Rectangle
      </button>
      <button
        onClick={togglePolygonDrawing}
        className={`px-4 py-1 rounded-full transition duration-200 ease-in-out shadow-sm ${
          polygonActive
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Shapes className="inline-block mr-1" size={16} /> Polygon
      </button>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        id="image-upload"
        className="hidden"
      />
      <label
        htmlFor="image-upload"
        className="px-4 py-1 rounded-full bg-gray-200 text-gray-700 shadow cursor-pointer hover:bg-gray-100 transition duration-200 ease-in-out"
      >
        <ImageIcon className="inline-block mr-1" size={16} /> Image
      </label>

      <label className="text-sm text-gray-500">Type d'annotation:</label>
      <select
        value={selectedEntity}
        onChange={(e) => setSelectedEntity(e.target.value)}
        className="border rounded px-2 py-1 text-sm"
      >
        <option value="fenetre">Fenêtre</option>
        <option value="porte">Porte</option>
        <option value="facade">Façade</option>
      </select>

      <button
        onClick={exportAnnotations}
        className="bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition duration-200 ease-in-out"
      >
        <Save className="inline-block mr-1" size={16} /> Sauvegarder
      </button>
  <div className="relative bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200 shadow-sm">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-5 gap-4">
      {/* Title Section */}
      <div className="flex items-center space-x-3">
        <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            FACADE 1
          </h1>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Manuel
          </span>
        </div>
      </div>
      {/* Controls Section */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Drawing Tools */}
        <div className="flex items-center bg-gray-100 rounded-full p-1 shadow-inner">
          <button
            onClick={toggleDrawing}
            className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-out transform ${
              drawingActive
                ? 'bg-blue-500 text-white shadow-lg scale-105 hover:bg-blue-600'
                : 'text-gray-700 hover:bg-white hover:shadow-sm'
            }`}
          >
            Rectangle
          </button>
          <button
            onClick={togglePolygonDrawing}
            className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-out transform ${
              polygonActive
                ? 'bg-blue-500 text-white shadow-lg scale-105 hover:bg-blue-600'
                : 'text-gray-700 hover:bg-white hover:shadow-sm'
            }`}
          >
            Polygon
          </button>
          <button
            onClick={toggleScaleMode}
            className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-out transform ${
              scaleActive
                ? 'bg-blue-500 text-white shadow-lg scale-105 hover:bg-blue-600'
                : 'text-gray-700 hover:bg-white hover:shadow-sm'
            }`}
          >
            <Ruler className="inline-block w-4 h-4 mr-1" />
            Échelle
          </button>
        </div>
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
        {/* Annotation Type Selector */}
        <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-md border border-gray-200">
          <label className="text-sm font-medium text-gray-600">Type:</label>
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="border-0 bg-transparent text-sm font-medium text-gray-800 focus:outline-none cursor-pointer"
          >
            <option value="fenetre">Fenêtre</option>
            <option value="porte">Porte</option>
            <option value="facade">Façade</option>
          </select>
        </div>
        {/* Save Button */}
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