import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ParticleAnimation from './ParticleAnimation';

interface ParticlePortalProps {
  onComplete: () => void;
  source: 'stake' | 'compound';
}

const ParticlePortal: React.FC<ParticlePortalProps> = ({ onComplete, source }) => {
  const [hasPlayed, setHasPlayed] = useState(false);

  // Create a div for the portal if it doesn't exist
  useEffect(() => {
    const portalDiv = document.getElementById('particle-portal');
    if (!portalDiv) {
      const div = document.createElement('div');
      div.id = 'particle-portal';
      div.style.position = 'fixed';
      div.style.inset = '0';
      div.style.pointerEvents = 'none';
      div.style.zIndex = '20';
      document.body.appendChild(div);
    }

    // Cleanup
    return () => {
      const portalDiv = document.getElementById('particle-portal');
      if (portalDiv && !portalDiv.children.length) {
        portalDiv.remove();
      }
    };
  }, []);

  const handleComplete = () => {
    setHasPlayed(true);
    onComplete();
  };

  if (hasPlayed) {
    return null;
  }

  return ReactDOM.createPortal(
    <ParticleAnimation onComplete={handleComplete} source={source} />,
    document.getElementById('particle-portal') || document.body
  );
};

export default ParticlePortal;