import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Lista de procedimientos y visitas
const procedimientos = [
  "Firma de consentimiento Informado",
  "Criterios de Inclusión/ Exclusión",
  "Historia Clínica",
  "Signos Vitales",
  "Medicamentos Concomitantes",
  "Eventos Adversos",
];

const visitas = ["Visita 0", "Visita 1", "Visita 2", "Visita 3"];

const links = {
  "Firma de consentimiento Informado": {
    "Visita 0": "/ConcentimientoInformado",
  },
  "Criterios de Inclusión/ Exclusión": {
    "Visita 0": "/CriteriosE",
  },
  "Historia Clínica": {
    "Visita 0": "/HistoriaClinica",
  },
  "Signos Vitales": {
    "Visita 0": "/Signos_Vitales",
    "Visita 1": "/signos-vitales/v1",
    "Visita 2": "/signos-vitales/v2",
  },
  "Medicamentos Concomitantes": {
    "Visita 0": "/MedicamentosConcomitantes",
  },
  "Eventos Adversos": {
    "Visita 0": "/eventosAdversos",
  },
};

const TablaProcedimientos = () => {
  const { idPaciente } = useParams();
  const navigate = useNavigate();

  const [botonColors, setBotonColors] = useState({
    FirmaConsentimiento: 'green',
    SignosVitales: 'green',
    CriteriosInclusion: 'green',
    MedicamentosConcomitantes: 'red',
    EventosAdversos: 'red',
  });

  useEffect(() => {
    if (!idPaciente) return;

    const fetchData = async () => {
      try {
        const responseConsentimiento = await fetch(`http://127.0.0.1:5000/form/verifyconsentimiento/${idPaciente}`);
        const dataConsentimiento = await responseConsentimiento.json();
        setBotonColors(prev => ({
          ...prev,
          FirmaConsentimiento: dataConsentimiento.respuesta_correcta ? 'green' : 'red'
        }));

        const responseSignos = await fetch(`http://localhost:5000/form/verifysignos_vitales/${idPaciente}`);
        const dataSignos = await responseSignos.json();
        const isDataOutOfRange = dataSignos.some((signo) =>
          Object.keys(signo).some((key) => key.includes('_fuera_de_rango') && signo[key])
        );
        setBotonColors(prev => ({
          ...prev,
          SignosVitales: isDataOutOfRange ? 'red' : 'green'
        }));

        const responseCriterios = await fetch(`http://127.0.0.1:5000/form/verifycriterios_inclusion/${idPaciente}`);
        const dataCriterios = await responseCriterios.json();
        setBotonColors(prev => ({
          ...prev,
          CriteriosInclusion: dataCriterios.respuesta_correcta ? 'green' : 'red'
        }));

        const responseMedicamentos = await fetch(`http://127.0.0.1:5000/form/medicamentos_concomitantesV/${idPaciente}`);
        const dataMedicamentos = await responseMedicamentos.json();
        console.log("Medicamentos:", dataMedicamentos);
        setBotonColors(prev => ({
          ...prev,
          MedicamentosConcomitantes: dataMedicamentos.respuestas_completas ? 'green' : 'red'
        }));

        const responseEventos = await fetch(`http://127.0.0.1:5000/form/eventos_adversosV/${idPaciente}`);
        const dataEventos = await responseEventos.json();
        console.log("Eventos:", dataEventos);
        setBotonColors(prev => ({
          ...prev,
          EventosAdversos: dataEventos.respuestas_completas ? 'green' : 'red'
        }));

      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setBotonColors({
          FirmaConsentimiento: 'red',
          SignosVitales: 'red',
          CriteriosInclusion: 'red',
          MedicamentosConcomitantes: 'red',
          EventosAdversos: 'red',
        });
      }
    };

    fetchData();
  }, [idPaciente]);

  const handleClick = (link) => {
    if (link !== "#") {
      navigate(`${link}/${idPaciente}`);
    } else {
      alert("No hay ruta disponible para esta combinación de procedimiento y visita.");
    }
  };

  return (
    <div className="container" style={{ overflowX: "auto" }}>
      <h2>Tabla de Procedimientos</h2>
      <table>
        <thead>
          <tr>
            <th>Procedimiento</th>
            {visitas.map((v, i) => (
              <th key={i}>{v}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {procedimientos.map((proc, i) => (
            <tr key={i}>
              <td>{proc}</td>
              {visitas.map((visita, j) => {
                const link = links[proc]?.[visita] || "#";

                const isFirmaConsentimiento = proc === "Firma de consentimiento Informado";
                const isSignosVitales = proc === "Signos Vitales";
                const isCriteriosInclusion = proc === "Criterios de Inclusión/ Exclusión";
                const isMedicamentosConcomitantes = proc === "Medicamentos Concomitantes";
                const isEventosAdversos = proc === "Eventos Adversos";

                const backgroundColor =
                  isFirmaConsentimiento ? botonColors.FirmaConsentimiento :
                  isSignosVitales ? botonColors.SignosVitales :
                  isCriteriosInclusion ? botonColors.CriteriosInclusion :
                  isMedicamentosConcomitantes ? botonColors.MedicamentosConcomitantes :
                  isEventosAdversos ? botonColors.EventosAdversos :
                  "initial";

                return (
                  <td key={j} style={{ textAlign: "center" }}>
                    {link !== "#" ? (
                      <button
                        className="boton-celda"
                        style={{
                          backgroundColor,
                          padding: '5px 10px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleClick(link)}
                      >
                        <span role="img" aria-label="Formulario">📝</span>
                      </button>
                    ) : (
                      <button
                        className="boton-celda"
                        style={{
                          backgroundColor: "initial",
                          border: "1px solid #ccc",
                          width: "30px",
                          height: "30px",
                        }}
                        disabled={true}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaProcedimientos;
