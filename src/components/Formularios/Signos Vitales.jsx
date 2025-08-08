import React, { useState, useEffect } from 'react';
import '../css/SignosV.css';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const FormularioMedico = () => {
  const { idPaciente } = useParams();
  const navigate = useNavigate();

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
  const [formBloqueado, setFormBloqueado] = useState(false);

  useEffect(() => {
    const bloqueado = localStorage.getItem(`formulario_bloqueado_${idPaciente}`);
    if (bloqueado === 'true') setFormBloqueado(true);
  }, [idPaciente]);

  useEffect(() => {
    if (idPaciente) fetchSignos();
  }, [idPaciente]);

  useEffect(() => {
    if (peso && talla) {
      const imcCalculado = parseFloat(peso) / ((parseFloat(talla) / 100) ** 2);
      setImc(imcCalculado.toFixed(2));
    }
  }, [peso, talla]);

  const fetchSignos = async () => {
    try {
      const response = await fetch(`https://api.weareinfinite.mx/form/signos/paciente/${idPaciente}`);
      const data = await response.json();
      if (data.length > 0) {
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
      Swal.fire({ icon: 'error', title: 'Error al obtener datos' });
      navigate(`/Cronograma/${idPaciente}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fecha = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    const data = {
      idPaciente, aleatorizacion, fecha, genero,
      presion_sistolica: presionSistolica,
      presion_diastolica: presionDiastolica,
      temperatura, frecuencia_cardiaca: frecuenciaCardiaca,
      frecuencia_respiratoria: frecuenciaRespiratoria,
      peso, talla, imc, embarazo, comentario
    };
    const url = registroExistente
      ? `https://api.weareinfinite.mx/form/signos/${editId}`
      : 'https://api.weareinfinite.mx/form/signos';
    const method = registroExistente ? 'PUT' : 'POST';
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        Swal.fire({ icon: 'success', title: 'Datos guardados', timer: 1500 });
        fetchSignos();
        navigate(`/Cronograma/${idPaciente}`);
      } else {
        Swal.fire({ icon: 'error', title: 'Error al guardar' });
        navigate(`/Cronograma/${idPaciente}`);
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error de red' });
      navigate(`/Cronograma/${idPaciente}`);
    }
  };

  const handleBloquear = () => {
    localStorage.setItem(`formulario_bloqueado_${idPaciente}`, 'true');
    setFormBloqueado(true);
    Swal.fire({ icon: 'info', title: 'Formulario bloqueado' });
  };

  const handleDesbloquear = async () => {
    const { value: password } = await Swal.fire({
      title: 'Desbloquear formulario',
      input: 'password',
      inputLabel: 'Ingresa la contraseña',
      inputPlaceholder: 'Contraseña',
      inputAttributes: {
        maxlength: 20,
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true
    });
    if (password === 'infinite') {
      localStorage.removeItem(`formulario_bloqueado_${idPaciente}`);
      setFormBloqueado(false);
      Swal.fire('Desbloqueado', '', 'success');
    } else if (password !== undefined) {
      Swal.fire('Contraseña incorrecta', '', 'error');
    }
  };

  return (
    <div className="container">
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
          onChange={(e) => setPresionSistolica(e.target.value.replace(/[^0-9.]/g, ''))}
          disabled={formBloqueado}
          style={inputStyle(presionSistolica, 90, 120)}
        />
      </td>
      <td>Presión Diastólica</td>
      <td>
        <input
          type="text"
          placeholder="mmHg"
          value={presionDiastolica}
          onChange={(e) => setPresionDiastolica(e.target.value.replace(/[^0-9.]/g, ''))}
          disabled={formBloqueado}
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
          disabled={formBloqueado}
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
          disabled={formBloqueado}
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
          onChange={(e) => setFrecuenciaRespiratoria(e.target.value.replace(/[^0-9.]/g, ''))}
          disabled={formBloqueado}
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
          disabled={formBloqueado}
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
          disabled={formBloqueado}
        />
      </td>
      <td>IMC</td>
      <td>
        <input
          type="text"
          placeholder="kg/m²"
          value={imc}
          onChange={(e) => setImc(e.target.value.replace(/[^0-9.]/g, ''))}
          disabled
          readOnly
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
            onChange={(e) => setEmbarazo(e.target.value)}
            disabled={formBloqueado}
          />
          Sí
        </label>
        <label>
          <input
            type="radio"
            name="embarazo"
            value="No"
            checked={embarazo === 'No'}
            onChange={(e) => setEmbarazo(e.target.value)}
            disabled={formBloqueado}
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
            disabled={formBloqueado}
            style={{ width: '100%', fontSize: '14px', padding: '8px' }}
          ></textarea>
        </td>
      </tr>
    )}
  </tbody>
</table>

        <div className="botones-formulario">
          {registroExistente ? (
            !formBloqueado ? (
              <>
                <button type="submit">Actualizar</button>
                <button type="button" onClick={handleBloquear}>Bloquear Formulario</button>
              </>
            ) : (
              <button type="button" onClick={handleDesbloquear}>Desbloquear</button>
            )
          ) : (
            <button type="submit">Guardar</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormularioMedico;
