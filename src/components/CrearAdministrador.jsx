import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './css/Admin.css';

const CrearAdministrador = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('https://api.weareinfinite.mx/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Administrador creado!',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = '/Index';
        });

        setEmail('');
        setPassword('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.mensaje || 'Error al crear administrador ❌',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = '/Index';
        });
      }
    } catch (error) {
      console.error('Error:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'No se pudo conectar con el servidor ❌',
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = '/Index';
      });
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
    </div>
  );
};

export default CrearAdministrador;
