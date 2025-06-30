import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importamos useParams y useNavigate
import '../css/Formulario_Pacientes.css';

const preguntas = [
  { id: 'p1', texto: '1. Firma de la carta de Consentimiento Informado' },
  { id: 'p2', texto: '2. Dolor lumbar con evolución de < 6 semanas' },
  { id: 'p3', texto: '3. Diagnóstico de Lumbalgia Mecánica aguda o subaguda SIN radiculopatía' },
  { id: 'p4', texto: '4. Paciente de cualquier género, mayor de 18 años y menor de 65 años' },
  { id: 'p5', texto: '5. Mujeres en edad fértil con método seguro de anticoncepción y/o prueba rápida de embarazo NEGATIVA' },
  { id: 'p6', texto: '6. Intensidad de dolor entre 6 a 8 en la escala visual análoga en V0' },
  { id: 'p7', texto: '7. Capacidad de llenado de los formatos de recolección de datos' },
  { id: 'p8', texto: '8. Pacientes que al momento del enrolamiento no hayan recibido tratamiento o que hayan recibido tratamientos diferentes a los medicamentos de estudio sin tener respuesta satisfactoria' },
];

const FormularioEvaluacionI = () => {
  const { idPaciente } = useParams(); // Obtenemos el ID del paciente desde la URL
  const [respuestas, setRespuestas] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [criterios, setCriterios] = useState(null);
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate(); // Hook para navegar a otra ruta

  useEffect(() => {
    if (idPaciente) {
      fetchCriteriosInclusion();
    }
  }, [idPaciente]);

  const fetchCriteriosInclusion = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/form/criterios_inclusion/${idPaciente}`);
      const data = await res.json();
      const lista = Array.isArray(data) ? data : data.result || [];

      if (lista.length > 0) {
        const ultimo = lista[lista.length - 1];
        setCriterios(ultimo);
        setEditId(ultimo.id);
        setRespuestas({
          p1: ultimo.pregunta1,
          p2: ultimo.pregunta2,
          p3: ultimo.pregunta3,
          p4: ultimo.pregunta4,
          p5: ultimo.pregunta5,
          p6: ultimo.pregunta6,
          p7: ultimo.pregunta7,
          p8: ultimo.pregunta8,
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
        });
      } else {
        setCriterios(null);
        setEditId(null);
      }
    } catch (error) {
      alert('Error al obtener los criterios de inclusión');
      console.error(error);
    }
  };

  const handleChange = (id, value) => {
    setRespuestas(prev => ({ ...prev, [id]: value }));
  };

  const handleComentarioChange = (id, value) => {
    setComentarios(prev => ({ ...prev, [id]: value }));
  };

  const limpiarFormulario = () => {
    setRespuestas({});
    setComentarios({});
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let pregunta of preguntas) {
      if (!respuestas[pregunta.id]) {
        alert(`Responda: ${pregunta.texto}`);
        return;
      }
    }

    const payload = {
      idPaciente: idPaciente,
      respuestas: preguntas.map(pregunta => ({
        id: pregunta.id,
        respuesta: respuestas[pregunta.id],
        comentario: comentarios[pregunta.id] || ''
      })),
    };

    try {
      const method = editId ? 'PUT' : 'POST';
      const url = `http://127.0.0.1:5000/form/criterios_inclusion${editId ? `/${editId}` : ''}`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      alert(editId ? 'Criterios de Inclusión actualizados correctamente' : 'Criterios de Inclusión guardados');
      limpiarFormulario();
      fetchCriteriosInclusion();
    } catch (error) {
      alert('Error en el servidor: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!criterios || !criterios.id) return;
    if (!window.confirm('¿Seguro que deseas eliminar este registro?')) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/form/criterios_inclusion/${criterios.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error(await res.text());

      alert('Registro eliminado');
      setCriterios(null);
      limpiarFormulario();
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  const handleNext = () => {
    if (idPaciente) {
      navigate(`/CriteriosI/${idPaciente}`); // Redirige a la página con el idPaciente
    }
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
        <h2 style={{ color: '#ff5733' }}>Criterios de Inclusión</h2>

        <form onSubmit={handleSubmit}>
          {preguntas.map(pregunta => {
            const respuesta = respuestas[pregunta.id];
            const esNo = respuesta === 'No';

            return (
              <div className="pregunta" key={pregunta.id}>
                <span dangerouslySetInnerHTML={{ __html: pregunta.texto }} />
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
            <button type="button" onClick={handleDelete}>Eliminar registro</button>
          )}

          <button type="button" onClick={handleNext}>Siguiente</button> {/* Botón de siguiente */}
        </form>
      </div>
    </div>
  );
};

export default FormularioEvaluacionI;
