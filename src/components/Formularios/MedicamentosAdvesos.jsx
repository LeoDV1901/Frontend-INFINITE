import React, { useEffect, useState } from 'react';
import './Medicamento.css';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EventosAdversos = () => {
  const { idPaciente } = useParams();
  const BLOQUEO_KEY = `ea_bloqueado_${idPaciente}`;
  const [bloqueado, setBloqueado] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [formData, setFormData] = useState({
    iniciales: '',
    num_aleatorizacion: '',
    presento_ea: null,
    evento: '',
    clasificado_como_ea: '',
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
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const resetForm = () => {
    setFormData(prev => ({
      ...prev,
      presento_ea: null,
      evento: '',
      clasificado_como_ea: '',
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
    }));
  };

  useEffect(() => {
    if (localStorage.getItem(BLOQUEO_KEY) === 'true') setBloqueado(true);
    if (!idPaciente) return;

    const fetchEventos = async () => {
      try {
        const res = await fetch(`https://api.weareinfinite.mx/form/eventos_adversos/paciente/${idPaciente}`);
        if (!res.ok) return;
        const data = await res.json();
        setEventos(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchPaciente = async () => {
      try {
        const res = await fetch(`https://api.weareinfinite.mx/paciente/view/${idPaciente}`);
        if (res.ok) {
          const pd = await res.json();
          if (pd.iniciales) setFormData(prev => ({ ...prev, iniciales: pd.iniciales }));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPaciente();
    fetchEventos();
  }, [idPaciente]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePresentoEAChange = (val) => setFormData(prev => ({ ...prev, presento_ea: val }));
  const handleClasificadoEAChange = (val) => setFormData(prev => ({ ...prev, clasificado_como_ea: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, idPaciente };
    try {
      const res = await fetch(`https://api.weareinfinite.mx/form/eventos_adversos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error al guardar evento');
      Swal.fire({ icon: 'success', title: 'Evento guardado', timer: 1500, showConfirmButton: false });
      resetForm();
      const updated = await fetch(`https://api.weareinfinite.mx/form/eventos_adversos/paciente/${idPaciente}`);
      const updatedData = await updated.json();
      setEventos(updatedData);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar el evento' });
    }
  };

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar evento?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`https://api.weareinfinite.mx/form/eventos_adversos/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('No se pudo eliminar');
      setEventos(eventos.filter(ev => ev.id !== id));
      Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1000, showConfirmButton: false });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el evento' });
    }
  };

  const bloquearCampos = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez bloqueado, solo podrá desbloquearse con contraseña.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, bloquear',
      cancelButtonText: 'Cancelar'
    }).then((r) => {
      if (r.isConfirmed) {
        localStorage.setItem(BLOQUEO_KEY, 'true');
        setBloqueado(true);
        Swal.fire({ icon: 'info', title: 'Bloqueado', text: 'Los campos están bloqueados.', timer: 2000, showConfirmButton: false });
      }
    });
  };

  const desbloquearCampos = () => {
    Swal.fire({
      title: 'Desbloquear formulario',
      input: 'password',
      inputLabel: 'Introduce la contraseña',
      inputPlaceholder: 'Contraseña',
      inputAttributes: { maxlength: 20 },
      showCancelButton: true,
      confirmButtonText: 'Desbloquear'
    }).then((r) => {
      if (r.isConfirmed && r.value === 'infinite') {
        localStorage.removeItem(BLOQUEO_KEY);
        setBloqueado(false);
        Swal.fire({ icon: 'success', title: 'Desbloqueado', text: 'Puedes editar nuevamente.', timer: 2000, showConfirmButton: false });
      } else if (r.isConfirmed) {
        Swal.fire({ icon: 'error', title: 'Contraseña incorrecta' });
      }
    });
  };

  return (
    <div className="container">
      <h2>EVENTOS ADVERSOS</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td><label>Iniciales:</label></td>
              <td><input type="text" name="iniciales" value={formData.iniciales} disabled onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><label>No. Aleatorización:</label></td>
              <td><input type="text" name="num_aleatorizacion" value={formData.num_aleatorizacion} disabled={bloqueado} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td colSpan={2}>
                <label>¿El paciente presentó algún EA durante la visita?</label><br />
                <label><input type="radio" name="ea" value="si" checked={formData.presento_ea === true} disabled={bloqueado} onChange={() => handlePresentoEAChange(true)} /> Sí</label>
                <label><input type="radio" name="ea" value="no" checked={formData.presento_ea === false} disabled={bloqueado} onChange={() => handlePresentoEAChange(false)} /> No</label>
              </td>
            </tr>

            {formData.presento_ea && (
              <>
                <tr><td><label>Fecha inicio:</label></td><td><input type="date" name="fecha_inicio" value={formData.fecha_inicio} disabled={bloqueado} onChange={handleInputChange} /></td></tr>
                <tr><td><label>Fecha término:</label></td><td><input type="date" name="fecha_termino" value={formData.fecha_termino} disabled={bloqueado} onChange={handleInputChange} /></td></tr>
                <tr><td><label>Hora inicio:</label></td><td><input type="time" name="hora_inicio" value={formData.hora_inicio} disabled={bloqueado} onChange={handleInputChange} /></td></tr>
                <tr><td><label>Hora término:</label></td><td><input type="time" name="hora_termino" value={formData.hora_termino} disabled={bloqueado} onChange={handleInputChange} /></td></tr>
                <tr><td><label>Intensidad:</label></td><td>
                  <select name="intensidad" value={formData.intensidad} disabled={bloqueado} onChange={handleInputChange}>
                    <option value="">Seleccione</option><option value="1">Leve</option><option value="2">Moderada</option><option value="3">Grave</option>
                  </select>
                </td></tr>
                <tr><td><label>Causalidad:</label></td><td>
                  <select name="causalidad" value={formData.causalidad} disabled={bloqueado} onChange={handleInputChange}>
                    <option value="">Seleccione</option><option value="1">Relacionada</option><option value="2">No relacionada</option><option value="3">Probablemente</option>
                  </select>
                </td></tr>
                <tr><td><label>Relación medicamento:</label></td><td>
                  <select name="relacion_medicamento" value={formData.relacion_medicamento} disabled={bloqueado} onChange={handleInputChange}>
                    <option value="">Seleccione</option><option value="1">Alta</option><option value="2">Media</option><option value="3">Baja</option>
                  </select>
                </td></tr>
                <tr><td><label>Acciones tomadas:</label></td><td>
                  <select name="acciones_tomadas" value={formData.acciones_tomadas} disabled={bloqueado} onChange={handleInputChange}>
                    <option value="">Seleccione</option><option value="1">Suspensión</option><option value="2">Reducción</option><option value="3">Sin cambios</option>
                  </select>
                </td></tr>
                <tr><td><label>Desenlace:</label></td><td>
                  <select name="desenlace" value={formData.desenlace} disabled={bloqueado} onChange={handleInputChange}>
                    <option value="">Seleccione</option><option value="1">Recuperado</option><option value="2">Persistente</option><option value="3">Desconocido</option>
                  </select>
                </td></tr>
                <tr><td><label>Nota de evolución:</label></td><td>
                  <textarea name="nota_evolucion" rows="3" value={formData.nota_evolucion} disabled={bloqueado} onChange={handleInputChange}></textarea>
                </td></tr>
              </>
            )}
          </tbody>
        </table>
        {!bloqueado && (
          <div style={{ marginTop: '1rem' }}>
            <button type="submit">Agregar Evento</button>
            <button type="button" onClick={bloquearCampos}>Bloquear</button>
          </div>
        )}
        {bloqueado && <button type="button" onClick={desbloquearCampos}>Desbloquear</button>}
      </form>

      {/* Tabla de eventos agregados */}
 {eventos.length > 0 && (
      <div className="tabla-eventos-container">
        <h3>Eventos adversos registrados:</h3>
        <table className="eventos-table">
          <thead>
            <tr>
              <th>Fecha inicio</th>
              <th>Fecha término</th>
              <th>Hora inicio</th>
              <th>Hora término</th>
              <th>Intensidad</th>
              <th>Causalidad</th>
              <th>Desenlace</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((ev) => (
              <tr key={ev.id}>
                <td>{ev.fecha_inicio}</td>
                <td>{ev.fecha_termino}</td>
                <td>{ev.hora_inicio}</td>
                <td>{ev.hora_termino}</td>
                <td>{ev.intensidad}</td>
                <td>{ev.causalidad}</td>
                <td>{ev.desenlace}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleEliminar(ev.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
)}


    </div>
  );
};

export default EventosAdversos;
