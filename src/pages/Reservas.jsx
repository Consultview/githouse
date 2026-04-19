import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NaoAutorizado from '../components/NaoAutorizado';
import './styles/servicoshome.css';
import { useAuth } from '../hooks/useAuth';

export default function ReservasHome() {
  const { user, loadingAuth } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moduloBloqueado, setModuloBloqueado] = useState(null);

  const modulos = [
    { nome: "Minhas Reservas", rota: "/reservas/lista", cor: "#8b5cf6", liberado: false },
    { nome: "Nova Reserva", rota: "/reservas/novo", cor: "#10b981", liberado: false },
    { nome: "Gestão de Espaços", rota: "/reservas/locais", cor: "#2563eb", liberado: false },
    { nome: "Lista de Convidados", rota: "/reservas/convidados", cor: "#f59e0b", liberado: false }
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
            <div className="sh-badge-large">Módulo de Reservas</div>
          </header>

          <div className="sh-grid">
            {modulos.map((m, i) => (
              m.liberado ? (
                <Link key={i} to={m.rota} className="sh-card">
                  <span className="sh-card-name">{m.nome}</span>
                  <div className="sh-card-line" style={{ backgroundColor: m.cor }}></div>
                </Link>
              ) : (
                <div 
                  key={i} 
                  className="sh-card" 
                  onClick={() => setModuloBloqueado(m.nome)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="sh-card-name">{m.nome}</span>
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
