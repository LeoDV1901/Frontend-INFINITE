import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../css/Formulario_Pacientes.css';

const preguntas = [
  { id: 'p1', texto: '1. Diagnóstico de Lumbalgia Mecánica aguda o subaguda CON radiculopatía' },
  { id: 'p2', texto: '2. Intensidad de dolor igual o mayor a 8 en la escala visual análoga en V0' },
  { id: 'p3', texto: '3. Presencia de síntomas de cauda equina' },
  { id: 'p4', texto: '4. Enfermedad sistémica (cáncer, infecciones graves, VIH-SIDA, fiebre persistente, epilepsia)' },
  { id: 'p5', texto: '5. Patología neurológica sistémica' },
  { id: 'p6', texto: '6. Hernia discal o coxartrosis' },
  { id: 'p7', texto: '7. Historia de trauma de columna lumbar' },
  { id: 'p8', texto: '8. Pérdida de peso inexplicada' },
  { id: 'p9', texto: '9. No estar en tratamiento con AINE' },
  { id: 'p10', texto: '10. Estar bajo tratamiento derivado de la presencia de trastornos psiquiátricos o de personalidad' },
  { id: 'p11', texto: '11. Pacientes con HAS o DM NO CONTROLADA' },
  { id: 'p12', texto: '12. Paciente con antecedente de infarto agudo al miocardio' },
  { id: 'p13', texto: '13. En caso de presentar sobrepeso u obesidad, estar tomando medicamentos para reducción de peso' },
  { id: 'p14', texto: '14. Alteraciones renales o hepáticas' },
  { id: 'p15', texto: '15. Mujeres embarazadas o lactando' },
  { id: 'p16', texto: '16. ERGE, úlcera gástrica o duodenal y/o sangrados de tubo digestivo' },
  { id: 'p17', texto: '17. Alergia conocida a cualquier AINE o sulfonamidas' },
  { id: 'p18', texto: '18. Sacralización' },
  { id: 'p19', texto: '19. Alteraciones reumáticas' },
  { id: 'p20', texto: '20. Pacientes con antecedentes de abuso de alcohol o drogas' },
];

const EliminacionEvolucionCriteriosExclusion = () => {
  const { idPaciente } = useParams();
  const navigate = useNavigate();

  const [respuestas, setRespuestas] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [criteriosExistentes, setCriteriosExistentes] = useState(null);
  const [editId, setEditId] = useState(null);
  const [bloqueado, setBloqueado] = useState(false);

  const BLOQUEO_KEY = `exclusion_bloqueado_${idPaciente}`;

  useEffect(() => {
    const bloqueoGuardado = localStorage.getItem(BLOQUEO_KEY);
    if (bloqueoGuardado === 'true') {
      setBloqueado(true);
    }

    if (idPaciente) {
      fetchCriteriosExclusion();
    }
  }, [idPaciente]);

  const fetchCriteriosExclusion = async () => {
    try {
      const res = await fetch(`https://api.weareinfinite.mx/form/criterios_exclusion/${idPaciente}`);
      const data = await res.json();
      const lista = Array.isArray(data) ? data : data.result || [];

      if (lista.length > 0) {
        const ultimo = lista[lista.length - 1];
        setCriteriosExistentes(ultimo);
        setEditId(ultimo.id);

        setRespuestas(Object.fromEntries(preguntas.map(p => [p.id, ultimo[`pregunta${p.id.slice(1)}`]])));
        setComentarios(Object.fromEntries(preguntas.map(p => [p.id, ultimo[`comentario${p.id.slice(1)}`]])));
      }
    } catch (error) {
      Swal.fire('Error', 'Error al obtener registros.', 'error');
      navigate(`/Cronograma/${idPaciente}`);
    }
  };

  const handleChange = (id, value) => {
    setRespuestas(prev => ({ ...prev, [id]: value }));
  };

  const handleComentarioChange = (id, value) => {
    setComentarios(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todasRespondidas = preguntas.every(p => respuestas[p.id]);
    if (!todasRespondidas) {
      return Swal.fire('Faltan respuestas', 'Por favor responde todas las preguntas.', 'warning');
    }

    const faltanComentarios = preguntas.some(p =>
      respuestas[p.id] === 'Sí' && !comentarios[p.id]?.trim()
    );

    if (faltanComentarios) {
      return Swal.fire('Faltan comentarios', 'Por favor completa las observaciones en respuestas "Sí".', 'warning');
    }

    const payload = {
      idPaciente,
      respuestas: preguntas.map(p => ({
        id: p.id,
        respuesta: respuestas[p.id],
      })),
      comentarios,
    };

    try {
      const url = editId
        ? `https://api.weareinfinite.mx/form/criterios_exclusion/${editId}`
        : `https://api.weareinfinite.mx/form/criterios_exclusion`;

      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error en la petición');

      Swal.fire('Éxito', 'Datos actualizados correctamente.', 'success');
      navigate(`/Cronograma/${idPaciente}`);
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al guardar los datos.', 'error');
      navigate(`/Cronograma/${idPaciente}`);
    }
  };

  const bloquearFormulario = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez bloqueado, necesitarás una contraseña para desbloquear.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, bloquear',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        localStorage.setItem(BLOQUEO_KEY, 'true');
        setBloqueado(true);
        Swal.fire('Formulario bloqueado', 'Ahora está bloqueado para edición.', 'info');
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
          Swal.fire('Error', 'Contraseña incorrecta.', 'error');
        }
      }
    });
  };

  return (
    <div className="fondo">
      <div className="container glass">
        <img src="/image001.png" alt="Logo Infinite" className="logo" />
        <h2 style={{ color: '#ff5733' }}>Criterios de Eliminacion</h2>
        <form onSubmit={handleSubmit}>
          {preguntas.map(pregunta => {
            const respuesta = respuestas[pregunta.id];
            const esSi = respuesta === 'Sí';

            return (
              <div
                key={pregunta.id}
                className="pregunta"
                style={{
                  border: esSi ? '2px solid red' : '1px solid transparent',
                  borderRadius: '8px',
                  padding: '10px',
                  marginBottom: '15px',
                }}
              >
                <span dangerouslySetInnerHTML={{ __html: pregunta.texto }} />
                <div className="radio-group">
                  {['Sí', 'No'].map(opcion => (
                    <label className="radio-option" key={opcion}>
                      <input
                        type="radio"
                        name={pregunta.id}
                        value={opcion}
                        checked={respuesta === opcion}
                        onChange={(e) => handleChange(pregunta.id, e.target.value)}
                        disabled={bloqueado}
                      />
                      {opcion}
                    </label>
                  ))}
                </div>
                {esSi && (
                  <div className="comentario">
                    <textarea
                      value={comentarios[pregunta.id] || ''}
                      onChange={(e) => handleComentarioChange(pregunta.id, e.target.value)}
                      placeholder="Comentario sobre esta respuesta..."
                      disabled={bloqueado}
                    />
                  </div>
                )}
              </div>
            );
          })}
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={bloqueado}>
              Guardar
            </button>
            {!bloqueado && (
              <button type="button" onClick={bloquearFormulario} className="block-btn">
                Bloquear
              </button>
            )}
            {bloqueado && (
              <button type="button" onClick={desbloquearFormulario} className="unblock-btn">
                Desbloquear
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EliminacionEvolucionCriteriosExclusion;
