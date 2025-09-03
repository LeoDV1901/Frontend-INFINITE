import React, { useState, useEffect } from 'react'; 
import * as XLSX from 'xlsx';

const CriteriosInclusionForm = () => {
  const [data, setData] = useState([]);

  // Definimos las preguntas con su respectivo texto
  const preguntas = [
    { id: 'p1', texto: '1. Firma de la carta de Consentimiento Informado ff910d' },
    { id: 'p2', texto: '2. Dolor lumbar con evolución de < 6 semanas' },
    { id: 'p3', texto: '3. Diagnóstico de Lumbalgia Mecánica aguda o subaguda SIN radiculopatía' },
    { id: 'p4', texto: '4. Paciente de cualquier género, mayor de 18 años y menor de 65 años' },
    { id: 'p5', texto: '5. Mujeres en edad fértil con método seguro de anticoncepción y/o prueba rápida de embarazo NEGATIVA' },
    { id: 'p6', texto: '6. Intensidad de dolor entre 6 a 8 en la escala visual análoga en V0' },
    { id: 'p7', texto: '7. Capacidad de llenado de los formatos de recolección de datos' },
    { id: 'p8', texto: '8. Pacientes que al momento del enrolamiento no hayan recibido tratamiento o que hayan recibido tratamientos diferentes a los medicamentos de estudio sin tener respuesta satisfactoria' },
  ];

  // Función para obtener los datos de la API
  const fetchData = async () => {
    try {
      const response = await fetch('https://api.weareinfinite.mx/form/criterios_inclusion');
      const result = await response.json();

      // Filtrar los datos, eliminando el campo `id` y asegurándonos de que `idPaciente` esté incluido
      const filteredData = result.map(({ id, ...rest }) => ({
        idPaciente: rest.idPaciente, // Asegurándonos de incluir 'idPaciente'
        ...rest, // Incluyendo el resto de los campos
      }));

      setData(filteredData); // Guardamos los datos en el estado
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  // Llamar a la API cuando el componente se monta
  useEffect(() => {
    fetchData();
  }, []);

  // Función para crear y descargar el archivo Excel
  const downloadExcel = () => {
    // Mapear los datos con el orden de las columnas deseado
    const mappedData = data.map((item) => {
      const row = { idPaciente: item.idPaciente };

      // Iterar sobre las preguntas y agregar las respuestas y los comentarios intercalados
      preguntas.forEach((pregunta, index) => {
        const preguntaKey = `pregunta${index + 1}`;
        const comentarioKey = `comentario${index + 1}`;

        // Agregar la respuesta de la pregunta y su comentario correspondiente
        row[pregunta.texto] = item[preguntaKey] || ''; // Respuesta de la pregunta
        row[`Comentario ${index + 1}`] = item[comentarioKey] || ''; // Comentario correspondiente
      });

      return row;
    });

    // Eliminar registros duplicados por idPaciente
    const uniqueData = [];
    const seenIds = new Set();

    mappedData.forEach(row => {
      if (!seenIds.has(row.idPaciente)) {
        uniqueData.push(row);
        seenIds.add(row.idPaciente);
      }
    });

    // Crear una hoja de trabajo (workbook) a partir de los datos mapeados
    const ws = XLSX.utils.json_to_sheet(uniqueData);

    // Crear un libro de trabajo (workbook)
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Criterios Inclusión');

    // Descargar el archivo Excel
    XLSX.writeFile(wb, 'criterios_inclusion_datos.xlsx');
  };

  return (
    <div className="container">
      <h2>Formulario de Criterios de Inclusión</h2>
      {/* Mostrar el botón solo si tenemos datos */}
      {data.length > 0 ? (
        <button onClick={downloadExcel}>
          Descargar Datos en Excel
        </button>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
};

export default CriteriosInclusionForm;
