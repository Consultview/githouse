import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Componentes
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Usuarios from './pages/Usuarios';
import Condominios from './pages/Condominios';
import Dashboard from './pages/Dashboard';
import Chamados from './pages/Chamados';
import DetalheChamado from './pages/DetalheChamado';
import ServicosHome from './pages/ServicosHome';
import Reservas from './pages/Reservas';
import PanicoHome from './pages/PanicoHome';
import PetsHome from './pages/PetsHome';
import PortariaHome from './pages/PortariaHome';
import AvisosHome from './pages/AvisosHome';
import Configuracoes from './pages/Configuracoes';
import Acessos from './components/Acessos';

import './global.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ETAPA 1: Recuperar a sessão do localStorage para que as permissões funcionem
  useEffect(() => {
    const sessionData = localStorage.getItem('cityhouse_session');
    if (sessionData) {
      setUser(JSON.parse(sessionData));
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <BrowserRouter>
      <div className="app-main-layout">
        <Sidebar
          isOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          user={user}
        />

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Passar setUser para o Login conseguir autenticar o usuário */}
            <Route path="/login" element={<Login setUser={setUser} />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/condominios" element={<Condominios />} />
            <Route path="/acessos" element={<Acessos />} />

            {/* Módulos Específicos - Passando o user para garantir acesso às perms */}
            <Route path="/servicos" element={<ServicosHome user={user} />} />
            <Route path="/chamados" element={<Chamados user={user} />} />
            <Route path="/detalhe/:id" element={<DetalheChamado user={user} />} />
            
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/pets" element={<PetsHome />} />
            <Route path="/portaria" element={<PortariaHome />} />
            <Route path="/panico" element={<PanicoHome />} />
            <Route path="/avisos" element={<AvisosHome />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
