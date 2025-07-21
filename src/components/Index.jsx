import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/Index.css';

const VistaPacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/paciente/read');
        const data = await response.json();
        const lista = Array.isArray(data.pacientes) ? data.pacientes : data;

        setPacientes(lista);

        const estadoInicial = {};
        lista.forEach(p => estadoInicial[p.idPaciente] = { v1: false, v2: false });
        setCheckboxStates(estadoInicial);
      } catch (error) {
        console.error('Error al obtener los pacientes:', error);
      }
    };

    fetchPacientes();
  }, []);

  const toggleCheckbox = (id, key) => {
    setCheckboxStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: !prev[id][key],
      },
    }));
  };

  const handleDelete = async (idPaciente) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar a este paciente?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/paciente/delete/${idPaciente}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setPacientes(prev => prev.filter(p => p.idPaciente !== idPaciente));
        } else {
          console.error('Error al eliminar el paciente');
        }
      } catch (error) {
        console.error('Error al eliminar el paciente:', error);
      }
    }
  };

  const formatID = (id, iniciales) => {
    const numPart = String(id).padStart(3, '0');
    return `${numPart}${iniciales}`;
  };

  // Paginación
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const pacientesPaginados = pacientes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(pacientes.length / rowsPerPage);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === 'prev') return Math.max(prev - 1, 1);
      if (direction === 'next') return Math.min(prev + 1, totalPages);
      return prev;
    });
  };

  const handleRowsChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reinicia a la primera página
  };

  return (
    <div className="vista-pacientes">
      {/* Barra superior */}
      <div className="barra-matriz">
        <div className="titulo-barra">Tabla de Sujetos</div>
        <div className="barra-grupo">
          <div className="opciones">
            <select onChange={handleRowsChange} value={rowsPerPage}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>

            <Link to="/Graficas">
              <button className="boton-nuevo">Generar Gráficas</button>
            </Link>
            <Link to="/RegistroPacientes">
              <button className="boton-nuevo">Añadir Nuevo Sujeto</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabla de pacientes */}
      <div className="tabla-contenedor">
        <table className="tabla-pacientes">
          <thead>
            <tr>
              <th>ID Sujeto</th>
              <th>Visita 1</th>
              <th>Visita 2</th>
              <th>R. Seg.</th>
              <th>D. Paciente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientesPaginados.length > 0 ? (
              pacientesPaginados.map((paciente) => (
                <tr key={paciente.idPaciente}>
                  <td>{formatID(paciente.idPaciente, paciente.iniciales)}</td>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox-white"
                      checked={checkboxStates[paciente.idPaciente]?.v1 || false}
                      onChange={() => toggleCheckbox(paciente.idPaciente, 'v1')}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox-white"
                      checked={checkboxStates[paciente.idPaciente]?.v2 || false}
                      onChange={() => toggleCheckbox(paciente.idPaciente, 'v2')}
                    />
                  </td>
                  <td><button className="icono">📄</button></td>
                  <td><span>x5</span></td>
                  <td>
                    <Link to={`/Cronograma/${paciente.idPaciente}`}>
                      <button className="accion-boton">🔍</button>
                    </Link>
                    <button
                      className="accion-boton eliminar-boton"
                      onClick={() => handleDelete(paciente.idPaciente)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ color: 'white', textAlign: 'center' }}>
                  No hay pacientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <div className="paginacion-controles">
        <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>Anterior</button>
        <span style={{ color: 'white' }}>Página {currentPage} de {totalPages}</span>
        <button onClick={() => handlePageChange('next')} disabled={currentPage === totalPages}>Siguiente</button>
      </div>
    </div>
  );
};

export default VistaPacientes;
