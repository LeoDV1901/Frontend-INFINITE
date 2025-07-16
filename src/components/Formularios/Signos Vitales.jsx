import React, { useState, useEffect } from 'react';
import '../css/SignosV.css';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';


const FormularioMedico = () => {
  const { idPaciente } = useParams(); 

  
  const [aleatorizacion, setAleatorizacion] = useState('');
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');
  const [genero, setGenero] = useState('');
  const [embarazo, setEmbarazo] = useState('');
  const [presionSistolica, setPresionSistolica] = useState('');
  const [presionDiastolica, setPresionDiastolica] = useState('');
  const [frecuenciaCardiaca, setFrecuenciaCardiaca] = useState('');
  const [frecuenciaRespiratoria, setFrecuenciaRespiratoria] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [peso, setPeso] = useState('');
  const [talla, setTalla] = useState('');
  const [imc, setImc] = useState('');
  const [comentario, setComentario] = useState('');

  
  const [editId, setEditId] = useState(null); 
  const [registroExistente, setRegistroExistente] = useState(false);

  
  const isOutOfRange = (value, min, max) => {
    if (value === '') return false;
    const num = parseFloat(value);
    return isNaN(num) || num < min || num > max;
  };

  const inputStyle = (value, min, max) => ({
    border: isOutOfRange(value, min, max) ? '2px solid red' : '1px solid #ccc',
    padding: '5px',
    borderRadius: '4px',
  });

  
  const handleEmbarazoChange = (event) => {
    setEmbarazo(event.target.value);
  };

  
  useEffect(() => {
    if (idPaciente) {
      fetchSignos();
      
    }
  }, [idPaciente]);

  
useEffect(() => {
    if (peso && talla) {
      const tallaEnMetros = parseFloat(talla); 
      const imcCalculado = (tallaEnMetros * tallaEnMetros) / parseFloat(peso); 
      setImc(imcCalculado.toFixed(2)); 
    }
  }, [peso, talla]); 

  const fetchSignos = async () => {
    try {
      const response = await fetch(`http://localhost:5000/form/signos/paciente/${idPaciente}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const ultimo = data[data.length - 1]; 

        
        setEditId(ultimo.id);
        setRegistroExistente(true);
        setAleatorizacion(ultimo.aleatorizacion || '');
        const fechaParts = ultimo.fecha.split('-');
        setAnio(fechaParts[0]);
        setMes(fechaParts[1]);
        setDia(fechaParts[2]);
        setGenero(ultimo.genero || '');
        setPresionSistolica(ultimo.presion_sistolica || '');
        setPresionDiastolica(ultimo.presion_diastolica || '');
        setTemperatura(ultimo.temperatura || '');
        setFrecuenciaCardiaca(ultimo.frecuencia_cardiaca || '');
        setFrecuenciaRespiratoria(ultimo.frecuencia_respiratoria || '');
        setPeso(ultimo.peso || '');
        setTalla(ultimo.talla || '');
        setImc(ultimo.imc || '');
        setEmbarazo(ultimo.embarazo || '');
        setComentario(ultimo.comentario || '');
      }
    } catch (err) {
      alert('Error al obtener datos del paciente');
      console.error(err);
    }
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();

  const fecha = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;

  const data = {
    idPaciente,
    aleatorizacion,
    fecha,
    genero,
    presion_sistolica: presionSistolica,
    presion_diastolica: presionDiastolica,
    temperatura,
    frecuencia_cardiaca: frecuenciaCardiaca,
    frecuencia_respiratoria: frecuenciaRespiratoria,
    peso,
    talla,
    imc,
    embarazo,
    comentario,
  };

  const url = registroExistente
    ? `http://localhost:5000/form/signos/${editId}`
    : 'http://localhost:5000/form/signos';

  const method = registroExistente ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const resultado = await response.json();
      Swal.fire({
        icon: 'success',
        title: registroExistente ? 'Registro actualizado' : 'Datos guardados con éxito',
        showConfirmButton: false,
        timer: 1500
      });
      fetchSignos(); // recargar
    } else {
      const error = await response.json();
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: error.mensaje || 'Ocurrió un error inesperado',
      });
    }
  } catch (err) {
    console.error('ERROR de conexión:', err);
    Swal.fire({
      icon: 'error',
      title: 'Error de red o del servidor',
      text: 'Por favor intenta nuevamente más tarde',
    });
  }
};

const handleDelete = async () => {
  if (!editId || !window.confirm('¿Deseas eliminar este registro?')) return;

  try {
    const response = await fetch(`http://localhost:5000/form/signos/${editId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Registro eliminado correctamente',
        showConfirmButton: false,
        timer: 1500
      });
      resetForm();
    } else {
      const error = await response.json();
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar',
        text: error.mensaje || 'Ocurrió un error inesperado',
      });
    }
  } catch (err) {
    console.error('Error al eliminar', err);
    Swal.fire({
      icon: 'error',
      title: 'Error al eliminar',
      text: 'Por favor intenta nuevamente más tarde',
    });
  }
};


  // Función para resetear el formulario
  const resetForm = () => {
    setEditId(null);
    setRegistroExistente(false);
    setAleatorizacion('');
    setDia('');
    setMes('');
    setAnio('');
    setGenero('');
    setEmbarazo('');
    setPresionSistolica('');
    setPresionDiastolica('');
    setFrecuenciaCardiaca('');
    setFrecuenciaRespiratoria('');
    setTemperatura('');
    setPeso('');
    setTalla('');
    setImc('');
    setComentario('');
  };

  return (
    <div className="container">
      <h2>Formulario de Historia Clínica</h2>
      <form onSubmit={handleSubmit}>
        <table style={{ width: '100%', marginBottom: '20px' }}>
          <tbody>
            <tr>
              <td>Número de Paciente</td>
              <td>
                <input type="text" value={idPaciente} readOnly />
              </td>
              
            </tr>
          </tbody>
        </table>

        <h3>Visita (Día 0) Inicio de Tratamiento</h3>
        <table style={{ width: '100%', marginBottom: '20px' }}>
          <tbody>
            <tr>
              <td>Fecha</td>
              <td>
                <input
                  type="text"
                  placeholder="Día"
                  value={dia}
                  onChange={(e) => setDia(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Mes"
                  value={mes}
                  onChange={(e) => setMes(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Año"
                  value={anio}
                  onChange={(e) => setAnio(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Género</td>
              <td>
                <label>
                  <input
                    type="radio"
                    name="genero"
                    value="Masculino"
                    checked={genero === 'Masculino'}
                    onChange={(e) => setGenero(e.target.value)}
                  />
                  Masc
                </label>
              </td>
              <td>
                <label>
                  <input
                    type="radio"
                    name="genero"
                    value="Femenino"
                    checked={genero === 'Femenino'}
                    onChange={(e) => setGenero(e.target.value)}
                  />
                  Fem
                </label>
              </td>
            </tr>
          </tbody>
        </table>

        <h3>Signos Vitales</h3>
        <table style={{ width: '100%', marginBottom: '20px' }}>
          <tbody>
            <tr>
              <td>Presión Sistólica</td>
              <td>
                <input
                  type="text"
                  placeholder="mmHg"
                  value={presionSistolica}
                  onChange={(e) => setPresionSistolica(e.target.value)}
                  style={inputStyle(presionSistolica, 90, 120)}
                />
              </td>
              <td>Presión Diastólica</td>
              <td>
                <input
                  type="text"
                  placeholder="mmHg"
                  value={presionDiastolica}
                  onChange={(e) => setPresionDiastolica(e.target.value)}
                  style={inputStyle(presionDiastolica, 60, 80)}
                />
              </td>
            </tr>
            <tr>
              <td>Temperatura</td>
              <td>
                <input
                  type="text"
                  placeholder="°C"
                  value={temperatura}
                  onChange={(e) => setTemperatura(e.target.value.replace(/[^0-9.]/g, ''))}
                  style={inputStyle(temperatura, 36.5, 37.9)}
                />
              </td>
              <td>Frecuencia Cardiaca</td>
              <td>
                <input
                  type="text"
                  placeholder="latidos/min"
                  value={frecuenciaCardiaca}
                  onChange={(e) => setFrecuenciaCardiaca(e.target.value.replace(/[^0-9.]/g, ''))}
                  style={inputStyle(frecuenciaCardiaca, 60, 100)}
                />
              </td>
            </tr>
            <tr>
              <td>Frecuencia Respiratoria</td>
              <td>
                <input
                  type="text"
                  placeholder="respiraciones/min"
                  value={frecuenciaRespiratoria}
                  onChange={(e) => setFrecuenciaRespiratoria(e.target.value)}
                 style={inputStyle(frecuenciaRespiratoria, 12, 20)}
                />
              </td>
              <td>Peso</td>
              <td>
                <input
                  type="text"
                  placeholder="kg"
                  value={peso}
                 onChange={(e) => setPeso(e.target.value.replace(/[^0-9.]/g, ''))}
                />
              </td>
            </tr>
            <tr>
              <td>Talla</td>
              <td>
                <input
                  type="text"
                  placeholder="cm"
                  value={talla}
                  onChange={(e) => setTalla(e.target.value.replace(/[^0-9.]/g, ''))}
                />
              </td>
              <td>IMC</td>
              <td>
                <input
                  type="text"
                  placeholder="kg/m²"
                  value={imc}
                  onChange={(e) => setImc(e.target.value.replace(/[^0-9.]/g, ''))}
                />
              </td>
            </tr>
            <tr>
              <td>Embarazo</td>
              <td>
                <label>
                  <input
                    type="radio"
                    name="embarazo"
                    value="Si"
                    checked={embarazo === 'Si'}
                    onChange={handleEmbarazoChange}
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="embarazo"
                    value="No"
                    checked={embarazo === 'No'}
                    onChange={handleEmbarazoChange}
                  />
                  No
                </label>
              </td>
            </tr>
            {embarazo === 'Si' && (
              <tr>
                <td>Comentario</td>
                <td colSpan="3">
                  <textarea
                    rows="2"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    style={{ width: '100%', fontSize: '14px', padding: '8px' }}
                  ></textarea>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div>
          
          {registroExistente && (
            <>
              <button type="button" onClick={handleSubmit} style={{ marginLeft: '10px' }}>
                Actualizar
              </button>
              <button type="button" onClick={handleDelete} style={{ marginLeft: '10px' }}>
                Eliminar
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormularioMedico;
