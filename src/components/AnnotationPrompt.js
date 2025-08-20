import React from 'react';

const AnnotationPrompt = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-4 py-2 rounded shadow z-50 flex items-center space-x-4">
      <span>Veuillez annoter les portes et les fenêtres.</span>
      <button
        onClick={onClose}
        className="px-2 py-1 bg-blue-500 text-white rounded"
      >
        OK
      </button>
    </div>
  );
};

export default AnnotationPrompt;
