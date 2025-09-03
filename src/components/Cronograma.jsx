import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const procedimientos = [
  "Firma de consentimiento Informado",
  "Criterios de Inclusión",
  "Criterios de Exclusión",
  "Criterios de Eliminación", // ✅ Nuevo procedimiento
  "Historia Clínica",
  "Signos Vitales",
  "Medicamentos Concomitantes",
  "Eventos Adversos",
  "Estudios",
];

const visitas = ["Visita 0", "Visita 1", "Visita 2", "Visita 3"];

const links = {
  "Firma de consentimiento Informado": { "Visita 0": "/ConcentimientoInformado" },
  "Criterios de Inclusión": { "Visita 0": "/CriteriosE" },
  "Criterios de Exclusión": { "Visita 0": "/CriteriosI" },
  "Criterios de Eliminación": { "Visita 0": "/CriteriosEliminacion" }, // ✅ Nueva ruta
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
    FirmaConsentimiento: "red",
    CriteriosInclusion: "red",
    CriteriosExclusion: "red",
    CriteriosEliminacion: "red", // ✅ Agregado
    HistoriaClinica: "red",
    SignosVitales: "red",
    MedicamentosConcomitantes: "red",
    EventosAdversos: "red",
    Estudios: "red",
  });

  const determinarColor = (completo, parcial) => {
    if (completo) return "green";
    if (parcial) return "yellow";
    return "red";
  };

  const normalizaSN = (v) => {
    if (v === true) return "SI";
    if (v === false) return "NO";
    if (typeof v === "string") {
      const t = v.trim().toUpperCase();
      if (t === "SI" || t === "SÍ") return "SI";
      if (t === "NO") return "NO";
    }
    return null;
  };

  const extraeRespuestasSN = (data) => {
    const base =
      (Array.isArray(data?.respuestas) && data.respuestas) ||
      (Array.isArray(data?.preguntas) && data.preguntas) ||
      (Array.isArray(data) && data) ||
      [];

    return base
      .map((x) => {
        if (typeof x === "string" || typeof x === "boolean") return normalizaSN(x);
        if (x && typeof x === "object") {
          return normalizaSN(x.respuesta ?? x.valor ?? x.answer ?? x.checked);
        }
        return null;
      })
      .filter((v) => v === "SI" || v === "NO");
  };

  const ningunContestada = (resp) => resp.length === 0;

  const colorInclusion = (respuestas, totalEsperado) => {
    if (ningunContestada(respuestas)) return "red";
    const todasSi = respuestas.every((r) => r === "SI");
    const algunaNo = respuestas.some((r) => r === "NO");
    const incompleto = totalEsperado ? respuestas.length < totalEsperado : false;
    if (todasSi && !incompleto) return "green";
    if (algunaNo || incompleto) return "yellow";
    return "yellow";
  };

  const colorExclusion = (respuestas, totalEsperado) => {
    if (ningunContestada(respuestas)) return "red";
    const todasNo = respuestas.every((r) => r === "NO");
    const algunaSi = respuestas.some((r) => r === "SI");
    const incompleto = totalEsperado ? respuestas.length < totalEsperado : false;
    if (todasNo && !incompleto) return "green";
    if (algunaSi || incompleto) return "yellow";
    return "yellow";
  };

  const colorConsentimiento = (data) => {
    if (typeof data?.respuesta_correcta === "boolean") {
      return data.respuesta_correcta ? "green" : "yellow";
    }
    const respuestas = extraeRespuestasSN(data);
    if (ningunContestada(respuestas)) return "red";
    return "yellow";
  };

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
          FirmaConsentimiento: colorConsentimiento(data),
        }));
      } catch {
        setBotonColors((prev) => ({ ...prev, FirmaConsentimiento: "red" }));
      }
    };

    const fetchCriteriosInclusion = async () => {
      try {
        const res = await fetch(`https://api.weareinfinite.mx/form/verifycriterios_inclusion/${idPaciente}`);
        if (res.status === 400 || res.status === 404) {
          setBotonColors((prev) => ({ ...prev, CriteriosInclusion: "red" }));
          return;
        }
        const data = await res.json();
        if (data.respuesta_correcta === true) {
          setBotonColors((prev) => ({ ...prev, CriteriosInclusion: "green" }));
        } else if (data.respuesta_correcta === false) {
          setBotonColors((prev) => ({ ...prev, CriteriosInclusion: "yellow" }));
        } else {
          setBotonColors((prev) => ({ ...prev, CriteriosInclusion: "red" }));
        }
      } catch {
        setBotonColors((prev) => ({ ...prev, CriteriosInclusion: "red" }));
      }
    };

    const fetchCriteriosExclusion = async () => {
      try {
        const res = await fetch(`https://api.weareinfinite.mx/form/criterios_exclusionV/${idPaciente}`);
        if (res.status === 400 || res.status === 404) {
          setBotonColors((prev) => ({ ...prev, CriteriosExclusion: "red" }));
          return;
        }
        const data = await res.json();
        if (data.respuesta_correcta === true) {
          setBotonColors((prev) => ({ ...prev, CriteriosExclusion: "green" }));
        } else if (data.respuesta_correcta === false) {
          setBotonColors((prev) => ({ ...prev, CriteriosExclusion: "yellow" }));
        } else {
          setBotonColors((prev) => ({ ...prev, CriteriosExclusion: "red" }));
        }
      } catch {
        setBotonColors((prev) => ({ ...prev, CriteriosExclusion: "red" }));
      }
    };

   const fetchCriteriosEliminacion = async () => {
  try {
    const res = await fetch(`https://api.weareinfinite.mx/form/criterios_eliminacion/verificar/${idPaciente}`);
    if (res.status === 400 || res.status === 404) {
      setBotonColors((prev) => ({ ...prev, CriteriosEliminacion: "red" }));
      return;
    }

    const data = await res.json();

    if (data.respuesta_correcta === true) {
      setBotonColors((prev) => ({ ...prev, CriteriosEliminacion: "green" }));
    } else if (data.respuesta_correcta === false) {
      setBotonColors((prev) => ({ ...prev, CriteriosEliminacion: "yellow" }));
    } else {
      setBotonColors((prev) => ({ ...prev, CriteriosEliminacion: "red" }));
    }
  } catch (error) {
    setBotonColors((prev) => ({ ...prev, CriteriosEliminacion: "red" }));
  }
};


    const fetchSignos = async () => {
      try {
        const res = await fetch(`https://api.weareinfinite.mx/form/verifysignos_vitales/${idPaciente}`);
        const data = await res.json();
        const todasContestadas = data.length > 0;
        const algunFueraRango = data.some((signo) =>
          Object.keys(signo).some((key) => key.includes("_fuera_de_rango") && signo[key])
        );
        setBotonColors((prev) => ({
          ...prev,
          SignosVitales: determinarColor(todasContestadas && !algunFueraRango, todasContestadas || algunFueraRango),
        }));
      } catch {
        setBotonColors((prev) => ({ ...prev, SignosVitales: "red" }));
      }
    };

    const fetchHistoria = async () => {
      try {
        const res = await fetch(`https://api.weareinfinite.mx/form/historia_clinicaVerify/${idPaciente}`);
        const data = await res.json();
        setBotonColors((prev) => ({
          ...prev,
          HistoriaClinica: determinarColor(data.todas_contestadas, !data.todas_contestadas && data.algunas),
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
          MedicamentosConcomitantes: determinarColor(data.respuestas_completas, data.algunas),
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
          EventosAdversos: determinarColor(data.respuestas_completas, data.algunas),
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

    // 🔹 Ejecutar todos los fetch
    fetchConsentimiento();
    fetchCriteriosInclusion();
    fetchCriteriosExclusion();
    fetchCriteriosEliminacion(); // ✅
    fetchSignos();
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
                  proc === "Criterios de Eliminación" ? botonColors.CriteriosEliminacion : // ✅
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
