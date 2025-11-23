import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import Home from "./pages/Home";
import Nosotros from "./pages/Nosotros";
import TyC from "./pages/TyC";
import StreamerPage from "./pages/StreamerPage";
import ViewerPage from "./pages/ViewerPage";
import RegisterPage from "./pages/RegisterPage";
import ComprarMonedas from "./pages/ComprarMonedas";
import PerfilPage from "./pages/PerfilPage";
import { authAPI, guardarSesion, cerrarSesion } from "./services/api";

export default function App() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    !!localStorage.getItem("currentUser")
  );

  const [userRole, setUserRole] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved).role : null;
  });

  const [currentUserEmail, setCurrentUserEmail] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved).email : null;
  });

  const [monedas, setMonedas] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    if (!saved) return 0;
    const parsed = JSON.parse(saved);
    return parsed.monedas ?? 0;
  });

  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = async (email, password) => {
    try {
      const data = await authAPI.iniciarSesion(email, password);

      guardarSesion(data.token, data.user);

      setIsLoggedIn(true);
      setUserRole(data.user.role);
      setCurrentUserEmail(data.user.email);
      setMonedas(data.user.monedas ?? 0);
      setCurrentUser(data.user);

      setShowLogin(false);

      if (data.user.role === "streamer") {
        navigate("/streamer");
      } else {
        navigate("/viewer/ryuplayer");
      }
    } catch (err) {
      console.error(err);
      const mensaje = err.response?.data?.message || "No se pudo conectar con el servidor";
      alert(mensaje);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    const actualizado = { ...currentUser, monedas };
    localStorage.setItem("currentUser", JSON.stringify(actualizado));
  }, [monedas, currentUser]);

  useEffect(() => {
    const handler = () => setShowLogin(true);
    window.addEventListener("openLoginModal", handler);
    return () => window.removeEventListener("openLoginModal", handler);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentUserEmail(null);
    setMonedas(0);
    setCurrentUser(null);
    cerrarSesion();
    navigate("/");
  };

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onLoginClick={() => setShowLogin(true)}
        onLogoutClick={handleLogout}
        monedas={monedas}
        currentUserEmail={currentUserEmail}
        currentUserName={currentUser?.username || null}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={<Home isLoggedIn={isLoggedIn} userRole={userRole} />}
          />

          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/tyc" element={<TyC />} />

          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/comprar"
            element={
              isLoggedIn ? (
                <ComprarMonedas 
                  monedas={monedas} 
                  setMonedas={setMonedas}
                  currentUser={currentUser}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/streamer/*"
            element={
              isLoggedIn && userRole === "streamer" ? (
                <StreamerPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/viewer/:canal"
            element={
              isLoggedIn && userRole === "viewer" ? (
                <ViewerPage
                  monedas={monedas}
                  setMonedas={setMonedas}
                  currentUser={currentUser}
                  currentUserEmail={currentUser?.email || null}
                  currentUserName={currentUser?.username || null}
                  currentUserId={currentUser?.id || null}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/perfil"
            element={
              isLoggedIn ? (
                <PerfilPage
                  currentUser={currentUser}
                  currentUserEmail={currentUser?.email || null}
                  currentUserName={currentUser?.username || null}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </main>

      <Footer />

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}
    </>
  );
}
