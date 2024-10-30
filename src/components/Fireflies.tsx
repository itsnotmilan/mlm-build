import React, { useEffect, useRef } from 'react';

interface Firefly {
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
  brightness: number;
  glowSize: number;
  glowSpeed: number;
  softGlow: {
    active: boolean;
    intensity: number;
    duration: number;
    startTime?: number;
  };
}

const Fireflies = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createFirefly = (): Firefly => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.5 + 0.1,
      angle: Math.random() * Math.PI * 2,
      brightness: 0.4 + Math.random() * 0.2,
      glowSize: Math.random() * 3 + 2,
      glowSpeed: (Math.random() * 0.05 + 0.02) * (Math.random() < 0.5 ? 1 : -1),
      softGlow: {
        active: false,
        intensity: 0,
        duration: 0
      }
    });

    const fireflies: Firefly[] = Array.from({ length: 8 }, createFirefly);

    // Try to activate a random firefly's soft glow
    const tryActivateGlow = () => {
      const activeGlows = fireflies.filter(f => f.softGlow.active).length;
      if (activeGlows < 2 && Math.random() < 0.005) { // Reduced from 0.01 to 0.005 for less frequent activation
        const availableFireflies = fireflies.filter(f => !f.softGlow.active);
        if (availableFireflies.length > 0) {
          const randomFirefly = availableFireflies[Math.floor(Math.random() * availableFireflies.length)];
          randomFirefly.softGlow = {
            active: true,
            intensity: 0,
            duration: Math.random() * 8000 + 4000, // Changed from 4000 + 1000 to 8000 + 4000 (4-12 seconds)
            startTime: Date.now()
          };
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      tryActivateGlow();

      fireflies.forEach(firefly => {
        firefly.x += Math.cos(firefly.angle) * firefly.speed;
        firefly.y += Math.sin(firefly.angle) * firefly.speed;

        if (Math.random() < 0.02) {
          firefly.angle += (Math.random() - 0.5) * Math.PI / 2;
        }

        // Reset position to opposite side when going off screen
        if (firefly.x < 0) firefly.x = canvas.width;
        if (firefly.x > canvas.width) firefly.x = 0;
        if (firefly.y < 0) firefly.y = canvas.height;
        if (firefly.y > canvas.height) firefly.y = 0;

        firefly.glowSize += firefly.glowSpeed;
        if (firefly.glowSize < 2 || firefly.glowSize > 5) {
          firefly.glowSpeed *= -1;
        }

        // Update soft glow
        if (firefly.softGlow.active && firefly.softGlow.startTime) {
          const elapsed = Date.now() - firefly.softGlow.startTime;
          const fadeInDuration = 1000;  // Increased from 500ms to 1s
          const fadeOutDuration = 2000; // Increased from 1000ms to 2s
          
          if (elapsed < fadeInDuration) {
            // Fade in
            firefly.softGlow.intensity = elapsed / fadeInDuration;
          } else if (elapsed > firefly.softGlow.duration - fadeOutDuration) {
            // Fade out
            const fadeOutProgress = (elapsed - (firefly.softGlow.duration - fadeOutDuration)) / fadeOutDuration;
            firefly.softGlow.intensity = Math.max(0, 1 - fadeOutProgress);
          } else {
            // Full intensity
            firefly.softGlow.intensity = 1;
          }

          if (elapsed >= firefly.softGlow.duration) {
            firefly.softGlow.active = false;
            firefly.softGlow.intensity = 0;
          }
        }

        // Draw soft glow first (if active)
        if (firefly.softGlow.active && firefly.softGlow.intensity > 0) {
          const softGlowGradient = ctx.createRadialGradient(
            firefly.x, firefly.y, 0,
            firefly.x, firefly.y, firefly.glowSize * 4
          );
          softGlowGradient.addColorStop(0, `rgba(255, 255, 230, ${0.15 * firefly.softGlow.intensity})`);
          softGlowGradient.addColorStop(1, 'rgba(255, 255, 230, 0)');

          ctx.beginPath();
          ctx.arc(firefly.x, firefly.y, firefly.glowSize * 5, 0, Math.PI * 2);  // Increased from 3 to 5
          ctx.fillStyle = softGlowGradient;
          ctx.fill();
        }

        // Draw main firefly
        const gradient = ctx.createRadialGradient(
          firefly.x, firefly.y, 0,
          firefly.x, firefly.y, firefly.glowSize
        );
        gradient.addColorStop(0, `rgba(255, 255, 150, ${firefly.brightness})`);
        gradient.addColorStop(1, 'rgba(255, 255, 150, 0)');

        ctx.beginPath();
        ctx.arc(firefly.x, firefly.y, firefly.glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default Fireflies;
