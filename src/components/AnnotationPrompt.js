import React from 'react';

const AnnotationPrompt = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow z-50"
      onClick={onClose}
    >
      Veuillez annoter les portes et les fenêtres.
    </div>
  );
};

export default AnnotationPrompt;
