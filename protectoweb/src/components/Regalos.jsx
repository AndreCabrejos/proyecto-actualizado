import React, { useState } from "react";
import regalosData from "../data/regalos.json";
import "./Regalos.css";

export default function Regalos({ monedas, onEnviarRegalo, onClose }) {
  const [regaloSeleccionado, setRegaloSeleccionado] = useState(null);

  const handleEnviar = () => {
    if (!regaloSeleccionado) return alert("Selecciona un regalo primero.");
    if (monedas < regaloSeleccionado.costo)
      return alert("No tienes suficientes monedas.");

    onEnviarRegalo(regaloSeleccionado);
    alert(`¡Has enviado ${regaloSeleccionado.nombre}! 🎁`);
    setRegaloSeleccionado(null);
  };

  return (
    <div className="regalos-overlay">
      <div className="regalos-container">
        {/* Botón cerrar arriba a la derecha */}
        <button className="btn-cerrar" onClick={onClose}>
          ✖
        </button>

        <h2>🎁 Enviar un regalo</h2>
        <p>Monedas disponibles: {monedas} 💰</p>

        <div className="lista-regalos">
          {regalosData.map((r) => (
            <div
              key={r.id}
              className={`regalo ${regaloSeleccionado?.id === r.id ? "seleccionado" : ""}`}
              onClick={() => setRegaloSeleccionado(r)}
            >
              <span className="icono">{r.icono}</span>
              <p>{r.nombre}</p>
              <small>{r.costo} monedas</small>
              <small>{r.puntos} pts</small>
            </div>
          ))}
        </div>

        <button className="btn-enviar" onClick={handleEnviar}>
          Enviar regalo
        </button>
      </div>
    </div>
  );
}
