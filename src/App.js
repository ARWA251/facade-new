import React from 'react';
import AnnotationCanvas from './components/AnnotationCanvas';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold underline my-4">Hello Tailwind CSS</h1>
      <AnnotationCanvas />
    </div>
  );
}

export default App;
