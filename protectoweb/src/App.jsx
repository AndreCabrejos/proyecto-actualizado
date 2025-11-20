import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import Home from "./pages/Home";
import Nosotros from "./pages/Nosotros";
import TyC from "./pages/TyC";
import StreamerPage from "./pages/StreamerPage"; // Importar StreamerPage
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

  const handleLogin = (email, password) => {
    if (email === "streamer@streamoria.com" && password === "1234") {
      setIsLoggedIn(true);
      setUserRole("streamer");
      setShowLogin(false);
      navigate("/streamer"); // Redirigir al dashboard del streamer
    } else if (email === "viewer@streamoria.com" && password === "1234") {
      setIsLoggedIn(true);
      setUserRole("viewer");
      setShowLogin(false);
      navigate('/');
    } else {
      console.error("Credenciales incorrectas");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
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
            // Agrega aquí todas las sub-rutas si las implementas en el futuro
            <Route path="/streamer/*" element={<StreamerPage />} /> 
          )}
          {isLoggedIn && userRole === 'viewer' && (
            <>
            <Route
              path="/viewer/:canal"
              element={<ViewerPage monedas={monedas} setMonedas={setMonedas} />}
            />
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
