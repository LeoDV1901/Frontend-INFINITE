import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const EventosAdversosForm = () => {
  const [data, setData] = useState([]);

  // Mapeos de valores numéricos a texto
  const intensidadMapping = {
    1: 'Leve',
    2: 'Moderada',
    3: 'Grave',
  };

  const causalidadMapping = {
    1: 'Relacionada',
    2: 'No relacionada',
    3: 'Probablemente',
  };

  const relacionMedicamentoMapping = {
    1: 'Alta',
    2: 'Media',
    3: 'Baja',
  };

  const accionesTomadasMapping = {
    1: 'Suspensión',
    2: 'Reducción',
    3: 'Sin cambios',
  };

  const desenlaceMapping = {
    1: 'Recuperado',
    2: 'Persistente',
    3: 'Desconocido',
  };

  // Función para obtener los datos de la API
  const fetchData = async () => {
    try {
      const response = await fetch('https://api.weareinfinite.mx/form/eventos_adversos');
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
    // Mapear los datos para reordenar las columnas y aplicar los mapeos
    const mappedData = data.map(({
      idPaciente,
      evento,
      fecha_inicio,
      fecha_termino,
      hora_inicio,
      hora_termino,
      intensidad,
      causalidad,
      relacion_medicamento,
      acciones_tomadas,
      desenlace,
      nota_evolucion
    }) => ({
      idPaciente,
      evento,
      fecha_inicio,
      fecha_termino,
      hora_inicio,
      hora_termino,
      intensidad: intensidadMapping[intensidad],
      causalidad: causalidadMapping[causalidad],
      relacion_medicamento: relacionMedicamentoMapping[relacion_medicamento],
      acciones_tomadas: accionesTomadasMapping[acciones_tomadas],
      desenlace: desenlaceMapping[desenlace],
      nota_evolucion,
    }));

    // Crear una hoja de trabajo (workbook) a partir de los datos mapeados
    const ws = XLSX.utils.json_to_sheet(mappedData);

    // Crear un libro de trabajo (workbook)
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Eventos Adversos');

    // Descargar el archivo Excel
    XLSX.writeFile(wb, 'eventos_adversos_datos.xlsx');
  };

  return (
    <div className="container">
      <h2>Formulario de Eventos Adversos</h2>
      {/* Mostrar el botón solo si tenemos datos */}
      {data.length > 0 ? (
        <button onClick={downloadExcel}> Descargar Datos en Excel </button>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
};

export default EventosAdversosForm;
