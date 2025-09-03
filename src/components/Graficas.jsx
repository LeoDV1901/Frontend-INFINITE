import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import * as XLSX from 'xlsx';

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const SignosVitalesGraph = () => {
  const [data, setData] = useState([]);

  // Hacer la solicitud a la API para obtener los datos
  useEffect(() => {
    axios.get('https://api.weareinfinite.mx/form/signos/all')
      .then(response => {
        console.log('Datos recibidos:', response.data);
        setData(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error.response || error.message);
      });
  }, []);

  // Mapeo de parámetros, etiquetas y unidades
  const parametros = [
    { key: 'presion_sistolica', label: 'Presión Sistólica (mmHg)', step: 10 },
    { key: 'presion_diastolica', label: 'Presión Diastólica (mmHg)', step: 10 },
    { key: 'temperatura', label: 'Temperatura (°C)', step: 0.5 },
    { key: 'frecuencia_cardiaca', label: 'Frecuencia Cardíaca (bpm)', step: 5 },
    { key: 'frecuencia_respiratoria', label: 'Frecuencia Respiratoria (rpm)', step: 2 },
    { key: 'peso', label: 'Peso (kg)', step: 5 },
    { key: 'talla', label: 'Talla (cm)', step: 5 },
    { key: 'imc', label: 'IMC', step: 50 },
  ];

  // Generar dataset por parámetro
  const createChartData = (param) => {
    const datasets = [
      {
        label: param.label,
        data: data.map((item) => ({
          x: `Paciente ${item.idPaciente}`,
          y: item[param.key],
        })),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        pointRadius: 6,
      }
    ];
    return { datasets };
  };

  // Exportar Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Signos Vitales');
    XLSX.writeFile(wb, 'signos_vitales.xlsx');
  };

  return (
    <div className="graphs-container">
      <h1 className="title">Gráficos de Signos Vitales</h1>

      {data.length > 0 ? (
        <div className="graph-grid">
          {parametros.map((param, idx) => (
            <div className="graph-item" key={idx}>
              <h2>{param.label}</h2>
              <div className="chart-wrapper">
                <Scatter 
                  data={createChartData(param)}
                  options={{
                    maintainAspectRatio: false, // ✅ para poder estirar hacia abajo
                    scales: {
                      x: {
                        type: 'category',
                        title: { display: true, text: 'Pacientes' },
                        labels: data.map(item => `Paciente ${item.idPaciente}`),
                      },
                      y: {
                        title: { display: true, text: param.label },
                        ticks: { stepSize: param.step },
                      },
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => `${param.label}: ${context.raw.y}`,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Cargando datos...</p>
      )}

      {/* Estilos CSS */}
      <style jsx>{`
        /* Contenedor principal */
        .graphs-container {
          padding: 20px;
          text-align: center;
        }

        .title {
          font-size: 2rem;
          margin-bottom: 20px;
        }

        .graph-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin: 0 auto;
          max-width: 1200px;
        }

        .graph-item {
          background-color: #fff;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .graph-item h2 {
          margin-bottom: 15px;
          font-size: 1.2rem;
          color: #333;
        }

        /* Hacemos las gráficas más largas hacia abajo */
        .chart-wrapper {
          height: 300px; /* ✅ más alto que el default */
        }

        .download-btn-container {
          margin-top: 30px;
          text-align: center;
        }

        .download-btn {
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
        }

        .download-btn:hover {
          background-color: #45a049;
        }

        @media (max-width: 768px) {
          .graph-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default SignosVitalesGraph;
