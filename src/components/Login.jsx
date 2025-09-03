import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './css/login.css';

const Login = () => {
  // Definir los estados para email y password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Obtener la función navigate de react-router-dom
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://api.weareinfinite.mx/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        // Guardamos el token en localStorage
        localStorage.setItem('token', data.access_token);
         localStorage.setItem('correo', email);

        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Inicio de sesión exitoso',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate('/Index');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.mensaje || 'Correo o contraseña incorrectos',
        });
      }
    } catch (error) {
      console.error('Error de red:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo conectar al servidor',
      });
    }
  };

  return (
    <div className="container">
      <img src="/image001.png" alt="Logo Infinite" className="logo" />
      <h2>Iniciar Sesión</h2>
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
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
