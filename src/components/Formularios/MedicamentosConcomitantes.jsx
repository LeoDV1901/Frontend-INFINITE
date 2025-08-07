import React, { useState, useEffect } from 'react';
import '../css/SignosV.css';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const MedicamentosConcomitantes = () => {
  const { idPaciente } = useParams();
  const [registroExistente, setRegistroExistente] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);

  const [consumioMedicamento, setConsumioMedicamento] = useState(null);
  const [iniciales, setIniciales] = useState('');
  const [numeroAleatorizacion, setNumeroAleatorizacion] = useState('');
  const [nombreGenerico, setNombreGenerico] = useState('');
  const [dosisDiaria, setDosisDiaria] = useState('');
  const [presentacion, setPresentacion] = useState('');
  const [indicacion, setIndicacion] = useState('');  // Cambio aquí de 'indicacionTerapeutica' a 'indicacion'
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaTermino, setFechaTermino] = useState('');
  const [continuaMedicamento, setContinuaMedicamento] = useState(null);

  const BLOQUEO_KEY = `medicamento_bloqueado_${idPaciente}`;

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  useEffect(() => {
    const bloqueoGuardado = localStorage.getItem(BLOQUEO_KEY);
    if (bloqueoGuardado === 'true') setBloqueado(true);

    if (!idPaciente) return;

    // Llamada a la API para obtener los datos del paciente
    const fetchPaciente = async () => {
      try {
        const res = await fetch(`https://api.weareinfinite.mx/paciente/view/${idPaciente}`);
        if (!res.ok) {
          throw new Error('No se pudo obtener los datos del paciente');
        }
        const pacienteData = await res.json();
        setIniciales(pacienteData.iniciales || '');
      } catch (error) {
        console.error('Error cargando datos del paciente:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los datos del paciente.',
        });
      }
    };

    // Llamada a la API para obtener los datos del formulario de medicamentos concomitantes
    fetch(`https://api.weareinfinite.mx/form/medicamentos_concomitantes/${idPaciente}`)
      .then(res => {
        if (res.status === 404) {
          setRegistroExistente(false);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setRegistroExistente(true);
          setNumeroAleatorizacion(data.num_aleatorizacion || '');
          setConsumioMedicamento(data.consumio_medicamento?.toUpperCase() === 'S');
          setNombreGenerico(data.nombre_medicamento || '');
          setDosisDiaria(data.dosis_diaria || '');
          setPresentacion(data.presentacion || '');
          setIndicacion(data.indicacion || '');  // Cambio aquí para establecer el valor de 'indicacion'
          setFechaInicio(formatDateForInput(data.fecha_inicio));
          setFechaTermino(formatDateForInput(data.fecha_termino));
          setContinuaMedicamento(data.continua_consumo?.toUpperCase() === 'S');
        }
      })
      .catch(err => {
        console.error('Error al obtener datos:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los datos.',
        });
      });

    fetchPaciente(); // Llamada para obtener las iniciales del paciente
  }, [idPaciente]);

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
      indicacion,  // Cambio aquí para usar 'indicacion' en lugar de 'indicacionTerapeutica'
      fecha_inicio: fechaInicio,
      fecha_termino: fechaTermino,
      continua_consumo: continuaMedicamento ? 'S' : 'N'
    };

    try {
      const response = await fetch(`https://api.weareinfinite.mx/form/medicamentos_concomitantes${registroExistente ? `/${idPaciente}` : ''}`, {
        method: registroExistente ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.mensaje || 'Error al guardar');

      Swal.fire({
        icon: 'success',
        title: registroExistente ? 'Datos actualizados' : 'Datos guardados',
        text: registroExistente ? 'Los datos se actualizaron correctamente.' : 'Los datos se guardaron exitosamente.',
        timer: 2000,
        showConfirmButton: false,
      });
      setRegistroExistente(true);
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar los datos.',
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
          text: 'Los campos ahora están bloqueados.',
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
      inputAttributes: {
        maxlength: 20,
        autocapitalize: 'off',
        autocorrect: 'off'
      },
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
            text: 'Puedes editar nuevamente los datos.',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Contraseña incorrecta',
            text: 'No se puede desbloquear el formulario.',
          });
        }
      }
    });
  };

  return (
    <div className="container">
      <h2>MEDICAMENTOS CONCOMITANTES</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td><label>Iniciales:</label></td>
              <td><input type="text" value={iniciales} disabled={bloqueado} onChange={(e) => setIniciales(e.target.value)} /></td>
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
                  <td><label>Indicación:</label></td>  {/* Cambié aquí */}
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
          {!bloqueado && <button type="submit">{registroExistente ? 'Actualizar' : 'Guardar'}</button>}
          {!bloqueado && <button type="button" onClick={bloquearCampos}>Bloquear</button>}
          {bloqueado && <button type="button" onClick={desbloquearCampos}>Desbloquear</button>}
        </div>
      </form>
    </div>
  );
};

export default MedicamentosConcomitantes;
