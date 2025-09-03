import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const categorias = {
  intensidad: { 1: 'Leve', 2: 'Moderada', 3: 'Grave' },
  causalidad: { 1: 'Relacionada', 2: 'No relacionada', 3: 'Probablemente' },
  relacionMedicamento: { 1: 'Alta', 2: 'Media', 3: 'Baja' },
  accionesTomadas: { 1: 'Suspensión', 2: 'Reducción', 3: 'Sin cambios' },
  desenlace: { 1: 'Recuperado', 2: 'Persistente', 3: 'Desconocido' },
};

const EventosAdversosGraph = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({
    evento: {},
    intensidad: {},
    causalidad: {},
    relacionMedicamento: {},
    accionesTomadas: {},
    desenlace: {},
  });

  useEffect(() => {
    axios.get('https://api.weareinfinite.mx/form/eventos_adversos')
      .then(response => {
        const eventos = response.data;

        // Contar las ocurrencias de cada categoría
        let countData = {
          evento: {},
          intensidad: { 1: 0, 2: 0, 3: 0 },
          causalidad: { 1: 0, 2: 0, 3: 0 },
          relacionMedicamento: { 1: 0, 2: 0, 3: 0 },
          accionesTomadas: { 1: 0, 2: 0, 3: 0 },
          desenlace: { 1: 0, 2: 0, 3: 0 }
        };

        eventos.forEach(evento => {
          // Contar eventos
          countData.evento[evento.evento] = (countData.evento[evento.evento] || 0) + 1;

          // Contar otras categorías
          countData.intensidad[evento.intensidad]++;
          countData.causalidad[evento.causalidad]++;
          countData.relacionMedicamento[evento.relacion_medicamento]++;
          countData.accionesTomadas[evento.acciones_tomadas]++;
          countData.desenlace[evento.desenlace]++;
        });

        setChartData(countData);
        setData(eventos);
      })
      .catch(error => console.error(error));
  }, []);

  const createChartData = (category) => {
    if (category === 'evento') {
      const labels = Object.keys(chartData.evento);
      const data = Object.values(chartData.evento);

      return {
        labels,
        datasets: [
          {
            label: 'Eventos',
            data,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }
        ]
      };
    }

    const labels = Object.values(categorias[category]);
    const data = Object.values(chartData[category]);

    return {
      labels,
      datasets: [
        {
          label: category,
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  return (
    <div className="graphs-container">
      <h1 className="title">Gráficas de Eventos Adversos</h1>

      <div className="graph-grid">
        <div className="graph-item">
          <h2>Eventos</h2>
          <div className="chart-wrapper">
            <Bar data={createChartData('evento')} />
          </div>
        </div>

        <div className="graph-item">
          <h2>Intensidad</h2>
          <div className="chart-wrapper">
            <Bar data={createChartData('intensidad')} />
          </div>
        </div>

        <div className="graph-item">
          <h2>Causalidad</h2>
          <div className="chart-wrapper">
            <Bar data={createChartData('causalidad')} />
          </div>
        </div>

        <div className="graph-item">
          <h2>Relación con Medicamento</h2>
          <div className="chart-wrapper">
            <Bar data={createChartData('relacionMedicamento')} />
          </div>
        </div>

        <div className="graph-item">
          <h2>Acciones Tomadas</h2>
          <div className="chart-wrapper">
            <Bar data={createChartData('accionesTomadas')} />
          </div>
        </div>

        <div className="graph-item">
          <h2>Desenlace</h2>
          <div className="chart-wrapper">
            <Bar data={createChartData('desenlace')} />
          </div>
        </div>
      </div>

     

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
          height: 200px; /* ✅ más alto que el default */
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

export default EventosAdversosGraph;
