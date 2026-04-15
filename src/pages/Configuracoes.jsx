import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './styles/servicoshome.css';
import { useAuth } from '../hooks/useAuth';
import Acessos from '../components/Acessos';

export default function ConfigSistemaProfissional() {
  const { user, loadingAuth } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const modulosConfig = [
    // SEGURANÇA E ACESSO (O CORE DO SISTEMA)
    { nome: "Logs de Sessão e Acesso", rota: "/logs/", cor: "#1e293b" },
    { nome: "Perfis e Permissões", rota: "/acessos/", cor: "#ef4444" },
    { nome: "Usuários", rota: "/usuarios/" , cor: "#64748b" },
    { nome: "Parâmetros do Sistema", rota: "/admin/parametros-globais", cor: "#10b981" },
    

    // AUDITORIA E COMPLIANCE
    { nome: "Auditoria (Logs de Ações)", rota: "/admin/audit-trail", cor: "#6366f1" }
  ];

  if (loadingAuth) return null;

  return (
    <div className="sh-layout-root">
      <Sidebar
        user={user}
        isOpen={menuOpen}
        toggleMenu={() => setMenuOpen(!menuOpen)}
      />

      <main className="sh-container">
        <header className="sh-header-clean">
          <div className="sh-badge-large">Console de Administração</div>
        </header>

        <div className="sh-grid">
          {modulosConfig.map((item) => (
            <Link key={item.rota} to={item.rota} className="sh-card">
              <span className="sh-card-name">{item.nome}</span>
              <div 
                className="sh-card-line" 
                style={{ backgroundColor: item.cor }}
              ></div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
