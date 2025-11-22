import { useState } from "react";
import "./RecargarMonedasModal.css";

// Importar las imágenes locales desde src/assets/
import visa from "../assets/visa.svg";
import master from "../assets/master.svg";
import american from "../assets/american.svg";
import diners from "../assets/diners.svg";

export default function RecargarMonedasModal({ monedas, setMonedas, onClose, montoInicial = 0 }) {
  const [monto, setMonto] = useState(montoInicial.toString());
  const [tarjeta, setTarjeta] = useState("");
  const [caducidad, setCaducidad] = useState("");
  const [cvv, setCvv] = useState("");
  const [transaccion, setTransaccion] = useState(null);
  const [cargando, setCargando] = useState(false);

  const simularPago = (e) => {
    e.preventDefault();
    if (!monto || !tarjeta || !caducidad || !cvv) {
      alert("Por favor complete todos los campos.");
      return;
    }

    setCargando(true);
    setTimeout(() => {
      const id = "TXN" + Date.now();
      const nueva = {
        id,
        monto: parseFloat(monto),
        fecha: new Date().toLocaleString(),
      };
      setTransaccion(nueva);
      setMonedas((prev) => prev + nueva.monto);
      setCargando(false);
    }, 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="payment-modal">
        <button className="close-btn" onClick={onClose}>✖</button>

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
                  <div className="payment-amount">
                    <span>Monto a recargar:</span>
                    <input
                      type="number"
                      value={monto}
                      onChange={(e) => setMonto(e.target.value)}
                      placeholder="Ingrese monto"
                      required
                    />
                  </div>

                  <h3>Datos de la Tarjeta</h3>
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
                      <button type="button" className="cancel-btn" onClick={onClose}>
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
          <div className="recargar-result">
            <h3>✅ Recarga Exitosa</h3>
            <p><strong>ID de transacción:</strong> {transaccion.id}</p>
            <p><strong>Monto:</strong> {transaccion.monto} monedas</p>
            <p><strong>Fecha:</strong> {transaccion.fecha}</p>
            <button className="pay-btn" onClick={onClose}>Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
}

