// RecargarMonedasModal.jsx
import { useState } from "react";
import "./RecargarMonedasModal.css";

import visa from "../assets/visa.svg";
import master from "../assets/master.svg";
import american from "../assets/american.svg";
import diners from "../assets/diners.svg";

export default function RecargarMonedasModal({
  monedas,
  setMonedas,
  onClose,
  packSeleccionado = null,
}) {
  // Si viene de un pack, precargamos las monedas del pack
  const [monto, setMonto] = useState(
    packSeleccionado ? String(packSeleccionado.coins) : ""
  );
  const [tarjeta, setTarjeta] = useState("");
  const [caducidad, setCaducidad] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardBrand, setCardBrand] = useState("visa");
  const [transaccion, setTransaccion] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Precio que se va a cobrar (si hay pack, su price; si no, usamos el monto como demo)
  const precioActual = packSeleccionado
    ? packSeleccionado.price
    : monto
      ? Number(monto)
      : 0;

  const simularPago = (e) => {
    e.preventDefault();

    const monedasARecargar = packSeleccionado
      ? packSeleccionado.coins
      : parseFloat(monto);

    if (!monedasARecargar || !tarjeta || !caducidad || !cvv) {
      alert("Por favor completa todos los campos.");
      return;
    }

    setCargando(true);

    setTimeout(() => {
      const id = "TXN" + Date.now();
      const saldoAnterior = monedas;

      const nueva = {
        id,
        monedas: monedasARecargar,
        precio: precioActual, // S/
        fecha: new Date().toLocaleString(),
        ultimos4: String(tarjeta).slice(-4) || "0000",
        brand: cardBrand,
        saldoAnterior,
        packName: packSeleccionado ? packSeleccionado.name : "Recarga manual",
      };

      setTransaccion(nueva);
      setMonedas((prev) => prev + monedasARecargar);
      setCargando(false);
    }, 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="payment-modal">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        {!transaccion ? (
          <>
            <div className="payment-header">Recargar Monedas</div>

            <div className="payment-body">
              {cargando ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Procesando pago...</p>
                </div>
              ) : (
                <>
                  {/* Resumen de la compra antes de pagar */}
                  <div className="payment-amount">
                    {packSeleccionado && (
                      <p className="payment-pack-name">
                        {packSeleccionado.name}
                      </p>
                    )}

                    <span className="payment-amount-label">
                      Monedas a recargar
                    </span>
                    <input
                      type="number"
                      value={monto}
                      onChange={(e) => setMonto(e.target.value)}
                      placeholder="Ingrese monedas"
                      required
                      disabled={!!packSeleccionado} // si viene de pack, fijo
                    />

                    {packSeleccionado && (
                      <div className="payment-amount-summary">
                        <span>{packSeleccionado.name}</span>
                        <strong>S/ {packSeleccionado.price.toFixed(2)}</strong>
                      </div>
                    )}

                    {!packSeleccionado && (
                      <p className="payment-amount-hint">
                        (Demo) Se cobra 1 sol por cada moneda.
                      </p>
                    )}
                  </div>

                  <h3>Datos de la Tarjeta</h3>

                  {/* Selector de tipo de tarjeta */}
                  <div className="card-brand-selector">
                    <button
                      type="button"
                      className={`card-brand-btn ${cardBrand === "visa" ? "active" : ""
                        }`}
                      onClick={() => setCardBrand("visa")}
                    >
                      <img src={visa} alt="Visa" />
                      <span>Visa</span>
                    </button>
                    <button
                      type="button"
                      className={`card-brand-btn ${cardBrand === "master" ? "active" : ""
                        }`}
                      onClick={() => setCardBrand("master")}
                    >
                      <img src={master} alt="MasterCard" />
                      <span>MasterCard</span>
                    </button>
                    <button
                      type="button"
                      className={`card-brand-btn ${cardBrand === "american" ? "active" : ""
                        }`}
                      onClick={() => setCardBrand("american")}
                    >
                      <img src={american} alt="AmEx" />
                      <span>AmEx</span>
                    </button>
                    <button
                      type="button"
                      className={`card-brand-btn ${cardBrand === "diners" ? "active" : ""
                        }`}
                      onClick={() => setCardBrand("diners")}
                    >
                      <img src={diners} alt="Diners" />
                      <span>Diners</span>
                    </button>
                  </div>

                  <form onSubmit={simularPago} className="payment-form">
                    <label>Número de tarjeta</label>
                    <input
                      type="text"
                      value={tarjeta}
                      onChange={(e) => setTarjeta(e.target.value)}
                      placeholder="XXXX XXXX XXXX XXXX"
                      maxLength={19}
                      required
                    />

                    <div className="form-row">
                      <div>
                        <label>Caducidad</label>
                        <input
                          type="text"
                          value={caducidad}
                          onChange={(e) => setCaducidad(e.target.value)}
                          placeholder="MM/AA"
                          maxLength={5}
                          required
                        />
                      </div>

                      <div>
                        <label>CVV</label>
                        <input
                          type="password"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="XXX"
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>

                    <div className="button-row">
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={onClose}
                      >
                        Cancelar
                      </button>
                      <button type="submit" className="pay-btn">
                        Confirmar Pago
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>

            <div className="payment-footer">
              <img src={visa} alt="Visa" />
              <img src={master} alt="MasterCard" />
              <img src={american} alt="American Express" />
              <img src={diners} alt="Diners Club" />
            </div>
          </>
        ) : (
          /* 🧾 Comprobante tipo "Kick" pero morado */
          <div className="recargar-result">
            <div className="receipt-hero">
              <div className="receipt-pill">Streamoria</div>
              <h2 className="receipt-title">¡Gracias por tu recarga! 💜</h2>
              <p className="receipt-subtitle">
                Tu compra ha sido confirmada correctamente.
              </p>

              <div className="receipt-amount">
                <span className="receipt-amount-label">Total pagado</span>
                <span className="receipt-amount-value">
                  S/ {Number(transaccion.precio).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="receipt-body">
              <p className="receipt-section-title">Resumen de tu compra</p>

              <div className="receipt-row">
                <span>Orden</span>
                <span>{transaccion.id}</span>
              </div>

              <div className="receipt-row">
                <span>Fecha</span>
                <span>{transaccion.fecha}</span>
              </div>

              <div className="receipt-row">
                <span>Método de pago</span>
                <span>
                  {transaccion.brand.toUpperCase()} •••• {transaccion.ultimos4}
                </span>
              </div>

              <div className="receipt-row">
                <span>Producto</span>
                <span>{transaccion.packName}</span>
              </div>

              <div className="receipt-row">
                <span>Monedas acreditadas</span>
                <span>{transaccion.monedas} 🪙</span>
              </div>

              <div className="receipt-row receipt-row-total">
                <span>Saldo nuevo (estimado)</span>
                <span>
                  {transaccion.saldoAnterior + transaccion.monedas} 🪙
                </span>
              </div>
            </div>

            <p className="receipt-footer-text">
              Puedes cerrar este comprobante y seguir apoyando a tus streamers
              favoritos.
            </p>

            <button className="pay-btn receipt-close-btn" onClick={onClose}>
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
