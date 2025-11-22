import React, { useEffect } from "react";
import "./GiftOverlay.css";

export default function GiftOverlay({ show, regalo, espectador, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 4000); // desaparece después de 4s
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show || !regalo) return null;

  return (
    <div className="gift-overlay">
      <div className="gift-card">
        <div className="gift-emoji">🎁</div>
        <div className="gift-info">
          <h3>{espectador} ha enviado un {regalo.nombre}!</h3>
          <p>+{regalo.puntos} puntos • -{regalo.costo} 🪙</p>
        </div>
      </div>
    </div>
  );
}