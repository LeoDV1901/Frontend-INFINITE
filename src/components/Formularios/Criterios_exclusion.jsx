import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // <- Importación de SweetAlert2
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

const EvolucionCriteriosExclusion = () => {
  const { idPaciente } = useParams();
  const [respuestas, setRespuestas] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [criteriosExistentes, setCriteriosExistentes] = useState(null);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const fetchCriteriosExclusion = async () => {
    try {
      const res = await fetch(`https://api.weareinfinite.mx/form/criterios_exclusion/${idPaciente}`);
      const data = await res.json();
      const lista = Array.isArray(data) ? data : data.result || [];

      if (lista.length > 0) {
        const ultimo = lista[lista.length - 1];
        setCriteriosExistentes(ultimo);
        setEditId(ultimo.id);

        setRespuestas(Object.fromEntries(
          preguntas.map(p => [p.id, ultimo[`pregunta${p.id.slice(1)}`]])
        ));

        setComentarios(Object.fromEntries(
          preguntas.map(p => [p.id, ultimo[`comentario${p.id.slice(1)}`]])
        ));
      } else {
        setCriteriosExistentes(null);
        setEditId(null);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al obtener registros.',
      });
      console.error(error);
    }
  };

  useEffect(() => {
    if (idPaciente) {
      fetchCriteriosExclusion();
    }
  }, [idPaciente]);

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
      Swal.fire({
        icon: 'warning',
        title: 'Faltan respuestas',
        text: 'Por favor responde todas las preguntas.',
      });
      return;
    }

    const faltanComentarios = preguntas.some(p =>
      respuestas[p.id] === 'Sí' && !comentarios[p.id]?.trim()
    );

    if (faltanComentarios) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan comentarios',
        text: 'Por favor ingrese una observación en todas las respuestas "Sí".',
      });
      return;
    }

    const payload = {
      idPaciente: idPaciente,
      respuestas: preguntas.map(p => ({
        id: p.id,
        respuesta: respuestas[p.id],
      })),
      comentarios: comentarios,
    };

    try {
      let response;
      if (criteriosExistentes) {
        response = await fetch(`https://api.weareinfinite.mx/form/criterios_exclusion/${criteriosExistentes.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          await Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: 'Criterios actualizados con éxito.',
          });
        } else {
          throw new Error('Error al actualizar');
        }
      } else {
        response = await fetch('https://api.weareinfinite.mx/form/criterios_exclusion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          await Swal.fire({
            icon: 'success',
            title: 'Guardado',
            text: 'Criterios creados con éxito.',
          });
        } else {
          throw new Error('Error al crear');
        }
      }

      navigate(`/CriteriosI/${idPaciente}`);
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al enviar los datos.',
      });
    }
  };

  const handleDelete = async () => {
    if (!criteriosExistentes || !criteriosExistentes.id) {
      console.error("No hay criterios para eliminar.");
      return;
    }

    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará los criterios actuales.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(`https://api.weareinfinite.mx/form/criterios_exclusion/${criteriosExistentes.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'Criterios eliminados con éxito.',
          });
          navigate(`/CriteriosI/${idPaciente}`);
        } else {
          throw new Error('Error al eliminar');
        }
      } catch (error) {
        console.error('Error al eliminar los criterios:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron eliminar los criterios.',
        });
      }
    }
  };

  return (
    <div className="fondo">
      <div className="container glass">
        <img src="/image001.png" alt="Logo Infinite" className="logo" />
        <h2 style={{ color: '#ff5733' }}>Evolución de Criterios de Exclusión</h2>
        <form onSubmit={handleSubmit}>
          {preguntas.map(pregunta => {
            const respuesta = respuestas[pregunta.id];
            const esSi = respuesta === 'Sí';

            return (
              <div
                className="pregunta"
                key={pregunta.id}
                style={{
                  border: esSi ? '2px solid red' : '1px solid transparent',
                  borderRadius: '8px',
                  padding: '10px',
                  marginBottom: '15px',
                }}
              >
                <span dangerouslySetInnerHTML={{ __html: pregunta.texto }} />
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name={pregunta.id}
                      value="Sí"
                      checked={respuesta === 'Sí'}
                      onChange={(e) => handleChange(pregunta.id, e.target.value)}
                    />
                    Sí
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name={pregunta.id}
                      value="No"
                      checked={respuesta === 'No'}
                      onChange={(e) => handleChange(pregunta.id, e.target.value)}
                    />
                    No
                  </label>
                </div>
                {esSi && (
                  <div className="comentario">
                    <textarea
                      value={comentarios[pregunta.id] || ''}
                      onChange={(e) => handleComentarioChange(pregunta.id, e.target.value)}
                      placeholder="Comentario sobre esta respuesta..."
                      style={{ color: 'black' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
          <div className="actions">
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
            {criteriosExistentes && (
              <button type="button" className="btn btn-danger" onClick={handleDelete}>
                Eliminar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvolucionCriteriosExclusion;
