import React from "react";
import { useNavigate } from 'react-router-dom';  
import { useParams } from 'react-router-dom';

const procedimientos = [
  "Firma de consentimiento Informado",
  "Criterios de Inclusión/ Exclusión",
  "Historia Clínica",
  "Signos Vitales",
  "Glicemia capilar",
  "Medicamentos Concomitantes",
  "Eventos Adversos",
  
];

const visitas = ["Visita 0", "Visita 1", "Visita 2", "Visita 3"];

const datos = [
  [1, 0, 0, 0],
  [1, 0, 0, 0],
  [1, 0, 0, 0],
  [1, 1, 1, 0],
  [1, 0, 0, 0],
  [1, 0, 0, 0],
  [1, 1, 1, 0],
  
];

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
};


const TablaProcedimientos = () => {
  const { idPaciente } = useParams();  // 👈 obtén el idPaciente de la URL
  const navigate = useNavigate();

  const handleClick = (link) => {
    if (link !== "#") {
      navigate(`${link}/${idPaciente}`);  // 👈 redirige pasando el idPaciente
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
              <th key={i}>
                {v}
                <br />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {procedimientos.map((proc, i) => (
            <tr key={i}>
              <td>{proc}</td>
              {visitas.map((visita, j) => {
                const isActive = datos[i][j];
                const link = links[proc]?.[visita] || "#";  // Usamos el enlace o "#"

                return (
                  <td key={j} style={{ textAlign: "center" }}>
                    <button
                      className={`boton-celda ${isActive ? "" : "inactivo"}`}
                      disabled={!isActive || link === "#"}
                      onClick={() => handleClick(link)} // Llamamos a la función de clic
                    >
                      {isActive ? "X" : ""}
                    </button>
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
