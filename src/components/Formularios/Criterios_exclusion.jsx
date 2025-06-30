import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  // Cargar los criterios de exclusión existentes para el paciente
  const fetchCriteriosExclusion = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/form/criterios_exclusion/${idPaciente}`);
      const data = await res.json();
      const lista = Array.isArray(data) ? data : data.result || [];

      if (lista.length > 0) {
        const ultimo = lista[lista.length - 1];
        setCriteriosExistentes(ultimo);
        setEditId(ultimo.id);

        // Mapear las respuestas y comentarios
        setRespuestas({
          p1: ultimo.pregunta1,
          p2: ultimo.pregunta2,
          p3: ultimo.pregunta3,
          p4: ultimo.pregunta4,
          p5: ultimo.pregunta5,
          p6: ultimo.pregunta6,
          p7: ultimo.pregunta7,
          p8: ultimo.pregunta8,
          p9: ultimo.pregunta9,
          p10: ultimo.pregunta10,
          p11: ultimo.pregunta11,
          p12: ultimo.pregunta12,
          p13: ultimo.pregunta13,
          p14: ultimo.pregunta14,
          p15: ultimo.pregunta15,
          p16: ultimo.pregunta16,
          p17: ultimo.pregunta17,
          p18: ultimo.pregunta18,
          p19: ultimo.pregunta19,
          p20: ultimo.pregunta20,
        });

        setComentarios({
          p1: ultimo.comentario1,
          p2: ultimo.comentario2,
          p3: ultimo.comentario3,
          p4: ultimo.comentario4,
          p5: ultimo.comentario5,
          p6: ultimo.comentario6,
          p7: ultimo.comentario7,
          p8: ultimo.comentario8,
          p9: ultimo.comentario9,
          p10: ultimo.comentario10,
          p11: ultimo.comentario11,
          p12: ultimo.comentario12,
          p13: ultimo.comentario13,
          p14: ultimo.comentario14,
          p15: ultimo.comentario15,
          p16: ultimo.comentario16,
          p17: ultimo.comentario17,
          p18: ultimo.comentario18,
          p19: ultimo.comentario19,
          p20: ultimo.comentario20,
        });
      } else {
        setCriteriosExistentes(null);
        setEditId(null);
      }
    } catch (error) {
      alert('Error al obtener registros');
      console.error(error);
    }
  };

  useEffect(() => {
    if (idPaciente) {
      fetchCriteriosExclusion();
    }
  }, [idPaciente]);

  // Manejar el cambio de respuestas
  const handleChange = (id, value) => {
    setRespuestas(prev => ({ ...prev, [id]: value }));
  };

  // Manejar el cambio de comentarios
  const handleComentarioChange = (id, value) => {
    setComentarios(prev => ({ ...prev, [id]: value }));
  };

  // Enviar el formulario (crear o actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar que todas las preguntas tengan respuesta
    const todasRespondidas = preguntas.every(p => respuestas[p.id]);
    if (!todasRespondidas) {
      alert('Por favor responde todas las preguntas.');
      return;
    }

    // Verificar que los comentarios estén completos cuando la respuesta sea "Sí"
    const faltanComentarios = preguntas.some(p =>
      respuestas[p.id] === 'Sí' && !comentarios[p.id]?.trim()
    );

    if (faltanComentarios) {
      alert('Por favor ingrese una observación en todas las respuestas "Sí".');
      return;
    }

    // Preparar los datos para enviar
    const payload = {
      idPaciente: idPaciente,
      respuestas: preguntas.map(p => ({
        id: p.id,
        respuesta: respuestas[p.id],
      })),
      comentarios: comentarios,
    };

    try {
      if (criteriosExistentes) {
        // Si ya existen criterios, realizamos la actualización
        const response = await fetch(`http://127.0.0.1:5000/form/criterios_exclusion/${criteriosExistentes.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          alert('Criterios actualizados con éxito');
        } else {
          alert('Error al actualizar los criterios');
        }
      } else {
        // Si no existen criterios, creamos nuevos
        const response = await fetch('http://127.0.0.1:5000/form/criterios_exclusion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          alert('Criterios creados con éxito');
        } else {
          alert('Error al crear los criterios');
        }
      }

      // Redirigir después de guardar los datos
      navigate(`/CriteriosI/${idPaciente}`);
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  // Eliminar los criterios de exclusión existentes
  const handleDelete = async () => {
    if (!criteriosExistentes || !criteriosExistentes.id) {
      console.error("No hay criterios para eliminar.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/form/criterios_exclusion/${criteriosExistentes.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Criterios eliminados con éxito');
        navigate(`/CriteriosI/${idPaciente}`);
      } else {
        alert('Error al eliminar los criterios');
      }
    } catch (error) {
      console.error('Error al eliminar los criterios:', error);
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
                {respuesta === 'Sí' && (
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
