import React, { useState, useEffect } from 'react';
import '../css/Historia.css';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';

const HistoriaClinica = () => {
  const { idPaciente } = useParams();
  const navigate = useNavigate();

  const heredoItems = ["", "", "", "", ""];
  const noPatologicosItems = ["", "", "", "", "", ""];
  const padecimientosItems = [
    "Dolor de espalda baja",
    "Dolor sordo",
    "Dolor sin irradiación",
    "Dolor que se irradia al glúteo",
    "Dolor que se irradia a la pierna",
    "Dolor que limita los movimientos",
    "Dolor que limita las actividades diarias/laborales"
  ];
  const patologicosItems = [
    "Diabetes Mellitus",
    "Hipertensión Arterial",
    "Dislipidemias",
    "Sobrepeso",
    "Obesidad",
    "Alérgicos",
    "Quirúrgicos",
    "Otro"
  ];

  const [heredoData, setHeredoData] = useState([]);
  const [noPatologicosData, setNoPatologicosData] = useState([]);
  const [selectedPatologias, setSelectedPatologias] = useState([]);
  const [patologicosData, setPatologicosData] = useState({});
  const [padecimientosData, setPadecimientosData] = useState([]);

  const BLOQUEO_KEY = `historia_bloqueado_${idPaciente}`;
  const [bloqueado, setBloqueado] = useState(false);
  const [registroExistente, setRegistroExistente] = useState(false);

  useEffect(() => {
    const bloqueoGuardado = localStorage.getItem(BLOQUEO_KEY);
    if (bloqueoGuardado === 'true') setBloqueado(true);

    if (!idPaciente) return;

    fetch(`https://api.weareinfinite.mx/form/historia_clinicaV/${idPaciente}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener historia clínica');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const historia = data[0];
          setRegistroExistente(true);

          const heredo = heredoItems.map((item, i) =>
            historia.heredo_familiares?.[i] || {
              no: false, si: false, familiar: '', enfermedad: item,
              fecha_inicio: '', fallecido_si: false, fallecido_no: false
            }
          );
          setHeredoData(heredo);

          const noPat = noPatologicosItems.map((item, i) =>
            historia.no_patologicos?.[i] || {
              no: false, si: false, sustancia: item,
              fecha_inicio: '', continua: false, fecha_fin: '',
              copas_semana: '', cigarrillos_semana: '', consumo_semana: ''
            }
          );
          setNoPatologicosData(noPat);

          const padecimientos = padecimientosItems.map((_, i) =>
            historia.padecimientos?.[i] || {
              si: false, no: false, fecha_inicio: '', continua_si: false
            }
          );
          setPadecimientosData(padecimientos);

          const patologicos = historia.patologicos || [];
          setSelectedPatologias(patologicos.map(p => p.patologia));

          const detalles = {};
          patologicos.forEach(p => {
            detalles[p.patologia] = p.detalles || {
              fecha_inicio: '', continuaSi: false,
              continuaNo: false, resueltoFecha: '', manejoFarmacologico: ''
            };
          });
          setPatologicosData(detalles);

        } else {
          setRegistroExistente(false);
        }
      })
      .catch((error) => {
        console.error("Error cargando datos de historia clínica:", error);
        setRegistroExistente(false);
      });
  }, [idPaciente]);

  // 🔹 Heredo familiares
  const handleHeredoChange = (index, field, value) => {
    const newData = [...heredoData];
    newData[index] = { ...newData[index], [field]: value };
    if (field === "no" && value) newData[index].si = false;
    if (field === "si" && value) newData[index].no = false;
    setHeredoData(newData);
  };

  // 🔹 No patológicos
  const handleNoPatologicosChange = (index, field, value) => {
    const newData = [...noPatologicosData];
    newData[index] = { ...newData[index], [field]: value };
    if (field === "no" && value) newData[index].si = false;
    if (field === "si" && value) newData[index].no = false;
    setNoPatologicosData(newData);
  };

  // 🔹 Patológicos
  const handlePatologiaChange = (e) => {
    const { value, checked } = e.target;
    let newSelected;
    if (checked) {
      newSelected = [...selectedPatologias, value];
      if (!patologicosData[value]) {
        setPatologicosData(prev => ({
          ...prev,
          [value]: {
            fecha_inicio: '',
            continuaSi: false,
            continuaNo: false,
            resueltoFecha: '',
            manejoFarmacologico: ''
          }
        }));
      }
    } else {
      newSelected = selectedPatologias.filter(p => p !== value);
      const newDetalles = { ...patologicosData };
      delete newDetalles[value];
      setPatologicosData(newDetalles);
    }
    setSelectedPatologias(newSelected);
  };

  const handleDetallePatologiaChange = (patologia, field, value) => {
    setPatologicosData(prev => ({
      ...prev,
      [patologia]: { ...prev[patologia], [field]: value }
    }));
  };

  // 🔹 Padecimientos (bloquea fila si se selecciona NO)
  const handlePadecimientoChange = (index, field, value) => {
    const newData = [...padecimientosData];
    newData[index] = { ...newData[index], [field]: value };
    if (field === "no" && value) newData[index].si = false;
    if (field === "si" && value) newData[index].no = false;
    setPadecimientosData(newData);
  };

  // 🔹 Guardar
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      idPaciente,
      heredo_familiares: heredoData,
      no_patologicos: noPatologicosData,
      patologicos: selectedPatologias.map(p => ({
        patologia: p,
        detalles: patologicosData[p] || {}
      })),
      padecimientos: padecimientosData
    };
    try {
      const response = await fetch(`https://api.weareinfinite.mx/form/historia_clinica/${idPaciente}`, {
        method: registroExistente ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Error al guardar los datos');
      Swal.fire({
        icon: 'success',
        title: registroExistente ? 'Datos actualizados correctamente' : 'Datos guardados exitosamente',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        navigate(`/cronograma/${idPaciente}`);
      });
      setRegistroExistente(true);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un problema al guardar los datos',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  // 🔹 Bloqueo
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
      }
    });
  };

  const desbloquearCampos = () => {
    Swal.fire({
      title: 'Desbloquear formulario',
      input: 'password',
      inputLabel: 'Introduce la contraseña',
      showCancelButton: true,
      confirmButtonText: 'Desbloquear'
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value === 'infinite') {
          localStorage.removeItem(BLOQUEO_KEY);
          setBloqueado(false);
        } else {
          Swal.fire({ icon: 'error', title: 'Contraseña incorrecta' });
        }
      }
    });
  };

  return (
    <div className="container">
      {/* 🔹 Heredo familiares */}
      <h3>Antecedentes Heredo Familiares</h3>
      <table border="1" style={{ width: '100%', marginBottom: 20 }}>
        <thead>
          <tr>
            <th>No</th><th>Sí</th><th>Parentesco</th><th>Enfermedad</th>
            <th>Fecha de Inicio</th><th>Fallecido Sí</th><th>Fallecido No</th>
          </tr>
        </thead>
        <tbody>
          {heredoItems.map((item, i) => {
            const fila = heredoData[i] || {};
            const filaBloqueada = fila.no;
            return (
              <tr key={i}>
                <td><input type="checkbox" checked={fila.no || false}
                  onChange={e => handleHeredoChange(i, "no", e.target.checked)}
                  disabled={bloqueado} /></td>
                <td><input type="checkbox" checked={fila.si || false}
                  onChange={e => handleHeredoChange(i, "si", e.target.checked)}
                  disabled={bloqueado} /></td>
                <td><input type="text" value={fila.familiar || ""}
                  onChange={e => handleHeredoChange(i, "familiar", e.target.value)}
                  disabled={bloqueado || filaBloqueada} /></td>
                <td><input type="text" value={fila.enfermedad || ""}
                  onChange={e => handleHeredoChange(i, "enfermedad", e.target.value)}
                  disabled={bloqueado || filaBloqueada} /></td>
                <td><input type="date" value={fila.fecha_inicio || ""}
                  onChange={e => handleHeredoChange(i, "fecha_inicio", e.target.value)}
                  disabled={bloqueado || filaBloqueada} /></td>
                <td><input type="checkbox" checked={fila.fallecido_si || false}
                  onChange={e => handleHeredoChange(i, "fallecido_si", e.target.checked)}
                  disabled={bloqueado || filaBloqueada} /></td>
                <td><input type="checkbox" checked={fila.fallecido_no || false}
                  onChange={e => handleHeredoChange(i, "fallecido_no", e.target.checked)}
                  disabled={bloqueado || filaBloqueada} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* 🔹 No patológicos */}
      <h3>Antecedentes Personales No Patológicos</h3>
      <table border="1" style={{ width: '100%', marginBottom: 20 }}>
        <thead>
          <tr>
            <th>No</th><th>Sí</th><th>Sustancia</th><th>Fecha de Inicio</th>
            <th>Continua</th><th>Fecha de Fin</th><th>Consumo/Semana</th>
          </tr>
        </thead>
        <tbody>
          {noPatologicosItems.map((item, i) => {
            const fila = noPatologicosData[i] || {};
            const filaBloqueada = fila.no;
            return (
              <tr key={i}>
                <td><input type="checkbox" checked={fila.no || false}
                  onChange={e => handleNoPatologicosChange(i, "no", e.target.checked)}
                  disabled={bloqueado} /></td>
                <td><input type="checkbox" checked={fila.si || false}
                  onChange={e => handleNoPatologicosChange(i, "si", e.target.checked)}
                  disabled={bloqueado} /></td>
                <td><input type="text" value={fila.sustancia || ""}
                  onChange={e => handleNoPatologicosChange(i, "sustancia", e.target.value)}
                  disabled={bloqueado || filaBloqueada} /></td>
                <td><input type="date" value={fila.fecha_inicio || ""}
                  onChange={e => handleNoPatologicosChange(i, "fecha_inicio", e.target.value)}
                  disabled={bloqueado || filaBloqueada} /></td>
                <td><input type="checkbox" checked={fila.continua || false}
                  onChange={e => handleNoPatologicosChange(i, "continua", e.target.checked)}
                  disabled={bloqueado || filaBloqueada} /></td>
                <td><input type="date" value={fila.fecha_fin || ""}
                  onChange={e => handleNoPatologicosChange(i, "fecha_fin", e.target.value)}
                  disabled={bloqueado || filaBloqueada} /></td>
                <td><input type="text" value={fila.copas_semana || ""}
                  onChange={e => handleNoPatologicosChange(i, "copas_semana", e.target.value)}
                  disabled={bloqueado || filaBloqueada} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* 🔹 Patológicos */}
   <h3>Antecedentes Personales Patológicos</h3>
<div style={{ marginBottom: 20 }}>
  {patologicosItems.map((pat, i) => (
    <label key={i} style={{ display: 'block' }}>
      <input type="checkbox" value={pat}
        checked={selectedPatologias.includes(pat)}
        onChange={handlePatologiaChange}
        disabled={bloqueado} /> {pat}
    </label>
  ))}
</div>
{selectedPatologias.map((patologia) => {
  const detalles = patologicosData[patologia] || {};
  const bloquearFecha = detalles.continuaSi;
  
  // Determinar si se debe bloquear el calendario de "Fecha Resuelto"
  const bloquearFechaResuelto = detalles.continuaSi;

  return (
    <div key={patologia} style={{ marginBottom: 20 }}>
      <h5>Detalles de: {patologia}</h5>
      <table border="1" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Fecha Inicio</th><th>Continua</th>
            <th>Fecha Resuelto</th><th>Manejo Farmacológico</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input type="date" value={detalles.fecha_inicio || ""}
                onChange={e => handleDetallePatologiaChange(patologia, "fecha_inicio", e.target.value)}
                disabled={bloqueado || bloquearFecha} />
            </td>
            <td>
              <label>
                <input 
                  type="checkbox" 
                  checked={detalles.continuaSi || false}
                  onChange={e => {
                    // Si se selecciona "Sí", desmarcar "No"
                    if (e.target.checked) {
                      handleDetallePatologiaChange(patologia, "continuaSi", true);
                      handleDetallePatologiaChange(patologia, "continuaNo", false);
                    } else {
                      handleDetallePatologiaChange(patologia, "continuaSi", false);
                    }
                  }} 
                  disabled={bloqueado} /> Sí
              </label>
              <label style={{ marginLeft: 10 }}>
                <input 
                  type="checkbox" 
                  checked={detalles.continuaNo || false}
                  onChange={e => {
                    // Si se selecciona "No", desmarcar "Sí"
                    if (e.target.checked) {
                      handleDetallePatologiaChange(patologia, "continuaNo", true);
                      handleDetallePatologiaChange(patologia, "continuaSi", false);
                    } else {
                      handleDetallePatologiaChange(patologia, "continuaNo", false);
                    }
                  }} 
                  disabled={bloqueado} /> No
              </label>
            </td>
            <td>
              <input type="date" value={detalles.resueltoFecha || ""}
                onChange={e => handleDetallePatologiaChange(patologia, "resueltoFecha", e.target.value)}
                disabled={bloqueado || bloquearFechaResuelto} />
            </td>
            <td>
              <input type="text" value={detalles.manejoFarmacologico || ""}
                onChange={e => handleDetallePatologiaChange(patologia, "manejoFarmacologico", e.target.value)}
                placeholder="Medicamento" disabled={bloqueado} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
})}

      <h3>Padecimiento Actual</h3>
      <table border="1" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Padecimiento</th>
            <th>Sí</th>
            <th>No</th>
            <th>Fecha de Inicio</th>
            <th>Continua Sí</th>
          </tr>
        </thead>  
       <tbody>
          {padecimientosItems.map((pad, i) => {
            const fila = padecimientosData[i] || {};
            const filaBloqueada = fila.no; // 🔹 Si selecciona "No" bloquear fila
            return (
              <tr key={i}>
                <td>{pad}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={fila.si || false}
                    onChange={e => handlePadecimientoChange(i, 'si', e.target.checked)}
                    disabled={bloqueado}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={fila.no || false}
                    onChange={e => handlePadecimientoChange(i, 'no', e.target.checked)}
                    disabled={bloqueado}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={fila.fecha_inicio || ''}
                    onChange={e => handlePadecimientoChange(i, 'fecha_inicio', e.target.value)}
                    disabled={bloqueado || filaBloqueada}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={fila.continua_si || false}
                    onChange={e => handlePadecimientoChange(i, 'continua_si', e.target.checked)}
                    disabled={bloqueado || filaBloqueada}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HistoriaClinica;