import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/login.css'; // Asegúrate de que tu CSS esté en este archivo

const PreguntaInicio = () => {
  const [respuesta, setRespuesta] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (respuesta === '') {
      alert('Por favor, selecciona una opción');
      return;
    }

    // Redirigir dependiendo de la respuesta
    if (respuesta === 'Si') {
      navigate('/FechaDiarioPaciente');
    } else {
      navigate('/EvaluacionTratamiento');
    }
  };

  return (
    <div className="container">
      <img src="/image001.png" alt="Logo Infinite" className="logo" />
      <h2>Instrucciones</h2>
      <p style={{ color: 'white', marginBottom: '20px', textAlign: 'justify' }}>
        Ingrese el tiempo de avance al momento de contestar este formulario.
        <br /><br />
        <strong>¿Usted ya ha iniciado el tratamiento con FEMEDUAL®?</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="respuesta" style={{ color: 'white' }}>Seleccione una opción:</label>
        
        {/* "Sí" y "No" uno debajo del otro, con botón a la derecha */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '10px 0 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="si" style={{ color: 'white', minWidth: '30px' }}>Sí</label>
            <input 
              type="radio" 
              id="si" 
              name="tratamiento" 
              value="Si" 
              onChange={(e) => setRespuesta(e.target.value)} 
              required 
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="no" style={{ color: 'white', minWidth: '30px' }}>No</label>
            <input 
              type="radio" 
              id="no" 
              name="tratamiento" 
              value="No" 
              onChange={(e) => setRespuesta(e.target.value)} 
              required 
            />
          </div>
        </div>

        <button type="submit">Siguiente</button>
      </form>
    </div>
  );
};

export default PreguntaInicio;
