import React from 'react';

export const SmokeBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden z-[5]">
      <div className="smoke-container w-full h-full">
        <div className="smoke-scroll">
          <img 
            src="/src/assets/images/smoke_looping_bg.png" 
            alt="" 
            className="animate-smoke object-cover h-screen"
            style={{ 
              transform: 'scale(0.35)', 
              transformOrigin: 'center',
              opacity: 0.5
            }} 
          />
          <img 
            src="/src/assets/images/smoke_looping_bg.png" 
            alt="" 
            className="animate-smoke object-cover h-screen"
            style={{ 
              transform: 'scale(0.35)', 
              transformOrigin: 'center',
              opacity: 0.5
            }} 
          />
        </div>
      </div>
    </div>
  );
};
