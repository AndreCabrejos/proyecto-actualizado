import React, { useState, useEffect } from "react";
import { regalosAPI } from "../services/api";
import "./Regalos.css";

export default function Regalos({ monedas, onEnviarRegalo, onClose }) {
  const [regaloSeleccionado, setRegaloSeleccionado] = useState(null);
  const [regalos, setRegalos] = useState([]);
  const [mensajeEnvio, setMensajeEnvio] = useState("");

  useEffect(() => {
    const cargarRegalos = async () => {
      try {
        const data = await regalosAPI.obtenerTodos();
        setRegalos(data);
      } catch (err) {
        console.error("Error cargando regalos:", err);
      }
    };
    cargarRegalos();
  }, []);

  const handleEnviar = () => {
    if (!regaloSeleccionado) {
      setMensajeEnvio("Selecciona un regalo primero ✋");
      setTimeout(() => setMensajeEnvio(""), 2000);
      return;
    }

    if (monedas < regaloSeleccionado.costo) {
      setMensajeEnvio("No tienes suficientes monedas 😢");
      setTimeout(() => setMensajeEnvio(""), 2000);
      return;
    }

    onEnviarRegalo(regaloSeleccionado);
    setMensajeEnvio(`¡Has enviado ${regaloSeleccionado.nombre}! 🎁`);
    setRegaloSeleccionado(null);

    setTimeout(() => {
      setMensajeEnvio("");
    }, 2200);
  };

  return (
    <div className="regalos-overlay">
      <div className="regalos-container">
        <button className="btn-cerrar" onClick={onClose}>
          ✖
        </button>

        <h2>🎁 Enviar un regalo</h2>
        <p>Monedas disponibles: {monedas} 💰</p>

        <div className="lista-regalos">
          {regalos.map((r) => (
            <div
              key={r.id}
              className={`regalo ${regaloSeleccionado?.id === r.id ? "seleccionado" : ""
                }`}
              onClick={() => setRegaloSeleccionado(r)}
            >
              <span className="icono">{r.icono}</span>
              <p>{r.nombre}</p>
              <small>{r.costo} monedas</small>
              <small>{r.puntos} pts</small>
            </div>
          ))}
        </div>

        {mensajeEnvio && <div className="regalo-toast">{mensajeEnvio}</div>}

        <button className="btn-enviar" onClick={handleEnviar}>
          Enviar regalo
        </button>
      </div>
    </div>
  );
}
