import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import Home from "./pages/Home";
import Nosotros from "./pages/Nosotros";
import TyC from "./pages/TyC";
import StreamerPage from "./pages/StreamerPage";
import ViewerPage from "./pages/ViewerPage";
import RegisterPage from "./pages/RegisterPage";
import ComprarMonedas from './pages/ComprarMonedas';
import PerfilPage from "./pages/PerfilPage";
import RecargarMonedas from './components/RecargarMonedasModal';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showRecargarModal, setShowRecargarModal] = useState(false);
  const [monedas, setMonedas] = useState(100); 
  const navigate = useNavigate();

  // 🔹 Nuevo handleLogin que llama al backend
  const handleLogin = async (email, password) => {
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.user.rol); // Guardar rol
        setIsLoggedIn(true);
        setUserRole(data.user.rol);
        setShowLogin(false);
        alert("Login correcto 🎉");

        // Redirige según rol
        if (data.user.rol === 'streamer') navigate("/streamer");
        else navigate('/');
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error en el login");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    navigate("/");
  };

  const manejarCompraMonedas = (cantidad) => {
    setMonedas(monedas + cantidad);
  };

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        userRole={userRole} 
        onLoginClick={() => setShowLogin(true)}
        onLogoutClick={handleLogout}
        monedas={monedas}
        onRecargarClick={() => setShowRecargarModal(true)} 
      />

      <main>
        <Routes>
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/tyc" element={<TyC />} />
          
          <Route path="/register" element={<RegisterPage />} /> 
          <Route path="/comprar" element={<ComprarMonedas onBuy={manejarCompraMonedas} />} />

          {/* Rutas protegidas para el streamer */}
          {isLoggedIn && userRole === 'streamer' && (
            <Route path="/streamer/*" element={<StreamerPage />} /> 
          )}

          {/* Rutas protegidas para el viewer */}
          {isLoggedIn && userRole === 'viewer' && (
            <>
              <Route path="/viewer/:canal" element={<ViewerPage monedas={monedas} setMonedas={setMonedas} />} />
              <Route path="/recargar" element={<RecargarMonedas />} />
            </>
          )}
        </Routes>
      </main>

      <Footer />

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}

      {showRecargarModal && (
        <RecargarMonedas 
          monedas={monedas} 
          setMonedas={setMonedas} 
          onClose={() => setShowRecargarModal(false)} 
        />
      )}
    </>
  );
}
