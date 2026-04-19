import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NaoAutorizado from '../components/NaoAutorizado';
import './styles/servicoshome.css';
import { useAuth } from '../hooks/useAuth';
import { useAcessos } from '../hooks/useAcessos'; // Importado para checar permissões

export default function PanicoHome() {
  const { user, loadingAuth } = useAuth();
  const { permissoes, loading: loadingPerms, loadPerms } = useAcessos();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moduloBloqueado, setModuloBloqueado] = useState(null);

  // Carrega as permissões assim que o usuário e o condomínio estiverem disponíveis
  useEffect(() => {
    if (user?.id_condominio && user?.id_perfil) {
      loadPerms(user.id_condominio, user.id_perfil);
    }
  }, [user, loadPerms]);

  // Verifica se o módulo "pani" tem permissão de "Ver"
  const temAcessoGeral = !!permissoes['pani-Ver'];

  const alertas = [
    { nome: "Emergência Médica", rota: "/panico/medico", cor: "#ef4444" },
    { nome: "Invasão / Suspeito", rota: "/panico/seguranca", cor: "#dc2626" },
    { nome: "Incêndio", rota: "/panico/fogo", cor: "#f97316" },
    { nome: "Vazamento de Gás", rota: "/panico/gas", cor: "#f59e0b" }
  ];

  if (loadingAuth || loadingPerms) return <div className="loading">Carregando...</div>;

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
            <div className="sh-badge-large" style={{ backgroundColor: '#dc2626', color: 'white' }}>
              Central de Emergência
            </div>
          </header>

          <div className="sh-grid">
            {alertas.map((a, i) => (
              /* Agora checa a permissão dinâmica vinda do banco */
              temAcessoGeral ? (
                <Link key={i} to={a.rota} className="sh-card">
                  <span className="sh-card-name">{a.nome}</span>
                  <div className="sh-card-line" style={{ backgroundColor: a.cor }}></div>
                </Link>
              ) : (
                <div
                  key={i}
                  className="sh-card"
                  onClick={() => setModuloBloqueado("Pânico")}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="sh-card-name">{a.nome}</span>
                  <div className="sh-card-line" style={{ backgroundColor: '#cbd5e1' }}></div>
                </div>
              )
            ))}
          </div>

          <p style={{
            marginTop: '20px',
            fontSize: '0.85rem',
            color: '#64748b',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            O uso indevido gera multas. Acione apenas em caso de necessidade real.
          </p>
        </main>
      )}
    </div>
  );
}
