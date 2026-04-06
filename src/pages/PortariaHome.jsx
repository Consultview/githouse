import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import './styles/servicoshome.css';

export default function PortariaHome() {
  const {user, loadingAuth } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const acoesAcesso = [
    { nome: "Registrar Entrada", rota: "/portaria/entrada", cor: "#10b981" },
    { nome: "Log de Acessos", rota: "/portaria/historico", cor: "#2563eb" },
    { nome: "Pré-Autorizados", rota: "/portaria/autorizados", cor: "#8b5cf6" },
    { nome: "Encomendas e Pacotes", rota: "/portaria/encomendas", cor: "#f59e0b" }
  ];

  return (
    <div className="sh-layout-root">
      <Sidebar 
        user={user} 
        isOpen={menuOpen} 
        toggleMenu={() => setMenuOpen(!menuOpen)} 
      />

      <main className="sh-container">
        <header className="sh-header-clean">
          <div className="sh-badge-large">Controle de Portaria</div>
        </header>

        <div className="sh-grid">
          {acoesAcesso.map((a, i) => (
            <Link key={i} to={a.rota} className="sh-card">
              <span className="sh-card-name">{a.nome}</span>
              <div className="sh-card-line" style={{ backgroundColor: a.cor }}></div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
