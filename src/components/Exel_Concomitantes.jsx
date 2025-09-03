import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const MedicamentosConcomitantesForm = () => {
  const [data, setData] = useState([]);

  // Función para obtener los datos de la API
  const fetchData = async () => {
    try {
      const response = await fetch('https://api.weareinfinite.mx/form/medicamentos_concomitantes');
      const result = await response.json();
      setData(result); // Guardamos los datos tal cual están en el estado
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
    // Mapear los datos para reordenar las columnas
    const mappedData = data.map(({ id, idPaciente, ...rest }) => ({
      idPaciente: idPaciente, // Colocamos idPaciente primero
      iniciales: rest.iniciales,
      consumio_medicamento: rest.consumio_medicamento,
      nombre_generico_medicamento: rest.nombre_medicamento, // Asumimos que "nombre_medicamento" es el nombre genérico
      dosis_diaria: rest.dosis_diaria,
      presentacion: rest.presentacion,
      indicacion: rest.indicacion,
      fecha_inicio: rest.fecha_inicio,
      fecha_termino: rest.fecha_termino,
      continua_consumo: rest.continua_consumo,
    }));

    // Crear una hoja de trabajo (workbook) a partir de los datos mapeados
    const ws = XLSX.utils.json_to_sheet(mappedData);

    // Crear un libro de trabajo (workbook)
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Medicamentos Concomitantes');

    // Descargar el archivo Excel
    XLSX.writeFile(wb, 'medicamentos_concomitantes_datos.xlsx');
  };

  return (
    <div className="container">
      <h2>Formulario de Medicamentos Concomitantes</h2>
      {/* Mostrar el botón solo si tenemos datos */}
      {data.length > 0 ? (
        <button onClick={downloadExcel}> Descargar Datos en Excel </button>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
};

export default MedicamentosConcomitantesForm;
