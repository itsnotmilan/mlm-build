'use client'
import { motion } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'

const vineVariants = {
  swing: (i: number) => ({
    d: [
      `M10,0 Q-5,${50 + i * 10} 10,${100 + i * 20} T10,${200 + i * 40}`,
      `M10,0 Q25,${50 + i * 10} 10,${100 + i * 20} T10,${200 + i * 40}`,
      `M10,0 Q-5,${50 + i * 10} 10,${100 + i * 20} T10,${200 + i * 40}`,
    ],
    transition: {
      d: {
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        duration: 3 + i * 0.5,
      },
    },
  }),
}

const containerVariants = {
  swing: (i: number) => ({
    rotate: [-2, 2, -2],
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
      duration: 3.5 + i * 0.2,
    },
  }),
}

const Vine = ({ color, height, side, index, scrollY, thickness = 8, customLeft }: { 
  color: string; 
  height: number; 
  side: 'left' | 'right'; 
  index: number; 
  scrollY: number;
  thickness?: number;
  customLeft?: string;
}) => (
  <motion.div
    className="fixed top-0"
    style={{ 
      originY: 0, 
      width: '20px', 
      height: `${height}px`,
      zIndex: 19,
      transform: `translateY(${scrollY * 0.08}px)`,
      left: customLeft || (side === 'left' ? 'min(15%, 12rem)' : 'auto'),
      right: (!customLeft && side === 'right') ? 'min(15%, 12rem)' : 'auto'
    }}
    variants={containerVariants}
    animate="swing"
    custom={index}
  >
    <svg
      width="20"
      height={height}
      viewBox={`0 0 20 ${height}`}
      style={{ overflow: 'visible' }}
    >
      <motion.path
        d={`M10,0 Q10,${height / 2} 10,${height}`}
        stroke="#0c1d18"
        strokeWidth={thickness}
        strokeLinecap="round"
        fill="transparent"
        variants={vineVariants}
        animate="swing"
        custom={index}
      />
    </svg>
  </motion.div>
)

export const SwingingVines = () => {
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

  const leftVines = [
    { color: '#0c1d18', height: 400 },
    { color: '#0c1d18', height: 350 },
  ]

  const rightVines = [
    { color: '#0c1d18', height: 380 },
    { color: '#0c1d18', height: 320 },
    { color: '#0c1d18', height: 360 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }}>
      {leftVines.map((vine, index) => (
        <Vine key={`left-${index}`} color={vine.color} height={vine.height} side="left" index={index} scrollY={scrollY} />
      ))}
      {rightVines.map((vine, index) => (
        <Vine 
          key={`right-${index}`} 
          color={vine.color} 
          height={vine.height} 
          side="right" 
          index={index + leftVines.length} 
          scrollY={scrollY} 
        />
      ))}
    </div>
  )
} 