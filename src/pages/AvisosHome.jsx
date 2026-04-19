import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NaoAutorizado from '../components/NaoAutorizado';
import './styles/servicoshome.css';
import { useAuth } from '../hooks/useAuth';

export default function AvisosHome() {
  const { user, loadingAuth } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moduloBloqueado, setModuloBloqueado] = useState(null); // Estado para controlar o clique

  const modulos = [
    { nome: "Comunicados Oficiais", rota: "/avisos/oficiais", cor: "#e74c3c", liberado: false },
    { nome: "Manutenções", rota: "/avisos/manutencao", cor: "#f1c40f", liberado: false },
    { nome: "Classificados", rota: "/avisos/comunidade", cor: "#2ecc71", liberado: false },
    { nome: "Novo Comunicado", rota: "/avisos/novo", cor: "#34495e", liberado: false }
  ];

  if (loadingAuth) return <div className="loading">Carregando...</div>;
  if (!user) return null;

  return (
    <div className="sh-layout-root">
      <Sidebar 
        user={user} 
        isOpen={menuOpen} 
        toggleMenu={() => setMenuOpen(!menuOpen)} 
      />

      {/* Se algum módulo foi clicado e está bloqueado, mostra o aviso. Senão, mostra o grid. */}
      {moduloBloqueado ? (
        <NaoAutorizado 
          moduloNome={moduloBloqueado} 
          aoVoltar={() => setModuloBloqueado(null)} 
        />
      ) : (
        <main className="sh-container">
          <header className="sh-header-clean">
            <div className="sh-badge-large">Mural de Avisos</div>
          </header>

          <div className="sh-grid">
            {modulos.map((m, i) => (
              m.liberado ? (
                /* Card Liberado: Navega normalmente */
                <Link key={i} to={m.rota} className="sh-card">
                  <span className="sh-card-name">{m.nome}</span>
                  <div className="sh-card-line" style={{ backgroundColor: m.cor }}></div>
                </Link>
              ) : (
                /* Card Bloqueado: Ativa a tela de solicitação */
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
