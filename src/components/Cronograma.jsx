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
  "Estudios",  // Agregado "Estudios"
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
  },
  "Medicamentos Concomitantes": {
    "Visita 0": "/MedicamentosConcomitantes",
  },
  "Eventos Adversos": {
    "Visita 0": "/eventosAdversos",
  },
  "Estudios": {  // Enlace para "Estudios"
    "Visita 0": "/Archivos",  // Ruta a cambiar según tu requerimiento
  },
};

const TablaProcedimientos = () => {
  const { idPaciente } = useParams();
  const navigate = useNavigate();

  const [botonColors, setBotonColors] = useState({
    FirmaConsentimiento: 'green',
    SignosVitales: 'green',
    CriteriosInclusion: 'green', // Inicialmente verde
    HistoriaClinica: 'green',
    MedicamentosConcomitantes: 'red',
    EventosAdversos: 'red',
    Estudios: 'green',  // Inicialmente verde
  });

 useEffect(() => {
  if (!idPaciente) return;

  const fetchConsentimiento = async () => {
    try {
      const res = await fetch(`https://api.weareinfinite.mx/form/verifyconsentimiento/${idPaciente}`);
      const data = await res.json();
      setBotonColors(prev => ({
        ...prev,
        FirmaConsentimiento: data.respuesta_correcta ? 'green' : 'red'
      }));
    } catch (err) {
      console.error("Error en consentimiento:", err);
      setBotonColors(prev => ({ ...prev, FirmaConsentimiento: 'red' }));
    }
  };

  const fetchSignos = async () => {
    try {
      const res = await fetch(`https://api.weareinfinite.mx/form/verifysignos_vitales/${idPaciente}`);
      const data = await res.json();
      const isDataOutOfRange = data.some((signo) =>
        Object.keys(signo).some((key) => key.includes('_fuera_de_rango') && signo[key])
      );
      setBotonColors(prev => ({
        ...prev,
        SignosVitales: isDataOutOfRange ? 'red' : 'green'
      }));
    } catch (err) {
      console.error("Error en signos vitales:", err);
      setBotonColors(prev => ({ ...prev, SignosVitales: 'red' }));
    }
  };

  const fetchCriterios = async () => {
    try {
      const resInclusion = await fetch(`https://api.weareinfinite.mx/form/verifycriterios_inclusion/${idPaciente}`);
      const dataInclusion = await resInclusion.json();

      const resExclusion = await fetch(`https://api.weareinfinite.mx/form/criterios_exclusionV/${idPaciente}`);
      const dataExclusion = await resExclusion.json();

      const correctos = dataInclusion.respuesta_correcta && dataExclusion.respuesta_correcta;
      setBotonColors(prev => ({
        ...prev,
        CriteriosInclusion: correctos ? 'green' : 'red'
      }));
    } catch (err) {
      console.error("Error en criterios:", err);
      setBotonColors(prev => ({ ...prev, CriteriosInclusion: 'red' }));
    }
  };

  const fetchHistoria = async () => {
    try {
      const res = await fetch(`https://api.weareinfinite.mx/form/historia_clinicaVerify/${idPaciente}`);
      const data = await res.json();
      setBotonColors(prev => ({
        ...prev,
        HistoriaClinica: data.todas_contestadas ? 'green' : 'red'
      }));
    } catch (err) {
      console.error("Error en historia clínica:", err);
      setBotonColors(prev => ({ ...prev, HistoriaClinica: 'red' }));
    }
  };

  const fetchMedicamentos = async () => {
    try {
      const res = await fetch(`https://api.weareinfinite.mx/form/medicamentos_concomitantesV/${idPaciente}`);
      const data = await res.json();
      setBotonColors(prev => ({
        ...prev,
        MedicamentosConcomitantes: data.respuestas_completas ? 'green' : 'red'
      }));
    } catch (err) {
      console.error("Error en medicamentos:", err);
      setBotonColors(prev => ({ ...prev, MedicamentosConcomitantes: 'red' }));
    }
  };

  const fetchEventos = async () => {
    try {
      const res = await fetch(`https://api.weareinfinite.mx/form/eventos_adversosV/${idPaciente}`);
      const data = await res.json();
      setBotonColors(prev => ({
        ...prev,
        EventosAdversos: data.respuestas_completas ? 'green' : 'red'
      }));
    } catch (err) {
      console.error("Error en eventos adversos:", err);
      setBotonColors(prev => ({ ...prev, EventosAdversos: 'red' }));
    }
  };

  const fetchEstudios = async () => {
    try {
      // Simulación. Modifica según la lógica real que uses
      setBotonColors(prev => ({ ...prev, Estudios: 'green' }));
    } catch (err) {
      setBotonColors(prev => ({ ...prev, Estudios: 'red' }));
    }
  };

  // Ejecuta todos los fetch en paralelo, no en cadena
  fetchConsentimiento();
  fetchSignos();
  fetchCriterios();
  fetchHistoria();
  fetchMedicamentos();
  fetchEventos();
  fetchEstudios();

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
                const isHistoriaClinica = proc === "Historia Clínica";
                const isMedicamentosConcomitantes = proc === "Medicamentos Concomitantes";
                const isEventosAdversos = proc === "Eventos Adversos";
                const isEstudios = proc === "Estudios";  // Verificar "Estudios"

                const backgroundColor =
                  isFirmaConsentimiento ? botonColors.FirmaConsentimiento :
                  isSignosVitales ? botonColors.SignosVitales :
                  isCriteriosInclusion ? botonColors.CriteriosInclusion :
                  isHistoriaClinica ? botonColors.HistoriaClinica :
                  isMedicamentosConcomitantes ? botonColors.MedicamentosConcomitantes :
                  isEventosAdversos ? botonColors.EventosAdversos :
                  isEstudios ? botonColors.Estudios :  // Colorear "Estudios"
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
