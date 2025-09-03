import React, { useEffect, useState } from 'react';
import { Scatter, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MedicamentosGraph = () => {
  const [data, setData] = useState([]);
  const [graphs, setGraphs] = useState({
    dosis: { label: 'Dosis Diaria', data: [], backgroundColor: 'rgba(75, 192, 192, 1)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 },
    medicamentos: { label: 'Medicamentos', data: [], backgroundColor: 'rgba(153, 102, 255, 1)', borderColor: 'rgba(153, 102, 255, 1)', borderWidth: 1 },
    presentacion: { label: 'Presentación', data: [], backgroundColor: 'rgba(255, 159, 64, 1)', borderColor: 'rgba(255, 159, 64, 1)', borderWidth: 1 },
    continuaConsumo: { label: 'Continúa Consumo', data: [], backgroundColor: 'rgba(255, 99, 132, 1)', borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 1 }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.weareinfinite.mx/form/medicamentos_concomitantes');
        const result = await response.json();
        console.log('Datos de medicamentos:', result);
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const filterNullOrEmpty = (array) =>
    array.filter((item) => item !== null && item !== undefined && Object.keys(item).length !== 0);

  const countOccurrences = (dataArray) => {
    const counts = {};
    dataArray.forEach((item) => {
      if (item !== undefined && item !== null) {
        const key = item;
        counts[key] = counts[key] ? counts[key] + 1 : 1;
      }
    });
    return counts;
  };

  const processGraphData = () => {
    const dosisData = [];
    const medicamentoData = [];
    const presentacionData = [];
    const continuaConsumoData = [];

    data.forEach((medicamento) => {
      if (medicamento.dosis_diaria) dosisData.push(medicamento.dosis_diaria);
      if (medicamento.nombre_medicamento) medicamentoData.push(medicamento.nombre_medicamento);
      if (medicamento.presentacion) presentacionData.push(medicamento.presentacion);
      if (medicamento.continua_consumo) continuaConsumoData.push(medicamento.continua_consumo);
    });

    const dosisCounts = countOccurrences(dosisData);
    const medicamentoCounts = countOccurrences(medicamentoData);
    const presentacionCounts = countOccurrences(presentacionData);
    const continuaConsumoCounts = countOccurrences(continuaConsumoData);

    setGraphs({
      dosis: {
        label: 'Dosis Diaria',
        data: Object.keys(dosisCounts).map((key) => ({ x: key, y: dosisCounts[key] })),
        backgroundColor: 'rgba(75, 192, 192, 1)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      medicamentos: {
        label: 'Medicamentos',
        data: Object.keys(medicamentoCounts).map((key) => ({ x: key, y: medicamentoCounts[key] })),
        backgroundColor: 'rgba(153, 102, 255, 1)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
      presentacion: {
        label: 'Presentación',
        data: Object.keys(presentacionCounts).map((key) => ({ x: key, y: presentacionCounts[key] })),
        backgroundColor: 'rgba(255, 159, 64, 1)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
      continuaConsumo: {
        label: 'Continúa Consumo',
        data: Object.keys(continuaConsumoCounts).map((key) => ({ x: key, y: continuaConsumoCounts[key] })),
        backgroundColor: 'rgba(255, 99, 132, 1)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    });
  };

  useEffect(() => {
    if (data.length > 0) {
      processGraphData();
    }
  }, [data]);

  const generateGraphs = () => {
    return (
      <>
        {/* Gráfico de Dosis */}
        <div style={{ marginBottom: 20, width: 'calc(50% - 10px)', padding: 5, backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3 style={{ color: 'black' }}>Dosis Diaria</h3>
          <Scatter
            data={{
              datasets: [
                {
                  label: 'Dosis Diaria',
                  data: graphs.dosis.data,
                  backgroundColor: 'rgba(75, 192, 192, 1)',
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                x: { type: 'category', labels: graphs.dosis.data.map((item) => item.x) },
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 2,
                    min: 0,
                    max: Math.max(...graphs.dosis.data.map((item) => item.y)) + 2,
                  },
                },
              },
            }}
          />
        </div>

        {/* Gráfico de Medicamentos */}
        <div style={{ marginBottom: 20, width: 'calc(50% - 10px)', padding: 5, backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3 style={{ color: 'black' }}>Medicamentos</h3>
          <Scatter
            data={{
              datasets: [
                {
                  label: 'Medicamentos',
                  data: graphs.medicamentos.data,
                  backgroundColor: 'rgba(153, 102, 255, 1)',
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                x: { type: 'category', labels: graphs.medicamentos.data.map((item) => item.x) },
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 2,
                    min: 0,
                    max: Math.max(...graphs.medicamentos.data.map((item) => item.y)) + 2,
                  },
                },
              },
            }}
          />
        </div>

        {/* Gráfico de Presentación */}
        <div style={{ marginBottom: 20, width: 'calc(50% - 10px)', padding: 5, backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3 style={{ color: 'black' }}>Presentación</h3>
          <Scatter
            data={{
              datasets: [
                {
                  label: 'Presentación',
                  data: graphs.presentacion.data,
                  backgroundColor: 'rgba(255, 159, 64, 1)',
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                x: { type: 'category', labels: graphs.presentacion.data.map((item) => item.x) },
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 2,
                    min: 0,
                    max: Math.max(...graphs.presentacion.data.map((item) => item.y)) + 2,
                  },
                },
              },
            }}
          />
        </div>

        {/* Gráfico de Continúa Consumo (Gráfico de Pastel) */}
        <div style={{ marginBottom: 20, width: 'calc(50% - 10px)', padding: 5, backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3 style={{ color: 'black' }}>Continúa Consumo</h3>
          <Pie
            data={{
              labels: graphs.continuaConsumo.data.map((item) => item.x),
              datasets: [
                {
                  label: 'Continúa Consumo',
                  data: graphs.continuaConsumo.data.map((item) => item.y),
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                },
              ],
            }}
            options={{
              responsive: true,
            }}
          />
        </div>
      </>
    );
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {generateGraphs()}
    </div>
  );
};

export default MedicamentosGraph;
