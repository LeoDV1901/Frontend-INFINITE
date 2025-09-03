import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importamos Link desde react-router-dom

const RutasGraficas = () => {
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
    { path: '/Graficas', label: 'Graficas Signos Vitales' },
    { path: '/GraficasHistoriaClinica', label: 'Graficas Historia Clinica' },
    { path: '/Graficas_Concomitantes', label: 'Graficas Medicamentos Concomitantes' },
    { path: '/Graficas_Eventos', label: 'Graficas Eventos Adversos' },
  ];

  if (!isTokenValid) {
    return <div>No tienes acceso a estas rutas. Inicia sesión nuevamente.</div>;
  }

  return (
    <div className="container">
      <h2>Control de Rutas</h2>
      <div className="routes-container">
        {rutas.map(({ path, label }) => (
          <div key={path} className="route-item">
            <Link to={path}>
              <button className="boton-nuevo">{label}</button> {/* Añado la clase boton-nuevo */}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RutasGraficas;
