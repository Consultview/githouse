import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NaoAutorizado from '../components/NaoAutorizado';
import './styles/servicoshome.css';
import { useAuth } from '../hooks/useAuth';

export default function PetsHome() {
  const { user, loadingAuth } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moduloBloqueado, setModuloBloqueado] = useState(null);

  const acoes = [
    { nome: "Meus Pets", rota: "/pets/cadastro", cor: "#06b6d4", liberado: false },
    { nome: "Carteira de Vacinação", rota: "/pets/vacinas", cor: "#10b981", liberado: false },
    { nome: "Pet Perdido/Achado", rota: "/pets/alertas", cor: "#ef4444", liberado: false },
    { nome: "Regras do Pet", rota: "/pets/normas", cor: "#64748b", liberado: false }
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
            <div className="sh-badge-large">Espaço Pet CityHouse</div>
          </header>

          <div className="sh-grid">
            {acoes.map((a, i) => (
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
