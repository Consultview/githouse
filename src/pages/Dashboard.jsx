import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NaoAutorizado from '../components/NaoAutorizado';
import './styles/servicoshome.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [moduloBloqueado, setModuloBloqueado] = useState(null);

  // Módulos de Relatórios solicitados
  const relatorios = [
    { nome: "Relatório Financeiro", rota: "/dashboard/financeiro", cor: "#0f172a", liberado: false },
    { nome: "Relatório de Chamados", rota: "/dashboard/chamados", cor: "#f59e0b", liberado: false },
    { nome: "Relatório de Reservas", rota: "/dashboard/reservas", cor: "#8b5cf6", liberado: false },
    { nome: "Relatório Geral", rota: "/dashboard/geral", cor: "#2563eb", liberado: false }
  ];

  useEffect(() => {
    const sessionData = localStorage.getItem('cityhouse_session');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      setUser(session);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) return null;

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
            <div className="sh-badge-large">
              Dashboard {user?.role === 'ADM' ? 'Geral' : 'do Condomínio'}
            </div>
          </header>

          <div className="sh-grid">
            {relatorios.map((r, i) => (
              r.liberado ? (
                <Link key={i} to={r.rota} className="sh-card">
                  <span className="sh-card-name">{r.nome}</span>
                  <div className="sh-card-line" style={{ backgroundColor: r.cor }}></div>
                </Link>
              ) : (
                <div 
                  key={i} 
                  className="sh-card" 
                  onClick={() => setModuloBloqueado(r.nome)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="sh-card-name">{r.nome}</span>
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
