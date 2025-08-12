import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './css/login.css';

const Login = () => {
  const [email, setEmail] = useState('admin@infinite.com.mx');
  const [password, setPassword] = useState('Admin123');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Comprobamos si las credenciales son correctas
    if (email === 'admin@infinite.com.mx' && password === 'Admin123') {
      // Simulamos un inicio de sesión exitoso
      localStorage.setItem('token', 'fake_token'); // Almacenamos un token ficticio

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
        text: 'Correo o contraseña incorrectos',
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
