import React from 'react';
import { ParallaxBackground } from './ParallaxBackground';
import { SmokeBackground } from './SmokeBackground';

export const BackgroundEffects = React.memo(() => {
  return (
    <>
      <ParallaxBackground />
      <SmokeBackground />
    </>
  );
});

BackgroundEffects.displayName = 'BackgroundEffects'; 