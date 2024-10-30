import React from 'react';
import frame1 from '../assets/images/money_gif_frame_1.png';
import frame2 from '../assets/images/money_gif_frame_2.png';

interface MoneyAnimationProps {
  onClick: () => void;
}

const MoneyAnimation = ({ onClick }: MoneyAnimationProps) => {
  const [currentFrame, setCurrentFrame] = React.useState(frame1);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => prev === frame1 ? frame2 : frame1);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <img 
      src={currentFrame}
      alt="Money Animation"
      onClick={onClick}
      className="w-64 h-auto mx-auto block rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
    />
  );
};

export default MoneyAnimation;
