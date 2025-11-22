import "./ComprarMonedas.css";
import { useState } from "react";

export default function ComprarMonedas() {
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

  const comprarPack = async () => {
    if (!packSeleccionado) return alert("Selecciona un pack.");

    const token = localStorage.getItem("token");
    if (!token) return alert("Debes iniciar sesión.");

    try {
      const res = await fetch("http://localhost:3001/api/monedas/comprar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          cantidad: packSeleccionado.coins
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al comprar monedas.");
        return;
      }

      // Guardamos el saldo actualizado para el Header
      localStorage.setItem("monedas", data.monedas);

      alert(`Compra exitosa 🎉 Nuevo saldo: ${data.monedas}`);

      setModalAbierto(false);
      setPackSeleccionado(null);

    } catch (err) {
      console.error(err);
      alert("Error al procesar la compra.");
    }
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
                onClick={() => {
                  setPackSeleccionado(pack);
                  setModalAbierto(true);
                }}
              >
                Comprar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL DE COMPRA --- */}
      {modalAbierto && (
        <div className="modal-overlay-recarga">
          <div className="modal-recarga">
            <button className="cerrar-modal" onClick={() => setModalAbierto(false)}>
              ✖
            </button>

            <h3>Confirmar compra</h3>
            <p>{packSeleccionado.name}</p>
            <p>Recibirás <strong>{packSeleccionado.coins} monedas</strong></p>
            <p>Precio: S/ {packSeleccionado.price.toFixed(2)}</p>

            <button className="btn-confirmar" onClick={comprarPack}>
              Confirmar compra
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
