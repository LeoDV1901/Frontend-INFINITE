import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';  // Importamos Link de react-router-dom

const RutasExels = () => {
  const [isTokenValid, setIsTokenValid] = useState(true); // Estado para almacenar si el token es válido
    const navigate = useNavigate(); // Usamos useNavigate para redirección en v6
  
    // Verificar token al cargar el componente
    useEffect(() => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Si no hay token, redirigir o actualizar el estado
        setIsTokenValid(false);
        navigate('/login'); // Usamos navigate en lugar de history.push
      } else {
        // Aquí podrías hacer una validación adicional del token si tienes una API
        // Por ejemplo, hacer una solicitud a un endpoint que valide el token
        // Para este ejemplo, asumimos que si el token está presente, es válido
        setIsTokenValid(true);
      }
    }, [navigate]); // Esto se ejecuta cuando el componente se monta
  const rutas = [
    { path: '/ExelConcentimiento', label: 'Exel Concentimiento' },
    { path: '/Exel_Inclusion', label: 'Exel Inclusión' },
    { path: '/Exel_Exclusion', label: 'Exel Exclusión' },
    { path: '/Exel_Eliminacion', label: 'Exel Eliminación' },
    { path: '/Exel_HClinica', label: 'Exel Historia Clínica' },
    { path: '/Exel_Signos', label: 'Exel Signos' },
    { path: '/Exel_Concomitantes', label: 'Exel Concomitantes' },
    { path: '/Exel_Adversos', label: 'Exel Adversos' },
  ];

  return (
    <div className="container">
      <h2>Control de Rutas</h2>
      <div className="routes-container">
        {rutas.map(({ path, label }) => (
          <div key={path} className="route-item">
            <Link to={path}>
              <button className="boton-nuevo">{label}</button> {/* Añadí la clase boton-nuevo */}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RutasExels;
