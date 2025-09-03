import React, { useState, useEffect } from 'react';
import '../css/Formulario_Pacientes.css';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const preguntas = [
  { id: 'p1', texto: '¿El paciente aceptó su participación en el estudio?' },
  { id: 'p2', texto: 'Hora de obtención del consentimiento informado (Formato 24hrs):' },
  { id: 'p3', texto: '¿Tiene el paciente alguna condición preexistente relevante?' },
  { id: 'p4', texto: '¿El paciente recibió toda la información necesaria?' },
];

const ConcentimientoInformado = () => {
  const { idPaciente } = useParams();
  const navigate = useNavigate();

  const [respuestas, setRespuestas] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [horaValida, setHoraValida] = useState(true);
  const [horaError, setHoraError] = useState('');
  const [editId, setEditId] = useState(null);
  const [consentimiento, setConsentimiento] = useState(null);
  const [bloqueado, setBloqueado] = useState(false);

  const BLOQUEO_KEY = `consentimiento_bloqueado_${idPaciente}`;

  useEffect(() => {
    const bloqueoGuardado = localStorage.getItem(BLOQUEO_KEY);
    if (bloqueoGuardado === 'true') {
      setBloqueado(true);
    }

    if (idPaciente) {
      fetchConsentimiento();
    }
  }, [idPaciente]);

  const fetchConsentimiento = async () => {
    try {
      const res = await fetch(`https://api.weareinfinite.mx/form/consentimiento/${idPaciente}`);
      const data = await res.json();
      const lista = Array.isArray(data) ? data : data.result || [];

      if (lista.length > 0) {
        const ultimo = lista[lista.length - 1];
        setConsentimiento(ultimo);
        setEditId(ultimo.id);
        setRespuestas({
          p1: ultimo.pregunta1,
          p3: ultimo.pregunta3,
          p4: ultimo.pregunta4,
        });
        setComentarios({
          p1: ultimo.comentario1,
          p2: ultimo.pregunta2,
          p3: ultimo.comentario3,
          p4: ultimo.comentario4,
        });
      }
    } catch (error) {
      Swal.fire('Error', 'Error al obtener registros', 'error');
      navigate(`/Cronograma/${idPaciente}`);
    }
  };

  const handleChange = (id, value) => {
    setRespuestas(prev => ({ ...prev, [id]: value }));
  };

  const handleComentarioChange = (id, value) => {
    setComentarios(prev => ({ ...prev, [id]: value }));
  };

  const handleHoraChange = (e) => {
    const hora = e.target.value;
    setComentarios(prev => ({ ...prev, p2: hora }));

    const regexHora = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (regexHora.test(hora)) {
      setHoraValida(true);
      setHoraError('');
    } else {
      setHoraValida(false);
      setHoraError('Por favor ingrese una hora válida (ej: 13:45)');
    }
  };

  const limpiarFormulario = () => {
    setRespuestas({});
    setComentarios({});
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let pregunta of preguntas) {
      if (!respuestas[pregunta.id] && pregunta.id !== 'p2') {
        Swal.fire('Campo incompleto', `Responda: ${pregunta.texto}`, 'warning');
        return;
      }
    }

    if (!comentarios.p2 || !horaValida) {
      setHoraValida(false);
      Swal.fire('Hora inválida', 'Ingrese una hora válida (ej: 13:45)', 'warning');
      return;
    }

    const payload = {
      idPaciente,
      respuestas: [
        { id: 'p1', respuesta: respuestas.p1, comentario: comentarios.p1 || '' },
        { id: 'p2', comentario: comentarios.p2 },
        { id: 'p3', respuesta: respuestas.p3, comentario: comentarios.p3 || '' },
        { id: 'p4', respuesta: respuestas.p4, comentario: comentarios.p4 || '' },
      ]
    };

    try {
      const method = editId ? 'PUT' : 'POST';
      const url = `https://api.weareinfinite.mx/form/consentimiento${editId ? `/${editId}` : ''}`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      Swal.fire('Éxito', 'Datos guardados correctamente.', 'success');
      navigate(`/Cronograma/${idPaciente}`);
    } catch (error) {
      Swal.fire('Error del servidor', error.message, 'error');
      navigate(`/Cronograma/${idPaciente}`);
    }
  };

  const bloquearFormulario = () => {
    Swal.fire({
      title: '¿Deseas bloquear el formulario?',
      text: 'Luego necesitarás una contraseña para editarlo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, bloquear',
    }).then(result => {
      if (result.isConfirmed) {
        localStorage.setItem(BLOQUEO_KEY, 'true');
        setBloqueado(true);
        Swal.fire('Formulario bloqueado', '', 'info');
      }
    });
  };

  const desbloquearFormulario = () => {
    Swal.fire({
      title: 'Desbloquear formulario',
      input: 'password',
      inputLabel: 'Introduce la contraseña',
      inputPlaceholder: 'Contraseña',
      showCancelButton: true,
      confirmButtonText: 'Desbloquear',
    }).then(result => {
      if (result.isConfirmed) {
        if (result.value === 'infinite') {
          localStorage.removeItem(BLOQUEO_KEY);
          setBloqueado(false);
          Swal.fire('Desbloqueado', 'Formulario desbloqueado.', 'success');
        } else {
          Swal.fire('Contraseña incorrecta', '', 'error');
        }
      }
    });
  };

  if (!idPaciente) {
    return (
      <div className="fondo">
        <div className="container glass">
          <h2 style={{ color: 'white' }}>No se proporcionó un ID de paciente.</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="fondo">
      <div className="container glass">
        <img src="/image001.png" alt="Logo Infinite" className="logo" />
        <h2 style={{ color: '#ff5733' }}>Consentimiento Informado</h2>

        <form onSubmit={handleSubmit}>
    {preguntas.map(pregunta => {
  const respuesta = respuestas[pregunta.id];

  return (
    <div className="pregunta" key={pregunta.id}>
      <span dangerouslySetInnerHTML={{ __html: pregunta.texto }} />

      {['p1', 'p3', 'p4'].includes(pregunta.id) && (
        <div className="radio-group">
          {['Sí', 'No'].map(op => (
            <label className="radio-option" key={op}>
              <input
                type="radio"
                name={pregunta.id}
                value={op}
                checked={respuesta === op}
                onChange={() => handleChange(pregunta.id, op)}
                required
                disabled={bloqueado}
              />
              <span className="custom-radio">{op}</span>
            </label>
          ))}
        </div>
      )}

      {pregunta.id === 'p2' && (
        <>
          <input
            type="time"
            className={`comentario-input ${!horaValida ? 'error' : ''}`}
            value={comentarios[pregunta.id] || ''}
            onChange={handleHoraChange}
            disabled={bloqueado}
          />
          {!horaValida && (
            <span style={{ color: 'red', fontSize: '12px' }}>{horaError}</span>
          )}
        </>
      )}

      {/* Lógica de visibilidad de recuadro de comentario ajustada */}
      {(
        // Mostrar comentario si:
        // → es la p3 y respuesta es "Sí"
        (pregunta.id === 'p3' && respuesta === 'Sí') ||
        // → para otras preguntas (p1 y p4), si respuesta es "No"
        (pregunta.id !== 'p3' && respuesta === 'No')
      ) && (
        <input
          type="text"
          className="comentario-input"
          placeholder="Ingrese una observación..."
          value={comentarios[pregunta.id] || ''}
          onChange={(e) => handleComentarioChange(pregunta.id, e.target.value)}
          disabled={bloqueado}
        />
      )}
    </div>
  );
})}


          <div className="actions">
            <button type="submit" disabled={bloqueado}>
              {editId ? 'Actualizar' : 'Enviar'}
            </button>

            {editId && !bloqueado && (
              <button type="button" onClick={bloquearFormulario} className="btn btn-danger">
                Bloquear formulario
              </button>
            )}

            {bloqueado && (
              <button type="button" onClick={desbloquearFormulario} className="btn btn-warning">
                Desbloquear formulario
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConcentimientoInformado;
