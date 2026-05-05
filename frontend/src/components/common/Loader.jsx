import React from 'react';
import loadingGif from '../../assets/gif/SandyLoading.gif';

const Loader = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.16)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(5px)'
    }}>
      <img 
        src={loadingGif} 
        alt="Loading..." 
        style={{
          width: '100px',
          height: 'auto'
        }}
      />
    </div>
  );
};

export default Loader;
