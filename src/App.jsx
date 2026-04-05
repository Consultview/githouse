import React, { useState } from 'react'; // Importar o useState aqui
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Footer from './components/Footer';
import Usuarios from './pages/Usuarios';
import Condominios from './pages/Condominios';
import Dashboard from './pages/Dashboard';
import Chamados from './pages/Chamados';


import './styles/global.css';

export default function App() {

  const [user, setUser] = useState(null); 
  
  // ESTADO GLOBAL DO MENU: Centralizado aqui para não resetar
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <BrowserRouter>
      <div className="app-main-layout"> 
        
        {/* Passamos o estado e a função para a Sidebar */}
        <Sidebar 
          isOpen={isMenuOpen} 
          toggleMenu={toggleMenu} 
          user={user} 
        />

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/condominios" element={<Condominios />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chamados" element={<Chamados />} />
           
          </Routes>
        </main>

      </div>
      <Footer />
    </BrowserRouter>

    
  );
}
