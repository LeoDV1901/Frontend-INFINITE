import React, { useState, useEffect } from 'react';
import '../css/HistoriaClinica.css';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';

const HistoriaClinica = () => {
  const { idPaciente } = useParams();
  const heredoItems = ["Diabetes Mellitus", "Hipertensión Arterial", "Cardiopatías", "Cáncer", "Otra"];
  const noPatologicosItems = ["ALCOHOL", "TABACO", "MARIHUANA", "COCAÍNA", "HEROINA", "CRISTAL/PIEDRA"];
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
    "Diabetes Mellitus", "Hipertensión Arterial", "Dislipidemias", "Sobrepeso",
    "Obesidad", "Alérgicos", "Quirúrgicos", "Otro"
  ];

  // Estados
  const [heredoData, setHeredoData] = useState([]);
  const [noPatologicosData, setNoPatologicosData] = useState([]);
  const [selectedPatologias, setSelectedPatologias] = useState([]);
  const [patologicosData, setPatologicosData] = useState({});
  const [padecimientosData, setPadecimientosData] = useState([]);

  const [registroExistente, setRegistroExistente] = useState(false);

  useEffect(() => {
  if (!idPaciente) return;

  fetch(`https://api.weareinfinite.mx/form/historia_clinicaV/${idPaciente}`)
    .then(res => {
      if (!res.ok) throw new Error('Error al obtener historia clínica');
      return res.json();
    })
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const historia = data[0]; // tomar la primera historia

        setRegistroExistente(true);

        const heredo = heredoItems.map((_, i) =>
          historia.heredo_familiares?.[i] || {
            no: false, si: false, familiar: '', año_inicio: '', fallecido_si: false, fallecido_no: false
          }
        );
        setHeredoData(heredo);

        const noPat = noPatologicosItems.map((_, i) =>
          historia.no_patologicos?.[i] || {
            no: false, si: false, año_inicio: '', continua: false, año_fin: '',
            copas_semana: '', cigarrillos_semana: '', consumo_semana: ''
          }
        );
        setNoPatologicosData(noPat);

        const padecimientos = padecimientosItems.map((_, i) =>
          historia.padecimientos?.[i] || {
            si: false, no: false, dia_inicio: '', mes_inicio: '', año_inicio: '', continua_si: false
          }
        );
        setPadecimientosData(padecimientos);

        const patologicos = historia.patologicos || [];
        setSelectedPatologias(patologicos.map(p => p.patologia));

        const detalles = {};
        patologicos.forEach(p => {
          detalles[p.patologia] = p.detalles || {
            dia: '', mes: '', año: '',
            continuaSi: false, continuaNo: false,
            resueltoDia: '', resueltoMes: '', resueltoAño: '',
            manejoFarmacologico: ''
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



  // Heredo familiares
  const handleHeredoChange = (index, field, value) => {
    const newData = [...heredoData];
    newData[index] = { ...newData[index], [field]: value };
    setHeredoData(newData);
  };

  // No patologicos
  const handleNoPatologicosChange = (index, field, value) => {
    const newData = [...noPatologicosData];
    newData[index] = { ...newData[index], [field]: value };
    setNoPatologicosData(newData);
  };

  // Patologias (selección)
  const handlePatologiaChange = (e) => {
    const { value, checked } = e.target;
    let newSelected;
    if (checked) {
      newSelected = [...selectedPatologias, value];
      // Si no tiene detalles crear objeto vacío
      if (!patologicosData[value]) {
        setPatologicosData(prev => ({ ...prev, [value]: {
          dia: "",
          mes: "",
          año: "",
          continuaSi: false,
          continuaNo: false,
          resueltoDia: "",
          resueltoMes: "",
          resueltoAño: "",
          manejoFarmacologico: ""
        }}));
      }
    } else {
      newSelected = selectedPatologias.filter(p => p !== value);
      // Quitar detalles también
      const newDetalles = {...patologicosData};
      delete newDetalles[value];
      setPatologicosData(newDetalles);
    }
    setSelectedPatologias(newSelected);
  };

  // Detalles patologias
  const handleDetallePatologiaChange = (patologia, field, value) => {
    setPatologicosData(prev => ({
      ...prev,
      [patologia]: {
        ...prev[patologia],
        [field]: value
      }
    }));
  };

  // Padecimientos actuales
  const handlePadecimientoChange = (index, field, value) => {
    const newData = [...padecimientosData];
    newData[index] = { ...newData[index], [field]: value };
    setPadecimientosData(newData);
  };

  // Enviar datos a API (guardar/actualizar)
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
      });

      setRegistroExistente(true);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un problema al guardar los datos'
      });
    }
  };

return (
  <div className="container">
    <h3>Antecedentes Heredo Familiares</h3>
    <table style={{ width: '100%', marginBottom: 20 }} border="1">
      <thead>
        <tr>
          <th>No</th>
          <th>Sí</th>
          <th>Familiar</th>
          <th>Fecha de Inicio</th>
          <th>Fallecido Sí</th>
          <th>Fallecido No</th>
        </tr>
      </thead>
      <tbody>
        {heredoItems.map((item, i) => (
          <tr key={i}>
            <td>
              <input
                type="checkbox"
                checked={heredoData[i]?.no || false}
                onChange={e => handleHeredoChange(i, "no", e.target.checked)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={heredoData[i]?.si || false}
                onChange={e => handleHeredoChange(i, "si", e.target.checked)}
              />
            </td>
            <td>
              <input
                type="text"
                value={heredoData[i]?.familiar || ""}
                onChange={e => handleHeredoChange(i, "familiar", e.target.value)}
              />
            </td>
            <td>
              <input
                type="date"
                value={heredoData[i]?.fecha_inicio || ""}
                onChange={e => handleHeredoChange(i, "fecha_inicio", e.target.value)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={heredoData[i]?.fallecido_si || false}
                onChange={e => handleHeredoChange(i, "fallecido_si", e.target.checked)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={heredoData[i]?.fallecido_no || false}
                onChange={e => handleHeredoChange(i, "fallecido_no", e.target.checked)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

<h3>Antecedentes Personales No Patológicos</h3>
<table style={{ width: '100%', marginBottom: 20 }} border="1">
  <thead>
    <tr>
      <th>NO</th>
      <th>SÍ</th>
      <th>Fecha de Inicio</th>
      <th>CONTINUA</th>
      <th>Fecha de Fin</th>
      <th>Nº DE COPAS POR SEMANA</th>
      <th>Nº DE CIGARRILLOS POR SEMANA</th>
      <th>CONSUMO POR SEMANA</th>
    </tr>
  </thead>
  <tbody>
    {noPatologicosItems.map((item, i) => (
      <tr key={i}>
        <td>
          <input
            type="checkbox"
            checked={noPatologicosData[i]?.no || false}
            onChange={e => handleNoPatologicosChange(i, "no", e.target.checked)}
          />
        </td>
        <td>
          <input
            type="checkbox"
            checked={noPatologicosData[i]?.si || false}
            onChange={e => handleNoPatologicosChange(i, "si", e.target.checked)}
          />
        </td>
        <td>
          <input
            type="date"
            value={noPatologicosData[i]?.fecha_inicio || ""}
            onChange={e => handleNoPatologicosChange(i, "fecha_inicio", e.target.value)}
            style={{ width: '100%' }} // Asegura que el input se ajuste correctamente al contenedor
          />
        </td>
        <td>
          <input
            type="checkbox"
            checked={noPatologicosData[i]?.continua || false}
            onChange={e => handleNoPatologicosChange(i, "continua", e.target.checked)}
          />
        </td>
        <td>
          <input
            type="date"
            value={noPatologicosData[i]?.fecha_fin || ""}
            onChange={e => handleNoPatologicosChange(i, "fecha_fin", e.target.value)}
            style={{ width: '100%' }} // Asegura que el input se ajuste correctamente al contenedor
          />
        </td>
        <td>
          <input
            type="text"
            value={noPatologicosData[i]?.copas_semana || ""}
            onChange={e => handleNoPatologicosChange(i, "copas_semana", e.target.value)}
          />
        </td>
        <td>
          <input
            type="text"
            value={noPatologicosData[i]?.cigarrillos_semana || ""}
            onChange={e => handleNoPatologicosChange(i, "cigarrillos_semana", e.target.value)}
          />
        </td>
        <td>
          <input
            type="text"
            value={noPatologicosData[i]?.consumo_semana || ""}
            onChange={e => handleNoPatologicosChange(i, "consumo_semana", e.target.value)}
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>

    <h3>Antecedentes Personales Patológicos</h3>
    <h4>Seleccione las patologías:</h4>
    <div style={{ marginBottom: 20 }}>
      {patologicosItems.map((pat, i) => (
        <label key={i} style={{ display: 'block' }}>
          <input
            type="checkbox"
            value={pat}
            checked={selectedPatologias.includes(pat)}
            onChange={handlePatologiaChange}
          />
          {pat}
        </label>
      ))}
    </div>

    {selectedPatologias.map((patologia) => (
      <div key={patologia} style={{ marginBottom: 20 }}>
        <h5>Detalles de: {patologia}</h5>
        <table style={{ width: '100%' }} border="1">
          <thead>
            <tr>
              <th>Fecha de Inicio</th>
              <th>Continua</th>
              <th>Fecha Resuelto</th>
              <th>Manejo Farmacológico</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="date"
                  value={patologicosData[patologia]?.fecha_inicio || ''}
                  onChange={e => handleDetallePatologiaChange(patologia, 'fecha_inicio', e.target.value)}
                />
              </td>
              <td>
                <label>
                  <input
                    type="checkbox"
                    checked={patologicosData[patologia]?.continuaSi || false}
                    onChange={e => handleDetallePatologiaChange(patologia, 'continuaSi', e.target.checked)}
                  /> Sí
                </label>
                <label style={{ marginLeft: 10 }}>
                  <input
                    type="checkbox"
                    checked={patologicosData[patologia]?.continuaNo || false}
                    onChange={e => handleDetallePatologiaChange(patologia, 'continuaNo', e.target.checked)}
                  /> No
                </label>
              </td>
              <td>
                <input
                  type="date"
                  value={patologicosData[patologia]?.resueltoFecha || ''}
                  onChange={e => handleDetallePatologiaChange(patologia, 'resueltoFecha', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={patologicosData[patologia]?.manejoFarmacologico || ''}
                  onChange={e => handleDetallePatologiaChange(patologia, 'manejoFarmacologico', e.target.value)}
                  placeholder="Medicamento"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ))}

   <h3>Padecimiento Actual</h3>
<table style={{ width: '100%', marginBottom: 20 }} border="1">
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
    {padecimientosItems.map((pad, i) => (
      <tr key={i}>
        <td>{pad}</td>
        <td>
          <input
            type="checkbox"
            checked={padecimientosData[i]?.si || false}
            onChange={e => handlePadecimientoChange(i, 'si', e.target.checked)}
          />
        </td>
        <td>
          <input
            type="checkbox"
            checked={padecimientosData[i]?.no || false}
            onChange={e => handlePadecimientoChange(i, 'no', e.target.checked)}
          />
        </td>
        <td>
          <input
            type="date"
            value={padecimientosData[i]?.fecha_inicio || ''}
            onChange={e => handlePadecimientoChange(i, 'fecha_inicio', e.target.value)}
          />
        </td>
        <td>
          <input
            type="checkbox"
            checked={padecimientosData[i]?.continua_si || false}
            onChange={e => handlePadecimientoChange(i, 'continua_si', e.target.checked)}
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>


      <button type="submit" onClick={handleSubmit} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Guardar
      </button>
        <button type="submit" onClick={handleSubmit}>
        {registroExistente ? 'Actualizar Historia Clínica' : 'Guardar Historia Clínica'}
      </button>
    </div>
  );
};

export default HistoriaClinica;
