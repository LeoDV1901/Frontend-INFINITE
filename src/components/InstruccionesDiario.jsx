import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/login.css'; // Asegúrate de que tu CSS esté en este archivo

const InstruccionesDiario = () => {
  const [id, setId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí puedes agregar una validación si es necesario, por ejemplo, para verificar si el ID tiene el formato correcto
    if (id === '') {
      alert('Por favor, ingresa tu ID');
      return;
    }

    // Redirigir al siguiente paso (se puede ajustar según el flujo de la aplicación)
    navigate('/PreguntaInicio'); 
  };

  return (
    <div className="container">
      <img src="/image001.png" alt="Logo Infinite" className="logo" />
      <h2>Instrucciones para ingresar a tu diario</h2>
      <p style={{ color: 'white', marginBottom: '20px', textAlign: 'justify' }}>
        Por favor ingresa tu número de identificación (ID). Este se compone de:
        <ul>
          <li>2 Números de referencia de tu médico</li>
          <li>3 Números correspondientes a tu número de paciente</li>
          <li>Las iniciales de tus apellidos y primer nombre en el siguiente orden: Apellido paterno + Apellido materno + Primer Nombre.</li>
        </ul>
        <strong>Ejemplo:</strong><br />
        Paciente: María Guadalupe Sánchez López <br />
        Número de Referencia del Médico: 30 <br />
        Número de Paciente: 120 <br />
        ID: 30120SLM
        <br /><br />
        <strong>NOTA IMPORTANTE:</strong> El nombre proporcionado se utilizará exclusivamente con el propósito de ejemplificar el proceso de generación de ID en un contexto educativo o demostrativo. El objetivo principal es ilustrar cómo se pueden crear identificadores únicos y no está destinado a representar a ninguna persona, entidad o producto real.
      </p>
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="idInput" style={{ color: 'white' }}>Escribe tu ID:</label>
        <input 
          type="text" 
          id="idInput" 
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
          placeholder="Ejemplo: 30120SLM"
          style={{ padding: '10px', margin: '10px 0', width: '100%' }}
        />
        <button type="submit">Siguiente</button>
      </form>
    </div>
  );
};

export default InstruccionesDiario;
