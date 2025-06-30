import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/login.css';

const EvaluacionTratamiento = () => {
  const [respuestas, setRespuestas] = useState({
    malOlor: '',
    flujoVaginal: '',
    comezon: '',
    ardorVaginal: '',
    dolorRelaciones: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRespuestas((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const incompleto = Object.values(respuestas).some((val) => val === '');
    if (incompleto) {
      alert('Por favor, completa todas las opciones');
      return;
    }

    navigate('/Resumen');
  };

  return (
    <div className="container">
      <img src="/image001.png" alt="Logo Infinite" className="logo" />
      <h2>Evaluación de Tratamiento</h2>
      <p style={{ color: 'white', marginBottom: '20px', textAlign: 'justify' }}>
        Su información es estrictamente confidencial, la siguiente información es solo para fines de investigación, 
        toda la información no se compartirá externamente.
      </p>

      <form onSubmit={handleSubmit}>
        <h3>Instrucciones: Selecciona la opción que mejor describa tus síntomas</h3>

        <PreguntaRadio
          nombre="malOlor"
          texto="Mal Olor"
          opciones={['Sin mal olor', 'Leve', 'Moderado', 'Intenso', 'Muy intenso']}
          valor={respuestas.malOlor}
          onChange={handleChange}
        />

        <PreguntaRadio
          nombre="flujoVaginal"
          texto="Cantidad de flujo vaginal"
          opciones={['Normal', 'Poco', 'Moderado', 'Abundante', 'Muy abundante']}
          valor={respuestas.flujoVaginal}
          onChange={handleChange}
        />

        <PreguntaRadio
          nombre="comezon"
          texto="Comezón"
          opciones={['No tengo', 'Raramente', 'Algunas veces', 'Frecuentemente', 'Siempre']}
          valor={respuestas.comezon}
          onChange={handleChange}
        />

        <PreguntaRadio
          nombre="ardorVaginal"
          texto="Ardor vaginal"
          opciones={['No tengo', 'Raramente', 'Algunas veces', 'Frecuentemente', 'Siempre']}
          valor={respuestas.ardorVaginal}
          onChange={handleChange}
        />

        <PreguntaRadio
          nombre="dolorRelaciones"
          texto="Dolor durante relaciones sexuales"
          opciones={['No aplica', 'Sin dolor', 'Raramente', 'Algunas veces', 'Frecuentemente']}
          valor={respuestas.dolorRelaciones}
          onChange={handleChange}
        />

        <button type="submit">Siguiente</button>
      </form>
    </div>
  );
};

// Componente reutilizable para preguntas de radio
const PreguntaRadio = ({ nombre, texto, opciones, valor, onChange }) => (
  <div style={{ marginBottom: '30px' }}>
    <label htmlFor={nombre} style={{ color: 'white', display: 'block', marginBottom: '10px', fontWeight: '500' }}>
      {texto}:
    </label>
    <div className="radio-group">
      {opciones.map((op, index) => (
        <label key={index} className={`radio-option ${valor === op ? 'selected' : ''}`}>
          <input
            type="radio"
            name={nombre}
            value={op}
            checked={valor === op}
            onChange={onChange}
            required
          />
          {op}
        </label>
      ))}
    </div>
  </div>
);


export default EvaluacionTratamiento;
