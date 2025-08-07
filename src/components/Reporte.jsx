import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ReportePaciente = () => {
  const { idPaciente } = useParams(); // ← '001', '002', etc., con ceros si aplica

  const [data, setData] = useState({
    signos: [],
    medicamentos: [],
    historiaClinica: {},
    eventosAdversos: [],
    criteriosInclusion: [],
    criteriosExclusion: [],
    consentimiento: {},
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idPaciente) return;

    const fetchAllData = async () => {
      try {
        const base = 'https://api.weareinfinite.mx';

        const urls = [
          `${base}/signos/paciente/${idPaciente}`,
          `${base}/form/medicamentos_concomitantes/${idPaciente}`,
          `${base}/form/historia_clinicaV/${idPaciente}`,
          `${base}/form/eventos_adversos/${idPaciente}`,
          `${base}/form/criterios_inclusion/${idPaciente}`,
          `${base}/form/criterios_exclusion/${idPaciente}`,
          `${base}/form/consentimiento/${idPaciente}`,
        ];

        const [
          signos,
          medicamentos,
          historiaClinica,
          eventosAdversos,
          criteriosInclusion,
          criteriosExclusion,
          consentimiento,
        ] = await Promise.all(
          urls.map(async (url) => {
            const res = await fetch(url);
            return res.ok ? await res.json() : null;
          })
        );

        setData({
          signos: signos || [],
          medicamentos: medicamentos || [],
          historiaClinica: historiaClinica || {},
          eventosAdversos: eventosAdversos || [],
          criteriosInclusion: criteriosInclusion || [],
          criteriosExclusion: criteriosExclusion || [],
          consentimiento: consentimiento || {},
        });

        console.log("Datos recibidos:", {
          signos,
          medicamentos,
          historiaClinica,
          eventosAdversos,
          criteriosInclusion,
          criteriosExclusion,
          consentimiento,
        });

        setLoading(false);
      } catch (err) {
        console.error('Error al obtener datos', err);
        setLoading(false);
      }
    };

    fetchAllData();
  }, [idPaciente]);

  if (!idPaciente) return <h2>ID de paciente inválido</h2>;

  if (loading) {
    return (
      <div className="vista-pacientes">
        <h2>Cargando reporte del paciente #{idPaciente}...</h2>
      </div>
    );
  }

  return (
    <div className="vista-pacientes">
      <h2>Reporte del Paciente #{idPaciente}</h2>

      <SeccionTabla titulo="Historia Clínica" data={data.historiaClinica} />
      <SeccionTabla titulo="Signos Vitales" arreglo={data.signos} />
      <SeccionTabla titulo="Medicamentos Concomitantes" arreglo={data.medicamentos} />
      <SeccionTabla titulo="Eventos Adversos" arreglo={data.eventosAdversos} />
      <SeccionCheckbox titulo="Criterios de Inclusión" criterios={data.criteriosInclusion} />
      <SeccionCheckbox titulo="Criterios de Exclusión" criterios={data.criteriosExclusion} />
      <SeccionTabla titulo="Consentimiento Informado" data={data.consentimiento} />
    </div>
  );
};

// ✅ Tabla para objetos o arreglos
const SeccionTabla = ({ titulo, arreglo = null, data = null }) => {
  const hasValidArray =
    Array.isArray(arreglo) &&
    arreglo.length > 0 &&
    arreglo[0] !== null &&
    typeof arreglo[0] === 'object';

  if (hasValidArray === false && data && Object.keys(data).length === 0) {
    return (
      <div className="tabla-contenedor">
        <h3>{titulo}</h3>
        <p style={{ color: 'white', padding: '10px' }}>No hay información disponible.</p>
      </div>
    );
  }

  return (
    <div className="tabla-contenedor">
      <h3>{titulo}</h3>
      <table className="tabla-pacientes">
        <thead>
          <tr>
            {hasValidArray ? (
              Object.keys(arreglo[0]).map((key, i) => <th key={i}>{key}</th>)
            ) : (
              <th colSpan={2}>Detalle</th>
            )}
          </tr>
        </thead>
        <tbody>
          {hasValidArray ? (
            arreglo.map((item, i) => (
              <tr key={i}>
                {Object.values(item).map((val, j) => (
                  <td key={j}>{String(val)}</td>
                ))}
              </tr>
            ))
          ) : (
            Object.entries(data || {}).map(([key, val], i) => (
              <tr key={i}>
                <th>{key}</th>
                <td>{String(val)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// ✅ Tabla para criterios con checkbox
const SeccionCheckbox = ({ titulo, criterios = [] }) => (
  <div className="tabla-contenedor">
    <h3>{titulo}</h3>
    {criterios.length === 0 ? (
      <p style={{ color: 'white', padding: '10px' }}>No hay criterios registrados.</p>
    ) : (
      <table className="tabla-pacientes">
        <thead>
          <tr>
            <th>Criterio</th>
            <th>Aplica</th>
          </tr>
        </thead>
        <tbody>
          {criterios.map((criterio, i) => (
            <tr key={i}>
              <td>{criterio.descripcion || `Criterio ${i + 1}`}</td>
              <td>
                <input
                  type="checkbox"
                  className="checkbox-white"
                  checked={criterio.aplica}
                  readOnly
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default ReportePaciente;
