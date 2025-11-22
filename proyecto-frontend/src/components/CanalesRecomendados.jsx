import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CanalesRecomendados.css";

export default function CanalesRecomendados({ isLoggedIn, userRole }) {
  const [canales, setCanales] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/canales")
      .then((res) => res.json())
      .then((data) => setCanales(data))
      .catch((err) => console.error("Error cargando canales:", err));
  }, []);

  const handleClickCanal = (nombre) => {
    if (!isLoggedIn || userRole !== "viewer") {
      window.dispatchEvent(new Event("openLoginModal"));
      return;
    }
    navigate(`/viewer/${nombre}`);
  };

  return (
    <div className="canales-lateral">
      <h3>Recomendado</h3>
      <div className="lista-canales">
        {canales.map((canal) => (
          <div
            key={canal.id}
            className="canal-item"
            onClick={() => handleClickCanal(canal.nombre.toLowerCase())}
          >
            <img src={canal.imagen} alt={canal.nombre} className="canal-logo" />
            <div className="canal-info">
              <p className="canal-nombre">{canal.nombre}</p>
              <p className="canal-categoria">{canal.categoria}</p>
            </div>
            <div className="canal-viewers">
              <span className="punto-rojo"></span>
              <span className="numero-viewers">{canal.viewers}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
