import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/login.css'; // Asegúrate de que tu CSS esté en este archivo

const AvisoDePrivacidad = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/InstruccionesDiario');  // Redirige al inicio, o a la página que desees
  };

  return (
    <div className="container">
      <img src="/image001.png" alt="Logo Infinite" className="logo" />
      <h2>Aviso de Privacidad</h2>
      <p style={{ color: 'white', marginBottom: '20px', textAlign: 'justify' }}>
        El presente <strong>Aviso de Privacidad</strong> tiene como objetivo informarle sobre el tratamiento que se les dará a sus datos personales cuando sean recabados, utilizados, almacenados y/o transferidos por <strong>INFINITE</strong>.
        <br /><br />
        Puede acceder al mismo a través del siguiente enlace:
        <br />
        <a 
          href="http://weareinfinite.mx/aviso-de-privacidad/" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: 'lightblue', textDecoration: 'underline' }}
        >
          http://weareinfinite.mx/aviso-de-privacidad/
        </a>
      </p>
      <button onClick={handleClick}>Aceptar</button>
    </div>
  );
};

export default AvisoDePrivacidad;
