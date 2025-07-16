import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/Login');
    }, 3000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div style={styles.fullscreen}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          height: 100%;
          margin: 0;
        }

        @keyframes backgroundMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes zoomFade {
          0% { opacity: 0; transform: scale(0.9); }
          20% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0; transform: scale(1.1); }
        }
      `}</style>

      <img
        src="/Logo2.png"
        alt="Logo Infinite"
        style={styles.logo}
      />
    </div>
  );
};

const styles = {
  fullscreen: {
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(135deg, #edf6f9, #a8dadc, #457b9d, #1d3557)',
    backgroundSize: '400% 400%',
    animation: 'backgroundMove 15s ease infinite',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    fontFamily: "'Poppins', sans-serif",
    position: 'absolute',
    top: 0,
    left: 0,
  },
  logo: {
    width: '22vw',
    maxWidth: '320px',
    height: 'auto',
    animation: 'zoomFade 3s ease-in-out forwards',
  },
};

export default SplashScreen;
