import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/login.css'; // Asegúrate de que tu CSS esté en este archivo

const DiarioPacienteFecha = () => {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fecha || !hora) {
      alert('Por favor, completa todos los campos');
      return;
    }

    // Redirigir dependiendo de la entrada
    navigate('/Confirmacion'); // Puedes cambiar esta ruta según lo que siga en el flujo
  };

  return (
    <div className="container">
      <img src="/image001.png" alt="Logo Infinite" className="logo" />
      <h2>DIARIO DE PACIENTE</h2>
      <p style={{ color: 'white', marginBottom: '20px', textAlign: 'justify' }}>
        Por favor, ingresa la fecha y el horario de la última aplicación del medicamento en formato de 24 horas.
      </p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="fecha" style={{ color: 'white' }}>Fecha de la última aplicación:</label>
        <input 
          type="date" 
          id="fecha" 
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required 
          style={{ padding: '10px', margin: '10px 0', width: '100%' }}
        />
        
        <label htmlFor="hora" style={{ color: 'white' }}>Horario de la última aplicación (24 horas):</label>
        <input 
          type="time" 
          id="hora" 
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          required 
          style={{ padding: '10px', margin: '10px 0', width: '100%' }}
        />

        <button type="submit">Siguiente</button>
      </form>
    </div>
  );
};

export default DiarioPacienteFecha;
