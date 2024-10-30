import lightGleamImage from '../assets/images/light_gleam.png';

export const LightGleam = () => {
  return (
    <div 
      className="fixed top-0 left-0 pointer-events-none animate-gleam"
      style={{ 
        width: '900px',
        height: '900px',
        backgroundImage: `url(${lightGleamImage})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        zIndex: 25,
        opacity: 0.25,
        transformOrigin: 'top left',
        position: 'fixed',
        top: '-50px'
      }}
    />
  );
};
