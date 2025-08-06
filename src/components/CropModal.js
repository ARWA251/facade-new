import React from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const CropModal = ({
  cropMode,
  selectedImage,
  crop,
  setCrop,
  completedCrop,
  setCompletedCrop,
  imgRef,
  handleCropValidate,
  addImageDirectly,
  onCancel
}) => {
  if (cropMode !== 'cropImage' || !selectedImage) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl max-w-full sm:max-w-[85%] max-h-[90%] overflow-auto shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            Recadrer l'image
          </h3>
          <div className="flex-1"></div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
          >
            ✕
          </button>
        </div>

        {/* Crop Area */}
        <div className="relative bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-inner mb-6">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={undefined}
            className="rounded-lg overflow-hidden"
          >
            <img
              ref={imgRef}
              src={selectedImage}
              className="max-w-full max-h-[60vh] rounded-lg shadow-lg"
              onLoad={() => {
                if (imgRef.current) {
                  const { width, height } = imgRef.current;
                  setCompletedCrop({
                    unit: 'px',
                    x: width * 0.25,
                    y: height * 0.25,
                    width: width * 0.5,
                    height: height * 0.5
                  });
                }
              }}
            />
          </ReactCrop>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleCropValidate}
            className="group px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold shadow-lg hover:from-green-600 hover:to-green-700 hover:shadow-xl transition-all duration-200 ease-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <span className="flex items-center space-x-2">
              <span>✂️</span>
              <span>Valider le crop</span>
            </span>
          </button>

          <button
            onClick={addImageDirectly}
            className="group px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transition-all duration-200 ease-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span className="flex items-center space-x-2">
              <span>📷</span>
              <span>Ajouter sans crop</span>
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

        {/* Helper Text */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Glissez pour sélectionner la zone à recadrer
          </p>
        </div>
      </div>
    </div>
  );
};

export default CropModal;