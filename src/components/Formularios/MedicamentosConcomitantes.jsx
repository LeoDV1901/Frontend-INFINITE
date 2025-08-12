import React, { useState, useEffect } from 'react';
import './Medicamento.css';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const MedicamentosConcomitantes = () => {
  const { idPaciente } = useParams();
  const navigate = useNavigate();
  const [bloqueado, setBloqueado] = useState(false);
  const [medicamentos, setMedicamentos] = useState([]); // lista de medicamentos existentes

  const [consumioMedicamento, setConsumioMedicamento] = useState(null);
  const [iniciales, setIniciales] = useState('');
  const [numeroAleatorizacion, setNumeroAleatorizacion] = useState('');
  const [nombreGenerico, setNombreGenerico] = useState('');
  const [dosisDiaria, setDosisDiaria] = useState('');
  const [presentacion, setPresentacion] = useState('');
  const [indicacion, setIndicacion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaTermino, setFechaTermino] = useState('');
  const [continuaMedicamento, setContinuaMedicamento] = useState(null);

  const BLOQUEO_KEY = `medicamento_bloqueado_${idPaciente}`;

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const bloqueoGuardado = localStorage.getItem(BLOQUEO_KEY);
    if (bloqueoGuardado === 'true') setBloqueado(true);

    if (!idPaciente) return;

    const fetchPaciente = async () => {
      try {
        const res = await fetch(`https://api.weareinfinite.mx/paciente/view/${idPaciente}`);
        const pacienteData = await res.json();
        setIniciales(pacienteData.iniciales || '');
      } catch (error) {
        console.error('Error paciente:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los datos del paciente.',
        }).then(() => navigate(`/cronograma/${idPaciente}`));
      }
    };

    const fetchMedicamentos = async () => {
      try {
        const res = await fetch(`https://api.weareinfinite.mx/form/medicamentos_concomitantes/${idPaciente}`);
        if (res.ok) {
          const data = await res.json();
          // Si el backend devuelve un array, úsalo directamente
          setMedicamentos(Array.isArray(data) ? data : [data]);
        }
      } catch (error) {
        console.error('Error medicamentos:', error);
      }
    };

    fetchPaciente();
    fetchMedicamentos();
  }, [idPaciente, navigate]);

  const resetFormulario = () => {
    setConsumioMedicamento(null);
    setNombreGenerico('');
    setDosisDiaria('');
    setPresentacion('');
    setIndicacion('');
    setFechaInicio('');
    setFechaTermino('');
    setContinuaMedicamento(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      idPaciente,
      iniciales,
      num_aleatorizacion: numeroAleatorizacion,
      consumio_medicamento: consumioMedicamento ? 'S' : 'N',
      nombre_medicamento: nombreGenerico,
      dosis_diaria: dosisDiaria,
      presentacion,
      indicacion,
      fecha_inicio: fechaInicio,
      fecha_termino: fechaTermino,
      continua_consumo: continuaMedicamento ? 'S' : 'N'
    };

    try {
      const response = await fetch(`https://api.weareinfinite.mx/form/medicamentos_concomitantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.mensaje || 'Error al guardar');
      }

      Swal.fire({
        icon: 'success',
        title: 'Medicamento guardado',
        timer: 2000,
        showConfirmButton: false,
      });

      resetFormulario();
      // Recargar lista de medicamentos
      const newList = await (await fetch(`https://api.weareinfinite.mx/form/medicamentos_concomitantes/${idPaciente}`)).json();
      setMedicamentos(Array.isArray(newList) ? newList : [newList]);

    } catch (error) {
      console.error('Error al guardar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar el medicamento.',
      });
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
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem(BLOQUEO_KEY, 'true');
        setBloqueado(true);
        Swal.fire({
          icon: 'info',
          title: 'Bloqueado',
          text: 'Los campos están bloqueados.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const desbloquearCampos = () => {
    Swal.fire({
      title: 'Desbloquear formulario',
      input: 'password',
      inputLabel: 'Introduce la contraseña',
      inputPlaceholder: 'Contraseña',
      showCancelButton: true,
      confirmButtonText: 'Desbloquear'
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value === 'infinite') {
          localStorage.removeItem(BLOQUEO_KEY);
          setBloqueado(false);
          Swal.fire({
            icon: 'success',
            title: 'Desbloqueado',
            text: 'Puedes editar nuevamente.',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Contraseña incorrecta',
          });
        }
      }
    });
  };

  const eliminarMedicamento = async (id) => {
  const confirmar = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Este medicamento será eliminado permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (confirmar.isConfirmed) {
    try {
      const response = await fetch(`https://api.weareinfinite.mx/form/medicamentos_concomitantes/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el medicamento');
      }

      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El medicamento fue eliminado correctamente.',
        timer: 2000,
        showConfirmButton: false
      });

      // Recargar lista de medicamentos
      const newList = await (await fetch(`https://api.weareinfinite.mx/form/medicamentos_concomitantes/${idPaciente}`)).json();
      setMedicamentos(Array.isArray(newList) ? newList : [newList]);

    } catch (error) {
      console.error('Error al eliminar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el medicamento.',
      });
    }
  }
};

  return (
    <div className="container">
      <h2>MEDICAMENTOS CONCOMITANTES</h2>

      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td><label>Iniciales:</label></td>
              <td><input type="text" value={iniciales} disabled={true} /></td>
            </tr>
            <tr>
              <td><label>No. De Aleatorización:</label></td>
              <td><input type="text" value={numeroAleatorizacion} disabled={bloqueado} onChange={(e) => setNumeroAleatorizacion(e.target.value)} /></td>
            </tr>
            <tr>
              <td colSpan={2}>
                <label>¿El paciente consumió algún medicamento concomitante?</label><br />
                <label>
                  <input type="radio" name="consumio" disabled={bloqueado} checked={consumioMedicamento === true} onChange={() => setConsumioMedicamento(true)} /> Sí
                </label>
                <label>
                  <input type="radio" name="consumio" disabled={bloqueado} checked={consumioMedicamento === false} onChange={() => setConsumioMedicamento(false)} /> No
                </label>
              </td>
            </tr>

            {consumioMedicamento && (
              <>
                <tr>
                  <td><label>Nombre genérico del medicamento:</label></td>
                  <td><input type="text" value={nombreGenerico} disabled={bloqueado} onChange={(e) => setNombreGenerico(e.target.value)} /></td>
                </tr>
                <tr>
                  <td><label>Dosis diaria:</label></td>
                  <td><input type="text" value={dosisDiaria} disabled={bloqueado} onChange={(e) => setDosisDiaria(e.target.value)} /></td>
                </tr>
                <tr>
                  <td><label>Presentación:</label></td>
                  <td><input type="text" value={presentacion} disabled={bloqueado} onChange={(e) => setPresentacion(e.target.value)} /></td>
                </tr>
               
                <tr>
                  <td><label>Indicación:</label></td>
                  <td><input type="text" value={indicacion} disabled={bloqueado} onChange={(e) => setIndicacion(e.target.value)} /></td>
                </tr>
                <tr>
                  <td><label>Fecha de inicio:</label></td>
                  <td><input type="date" value={fechaInicio} disabled={bloqueado} onChange={(e) => setFechaInicio(e.target.value)} /></td>
                </tr>
                <tr>
                  <td><label>Fecha de término:</label></td>
                  <td><input type="date" value={fechaTermino} disabled={bloqueado} onChange={(e) => setFechaTermino(e.target.value)} /></td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <label>¿Continúa consumiendo el medicamento?</label><br />
                    <label>
                      <input type="radio" name="continua" disabled={bloqueado} checked={continuaMedicamento === true} onChange={() => setContinuaMedicamento(true)} /> Sí
                    </label>
                    <label>
                      <input type="radio" name="continua" disabled={bloqueado} checked={continuaMedicamento === false} onChange={() => setContinuaMedicamento(false)} /> No
                    </label>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>

        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
          {!bloqueado && <button type="submit">Agregar Medicamento</button>}
          {!bloqueado && <button type="button" onClick={bloquearCampos}>Bloquear</button>}
          {bloqueado && <button type="button" onClick={desbloquearCampos}>Desbloquear</button>}
          <button type="button" onClick={() => navigate(`/cronograma/${idPaciente}`)}>Regresar</button>
        </div>
      </form>

      {/* Tabla de medicamentos ya registrados */}
{medicamentos.length > 0 && (
  <form style={{ marginTop: '2rem' }}>
    <h3>Medicamentos registrados:</h3>
    <div className="tabla-container">
      <table className="eventos-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dosis</th>
            <th>Presentación</th>
            <th>Indicación</th>
            <th>Inicio</th>
            <th>Término</th>
            <th>¿Continúa?</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {medicamentos.map((med) => (
            <tr key={med.id}>
              <td>{med.nombre_medicamento}</td>
              <td>{med.dosis_diaria}</td>
              <td>{med.presentacion}</td>
              <td>{med.indicacion}</td>
              <td>{formatDateForInput(med.fecha_inicio)}</td>
              <td>{formatDateForInput(med.fecha_termino)}</td>
              <td>{med.continua_consumo === 'S' ? 'Sí' : 'No'}</td>
              <td>
                <button
                  type="button"
                  onClick={() => eliminarMedicamento(med.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </form>
)}
      
    </div>
  );  
};

export default MedicamentosConcomitantes;
