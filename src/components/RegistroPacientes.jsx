import React, { useState } from 'react';
import './css/Formulario_Pacientes.css';

const FormularioPaciente = () => {
  const [formData, setFormData] = useState({
    idPaciente: '', // Campo agregado para el ID
    iniciales: '',
    fechaNacimiento: '',
    sexo: '',
    fechaReclutamiento: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState(''); // 'exito' o 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log("Enviando datos: ", formData);  // Verifica que los datos están correctos

    const response = await fetch('http://localhost:5000/paciente/create', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    console.log("Respuesta del servidor: ", response);

    const data = await response.json();
    if (response.ok) {
      setMensaje('✅ El paciente ha sido registrado exitosamente en el sistema.');
      setMensajeTipo('exito');
      console.log('Éxito:', data);
      setFormData({
        idPaciente: '',
        iniciales: '',
        fechaNacimiento: '',
        sexo: '',
        fechaReclutamiento: '',
      });
    } else {
      console.error('Error al registrar paciente:', data);
      setMensaje('❌ No se pudo registrar el paciente. Verifique los datos e intente nuevamente.');
      setMensajeTipo('error');
    }
  } catch (error) {
    setMensaje('❌ Error de conexión con el servidor. Por favor, intente más tarde.');
    setMensajeTipo('error');
    console.error('Error de red:', error);
  }
};

  const estiloMensaje = {
    padding: '10px',
    marginTop: '15px',
    borderRadius: '5px',
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: mensajeTipo === 'exito' ? '#d4edda' : '#f8d7da',
    color: mensajeTipo === 'exito' ? '#155724' : '#721c24',
    border: mensajeTipo === 'exito' ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
  };

  return (
    <div className="container">
      <h2>AÑADIR SUJETO</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="idPaciente"
          placeholder="ID del Paciente"
          value={formData.idPaciente}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="iniciales"
          placeholder="Iniciales"
          value={formData.iniciales}
          onChange={handleChange}
          required
        />

        <div className="field-group">
          <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
          <input
            type="date"
            name="fechaNacimiento"
            id="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field-group">
          <label>Sexo</label>
          <div className="radio-group">
            <label className="radio-button">
              <input
                type="radio"
                name="sexo"
                value="Masculino"
                checked={formData.sexo === 'Masculino'}
                onChange={handleChange}
              />
              <span>Masculino</span>
            </label>
            <label className="radio-button">
              <input
                type="radio"
                name="sexo"
                value="Femenino"
                checked={formData.sexo === 'Femenino'}
                onChange={handleChange}
              />
              <span>Femenino</span>
            </label>
          </div>
        </div>

        <div className="field-group">
          <label htmlFor="fechaReclutamiento">Fecha de Reclutamiento</label>
          <input
            type="date"
            name="fechaReclutamiento"
            id="fechaReclutamiento"
            value={formData.fechaReclutamiento}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Enviar</button>
      </form>

      {mensaje && <p style={estiloMensaje}>{mensaje}</p>}
    </div>
  );
};

export default FormularioPaciente;
