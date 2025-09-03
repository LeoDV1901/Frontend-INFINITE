import React, { useState, useEffect } from 'react'; 
import * as XLSX from 'xlsx';

const CriteriosExclusionForm = () => {
  const [data, setData] = useState([]);

  // Definimos las preguntas con su respectivo texto
  const preguntas = [
    { id: 'p1', texto: '1. Diagnóstico de Lumbalgia Mecánica aguda o subaguda CON radiculopatía' },
    { id: 'p2', texto: '2. Intensidad de dolor igual o mayor a 8 en la escala visual análoga en V0' },
    { id: 'p3', texto: '3. Presencia de síntomas de cauda equina' },
    { id: 'p4', texto: '4. Enfermedad sistémica (cáncer, infecciones graves, VIH-SIDA, fiebre persistente, epilepsia)' },
    { id: 'p5', texto: '5. Patología neurológica sistémica' },
    { id: 'p6', texto: '6. Hernia discal o coxartrosis' },
    { id: 'p7', texto: '7. Historia de trauma de columna lumbar' },
    { id: 'p8', texto: '8. Pérdida de peso inexplicada' },
    { id: 'p9', texto: '9. No estar en tratamiento con AINE' },
    { id: 'p10', texto: '10. Estar bajo tratamiento derivado de la presencia de trastornos psiquiátricos o de personalidad' },
    { id: 'p11', texto: '11. Pacientes con HAS o DM NO CONTROLADA' },
    { id: 'p12', texto: '12. Paciente con antecedente de infarto agudo al miocardio' },
    { id: 'p13', texto: '13. En caso de presentar sobrepeso u obesidad, estar tomando medicamentos para reducción de peso' },
    { id: 'p14', texto: '14. Alteraciones renales o hepáticas' },
    { id: 'p15', texto: '15. Mujeres embarazadas o lactando' },
    { id: 'p16', texto: '16. ERGE, úlcera gástrica o duodenal y/o sangrados de tubo digestivo' },
    { id: 'p17', texto: '17. Alergia conocida a cualquier AINE o sulfonamidas' },
    { id: 'p18', texto: '18. Sacralización' },
    { id: 'p19', texto: '19. Alteraciones reumáticas' },
    { id: 'p20', texto: '20. Pacientes con antecedentes de abuso de alcohol o drogas' },
  ];

  // Función para obtener los datos de la API
  const fetchData = async () => {
    try {
      const response = await fetch('https://api.weareinfinite.mx/form/criterios_exclusion');
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
    XLSX.utils.book_append_sheet(wb, ws, 'Criterios Exclusión');

    // Descargar el archivo Excel
    XLSX.writeFile(wb, 'criterios_exclusion_datos.xlsx');
  };

  return (
    <div className="container">
      <h2>Formulario de Criterios de Exclusión</h2>
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

export default CriteriosExclusionForm;
