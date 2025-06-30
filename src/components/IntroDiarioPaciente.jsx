import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/login.css'; // Asegúrate de que tu CSS esté en este archivo

const DiarioPacienteIntro = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/AvisodePrivacidad');
  };

  return (
    <div className="container">
      <img src="/image001.png" alt="Logo Infinite" className="logo" />
      <h2>Diario del Paciente</h2>
      <p style={{ color: 'white', marginBottom: '20px', textAlign: 'justify' }}>
        Bienvenida al Proyecto de Experiencia Clínica en Pacientes Mexicanas con Infecciones Vaginales tratadas con <strong>FEMEDUAL®</strong>.<br /><br />
        Como participante necesitamos recopilar tu experiencia desde tu primera consulta y continuar a las 24, 48, 72 y 96 horas posteriores.<br /><br />
        Si tiene dudas, comunícate al teléfono: <strong>(55) 5080-3620</strong> o <strong>(55) 4071-8008</strong>.
      </p>
      <button onClick={handleClick}>Siguiente</button>
    </div>
  );
};

export default DiarioPacienteIntro;
