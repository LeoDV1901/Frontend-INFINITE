import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/Index.css';

const VistaPacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [checkboxStates, setCheckboxStates] = useState({});

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
    // Mostrar alerta de confirmación
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar a este paciente?');
    
    if (confirmDelete) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/paciente/delete/${idPaciente}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Filtrar el paciente eliminado de la lista
          setPacientes(prev => prev.filter(paciente => paciente.idPaciente !== idPaciente));
        } else {
          console.error('Error al eliminar el paciente');
        }
      } catch (error) {
        console.error('Error al eliminar el paciente:', error);
      }
    }
  };

  // Función para formatear el ID
  const formatID = (id, iniciales) => {
    const numPart = String(id).padStart(3, '0'); // Asegura que tenga 3 dígitos
    return `${numPart}${iniciales}`;  // Deja las iniciales tal cual, sin repetirlas
  };

  return (
    <div className="vista-pacientes">
      {/* Barra superior con estilo glass */}
      <div className="barra-matriz">
        <div className="titulo-barra">Matriz de Sujetos</div>
        <div className="barra-grupo">
          <div className="flechas">
            <button>{"<<"}</button>
            <button>{"<"}</button>
            <button>{">"}</button>
            <button>{">>"}</button>
          </div>

          <div className="opciones">
            <label className="label-select">
              <select>
                <option>15</option>
                <option>25</option>
                <option>50</option>
              </select>
            </label>

            <select>
              <option>Seleccionar un Evento</option>
              <option>Evento 1</option>
              <option>Evento 2</option>
            </select>
            
            <Link to="/Graficas">
              <button className="boton-nuevo">Generar Graficas</button>
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
              <th>MC</th>
              <th>R. Adversa</th>
              <th>R. Seg.</th>
              <th>D. Paciente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.length > 0 ? (
              pacientes.map((paciente) => (
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
                  <td><button className="icono">📄</button></td>
                  <td><button className="icono">📄</button></td>
                  <td><span>x5</span></td>
                  <td>
                    <Link to={`/Cronograma/${paciente.idPaciente}`}>
                      <button className="accion-boton">🔍</button>
                    </Link>
                    {/* Botón Eliminar */}
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
                <td colSpan="8" style={{ color: 'white', textAlign: 'center' }}>No hay pacientes registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VistaPacientes;
