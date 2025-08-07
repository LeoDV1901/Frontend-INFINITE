import React, { useState, useEffect } from 'react';
import './css/Formulario_Pacientes.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const FormularioPaciente = () => {
  const [formData, setFormData] = useState({
    idPaciente: '',
    iniciales: '',
    fechaNacimiento: '',
    sexo: '',
    fechaReclutamiento: '',
    protocolo: '',
  });

  const [protocolos, setProtocolos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtocolos = async () => {
      try {
        const response = await fetch('https://api.weareinfinite.mx/form/protocols/ids');
        const data = await response.json();
        if (response.ok) {
          setProtocolos(data);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al obtener protocolos',
            text: 'No se pudieron obtener los protocolos. Intente de nuevo más tarde.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: '¡Error de conexión!',
          text: 'Hubo un problema al conectar con el servidor.',
        });
      }
    };

    fetchProtocolos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const protocoloInt = parseInt(formData.protocolo, 10);

    if (isNaN(protocoloInt)) {
      Swal.fire({
        icon: 'error',
        title: 'Protocolo inválido',
        text: 'Debe seleccionar un protocolo válido.',
      });
      return;
    }

    const dataToSend = {
      ...formData,
      idProtocolo: protocoloInt,
    };

    try {
      const response = await fetch('https://api.weareinfinite.mx/paciente/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Paciente registrado exitosamente!',
          text: 'El paciente ha sido registrado.',
          showConfirmButton: false,
          timer: 2000,
        });

        setTimeout(() => {
          navigate('/Index');
        }, 2000);
      } else {
        Swal.fire({
          icon: 'error',
          title: '¡Error al registrar paciente!',
          text: data.mensaje || 'Verifique los datos e intente nuevamente.',
        }).then(() => {
          navigate('/Index');
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '¡Error de conexión!',
        text: 'Hubo un problema al conectar con el servidor.',
      }).then(() => {
        navigate('/Index');
      });
    }
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

        <div className="field-group">
          <label htmlFor="protocolo">Protocolo</label>
          <select
            name="protocolo"
            value={formData.protocolo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar Protocolo</option>
            {protocolos.length > 0 ? (
              protocolos.map((protocolo, index) => (
                <option key={index} value={protocolo.idProtocolo}>
                  {protocolo.idProtocolo}
                </option>
              ))
            ) : (
              <option disabled>Cargando protocolos...</option>
            )}
          </select>
        </div>

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default FormularioPaciente;
