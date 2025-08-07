import React, { useState } from 'react';
import './css/Admin.css'; // Asegúrate de tener los estilos en este archivo

const CrearAdministrador = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://api.weareinfinite.mx/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje('Administrador creado con éxito ✅');
        setEmail('');
        setPassword('');
      } else {
        setMensaje(data.mensaje || 'Error al crear administrador ❌');
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error de red ❌');
    }
  };

  return (
    <div className="container">
      <h2>Crear Administrador</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Crear</button>
      </form>
      {mensaje && <p style={{ color: '#fff', marginTop: '15px', textAlign: 'center' }}>{mensaje}</p>}
    </div>
  );
};

export default CrearAdministrador;
