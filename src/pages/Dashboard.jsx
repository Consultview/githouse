import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NaoAutorizado from '../components/NaoAutorizado';
import './styles/servicoshome.css';

// --- COMPONENTE DE INDICADORES (O GRÁFICO MODERNO) ---
const DashPainel = () => {
  const stats = {
    condominios: { ativos: 75, inativos: 25 },
    usuarios: 45,
    moradores: 120,
    chamados: 85
  };

  const cardGraficoStyle = {
    background: '#fff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
      {/* Pizza - Condomínios */}
      <div style={cardGraficoStyle}>
        <h4 style={{ margin: '0 0 15px 0', color: '#64748b' }}>Condomínios</h4>
        <svg width="120" height="120" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="4" />
          <circle cx="18" cy="18" r="16" fill="none" stroke="#10b981" strokeWidth="4" 
            strokeDasharray={`${stats.condominios.ativos}, 100`} strokeLinecap="round" transform="rotate(-90 18 18)" />
          <text x="18" y="20.5" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1e293b">{stats.condominios.ativos}%</text>
        </svg>
        <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '10px' }}>Ativos no Sistema</span>
      </div>

      {/* Colunas - Usuários e Moradores */}
      <div style={cardGraficoStyle}>
        <h4 style={{ margin: '0 0 15px 0', color: '#64748b' }}>População</h4>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px', height: '100px', width: '100%', padding: '0 20px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: '#3b82f6', width: '100%', height: '40%', borderRadius: '4px' }}></div>
            <span style={{ fontSize: '10px', marginTop: '5px' }}>Usuários</span>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: '#8b5cf6', width: '100%', height: '90%', borderRadius: '4px' }}></div>
            <span style={{ fontSize: '10px', marginTop: '5px' }}>Moradores</span>
          </div>
        </div>
      </div>

      {/* Total de Chamados */}
      <div style={{ ...cardGraficoStyle, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff' }}>
        <h4 style={{ margin: '0', opacity: 0.9 }}>Total de Chamados</h4>
        <div style={{ fontSize: '42px', fontWeight: 'bold', margin: '10px 0' }}>{stats.chamados}</div>
        <div style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '11px' }}>
          Mês atual
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function Dashboard() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [moduloBloqueado, setModuloBloqueado] = useState(null);
  const [telaAtiva, setTelaAtiva] = useState('menu'); // 'menu' ou 'indicadores'

  const relatorios = [
    { nome: "Painel Indicadores", rota: "indicadores", cor: "#10b981", liberado: true },
    { nome: "Relatório Financeiro", rota: "/dashboard/financeiro", cor: "#0f172a", liberado: false },
    { nome: "Relatório de Chamados", rota: "/dashboard/chamados", cor: "#f59e0b", liberado: false },
    { nome: "Relatório de Reservas", rota: "/dashboard/reservas", cor: "#8b5cf6", liberado: false },
    { nome: "Relatório Geral", rota: "/dashboard/geral", cor: "#2563eb", liberado: false }
  ];

  useEffect(() => {
    const sessionData = localStorage.getItem('cityhouse_session');
    if (sessionData) {
      setUser(JSON.parse(sessionData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="sh-layout-root">
      <Sidebar user={user} isOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />

      {moduloBloqueado ? (
        <NaoAutorizado moduloNome={moduloBloqueado} aoVoltar={() => setModuloBloqueado(null)} />
      ) : (
        <main className="sh-container">
          <header className="sh-header-clean" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="sh-badge-large">
              {telaAtiva === 'menu' ? `Dashboard ${user?.role === 'ADM' ? 'Geral' : 'do Condomínio'}` : 'Painel de Indicadores'}
            </div>
            
            {telaAtiva !== 'menu' && (
              <button 
                onClick={() => setTelaAtiva('menu')}
                style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}
              >
                Voltar
              </button>
            )}
          </header>

          {telaAtiva === 'indicadores' ? (
            <DashPainel />
          ) : (
            <div className="sh-grid">
              {relatorios.map((r, i) => (
                <div
                  key={i}
                  className="sh-card"
                  onClick={() => {
                    if (!r.liberado) {
                      setModuloBloqueado(r.nome);
                    } else if (r.rota === 'indicadores') {
                      setTelaAtiva('indicadores');
                    } else {
                      navigate(r.rota);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="sh-card-name">{r.nome}</span>
                  <div className="sh-card-line" style={{ backgroundColor: r.liberado ? r.cor : '#cbd5e1' }}></div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}
