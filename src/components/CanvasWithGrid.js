import React, { forwardRef } from 'react';

// Renders a Fabric canvas overlaid with a configurable grid. The grid is
// produced via CSS gradients (no loops or canvas drawing), repeated every
// `gridSize` pixels.
const CanvasWithGrid = forwardRef(
  (
    { className = '', width = 800, height = 600, gridSize = 20 },
    ref
  ) => {
  return (
    <div
      className={`bg-gray-100 border rounded-lg relative ${className}`}
      style={{ width, height }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)'
        }}
      />
      <canvas ref={ref} className="w-full h-full" />
    </div>
  );
  }
);

export default CanvasWithGrid;
