import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.endsWith('@infinite.com.mx')) {
      alert('El correo no tiene acceso');
      return;
    }

    // Verificar las credenciales
    if (email === 'admin@infinite.com.mx' && password === 'Admin123') {
      navigate('/Index');
    } else {
      navigate('/PreguntaInicio');
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
