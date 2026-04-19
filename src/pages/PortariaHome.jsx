import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import NaoAutorizado from '../components/NaoAutorizado';
import './styles/servicoshome.css';

export default function PortariaHome() {
  const { user, loadingAuth } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moduloBloqueado, setModuloBloqueado] = useState(null);

  const acoesAcesso = [
    { nome: "Registrar Entrada", rota: "/portaria/entrada", cor: "#10b981", liberado: false },
    { nome: "Log de Acessos", rota: "/portaria/historico", cor: "#2563eb", liberado: false },
    { nome: "Pré-Autorizados", rota: "/portaria/autorizados", cor: "#8b5cf6", liberado: false },
    { nome: "Encomendas e Pacotes", rota: "/portaria/encomendas", cor: "#f59e0b", liberado: false }
  ];

  if (loadingAuth) return <div className="loading">Carregando...</div>;

  return (
    <div className="sh-layout-root">
      <Sidebar
        user={user}
        isOpen={menuOpen}
        toggleMenu={() => setMenuOpen(!menuOpen)}
      />

      {moduloBloqueado ? (
        <NaoAutorizado 
          moduloNome={moduloBloqueado} 
          aoVoltar={() => setModuloBloqueado(null)} 
        />
      ) : (
        <main className="sh-container">
          <header className="sh-header-clean">
            <div className="sh-badge-large">Controle de Portaria</div>
          </header>

          <div className="sh-grid">
            {acoesAcesso.map((a, i) => (
              a.liberado ? (
                <Link key={i} to={a.rota} className="sh-card">
                  <span className="sh-card-name">{a.nome}</span>
                  <div className="sh-card-line" style={{ backgroundColor: a.cor }}></div>
                </Link>
              ) : (
                <div 
                  key={i} 
                  className="sh-card" 
                  onClick={() => setModuloBloqueado(a.nome)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="sh-card-name">{a.nome}</span>
                  <div className="sh-card-line" style={{ backgroundColor: '#cbd5e1' }}></div>
                </div>
              )
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
