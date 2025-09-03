import React, { useState, useEffect } from 'react'; 
import * as XLSX from 'xlsx';

const ConsentimientoForm = () => {
  const [data, setData] = useState([]);

  // Función para obtener los datos de la API
  const fetchData = async () => {
    try {
      const response = await fetch('https://api.weareinfinite.mx/form//consentimiento');
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
      return {
        idPaciente: item.idPaciente,
        '¿El paciente aceptó su participación en el estudio?': item.pregunta1, // Mapeamos correctamente
        comentario1: item.comentario1, // Comentario 1
        'Hora de obtención del consentimiento informado (Formato 24hrs):': item.pregunta2, // Hora del consentimiento
        '¿Tiene el paciente alguna condición preexistente relevante?': item.pregunta3, // Pregunta 3
        comentario2: item.comentario2, // Comentario 2 (si existe)
        '¿El paciente recibió toda la información necesaria?': item.pregunta4, // Pregunta 4
        comentario3: item.comentario3, // Comentario 3
      };
    });

    // Crear una hoja de trabajo (workbook) a partir de los datos mapeados
    const ws = XLSX.utils.json_to_sheet(mappedData);

    // Crear un libro de trabajo (workbook)
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Consentimiento');

    // Descargar el archivo Excel
    XLSX.writeFile(wb, 'consentimiento_datos.xlsx');
  };

  return (
    <div className="container">
      <h2>Formulario de Consentimiento</h2>
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

export default ConsentimientoForm;
