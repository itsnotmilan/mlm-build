import React, { useEffect, useState, useCallback } from 'react';
import layer1 from '../assets/images/jungle_bg_wide_layer1.png';
import layer2 from '../assets/images/jungle_bg_wide_layer2.png';
import layer3 from '../assets/images/jungle_bg_wide_layer3.png';
import { LightGleam } from './LightGleam';

export const ParallaxBackground: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => {
      setScrollY(window.pageYOffset);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center will-change-transform animate-bgGleam"
        style={{ 
          backgroundImage: `url(${layer3})`,
          backgroundPosition: 'center 60%',
          transform: `translate3d(0, ${scrollY * 0.25}px, 0) scale(1.1)`,
          filter: 'blur(2.5px)',
          zIndex: 10,
        }}
      />
      <div 
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ 
          backgroundImage: `url(${layer2})`,
          backgroundPosition: 'center 60%',
          transform: `translate3d(0, ${scrollY * 0.15}px, 0) scale(1.1)`,
          filter: 'blur(2px)',
          zIndex: 20,
        }}
      />
      <div style={{ zIndex: 25 }}>
        <LightGleam />
      </div>
      <div 
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ 
          backgroundImage: `url(${layer1})`,
          backgroundPosition: 'center 60%',
          transform: `translate3d(0, ${scrollY * 0.08}px, 0) scale(1.1)`,
          zIndex: 30,
        }}
      />
    </div>
  );
};
