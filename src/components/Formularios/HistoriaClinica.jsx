import React, { useState } from 'react';
import '../css/SignosV.css';
import { useParams } from 'react-router-dom';

const HistoriaClinica = () => {
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

  const [heredoData, setHeredoData] = useState(Array(heredoItems.length).fill({ si: false, no: false, fallecidoSi: false, fallecidoNo: false }));
  const [noPatologicosData, setNoPatologicosData] = useState(Array(noPatologicosItems.length).fill({ si: false, no: false }));
  const [padecimientosData, setPadecimientosData] = useState(Array(padecimientosItems.length).fill({ si: false, no: false }));
  const [patologicosData, setPatologicosData] = useState(Array(patologicosItems.length).fill({ continuaSi: false, continuaNo: false }));

  const handleChange = (index, type, setData, data) => {
    setData(data.map((row, i) =>
      i === index
        ? {
            ...row,
            si: type === 'si',
            no: type === 'no'
          }
        : row
    ));
  };

  const handleFallecidoChange = (index, type) => {
    setHeredoData(heredoData.map((row, i) =>
      i === index
        ? {
            ...row,
            fallecidoSi: type === 'si',
            fallecidoNo: type === 'no'
          }
        : row
    ));
  };

  const handlePatologicosContinua = (index, type) => {
    setPatologicosData(patologicosData.map((row, i) =>
      i === index
        ? {
            ...row,
            continuaSi: type === 'si',
            continuaNo: type === 'no'
          }
        : row
    ));
  };

  return (
    <div className="container">
      <h3>Antecedentes Heredo Familiares</h3>
      <table style={{ width: '100%', marginBottom: '20px' }} border="1">
        <thead>
          <tr>
            <th>No</th>
            <th>Sí</th>
            <th>Familiar</th>
            <th>Año de Inicio</th>
            <th>Fallecido Sí</th>
            <th>Fallecido No</th>
          </tr>
        </thead>
        <tbody>
          {heredoItems.map((item, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={heredoData[index].no}
                  onChange={() => handleChange(index, 'no', setHeredoData, heredoData)}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={heredoData[index].si}
                  onChange={() => handleChange(index, 'si', setHeredoData, heredoData)}
                />
              </td>
              <td>
                <input type="text" disabled={!heredoData[index].si} />
              </td>
              <td>
                <input type="text" disabled={!heredoData[index].si} />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={heredoData[index].fallecidoSi}
                  disabled={!heredoData[index].si}
                  onChange={() => handleFallecidoChange(index, 'si')}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={heredoData[index].fallecidoNo}
                  disabled={!heredoData[index].si}
                  onChange={() => handleFallecidoChange(index, 'no')}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Antecedentes Personales No Patológicos</h3>
      <table style={{ width: '100%' }} border="1">
        <thead>
          <tr>
            <th>NO</th>
            <th>SÍ</th>
            <th>AÑO INICIO</th>
            <th>CONTINUA</th>
            <th>AÑO FIN</th>
            <th>Nº DE COPAS POR SEMANA</th>
            <th>Nº DE CIGARRILLOS POR SEMANA</th>
            <th>CONSUMO POR SEMANA</th>
          </tr>
        </thead>
        <tbody>
          {noPatologicosItems.map((item, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={noPatologicosData[index].no}
                  onChange={() => handleChange(index, 'no', setNoPatologicosData, noPatologicosData)}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={noPatologicosData[index].si}
                  onChange={() => handleChange(index, 'si', setNoPatologicosData, noPatologicosData)}
                />
              </td>
              <td><input type="text" disabled={!noPatologicosData[index].si} /></td>
              <td><input type="checkbox" disabled={!noPatologicosData[index].si} /></td>
              <td><input type="text" disabled={!noPatologicosData[index].si} /></td>
              <td><input type="text" disabled={!noPatologicosData[index].si} /></td>
              <td><input type="text" disabled={!noPatologicosData[index].si} /></td>
              <td><input type="text" disabled={!noPatologicosData[index].si} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Antecedentes Personales Patológicos</h3>
      <table style={{ width: '100%', marginBottom: '20px' }} border="1">
        <thead>
          <tr>
            <th>Patología</th>
            <th colSpan="3">Fecha de Inicio</th>
            <th>Continua</th>
            <th>Resuelto</th>
            <th>Manejo Farmacológico</th>
          </tr>
          <tr>
            <th></th>
            <th>Día</th>
            <th>Mes</th>
            <th>Año</th>
            <th>Sí / No</th>
            <th>Día / Mes / Año</th>
            <th>Anotar en hoja</th>
          </tr>
        </thead>
        <tbody>
          {patologicosItems.map((item, index) => (
            <tr key={index}>
              <td>{item}</td>
              <td><input type="text" placeholder="Día" /></td>
              <td><input type="text" placeholder="Mes" /></td>
              <td><input type="text" placeholder="Año" /></td>
              <td>
                <label>
                  <input
                    type="checkbox"
                    checked={patologicosData[index].continuaSi}
                    onChange={() => handlePatologicosContinua(index, 'si')}
                  /> Sí
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={patologicosData[index].continuaNo}
                    onChange={() => handlePatologicosContinua(index, 'no')}
                  /> No
                </label>
              </td>
              <td>
                <input type="text" placeholder="Día" />
                <input type="text" placeholder="Mes" />
                <input type="text" placeholder="Año" />
              </td>
              <td><input type="text" placeholder="Medicamento" /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Padecimiento Actual</h3>
      <table style={{ width: '100%' }} border="1">
        <thead>
          <tr>
            <th>Padecimiento</th>
            <th>Sí</th>
            <th>No</th>
            <th colSpan="3">Fecha de Inicio</th>
            <th>Continua Sí</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th>Día</th>
            <th>Mes</th>
            <th>Año</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {padecimientosItems.map((padecimiento, index) => (
            <tr key={index}>
              <td>{padecimiento}</td>
              <td>
                <input
                  type="checkbox"
                  checked={padecimientosData[index].si}
                  onChange={() => handleChange(index, 'si', setPadecimientosData, padecimientosData)}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={padecimientosData[index].no}
                  onChange={() => handleChange(index, 'no', setPadecimientosData, padecimientosData)}
                />
              </td>
              <td><input type="text" placeholder="Día" disabled={!padecimientosData[index].si} /></td>
              <td><input type="text" placeholder="Mes" disabled={!padecimientosData[index].si} /></td>
              <td><input type="text" placeholder="Año" disabled={!padecimientosData[index].si} /></td>
              <td><input type="checkbox" disabled={!padecimientosData[index].si} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="submit">Guardar</button>
    </div>
  );
};

export default HistoriaClinica;
