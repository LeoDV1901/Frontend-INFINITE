import React, { useState } from "react";
import Swal from "sweetalert2";
import "./css/login.css";
import { useNavigate } from "react-router-dom";

const Protocolo = () => {
  const [idProtocolo, setIdProtocolo] = useState("");
  const [protocolName, setProtocolName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idProtocolo || !protocolName) {
      setError("Todos los campos son requeridos");
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor, rellene todos los campos requeridos.",
      }).then(() => navigate("/Index"));
      return;
    }

    const parsedId = parseInt(idProtocolo, 10);
    if (isNaN(parsedId)) {
      setError("El ID Protocolo debe ser un número válido.");
      Swal.fire({
        icon: "error",
        title: "ID Protocolo inválido",
        text: "El ID Protocolo debe ser un número válido.",
      }).then(() => navigate("/Index"));
      return;
    }

    const data = {
      idProtocolo: parsedId,
      protocol_name: protocolName,
    };

    try {
      const response = await fetch("https://api.weareinfinite.mx/form/protocols", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIdProtocolo("");
        setProtocolName("");
        setError("");
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "¡Protocolo enviado exitosamente!",
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/Index");
        }, 2000);
      } else {
        setError("Error al enviar el protocolo. Intenta nuevamente.");
        Swal.fire({
          icon: "error",
          title: "Error al enviar",
          text: "Hubo un problema al enviar el protocolo, por favor intenta más tarde.",
        }).then(() => navigate("/Index"));
      }
    } catch (err) {
      setError("Hubo un error en la conexión. Intenta más tarde.");
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar al servidor. Intenta más tarde.",
      }).then(() => navigate("/Index"));
    }
  };

  return (
    <div className="container">
      <h2>Registrar Protocolo</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="ID Protocolo"
          value={idProtocolo}
          onChange={(e) => setIdProtocolo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nombre del Protocolo"
          value={protocolName}
          onChange={(e) => setProtocolName(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Protocolo;
