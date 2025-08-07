import React, { useEffect, useState } from 'react';
import '../css/SignosV.css';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EventosAdversos = () => {
  const { idPaciente } = useParams();
  const [registroExistente, setRegistroExistente] = useState(false);
  const [formData, setFormData] = useState({
    iniciales: '',
    num_aleatorizacion: '',
    presento_ea: null,
    evento: '',
    clasificado_como_ea: '', // Aquí se guardará 's' o 'n'
    fecha_inicio: '',
    fecha_termino: '',
    hora_inicio: '',
    hora_termino: '',
    intensidad: '',
    causalidad: '',
    relacion_medicamento: '',
    acciones_tomadas: '',
    desenlace: '',
    nota_evolucion: ''
  });

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  useEffect(() => {
    if (!idPaciente) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.weareinfinite.mx/form/eventos_adversos/${idPaciente}`);
        if (res.status === 404) {
          setRegistroExistente(false);
          return;
        }
        const data = await res.json();

        // Convertir campos numéricos a string para selects
        const camposNumericos = ['intensidad', 'causalidad', 'relacion_medicamento', 'acciones_tomadas', 'desenlace'];
        camposNumericos.forEach(campo => {
          if (data[campo] !== null && data[campo] !== undefined) {
            data[campo] = data[campo].toString();
          } else {
            data[campo] = '';
          }
        });

        // Convertir presento_ea: "1" o 1 a booleano
        data.presento_ea = data.presento_ea === "1" || data.presento_ea === 1;

        // Formatear fechas para inputs
        data.fecha_inicio = formatDateForInput(data.fecha_inicio);
        data.fecha_termino = formatDateForInput(data.fecha_termino);

        // clasificado_como_ea ya viene 's' o 'n' y se asigna tal cual
        data.clasificado_como_ea = data.clasificado_como_ea || '';

        setFormData(prev => ({ ...prev, ...data }));
        setRegistroExistente(true);
      } catch (error) {
        console.error('Error cargando evento adverso:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el evento adverso',
        });
      }
    };

    // Obtención de las iniciales del paciente
    const fetchPaciente = async () => {
      try {
        const resPaciente = await fetch(`https://api.weareinfinite.mx/paciente/view/${idPaciente}`);
        if (resPaciente.status === 404) {
          console.error('Paciente no encontrado');
          return;
        }
        const pacienteData = await resPaciente.json();
        if (pacienteData && pacienteData.iniciales) {
          setFormData(prev => ({ ...prev, iniciales: pacienteData.iniciales }));
        }
      } catch (error) {
        console.error('Error cargando datos del paciente:', error);
      }
    };

    fetchPaciente();  // Cargar datos del paciente
    fetchData();      // Cargar datos del evento adverso
  }, [idPaciente]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePresentoEAChange = (value) => {
    setFormData(prev => ({ ...prev, presento_ea: value }));
  };

  const handleClasificadoComoEAChange = (value) => {
    setFormData(prev => ({ ...prev, clasificado_como_ea: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      idPaciente
    };

    try {
      const response = await fetch(`https://api.weareinfinite.mx/form/eventos_adversos${registroExistente ? `/${idPaciente}` : ''}`, {
        method: registroExistente ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.mensaje || 'Error al guardar');

      Swal.fire({
        icon: 'success',
        title: '¡Guardado!',
        text: registroExistente ? 'Evento actualizado correctamente' : 'Evento guardado exitosamente',
      });

      setRegistroExistente(true);
    } catch (error) {
      console.error('Error en la solicitud:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar el evento adverso',
      });
    }
  };

  return (
    <div className="container">
      <h2>EVENTOS ADVERSOS</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td><label>Iniciales:</label></td>
              <td><input type="text" name="iniciales" value={formData.iniciales} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><label>No. De Aleatorización:</label></td>
              <td><input type="text" name="num_aleatorizacion" value={formData.num_aleatorizacion} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td colSpan={2}>
                <label>¿El paciente presentó algún Evento Adverso durante la visita?</label><br />
                <label>
                  <input
                    type="radio"
                    name="ea"
                    value="si"
                    checked={formData.presento_ea === true}
                    onChange={() => handlePresentoEAChange(true)}
                  /> Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="ea"
                    value="no"
                    checked={formData.presento_ea === false}
                    onChange={() => handlePresentoEAChange(false)}
                  /> No
                </label>
              </td>
            </tr>

            {formData.presento_ea && (
              <>
                <tr>
                  <td><label>Evento Adverso:</label></td>
                  <td><input type="text" name="evento" value={formData.evento} onChange={handleInputChange} /></td>
                </tr>
                <tr>
                  <td><label>¿Es clasificado como EA's?</label></td>
                  <td>
                    <label>
                      <input
                        type="radio"
                        name="clasificado_como_ea"
                        value="s"
                        checked={formData.clasificado_como_ea === 's'}
                        onChange={() => handleClasificadoComoEAChange('s')}
                      /> Sí
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="clasificado_como_ea"
                        value="n"
                        checked={formData.clasificado_como_ea === 'n'}
                        onChange={() => handleClasificadoComoEAChange('n')}
                      /> No
                    </label>
                  </td>
                </tr>
                <tr>
                  <td><label>Fecha de inicio:</label></td>
                  <td><input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleInputChange} /></td>
                </tr>
                <tr>
                  <td><label>Fecha de término:</label></td>
                  <td><input type="date" name="fecha_termino" value={formData.fecha_termino} onChange={handleInputChange} /></td>
                </tr>
                <tr>
                  <td><label>Hora de inicio:</label></td>
                  <td><input type="time" name="hora_inicio" value={formData.hora_inicio} onChange={handleInputChange} /></td>
                </tr>
                <tr>
                  <td><label>Hora de término:</label></td>
                  <td><input type="time" name="hora_termino" value={formData.hora_termino} onChange={handleInputChange} /></td>
                </tr>
                <tr>
                  <td><label>Intensidad:</label></td>
                  <td>
                    <select name="intensidad" value={formData.intensidad} onChange={handleInputChange}>
                      <option value="">Seleccione</option>
                      <option value="1">1. Leve</option>
                      <option value="2">2. Moderado</option>
                      <option value="3">3. Severo</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><label>Causalidad:</label></td>
                  <td>
                    <select name="causalidad" value={formData.causalidad} onChange={handleInputChange}>
                      <option value="">Seleccione</option>
                      <option value="1">1. Cierta</option>
                      <option value="2">2. Probable</option>
                      <option value="3">3. Posible</option>
                      <option value="4">4. Improbable</option>
                      <option value="5">5. Condicional/No clasificada</option>
                      <option value="6">6. No evaluable / Inclasificable</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><label>Relación con el medicamento de estudio:</label></td>
                  <td>
                    <select name="relacion_medicamento" value={formData.relacion_medicamento} onChange={handleInputChange}>
                      <option value="">Seleccione</option>
                      <option value="1">1. Ninguna</option>
                      <option value="2">2. Dudosa</option>
                      <option value="3">3. Posible</option>
                      <option value="4">4. Probable</option>
                      <option value="5">5. Muy probable</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><label>Acciones tomadas:</label></td>
                  <td>
                    <select name="acciones_tomadas" value={formData.acciones_tomadas} onChange={handleInputChange}>
                      <option value="">Seleccione</option>
                      <option value="1">1. Ninguna</option>
                      <option value="2">2. Descontinuación del medicamento de estudio</option>
                      <option value="3">3. Medicamento concomitante</option>
                      <option value="4">4. Hospitalización requerida o prolongada</option>
                      <option value="5">5. Otro</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><label>Desenlace:</label></td>
                  <td>
                    <select name="desenlace" value={formData.desenlace} onChange={handleInputChange}>
                      <option value="">Seleccione</option>
                      <option value="1">1. Resuelto</option>
                      <option value="2">2. Mejoría</option>
                      <option value="3">3. Sin cambio</option>
                      <option value="4">4. Empeoró</option>
                      <option value="5">5. Muerte</option>
                      <option value="6">6. Pérdida de seguimiento</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><label>Nota de evolución:</label></td>
                  <td>
                    <textarea
                      rows="5"
                      name="nota_evolucion"
                      value={formData.nota_evolucion}
                      onChange={handleInputChange}
                    ></textarea>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
        <button type="submit">{registroExistente ? 'Actualizar' : 'Guardar'}</button>
      </form>
    </div>
  );
};

export default EventosAdversos;
