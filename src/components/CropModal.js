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
    <div className="absolute inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-5 rounded-lg max-w-[80%] max-h-[80%] overflow-auto">
        <h3 className="text-white mb-4">Recadrer l'image</h3>

        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={undefined}
        >
          <img
            ref={imgRef}
            src={selectedImage}
            className="max-w-full max-h-[400px]"
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

        <div className="flex mt-4 gap-3">
          <button
            onClick={handleCropValidate}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            ✅ Valider le crop
          </button>
          <button
            onClick={addImageDirectly}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            📷 Ajouter sans crop
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            ❌ Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
