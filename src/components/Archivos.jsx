import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './css/Archivos.css';

const UploadForm = () => {
  const { idPaciente } = useParams(); // Obtenemos el ID desde la URL
  const [pdfFile, setPdfFile] = useState(null);
  const [archivos, setArchivos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (idPaciente) {
      // Si existe idPaciente, podemos cargar los archivos del paciente
      fetchArchivos(idPaciente);
    }
  }, [idPaciente]);

 const fetchArchivos = async (idPaciente) => {
  setLoading(true);
  try {
    const response = await fetch(`https://api.weareinfinite.mx/form/archivo/${idPaciente}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json', // Esperamos un JSON con los detalles de los archivos
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los archivos');
    }

    // Aquí estamos recibiendo la lista de archivos en formato JSON
    const data = await response.json();

    if (data.length > 0) {
      // Crear URLs para cada archivo (usamos los blobs para visualización)
      const archivosConUrls = await Promise.all(data.map(async (archivo) => {
        const fileResponse = await fetch(`https://api.weareinfinite.mx/form/archivo/${idPaciente}/${archivo.id}`);
        const blob = await fileResponse.blob();
        const fileUrl = window.URL.createObjectURL(blob);

        return {
          ...archivo,
          url: fileUrl, // Asignar la URL del archivo binario
        };
      }));

      setArchivos(archivosConUrls);
    } else {
      setArchivos([]); // No hay archivos
    }
  } catch (error) {
    console.error('Error al obtener los archivos:', error);
    setArchivos([]); // Aseguramos que si hay error, la lista esté vacía
  } finally {
    setLoading(false);
  }
};


  // Función para eliminar un archivo
  const handleDelete = async (fileId) => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar este archivo?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://api.weareinfinite.mx/form/delete/${idPaciente}/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Archivo eliminado correctamente');
        fetchArchivos(idPaciente); // Actualizamos la lista de archivos
      } else {
        alert('Error al eliminar el archivo');
      }
    } catch (error) {
      alert('Hubo un problema con la solicitud');
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idPaciente || !pdfFile) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    // Convertir el idPaciente a string y formatearlo con ceros a la izquierda
    const formattedIdPaciente = String(idPaciente).padStart(3, '0');

    // Crear un FormData para enviar el archivo PDF y los datos del paciente
    const formData = new FormData();
    formData.append('file', pdfFile); // Usamos el archivo
    formData.append('idPaciente', formattedIdPaciente); // Usamos el id formateado

    // Enviar los datos a la API en formato FormData
    try {
      const response = await fetch(`https://api.weareinfinite.mx/form/archivo/${formattedIdPaciente}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Archivo subido correctamente');
        fetchArchivos(formattedIdPaciente); // Actualizar la lista de archivos
      } else {
        alert('Error al subir el archivo');
      }
    } catch (error) {
      alert('Hubo un problema con la solicitud');
    }
  };

  return (
    <div className="container">
      <h2>Subir Documento PDF</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <table>
          <tr>
            <td><label htmlFor="idPaciente">ID Paciente:</label></td>
            <td>
              <input 
                type="text" 
                id="idPaciente" 
                name="idPaciente" 
                value={String(idPaciente).padStart(3, '0')} // Mostramos el id con ceros a la izquierda
                readOnly 
              />
            </td>
          </tr>
          <tr>
            <td><label htmlFor="pdfFile">Seleccionar PDF:</label></td>
            <td>
              <input 
                type="file" 
                id="pdfFile" 
                name="pdfFile" 
                accept=".pdf" 
                onChange={(e) => setPdfFile(e.target.files[0])} 
                required 
              />
            </td>
          </tr>
        </table>
        <button type="submit">Subir Archivo</button>
      </form>

 <h3>Archivos Existentes</h3>
{loading ? (
  <p>Cargando archivos...</p>
) : (
  <ul>
    {archivos.length > 0 ? (
      archivos.map((archivo) => (
        <li key={archivo.id}>
          {/* Usamos <embed> para mostrar el PDF directamente */}
          <embed 
            src={archivo.url} 
            type="application/pdf" 
            width="600" 
            height="400" 
          />
          <br />
          <a href={archivo.url} target="_blank" rel="noopener noreferrer">
            {archivo.filename}
          </a>
          {/* Botón para eliminar el archivo */}
          <button onClick={() => handleDelete(archivo.id)}>Eliminar</button>
        </li>
      ))
    ) : (
      <p>No hay archivos disponibles para este paciente.</p>
    )}
  </ul>
)}

    </div>
  );
};

export default UploadForm;



