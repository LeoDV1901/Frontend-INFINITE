import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const SignosForm = () => {
  const [data, setData] = useState([]);

  // Función para obtener los datos de la API
  const fetchData = async () => {
    try {
      const response = await fetch('https://api.weareinfinite.mx/form/signos/all');
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
    const mappedData = data.map(({ id, ...rest }) => ({
      idPaciente: rest.idPaciente, // Colocamos primero `idPaciente`
      fecha: rest.fecha,
      genero: rest.genero,
      presion_sistolica: rest.presion_sistolica,
      presion_diastolica: rest.presion_diastolica,
      temperatura: rest.temperatura,
      frecuencia_cardiaca: rest.frecuencia_cardiaca,
      frecuencia_respiratoria: rest.frecuencia_respiratoria,
      peso: rest.peso,
      talla: rest.talla,
      imc: rest.imc,
      embarazo: rest.embarazo,
      comentario: rest.comentario, // Colocamos `comentario` al final
    }));

    // Crear una hoja de trabajo (workbook) a partir de los datos mapeados
    const ws = XLSX.utils.json_to_sheet(mappedData);

    // Crear un libro de trabajo (workbook)
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Signos Vitales');

    // Descargar el archivo Excel
    XLSX.writeFile(wb, 'signos_vitales_datos.xlsx');
  };

  return (
    <div className="container">
      <h2>Formulario de Signos Vitales</h2>
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

export default SignosForm;
