import React, { useState, useEffect } from 'react'; 
import * as XLSX from 'xlsx';

const HistoriaClinicaForm = () => {
  const [data, setData] = useState([]);

  // Función para obtener los datos de la API
  const fetchData = async () => {
    try {
      const response = await fetch('https://api.weareinfinite.mx/historia_clinica/all');
      const result = await response.json();
      setData(result); // Guardamos los datos en el estado tal como están
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
    // Crear una hoja de trabajo (workbook) a partir de los datos tal cual están
    const ws = XLSX.utils.json_to_sheet(data);

    // Crear un libro de trabajo (workbook)
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Historia Clinica');

    // Descargar el archivo Excel
    XLSX.writeFile(wb, 'historia_clinica_datos.xlsx');
  };

  return (
    <div className="container">
      <h2>Formulario de Historia Clínica</h2>
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

export default HistoriaClinicaForm;
