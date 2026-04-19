import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import NaoAutorizado from '../../components/NaoAutorizado';
import '../styles/servicoshome.css';
import { useAuth } from '../../hooks/useAuth';

export default function Moradores() {
  const { user, loadingAuth } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moduloBloqueado, setModuloBloqueado] = useState(null);

  // Módulos com rotas ajustadas para o App.jsx
  const modulos = [
    { 
      nome: "Aprovação de Documentos", 
      rota: "/validacao/", // Ajustado de /aprovacao/ para /validacao/
      cor: "#10b981", 
      liberado: true 
    },
    { 
      nome: "Pagamentos e Cobranças", 
      rota: "/moradores/financeiro/", 
      cor: "#059669", 
      liberado: false 
    },
    { 
      nome: "Contratos e Fornecedores", 
      rota: "/moradores/contratos/", 
      cor: "#2563eb", 
      liberado: false 
    },
    { 
      nome: "Multas e Advertências", 
      rota: "/moradores/multas/", 
      cor: "#dc2626", 
      liberado: false 
    },
    { 
      nome: "Gestão de Unidades", 
      rota: "/moradores/unidades/", 
      cor: "#64748b", 
      liberado: false
    }
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
            <div className="sh-badge-large">
              Módulo de Moradores - {user?.nome_condominio?.toUpperCase() || "SISTEMA"}
            </div>
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
