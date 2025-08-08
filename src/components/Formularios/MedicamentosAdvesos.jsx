import React, { useEffect, useState } from 'react';
import '../css/SignosV.css';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const EventosAdversos = () => {
  const { idPaciente } = useParams();
  const navigate = useNavigate();
  const BLOQUEO_KEY = `ea_bloqueado_${idPaciente}`;
  const [bloqueado, setBloqueado] = useState(false);
  const [registroExistente, setRegistroExistente] = useState(false);
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

  useEffect(() => {
    if (localStorage.getItem(BLOQUEO_KEY) === 'true') setBloqueado(true);
    if (!idPaciente) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.weareinfinite.mx/form/eventos_adversos/${idPaciente}`);
        if (res.status === 404) return setRegistroExistente(false);
        const data = await res.json();
        ['intensidad','causalidad','relacion_medicamento','acciones_tomadas','desenlace'].forEach(c => {
          data[c] = data[c] ? data[c].toString() : '';
        });
        data.presento_ea = data.presento_ea === '1' || data.presento_ea === 1;
        data.fecha_inicio = formatDateForInput(data.fecha_inicio);
        data.fecha_termino = formatDateForInput(data.fecha_termino);
        setFormData(prev => ({ ...prev, ...data }));
        setRegistroExistente(true);
      } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar el evento adverso' })
          .then(() => navigate(`/cronograma/${idPaciente}`));
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
    fetchData();
  }, [idPaciente, navigate]);

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
      const res = await fetch(`https://api.weareinfinite.mx/form/eventos_adversos${registroExistente ? `/${idPaciente}` : ''}`, {
        method: registroExistente ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.mensaje || 'Error al guardar');
      Swal.fire({ icon: 'success', title: registroExistente ? 'Evento actualizado' : 'Evento guardado', timer: 2000, showConfirmButton: false })
        .then(() => navigate(`/cronograma/${idPaciente}`));
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Ocurrió un error al guardar el evento adverso' })
        .then(() => navigate(`/cronograma/${idPaciente}`));
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
        Swal.fire({ icon: 'info', title: 'Bloqueado', text: 'Los campos ahora están bloqueados.', timer: 2000, showConfirmButton: false });
      }
    });
  };

  const desbloquearCampos = () => {
    Swal.fire({
      title: 'Desbloquear formulario',
      input: 'password',
      inputLabel: 'Introduce la contraseña',
      inputPlaceholder: 'Contraseña',
      inputAttributes: { maxlength: 20, autocapitalize: 'off', autocorrect: 'off' },
      showCancelButton: true,
      confirmButtonText: 'Desbloquear'
    }).then((r) => {
      if (r.isConfirmed) {
        if (r.value === 'infinite') {
          localStorage.removeItem(BLOQUEO_KEY);
          setBloqueado(false);
          Swal.fire({ icon: 'success', title: 'Desbloqueado', text: 'Puedes editar nuevamente los datos.', timer: 2000, showConfirmButton: false });
        } else {
          Swal.fire({ icon: 'error', title: 'Contraseña incorrecta', text: 'No se puede desbloquear el formulario.' });
        }
      }
    });
  };

  return (
    <div className="container">
      <h2>EVENTOS ADVERSOS</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            {/* Inputs como antes, ahora deshabilitados según `bloqueado` */}
            <tr>
              <td><label>Iniciales:</label></td>
              <td><input type="text" name="iniciales" value={formData.iniciales} disabled={bloqueado} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><label>No. De Aleatorización:</label></td>
              <td><input type="text" name="num_aleatorizacion" value={formData.num_aleatorizacion} disabled={bloqueado} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td colSpan={2}>
                <label>¿El paciente presentó algún Evento Adverso durante la visita?</label><br />
                <label>
                  <input type="radio" name="ea" value="si" disabled={bloqueado} checked={formData.presento_ea === true} onChange={() => handlePresentoEAChange(true)} /> Sí
                </label>
                <label>
                  <input type="radio" name="ea" value="no" disabled={bloqueado} checked={formData.presento_ea === false} onChange={() => handlePresentoEAChange(false)} /> No
                </label>
              </td>
            </tr>
            {formData.presento_ea && (
              <>
                <tr>
  <td><label>Fecha de inicio:</label></td>
  <td><input type="date" name="fecha_inicio" value={formData.fecha_inicio} disabled={bloqueado} onChange={handleInputChange} /></td>
</tr>
<tr>
  <td><label>Fecha de término:</label></td>
  <td><input type="date" name="fecha_termino" value={formData.fecha_termino} disabled={bloqueado} onChange={handleInputChange} /></td>
</tr>
<tr>
  <td><label>Hora de inicio:</label></td>
  <td><input type="time" name="hora_inicio" value={formData.hora_inicio} disabled={bloqueado} onChange={handleInputChange} /></td>
</tr>
<tr>
  <td><label>Hora de término:</label></td>
  <td><input type="time" name="hora_termino" value={formData.hora_termino} disabled={bloqueado} onChange={handleInputChange} /></td>
</tr>
<tr>
  <td><label>Intensidad:</label></td>
  <td>
    <select name="intensidad" value={formData.intensidad} disabled={bloqueado} onChange={handleInputChange}>
      <option value="">Seleccione</option>
      <option value="1">Leve</option>
      <option value="2">Moderada</option>
      <option value="3">Grave</option>
    </select>
  </td>
</tr>
<tr>
  <td><label>Causalidad:</label></td>
  <td>
    <select name="causalidad" value={formData.causalidad} disabled={bloqueado} onChange={handleInputChange}>
      <option value="">Seleccione</option>
      <option value="1">Relacionada</option>
      <option value="2">No relacionada</option>
      <option value="3">Probablemente relacionada</option>
    </select>
  </td>
</tr>
<tr>
  <td><label>Relación con el medicamento de estudio:</label></td>
  <td>
    <select name="relacion_medicamento" value={formData.relacion_medicamento} disabled={bloqueado} onChange={handleInputChange}>
      <option value="">Seleccione</option>
      <option value="1">Alta</option>
      <option value="2">Media</option>
      <option value="3">Baja</option>
    </select>
  </td>
</tr>
<tr>
  <td><label>Acciones tomadas:</label></td>
  <td>
    <select name="acciones_tomadas" value={formData.acciones_tomadas} disabled={bloqueado} onChange={handleInputChange}>
      <option value="">Seleccione</option>
      <option value="1">Suspensión</option>
      <option value="2">Reducción de dosis</option>
      <option value="3">Sin cambios</option>
    </select>
  </td>
</tr>
<tr>
  <td><label>Desenlace:</label></td>
  <td>
    <select name="desenlace" value={formData.desenlace} disabled={bloqueado} onChange={handleInputChange}>
      <option value="">Seleccione</option>
      <option value="1">Recuperado</option>
      <option value="2">Persistente</option>
      <option value="3">Desconocido</option>
    </select>
  </td>
</tr>

                <tr>
                  <td><label>Nota de evolución:</label></td>
                  <td><textarea name="nota_evolucion" rows="5" value={formData.nota_evolucion} disabled={bloqueado} onChange={handleInputChange} /></td>
                </tr>
              </>
            )}
          </tbody>
        </table>
        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
          {!bloqueado && <button type="submit">{registroExistente ? 'Actualizar' : 'Guardar'}</button>}
          {!bloqueado && <button type="button" onClick={bloquearCampos}>Bloquear</button>}
          {bloqueado && <button type="button" onClick={desbloquearCampos}>Desbloquear</button>}
        </div>
      </form>
    </div>
  );
};

export default EventosAdversos;
