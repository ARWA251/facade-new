import React, { forwardRef ,useEffect, useRef} from 'react';

const CanvasWithGrid = forwardRef(({ className = '', width = 800, height = 600 }, ref) => {
  return (
    <div
      className={`bg-gray-100 border rounded-lg relative ${className}`}
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
      <div style={{
  width: '100%',
  height: '100%',
  position: 'relative',
}} >
  <canvas ref={ref}></canvas>
</div>
      
    </div>
  );
});

export default CanvasWithGrid;
