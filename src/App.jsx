import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Componentes Base
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Acessos from './components/Acessos';

// Páginas Gerais
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Condominios from './pages/Condominios';
import Configuracoes from './pages/Configuracoes';
import ServicosHome from './pages/ServicosHome';

// Operacional
import Chamados from './pages/Chamados';
import DetalheChamado from './pages/DetalheChamado';
import Reservas from './pages/Reservas';
import PanicoHome from './pages/PanicoHome';
import PetsHome from './pages/PetsHome';
import PortariaHome from './pages/PortariaHome';
import AvisosHome from './pages/AvisosHome';

// Moradores
import Moradores from './pages/morador/Moradores';
import ValidacaoDocumento from './pages/morador/ValidacaoDocumento';
import DetalheDocumento from './pages/morador/DetalheDocumento';
import Prontuario from './pages/morador/Prontuario';

// Estilo global
import './global.css';

// 🔥 Banner PWA
function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowBanner(false);
    }
  };

  if (!showBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '10px',
      right: '10px',
      background: '#1a1a1a',
      color: 'white',
      padding: '15px',
      borderRadius: '12px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      border: '1px solid #333'
    }}>
      <div style={{ fontSize: '14px', fontWeight: '500' }}>
        🏠 Adicionar CityHouse à tela inicial?
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={handleInstall} style={{
          flex: 1,
          background: '#fff',
          color: '#000',
          border: 'none',
          padding: '8px',
          borderRadius: '6px',
          fontWeight: 'bold'
        }}>
          Instalar
        </button>

        <button onClick={() => setShowBanner(false)} style={{
          flex: 1,
          background: '#333',
          color: '#fff',
          border: 'none',
          padding: '8px',
          borderRadius: '6px'
        }}>
          Depois
        </button>
      </div>
    </div>
  );
}

// 🚀 APP PRINCIPAL
export default function App() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const sessionData = localStorage.getItem('cityhouse_session');
    if (sessionData) {
      setUser(JSON.parse(sessionData));
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <BrowserRouter>

      <InstallBanner />

      <div className="app-main-layout">
        <Sidebar
          isOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          user={user}
        />

        <main className="app-content">
          <Routes>

            {/* Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/servicos" element={<ServicosHome user={user} />} />

            {/* Sistema */}
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/condominios" element={<Condominios />} />
            <Route path="/acessos" element={<Acessos />} />
            <Route path="/configuracoes" element={<Configuracoes />} />

            {/* Operacional */}
            <Route path="/chamados" element={<Chamados user={user} />} />
            <Route path="/detalhe/:id" element={<DetalheChamado user={user} />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/pets" element={<PetsHome />} />
            <Route path="/portaria" element={<PortariaHome />} />
            <Route path="/panico" element={<PanicoHome />} />
            <Route path="/avisos" element={<AvisosHome />} />

            {/* Moradores */}
            <Route path="/morador" element={<Moradores />} />

            {/* Documentos */}
            <Route path="/validacao" element={<ValidacaoDocumento />} />



         
            <Route path="/detalhedoc" element={<DetalheDocumento user={user} />} />
            
       
            {/* 🔥 PRONTUÁRIO CORRIGIDO */}
            <Route path="/prontuario" element={<Prontuario />} />

          </Routes>
        </main>
      </div>

      <Footer />
    </BrowserRouter>
  );
}
