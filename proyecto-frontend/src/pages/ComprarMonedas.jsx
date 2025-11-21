import "./ComprarMonedas.css";
import { useState } from "react";
import RecargarMonedasModal from "../components/RecargarMonedasModal";

export default function ComprarMonedas({ monedas, setMonedas }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [packSeleccionado, setPackSeleccionado] = useState(null);

  const packs = [
    { id: 1, name: "Pack Bronce", coins: 100, price: 3.0 },
    { id: 2, name: "Pack Plata", coins: 500, price: 12.0 },
    { id: 3, name: "Pack Oro", coins: 1000, price: 20.0 },
    { id: 4, name: "Pack Diamante", coins: 2500, price: 40.0 },
    { id: 5, name: "Pack Esmeralda", coins: 3000, price: 50.0 },
    { id: 6, name: "Pack Legendario", coins: 4000, price: 60.0 },
  ];

  const abrirModal = (pack) => {
    setPackSeleccionado(pack);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPackSeleccionado(null);
  };

  return (
    <section className="comprar-monedas-wrapper">
      <div className="comprar-monedas">
        <h2>Comprar Monedas</h2>
        <p>Selecciona un pack y completa tu compra.</p>

        {/* --- Catálogo de packs --- */}
        <div className="packs-grid">
          {packs.map((pack) => (
            <div className="pack-card" key={pack.id}>
              <span className="pack-coins-icon">💰</span>
              <h3 className="pack-name">{pack.name}</h3>
              <p className="pack-coins">{pack.coins} 🪙</p>
              <p className="pack-price">S/ {pack.price.toFixed(2)}</p>
              <button
                className="purchase-button"
                onClick={() => abrirModal(pack)}
              >
                Comprar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- Modal de Recarga --- */}
      {modalAbierto && (
        <RecargarMonedasModal
          monedas={monedas}
          setMonedas={setMonedas}
          onClose={cerrarModal}
          packSeleccionado={packSeleccionado}
        />
      )}
    </section>
  );
}
