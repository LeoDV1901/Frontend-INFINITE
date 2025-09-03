import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
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

const HistoriaClinicaGraphs = () => {
  const [data, setData] = useState(null);
  const [graphs, setGraphs] = useState({
    diseases: { label: 'Enfermedades', data: [], backgroundColor: 'rgba(255, 99, 132, 1)', borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 1 },
    substances: { label: 'Sustancias', data: [], backgroundColor: 'rgba(75, 192, 192, 1)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 },
    familyDiseases: { label: 'Familiares y Enfermedades', data: [], backgroundColor: 'rgba(153, 102, 255, 1)', borderColor: 'rgba(153, 102, 255, 1)', borderWidth: 1 },
    pathologies: { label: 'Patologías', data: [], backgroundColor: 'rgba(255, 159, 64, 1)', borderColor: 'rgba(255, 159, 64, 1)', borderWidth: 1 }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.weareinfinite.mx/form/historia_clinica/all');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data: ', error);
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

  const countFamilyDiseaseOccurrences = (heredoData) => {
    const counts = {};
    heredoData.forEach((item) => {
      const disease = item.enfermedad;
      const familyMember = item.familiar;
      if (disease && familyMember) {
        const key = `${disease}-${familyMember}`;
        counts[key] = counts[key] ? counts[key] + 1 : 1;
      }
    });
    return counts;
  };

  const processHereditaryData = (heredoData) => {
    const validData = filterNullOrEmpty(heredoData);
    const diseaseData = [];
    const counts = countOccurrences(validData.map((item) => item.enfermedad));

    Object.keys(counts).forEach((disease) => {
      if (disease) {
        diseaseData.push({ x: disease, y: counts[disease] });
      }
    });

    setGraphs((prevGraphs) => ({
      ...prevGraphs,
      diseases: {
        ...prevGraphs.diseases,
        data: diseaseData,
      },
    }));
  };

  const processNonPathologicalData = (noPatData) => {
    const validData = filterNullOrEmpty(noPatData);
    const substanceData = [];
    const counts = countOccurrences(validData.map((item) => item.sustancia));

    Object.keys(counts).forEach((substance) => {
      if (substance) {
        substanceData.push({ x: substance, y: counts[substance] });
      }
    });

    setGraphs((prevGraphs) => ({
      ...prevGraphs,
      substances: {
        ...prevGraphs.substances,
        data: substanceData,
      },
    }));
  };

  const processFamilyDiseaseData = (heredoData) => {
    const validData = filterNullOrEmpty(heredoData);
    const familyDiseaseData = [];
    const counts = countFamilyDiseaseOccurrences(validData);

    Object.keys(counts).forEach((key) => {
      const [disease, familyMember] = key.split('-');
      if (disease && familyMember) {
        familyDiseaseData.push({
          x: `${disease} - ${familyMember}`,
          y: counts[key],
          r: counts[key] * 3,
        });
      }
    });

    setGraphs((prevGraphs) => ({
      ...prevGraphs,
      familyDiseases: {
        ...prevGraphs.familyDiseases,
        data: familyDiseaseData,
      },
    }));
  };

  const processPathologies = (pathologyData) => {
    const validData = filterNullOrEmpty(pathologyData);
    const counts = countOccurrences(validData.map((item) => item.patologia));
    const pathologyGraphData = [];

    Object.keys(counts).forEach((pathology) => {
      if (pathology) {
        pathologyGraphData.push({ x: pathology, y: counts[pathology] });
      }
    });

    setGraphs((prevGraphs) => ({
      ...prevGraphs,
      pathologies: {
        ...prevGraphs.pathologies,
        data: pathologyGraphData,
      },
    }));
  };

  useEffect(() => {
    if (data) {
      const hereditaryData = [];
      const substanceData = [];
      const pathologyData = [];

      data.forEach((patient) => {
        hereditaryData.push(...filterNullOrEmpty(patient.heredo_familiares));
        substanceData.push(...filterNullOrEmpty(patient.no_patologicos));
        pathologyData.push(...filterNullOrEmpty(patient.patologicos));
      });

      processHereditaryData(hereditaryData);
      processNonPathologicalData(substanceData);
      processFamilyDiseaseData(hereditaryData);
      processPathologies(pathologyData);
    }
  }, [data]);

  const generateScatterGraphs = () => {
    return (
      <>
        {/* Gráfico para Enfermedades */}
        <div style={{ marginBottom: 20, width: 'calc(33.33% - 10px)', padding: '10px', boxSizing: 'border-box' }}>
          <h3>Enfermedades</h3>
          <Scatter
            data={{ datasets: [graphs.diseases] }}
            options={{
              scales: {
                x: { type: 'category', labels: graphs.diseases.data.map((item) => item.x) },
                y: { beginAtZero: true, ticks: { stepSize: 2 } },
              },
            }}
          />
        </div>

        {/* Gráfico para Sustancias */}
        <div style={{ marginBottom: 20, width: 'calc(33.33% - 10px)', padding: '10px', boxSizing: 'border-box' }}>
          <h3>Sustancias</h3>
          <Scatter
            data={{ datasets: [graphs.substances] }}
            options={{
              scales: {
                x: { type: 'category', labels: graphs.substances.data.map((item) => item.x) },
                y: { beginAtZero: true, ticks: { stepSize: 2 } },
              },
            }}
          />
        </div>

        {/* Gráfico para Familiares y Enfermedades */}
        <div style={{ marginBottom: 20, width: 'calc(33.33% - 10px)', padding: '10px', boxSizing: 'border-box' }}>
          <h3>Familiares y Enfermedades</h3>
          <Scatter
            data={{ datasets: [graphs.familyDiseases] }}
            options={{
              scales: {
                x: { type: 'category', labels: graphs.familyDiseases.data.map((item) => item.x) },
                y: { beginAtZero: true, ticks: { stepSize: 2 } },
              },
            }}
          />
        </div>

        {/* Gráfico para Patologías */}
        <div style={{ marginBottom: 20, width: 'calc(33.33% - 10px)', padding: '10px', boxSizing: 'border-box' }}>
          <h3>Patologías</h3>
          <Scatter
            data={{ datasets: [graphs.pathologies] }}
            options={{
              scales: {
                x: { type: 'category', labels: graphs.pathologies.data.map((item) => item.x) },
                y: { beginAtZero: true, ticks: { stepSize: 2 } },
              },
            }}
          />
        </div>
      </>
    );
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div
      className="container"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        margin: '0 auto',
        maxWidth: '95%',
        padding: '20px',
        backgroundColor: '#f0f0f0',
        borderRadius: '10px',
      }}
    >
      <h1 style={{ width: '100%', textAlign: 'center' }}>Gráficas de Historia Clínica</h1>
      {generateScatterGraphs()}
    </div>
  );
};

export default HistoriaClinicaGraphs;
