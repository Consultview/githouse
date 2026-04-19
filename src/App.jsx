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

// Páginas de Módulos Específicos
import Chamados from './pages/Chamados';
import DetalheChamado from './pages/DetalheChamado';
import Reservas from './pages/Reservas';
import PanicoHome from './pages/PanicoHome';
import PetsHome from './pages/PetsHome';
import PortariaHome from './pages/PortariaHome';
import AvisosHome from './pages/AvisosHome';

// Páginas do Módulo Moradores (Gestão Administrativa)
import Moradores from './pages/morador/Moradores';
import Validacaodocumentos from './pages/morador/Validacaodocumentos';

import './global.css';

// COMPONENTE DO BANNER DE INSTALAÇÃO (PWA)
function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    });
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
      position: 'fixed', bottom: '20px', left: '10px', right: '10px',
      background: '#1a1a1a', color: 'white', padding: '15px',
      borderRadius: '12px', zIndex: 9999, display: 'flex',
      flexDirection: 'column', gap: '10px', border: '1px solid #333',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.5)'
    }}>
      <div style={{ fontSize: '14px', fontWeight: '500' }}>
        🏠 Adicionar CityHouse à tela inicial?
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={handleInstall} style={{
          flex: 1, background: '#fff', color: '#000', border: 'none',
          padding: '8px', borderRadius: '6px', fontWeight: 'bold'
        }}>Instalar agora</button>
        <button onClick={() => setShowBanner(false)} style={{
          flex: 1, background: '#333', color: '#fff', border: 'none',
          padding: '8px', borderRadius: '6px'
        }}>Depois</button>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const sessionData = localStorage.getItem('cityhouse_session');
    if (sessionData) {
      setUser(JSON.parse(sessionData));
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <BrowserRouter>
      <>
        {/* Banner PWA */}
        <InstallBanner />

        <div className="app-main-layout">
          <Sidebar isOpen={isMenuOpen} toggleMenu={toggleMenu} user={user} />

          <main className="app-content">
            <Routes>
              {/* Rotas Públicas e Principais */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/dashboard/" element={<Dashboard />} />
              <Route path="/servicos/" element={<ServicosHome user={user} />} />
              
              {/* Gestão de Acessos e Sistema */}
              <Route path="/usuarios/" element={<Usuarios />} />
              <Route path="/condominios/" element={<Condominios />} />
              <Route path="/acessos/" element={<Acessos />} />
              <Route path="/configuracoes/" element={<Configuracoes />} />

              {/* Módulos Operacionais */}
              <Route path="/chamados/" element={<Chamados user={user} />} />
              <Route path="/detalhe/:id" element={<DetalheChamado user={user} />} />
              <Route path="/reservas/" element={<Reservas />} />
              <Route path="/pets" element={<PetsHome />} />
              <Route path="/portaria/" element={<PortariaHome />} />
              <Route path="/panico/" element={<PanicoHome />} />
              <Route path="/avisos/" element={<AvisosHome />} />

              {/* Módulos de Moradores e Gestão Administrativa */}
              <Route path="/morador/" element={<Moradores />} />
              <Route path="/validacao/" element={<Validacaodocumentos />} />
             
              
            </Routes>
          </main>
        </div>
        <Footer />
      </>
    </BrowserRouter>
  );
}
