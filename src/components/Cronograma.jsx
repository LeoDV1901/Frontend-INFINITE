import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Lista de procedimientos y visitas
const procedimientos = [
  "Firma de consentimiento Informado",
  "Criterios de Inclusión",
  "Criterios de Exclusión",
  "Historia Clínica",
  "Signos Vitales",
  "Medicamentos Concomitantes",
  "Eventos Adversos",
  "Estudios",
];

const visitas = ["Visita 0", "Visita 1", "Visita 2", "Visita 3"];

const links = {
  "Firma de consentimiento Informado": { "Visita 0": "/ConcentimientoInformado" },
  "Criterios de Inclusión": { "Visita 0": "/CriteriosI" },
  "Criterios de Exclusión": { "Visita 0": "/CriteriosE" },
  "Historia Clínica": { "Visita 0": "/HistoriaClinica" },
  "Signos Vitales": { "Visita 0": "/Signos_Vitales" },
  "Medicamentos Concomitantes": { "Visita 0": "/MedicamentosConcomitantes" },
  "Eventos Adversos": { "Visita 0": "/eventosAdversos" },
  "Estudios": { "Visita 0": "/Archivos" },
};

const TablaProcedimientos = () => {
  const { idPaciente } = useParams();
  const navigate = useNavigate();

  const [botonColors, setBotonColors] = useState({
    FirmaConsentimiento: "green",
    CriteriosInclusion: "green",
    CriteriosExclusion: "green",
    HistoriaClinica: "green",
    SignosVitales: "green",
    MedicamentosConcomitantes: "red",
    EventosAdversos: "red",
    Estudios: "green",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Login");
      return;
    }
    if (!idPaciente) return;

    const fetchConsentimiento = async () => {
      try {
        const res = await fetch(`https://api.weareinfinite.mx/form/verifyconsentimiento/${idPaciente}`);
        const data = await res.json();
        setBotonColors((prev) => ({
          ...prev,
          FirmaConsentimiento: data.respuesta_correcta ? "green" : "red",
        }));
      } catch {
        setBotonColors((prev) => ({ ...prev, FirmaConsentimiento: "red" }));
      }
    };

    const fetchSignos = async () => {
      try {
        const res = await fetch(`https://api.weareinfinite.mx/form/verifysignos_vitales/${idPaciente}`);
        const data = await res.json();
        const isDataOutOfRange = data.some((signo) =>
          Object.keys(signo).some((key) => key.includes("_fuera_de_rango") && signo[key])
        );
        setBotonColors((prev) => ({
          ...prev,
          SignosVitales: isDataOutOfRange ? "red" : "green",
        }));
      } catch {
        setBotonColors((prev) => ({ ...prev, SignosVitales: "red" }));
      }
    };

    const fetchCriteriosInclusion = async () => {
      try {
        const res = await fetch(`https://api.weareinfinite.mx/form/verifycriterios_inclusion/${idPaciente}`);
        const data = await res.json();
        setBotonColors((prev) => ({
          ...prev,
          CriteriosInclusion: data.respuesta_correcta ? "green" : "red",
        }));
      } catch {
        setBotonColors((prev) => ({ ...prev, CriteriosInclusion: "red" }));
      }
    };

    const fetchCriteriosExclusion = async () => {
      try {
        const res = await fetch(`https://api.weareinfinite.mx/form/criterios_exclusionV/${idPaciente}`);
        const data = await res.json();
        setBotonColors((prev) => ({
          ...prev,
          CriteriosExclusion: data.respuesta_correcta ? "green" : "red",
        }));
      } catch {
        setBotonColors((prev) => ({ ...prev, CriteriosExclusion: "red" }));
      }
    };

    const fetchHistoria = async () => {
      try {
        const res = await fetch(`https://api.weareinfinite.mx/form/historia_clinicaVerify/${idPaciente}`);
        const data = await res.json();
        setBotonColors((prev) => ({
          ...prev,
          HistoriaClinica: data.todas_contestadas ? "green" : "red",
        }));
      } catch {
        setBotonColors((prev) => ({ ...prev, HistoriaClinica: "red" }));
      }
    };

    const fetchMedicamentos = async () => {
      try {
        const res = await fetch(`https://api.weareinfinite.mx/form/medicamentos_concomitantesV/${idPaciente}`);
        const data = await res.json();
        setBotonColors((prev) => ({
          ...prev,
          MedicamentosConcomitantes: data.respuestas_completas ? "green" : "red",
        }));
      } catch {
        setBotonColors((prev) => ({ ...prev, MedicamentosConcomitantes: "red" }));
      }
    };

    const fetchEventos = async () => {
      try {
        const res = await fetch(`https://api.weareinfinite.mx/form/eventos_adversosV/${idPaciente}`);
        const data = await res.json();
        setBotonColors((prev) => ({
          ...prev,
          EventosAdversos: data.respuestas_completas ? "green" : "red",
        }));
      } catch {
        setBotonColors((prev) => ({ ...prev, EventosAdversos: "red" }));
      }
    };

    const fetchEstudios = async () => {
      try {
        setBotonColors((prev) => ({ ...prev, Estudios: "transparent" }));
      } catch {
        setBotonColors((prev) => ({ ...prev, Estudios: "red" }));
      }
    };

    // Ejecutar todos
    fetchConsentimiento();
    fetchSignos();
    fetchCriteriosInclusion();
    fetchCriteriosExclusion();
    fetchHistoria();
    fetchMedicamentos();
    fetchEventos();
    fetchEstudios();
  }, [idPaciente, navigate]);

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

                const backgroundColor =
                  proc === "Firma de consentimiento Informado" ? botonColors.FirmaConsentimiento :
                  proc === "Signos Vitales" ? botonColors.SignosVitales :
                  proc === "Criterios de Inclusión" ? botonColors.CriteriosInclusion :
                  proc === "Criterios de Exclusión" ? botonColors.CriteriosExclusion :
                  proc === "Historia Clínica" ? botonColors.HistoriaClinica :
                  proc === "Medicamentos Concomitantes" ? botonColors.MedicamentosConcomitantes :
                  proc === "Eventos Adversos" ? botonColors.EventosAdversos :
                  proc === "Estudios" ? botonColors.Estudios :
                  "initial";

                return (
                  <td key={j} style={{ textAlign: "center" }}>
                    {link !== "#" ? (
                      <button
                        className="boton-celda"
                        style={{
                          backgroundColor,
                          padding: "5px 10px",
                          borderRadius: "4px",
                          cursor: "pointer",
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
                        disabled
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
