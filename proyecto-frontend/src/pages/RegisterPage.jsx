// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer"); // viewer | streamer

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  // 👇 nuevo: para mostrar el mensaje de éxito
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const validar = () => {
    const nuevosErrores = {};
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername) {
      nuevosErrores.username = "Ingresa un nombre de usuario.";
    } else if (trimmedUsername.length < 3) {
      nuevosErrores.username =
        "El nombre de usuario debe tener al menos 3 caracteres.";
    }

    if (!trimmedEmail) {
      nuevosErrores.email = "Ingresa tu correo electrónico.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        nuevosErrores.email = "Ingresa un correo electrónico válido.";
      }
    }

    if (!password) {
      nuevosErrores.password = "Ingresa una contraseña.";
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

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const emailNormalizado = email.trim().toLowerCase();

    const yaExiste = usuarios.some((u) => u.email === emailNormalizado);
    if (yaExiste) {
      setErrors((prev) => ({
        ...prev,
        email: "Ya existe una cuenta registrada con ese correo.",
      }));
      return;
    }

    const nuevoUsuario = {
      username: username.trim(),
      email: emailNormalizado,
      password,
      role,
      monedas: 0,
    };

    const actualizados = [...usuarios, nuevoUsuario];
    localStorage.setItem("usuarios", JSON.stringify(actualizados));

    // 👇 mostramos el mensaje bonito de éxito
    setShowSuccess(true);
  };

  // Cuando el usuario hace clic en "Aceptar"
  const handleSuccessAccept = () => {
    const tipo = role === "streamer" ? "de streamer" : "de espectador";

    // Solo por si quieres usarlo después, pero lo importante es redirigir:
    console.log(`Cuenta ${tipo} creada correctamente`);

    // volvemos al home y abrimos el login
    navigate("/");
    window.dispatchEvent(new Event("openLoginModal"));
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button
          className="modal-close"
          onClick={() => navigate("/")}
          aria-label="Cerrar"
        >
          ✖
        </button>

        <h2>Crear cuenta</h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* USERNAME */}
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrors((prev) => ({ ...prev, username: "" }));
            }}
            className={errors.username ? "input-error" : ""}
          />
          {errors.username && (
            <p className="error-text">{errors.username}</p>
          )}

          {/* EMAIL */}
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

          {/* PASSWORD */}
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

          {/* ROLE */}
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="viewer">Espectador</option>
            <option value="streamer">Streamer</option>
          </select>

          <button type="submit">Registrarme</button>
        </form>

        {/* ✅ Mensaje de éxito personalizado */}
        {showSuccess && (
          <div className="success-overlay">
            <div className="success-box">
              <h3>Cuenta creada correctamente</h3>
              <p>
                Tu cuenta se creó con éxito. Ahora puedes iniciar sesión para
                comenzar a usar Streamoria.
              </p>
              <button onClick={handleSuccessAccept}>Aceptar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
