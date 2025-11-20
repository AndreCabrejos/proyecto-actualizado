import { useNavigate } from "react-router-dom";
import canalesData from "../data/canales.json";
import "./CanalesRecomendados.css";

export default function CanalesRecomendados() {
  const navigate = useNavigate();

  const formatViewers = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + " mil";
    return num.toString();
  };

  return (
    <div className="canales-lateral">
      <h3>Recomendado</h3>
      <div className="lista-canales">
        {canalesData.map((canal) => (
          <div
            key={canal.id}
            className="canal-item"
            onClick={() => navigate(`/viewer/${canal.nombre.toLowerCase()}`)}
          >
            <img src={canal.imagen} alt={canal.nombre} className="canal-logo" />
            <div className="canal-info">
              <p className="canal-nombre">{canal.nombre}</p>
              <p className="canal-categoria">{canal.categoria}</p>
            </div>

            <div className="canal-viewers">
              <span className="punto-rojo"></span>
              <span className="numero-viewers">{formatViewers(canal.viewers)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
