import React, { forwardRef } from 'react';

const CanvasWithGrid = forwardRef(({ className = '', width = 800, height = 600 }, ref) => {
  return (
    <div
      className={`bg-gray-100 border rounded-lg relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundSize: '20px 20px',
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)'
        }}
      />
      <canvas ref={ref} className="block max-w-full max-h-full" />
    </div>
  );
});

export default CanvasWithGrid;
