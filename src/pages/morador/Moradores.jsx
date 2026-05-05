import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import NaoAutorizado from '../../components/NaoAutorizado';
import '../styles/servicoshome.css';
import { useAuth } from '../../hooks/useAuth';

export default function Moradores() {
  const { user, loadingAuth } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moduloBloqueado, setModuloBloqueado] = useState(null);

  // 🔐 normalização do perfil (seguro)
  const perfilUsuario = useMemo(() => {
    const p = Number(user?.perfil);
    return Number.isFinite(p) ? p : 99;
  }, [user]);

  // 🎯 regra clara de permissão
  const podeAprovar = perfilUsuario >= 1 && perfilUsuario <= 3;

  // 📦 módulos centralizados
  const modulos = useMemo(() => {
    return [
      {
        id: 'aprovacao',
        nome: "Aprovação de Documentos",
        rota: "/validacao",
        cor: "#10b981",
        liberado: podeAprovar,
        visivel: true
      },
      {
        id: 'prontuario',
        nome: "Documentos e Contratos",
        rota: "/prontuario",
        cor: "#2563eb",
        liberado: true,
        visivel: true
      },
      {
        id: 'pagamento',
        nome: "Pagamentos",
        rota: "/moradores/pagamento",
        cor: "#dc2626",
        liberado: false,
        visivel: true
      },

       {
          id: 'dashboard',
          nome: "Pagamentos",
          rota: "/moradores/dashboard",
          cor: "#dc2626",
          liberado: false,
          visivel: true
        }
 


      
    ];
  }, [podeAprovar]);

  // ⏳ loading
  if (loadingAuth) {
    return <div className="loading">Carregando informações...</div>;
  }

  // 🔒 segurança
  if (!user) {
    return <div className="loading">Usuário não encontrado. Faça login novamente.</div>;
  }

  return (
    <div className="sh-layout-root">
      <Sidebar
        user={user}
        isOpen={menuOpen}
        toggleMenu={() => setMenuOpen(prev => !prev)}
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
              Módulo de Moradores - {user?.nome_condominio?.toUpperCase() || "CONDOMÍNIO"}
            </div>
          </header>

          <div className="sh-grid">
            {modulos.map((m) => (
              m.liberado ? (
                <Link key={m.id} to={m.rota} className="sh-card">
                  <span className="sh-card-name">{m.nome}</span>
                  <div
                    className="sh-card-line"
                    style={{ backgroundColor: m.cor }}
                  />
                </Link>
              ) : (
                <div
                  key={m.id}
                  className="sh-card"
                  onClick={() => setModuloBloqueado(m.nome)}
                  style={{ cursor: 'pointer', opacity: 0.6 }}
                >
                  <span className="sh-card-name">{m.nome}</span>
                  <div
                    className="sh-card-line"
                    style={{ backgroundColor: '#cbd5e1' }}
                  />
                </div>
              )
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
