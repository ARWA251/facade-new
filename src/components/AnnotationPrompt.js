import React from 'react';

const AnnotationPrompt = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-4 py-2 rounded shadow z-50 flex items-center space-x-4">

     <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow">
              Veuillez annoter les portes et les fenêtres.
            </div>
    </div>
  );
};

export default AnnotationPrompt;
