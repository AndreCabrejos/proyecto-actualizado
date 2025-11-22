import React from "react";
import "../pages/Notificacion.css";


export default function Notificacion({ message, show, onClose }) {
  if (!show) return null;

  return (
    <div className="notificacion">
      <p>{message}</p>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
}
