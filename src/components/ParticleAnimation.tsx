import React, { useEffect, useMemo, useState, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface ParticleAnimationProps {
  onComplete?: () => void;
  source: 'stake' | 'compound';
}

const ParticleAnimation: React.FC<ParticleAnimationProps> = ({
  onComplete,
  source
}) => {
  const [targetFound, setTargetFound] = useState(false);
  const [viewportPoints, setViewportPoints] = useState({
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 }
  });

  const [scrollY, setScrollY] = useState(window.scrollY);
  const [hasPlayed, setHasPlayed] = useState(false);

  const animationTimer = useRef<NodeJS.Timeout>();

  const particles = useMemo(() => Array.from({ length: 10 }, () => ({
    size: Math.random() * 6 + 4,
    speed: Math.random() < 0.3 ? 0.6 : Math.random() * 0.5 + 0.8, // 30% chance of moderately fast particle
    spread: {
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 30
    }
  })), []); // Memoize particles to prevent recreation

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationTimer.current) {
        clearTimeout(animationTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const findStartAndEndPoints = () => {
      // Get the correct starting element based on source
      const startElement = source === 'stake' 
        ? document.querySelector('.stake-amount-container span') // XP text next to stake input
        : document.querySelector('.compound-btn .xp-text'); // XP text in compound button

      const endElement = document.querySelector('.space-y-4 > div:first-child'); // Level text above meter

      if (startElement && endElement) {
        const startRect = startElement.getBoundingClientRect();
        const endRect = endElement.getBoundingClientRect();

        setViewportPoints({
          start: {
            x: startRect.left + startRect.width / 2,
            y: startRect.top + startRect.height / 2
          },
          end: {
            x: endRect.left + endRect.width / 2,
            y: endRect.top + endRect.height / 2
          }
        });
        setTargetFound(true);
      }
    };

    findStartAndEndPoints();
    window.addEventListener('resize', findStartAndEndPoints);
    return () => window.removeEventListener('resize', findStartAndEndPoints);
  }, [source]); // Add source to dependencies

  useEffect(() => {
    if (hasPlayed) return; // Skip if animation has already played

    requestAnimationFrame(() => {
      // Get starting element based on source
      const startEl = source === 'stake'
        ? document.querySelector('span[class*="absolute right-3"][class*="transform -translate-y-1/2"]')
        : document.querySelector('.compound-btn');
        
      const endEl = document.querySelector('.space-y-2 > div > div:first-child');

      if (!startEl || !endEl) {
        console.log('Could not find elements:', { startEl: !!startEl, endEl: !!endEl });
        return;
      }

      const startRect = startEl.getBoundingClientRect();
      const endRect = endEl.getBoundingClientRect();
      const initialScrollY = window.scrollY;

      const viewportStartPoint = {
        x: startRect.left + startRect.width / 2,
        y: startRect.top + startRect.height / 2 + initialScrollY
      };

      const viewportEndPoint = {
        x: endRect.left + endRect.width / 2,
        y: endRect.top + endRect.height / 2 + initialScrollY
      };

      setViewportPoints({
        start: viewportStartPoint,
        end: viewportEndPoint
      });
      setTargetFound(true);
    });

    const timer = setTimeout(() => {
      setHasPlayed(true);
      onComplete?.();
    }, 1200);

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete, hasPlayed, source]);

  if (!targetFound || hasPlayed) return null;

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none" style={{ zIndex: 20 }}>
      {particles.map((particle, index) => (
        <div
          key={index}
          className="fixed bg-green-400 rounded-full shadow-lg shadow-green-400/50"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${viewportPoints.start.x + particle.spread.x}px`,
            top: `${viewportPoints.start.y - scrollY + particle.spread.y}px`,
            transform: 'translate(-50%, -50%)',
            animation: `moveParticle-${index} ${particle.speed}s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            perspective: '1000px',
            WebkitFontSmoothing: 'antialiased'
          }}
        />
      ))}
      <style>
        {particles.map((particle, index) => `
          @keyframes moveParticle-${index} {
            0% {
              transform: translate3d(-50%, -50%, 0) scale(0);
              opacity: 0;
            }
            5% {
              transform: translate3d(-50%, -50%, 0) scale(1);
              opacity: 1;
            }
            20% {
              opacity: ${particle.speed < 0.5 ? 0.8 : 1}; 
            }
            100% {
              transform: translate3d(
                ${viewportPoints.end.x - (viewportPoints.start.x + particle.spread.x)}px,
                ${viewportPoints.end.y - scrollY - (viewportPoints.start.y - scrollY + particle.spread.y)}px,
                0
              ) scale(0.6);
              opacity: 0;
            }
          }
        `).join('\n')}
      </style>
    </div>
  );
};

export default ParticleAnimation;