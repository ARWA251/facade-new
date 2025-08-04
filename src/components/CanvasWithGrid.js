import React, { forwardRef } from 'react';

const CanvasWithGrid = forwardRef(({ className = '' }, ref) => {
  return (
    <div className={`bg-gray-100 border rounded-lg w-full h-full relative ${className}`}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundSize: '20px 20px',
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)'
        }}
      />
      <canvas ref={ref} className="w-full h-full" />
    </div>
  );
});

export default CanvasWithGrid;
