import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const validar = () => {
    const nuevosErrores = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nuevosErrores.email = "Ingresa tu correo electrónico.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        nuevosErrores.email = "Ingresa un correo electrónico válido.";
      }
    }

    if (!password) {
      nuevosErrores.password = "Ingresa tu contraseña.";
    } else if (password.length < 6) {
      nuevosErrores.password =
        "La contraseña debe tener al menos 6 caracteres.";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    onLogin(email.trim(), password);
  };

  const handleRegisterRedirect = () => {
    onClose();
    navigate("/register");
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✖
        </button>

        <h2>Iniciar sesión</h2>

        <form onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && (
            <p className="error-text">{errors.password}</p>
          )}

          <button type="submit">Entrar</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>

        <div style={{ marginTop: "1rem" }}>
          <p>¿No tienes una cuenta?</p>
          <button onClick={handleRegisterRedirect}>Crear cuenta</button>
        </div>
      </div>
    </div>
  );
}
