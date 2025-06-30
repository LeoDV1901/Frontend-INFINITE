import React, { useState, useEffect } from 'react';
import '../css/Formulario_Pacientes.css';
import { useParams } from 'react-router-dom';

const preguntas = [
  { id: 'p1', texto: '¿El paciente aceptó su participación en el estudio?' },
  { id: 'p2', texto: 'Hora de obtención del consentimiento informado (Formato 24hrs):' },
  { id: 'p3', texto: '¿Tiene el paciente alguna condición preexistente relevante?' },
  { id: 'p4', texto: '¿El paciente recibió toda la información necesaria?' },
];

const ConcentimientoInformado = () => {
  const { idPaciente } = useParams(); // Obtenemos el ID desde la URL
  const [respuestas, setRespuestas] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [horaValida, setHoraValida] = useState(true);
  const [horaError, setHoraError] = useState('');
  const [editId, setEditId] = useState(null);
  const [consentimiento, setConsentimiento] = useState(null);

  useEffect(() => {
    if (idPaciente) {
      fetchConsentimiento();
    }
  }, [idPaciente]);

  const fetchConsentimiento = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/form/consentimiento/${idPaciente}`);
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
      } else {
        setConsentimiento(null);
        setEditId(null);
      }
    } catch (error) {
      alert('Error al obtener registros');
      console.error(error);
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
        alert(`Responda: ${pregunta.texto}`);
        return;
      }
    }

    if (!comentarios.p2 || !horaValida) {
      setHoraValida(false);
      alert('Ingrese una hora válida (ej: 13:45)');
      return;
    }

    const payload = {
      idPaciente: idPaciente,
      respuestas: [
        { id: 'p1', respuesta: respuestas.p1, comentario: comentarios.p1 || '' },
        { id: 'p2', comentario: comentarios.p2 },
        { id: 'p3', respuesta: respuestas.p3, comentario: comentarios.p3 || '' },
        { id: 'p4', respuesta: respuestas.p4, comentario: comentarios.p4 || '' },
      ]
    };

    try {
      const method = editId ? 'PUT' : 'POST';
      const url = `http://127.0.0.1:5000/form/consentimiento${editId ? `/${editId}` : ''}`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      alert(editId ? 'Actualizado correctamente' : 'Consentimiento guardado');
      limpiarFormulario();
      fetchConsentimiento();
    } catch (error) {
      alert('Error en el servidor: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!consentimiento || !consentimiento.id) return;
    if (!window.confirm('¿Seguro que deseas eliminar este registro?')) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/form/consentimiento/${consentimiento.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error(await res.text());

      alert('Registro eliminado');
      setConsentimiento(null);
      limpiarFormulario();
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  // Si no hay idPaciente en la URL
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
            const esNo = respuesta === 'No';

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
                    />
                    {!horaValida && (
                      <span style={{ color: 'red', fontSize: '12px' }}>{horaError}</span>
                    )}
                  </>
                )}

                {esNo && (
                  <input
                    type="text"
                    className="comentario-input"
                    placeholder="Ingrese una observación..."
                    value={comentarios[pregunta.id] || ''}
                    onChange={(e) => handleComentarioChange(pregunta.id, e.target.value)}
                  />
                )}
              </div>
            );
          })}

          <button type="submit">{editId ? 'Actualizar' : 'Enviar'}</button>
          {editId && (
            <>
              <button type="button" onClick={handleDelete}>Eliminar registro</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ConcentimientoInformado;
