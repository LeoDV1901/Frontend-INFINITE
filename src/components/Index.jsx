import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './css/Index.css';
import Swal from 'sweetalert2';

const VistaPacientes = () => {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  // Verificación de Token (Protección de vista)
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (!token) {
      navigate('/Login');
    }
  }, [token, navigate]);

  // Cargar pacientes y estados de visitas
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await fetch('https://api.weareinfinite.mx/paciente/read');
        const data = await response.json();
        const lista = Array.isArray(data.pacientes) ? data.pacientes : data;
        setPacientes(lista);

        // Cargar estados guardados para cada paciente
        const estados = {};
        for (const p of lista) {
          try {
            const resVisitas = await fetch(`https://api.weareinfinite.mx/form/visita_seleccion/${p.idPaciente}`);
            if (!resVisitas.ok) {
              estados[p.idPaciente] = { v1: false, v2: false };
              continue;
            }
            const dataVisitas = await resVisitas.json();
            const v1Estado = dataVisitas.find(v => v.nombre_visita === 'Visita 1')?.seleccionada || false;
            const v2Estado = dataVisitas.find(v => v.nombre_visita === 'Visita 2')?.seleccionada || false;
            estados[p.idPaciente] = { v1: v1Estado, v2: v2Estado };
          } catch {
            estados[p.idPaciente] = { v1: false, v2: false };
          }
        }
        setCheckboxStates(estados);
      } catch (error) {
        console.error('Error al obtener los pacientes:', error);
      }
    };

    fetchPacientes();
  }, []);

  const toggleCheckbox = async (id, key) => {
    const nuevoEstado = !checkboxStates[id]?.[key];
    setCheckboxStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: nuevoEstado,
      },
    }));

    const nombreVisita = key === 'v1' ? 'Visita 1' : 'Visita 2';

    try {
      const res = await fetch("https://api.weareinfinite.mx/form/visita_seleccion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idPaciente: id,
          nombre_visita: nombreVisita,
          seleccionada: nuevoEstado,
        }),
      });

      if (!res.ok) {
        console.error("Error guardando selección");
      }
    } catch (error) {
      console.error("Error en fetch POST:", error);
    }
  };

  const handleDelete = async (idPaciente) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este paciente será eliminado permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://api.weareinfinite.mx/paciente/delete/${idPaciente}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setPacientes(prev => prev.filter(p => p.idPaciente !== idPaciente));
          Swal.fire('Eliminado!', 'El paciente ha sido eliminado.', 'success');
        } else {
          Swal.fire('Error!', 'No se pudo eliminar el paciente. Intenta nuevamente.', 'error');
        }
      } catch (error) {
        Swal.fire('Error!', 'No se pudo eliminar el paciente. Intenta nuevamente.', 'error');
      }
    }
  };

  const formatID = (idProtocolo, idPaciente, iniciales) => {
    const numPart = String(idPaciente).padStart(3, '0');
    return `${idProtocolo}${numPart}${iniciales}`;
  };

  const pacientesFiltrados = pacientes.filter(paciente => {
    const idCompleto = `${paciente.idProtocolo}${paciente.idPaciente}${paciente.iniciales}`.toLowerCase();
    return idCompleto.includes(searchTerm.toLowerCase());
  });

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const pacientesPaginados = pacientesFiltrados.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(pacientesFiltrados.length / rowsPerPage);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === 'prev') return Math.max(prev - 1, 1);
      if (direction === 'next') return Math.min(prev + 1, totalPages);
      return prev;
    });
  };

  const handleRowsChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="vista-pacientes">
      <div className="barra-matriz">
        <div className="titulo-barra">Tabla de Sujetos</div>
        <div className="barra-grupo">
          <div className="opciones">
            <input
              type="text"
              placeholder="Buscar pacientes..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="input-busqueda"
            />
            <select onChange={handleRowsChange} value={rowsPerPage}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>

            <Link to="/Routes_graficas">
              <button className="boton-nuevo">Generar Gráficas</button>
            </Link>
             <Link to="/Routes_view">
              <button className="boton-nuevo">Generar Exels</button>
            </Link>
            <Link to="/RegistroPacientes">
              <button className="boton-nuevo">Añadir Nuevo Sujeto</button>
            </Link>
            <Link to="/Protocolo">
  <button className="boton-nuevo">Nuevo Protocolo</button>
</Link>

{localStorage.getItem('correo') === 'admin@infinite.com.mx' && (
  <Link to="/CreateAdmin">
    <button className="boton-nuevo">Crear Acceso</button>
  </Link>
)}

          </div>
        </div>
      </div>

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
                  <td>{formatID(paciente.idProtocolo, paciente.idPaciente, paciente.iniciales)}</td>
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
                  <td>
                    <Link to={`/ReportePaciente/${paciente.idPaciente}`}>
                      <button className="icono">📄</button>
                    </Link>
                  </td>
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

      <div className="paginacion-controles">
        <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
          Anterior
        </button>
        <span style={{ color: 'white' }}>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={() => handlePageChange('next')} disabled={currentPage === totalPages}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default VistaPacientes;
