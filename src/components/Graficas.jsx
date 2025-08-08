import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; // Importa el gráfico de barras
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import * as XLSX from 'xlsx'; // Importa la librería xlsx

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SignosVitalesGraph = () => {
  const [data, setData] = useState({
    presion_sistolica: [],
    presion_diastolica: [],
    temperatura: [],
    frecuencia_cardiaca: [],
    frecuencia_respiratoria: [],
    peso: [],
    talla: [],
    imc: [],
  });

  // Hacer la solicitud a la API para obtener los datos
 useEffect(() => {
  axios.get('https://api.weareinfinite.mx/form/signos/all')
    .then(response => {
      console.log('Datos recibidos:', response.data); // Verifica los datos recibidos
      const parsedData = {
        presion_sistolica: response.data.map(item => item.presion_sistolica),
        presion_diastolica: response.data.map(item => item.presion_diastolica),
        temperatura: response.data.map(item => item.temperatura),
        frecuencia_cardiaca: response.data.map(item => item.frecuencia_cardiaca),
        frecuencia_respiratoria: response.data.map(item => item.frecuencia_respiratoria),
        peso: response.data.map(item => item.peso),
        talla: response.data.map(item => item.talla),
        imc: response.data.map(item => item.imc),
      };
      console.log('Datos parseados:', parsedData); // Verifica los datos parseados
      setData(parsedData);
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error.response || error.message);
    });
}, []);


  // Función para generar los gráficos de barras
  const createChartData = (label, data) => {
    // Verifica si los datos existen y si no están vacíos
    if (!Array.isArray(data) || data.length === 0) {
      return { labels: [], datasets: [] }; // Retorna datos vacíos si no están disponibles
    }

    return {
      labels: Array.from({ length: data.length }, (_, i) => `Muestra ${i + 1}`), // Etiquetas de las barras
      datasets: [{
        label: label,
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color de las barras
        borderColor: 'rgba(75, 192, 192, 1)', // Color de los bordes de las barras
        borderWidth: 1,
      }],
    };
  };

  // Función para exportar los datos a Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { "Label": "Presión Sistólica", ...data.presion_sistolica },
      { "Label": "Presión Diastólica", ...data.presion_diastolica },
      { "Label": "Temperatura", ...data.temperatura },
      { "Label": "Frecuencia Cardíaca", ...data.frecuencia_cardiaca },
      { "Label": "Frecuencia Respiratoria", ...data.frecuencia_respiratoria },
      { "Label": "Peso", ...data.peso },
      { "Label": "Talla", ...data.talla },
      { "Label": "IMC", ...data.imc }
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Signos Vitales');

    // Descargar el archivo Excel
    XLSX.writeFile(wb, 'signos_vitales.xlsx');
  };

  return (
    <div className="graphs-container">
      <h1 className="title">Gráficos de Signos Vitales</h1>
      
      {data ? (
        <div className="graph-grid">
          {/* Presión Sistólica */}
          {data.presion_sistolica.length > 0 && (
            <div className="graph-item">
              <h2>Presión Sistólica</h2>
              <Bar data={createChartData('Presión Sistólica', data.presion_sistolica)} />
            </div>
          )}
          
          {/* Presión Diastólica */}
          {data.presion_diastolica.length > 0 && (
            <div className="graph-item">
              <h2>Presión Diastólica</h2>
              <Bar data={createChartData('Presión Diastólica', data.presion_diastolica)} />
            </div>
          )}
          
          {/* Temperatura */}
          {data.temperatura.length > 0 && (
            <div className="graph-item">
              <h2>Temperatura</h2>
              <Bar data={createChartData('Temperatura', data.temperatura)} />
            </div>
          )}
          
          {/* Frecuencia Cardíaca */}
          {data.frecuencia_cardiaca.length > 0 && (
            <div className="graph-item">
              <h2>Frecuencia Cardíaca</h2>
              <Bar data={createChartData('Frecuencia Cardíaca', data.frecuencia_cardiaca)} />
            </div>
          )}
          
          {/* Frecuencia Respiratoria */}
          {data.frecuencia_respiratoria.length > 0 && (
            <div className="graph-item">
              <h2>Frecuencia Respiratoria</h2>
              <Bar data={createChartData('Frecuencia Respiratoria', data.frecuencia_respiratoria)} />
            </div>
          )}
          
          {/* Peso */}
          {data.peso.length > 0 && (
            <div className="graph-item">
              <h2>Peso</h2>
              <Bar data={createChartData('Peso', data.peso)} />
            </div>
          )}
          
          {/* Talla */}
          {data.talla.length > 0 && (
            <div className="graph-item">
              <h2>Talla</h2>
              <Bar data={createChartData('Talla', data.talla)} />
            </div>
          )}
          
          {/* IMC */}
          {data.imc.length > 0 && (
            <div className="graph-item">
              <h2>IMC</h2>
              <Bar data={createChartData('IMC', data.imc)} />
            </div>
          )}
        </div>
      ) : (
        <p>Cargando datos...</p>
      )}

      {/* Botón para descargar los datos */}
      <div className="download-btn-container">
        <button onClick={exportToExcel} className="download-btn">Descargar Excel</button>
      </div>

      {/* Estilos CSS */}
      <style jsx>{`
        /* Contenedor principal */
        .graphs-container {
          padding: 20px;
          text-align: center;
        }

        /* Título */
        .title {
          font-size: 2rem;
          margin-bottom: 20px;
        }

        /* Estilo del contenedor de las gráficas */
        .graph-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr); /* 3 columnas de igual tamaño */
          gap: 20px;
          margin: 0 auto;
          max-width: 1200px; /* Límite de ancho para evitar que se estiren demasiado */
        }

        /* Estilo de cada gráfica */
        .graph-item {
          background-color: #fff;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        /* Títulos de cada gráfica */
        .graph-item h2 {
          margin-bottom: 15px;
          font-size: 1.2rem;
          color: #333;
        }

        /* Contenedor del botón de descarga */
        .download-btn-container {
          margin-top: 30px;
          text-align: center;
        }

        /* Botón de descarga */
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

        /* Responsividad: en pantallas pequeñas, usar una sola columna */
        @media (max-width: 768px) {
          .graph-grid {
            grid-template-columns: 1fr; /* Una sola columna en pantallas pequeñas */
          }
        }
      `}</style>
    </div>
  );
};

export default SignosVitalesGraph;
