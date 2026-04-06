import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './styles/servicoshome.css';
import { useAuth } from '../hooks/useAuth';

export default function ConfigSistemaProfissional() {
  const { user, loadingAuth } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const modulosConfig = [
    // SEGURANÇA E ACESSO (O CORE DO SISTEMA)
    { nome: "Logs de Sessão e Acesso", rota: "/admin/logs-acesso", cor: "#1e293b" },
    { nome: "Gestão de Perfis e Permissões", rota: "/admin/roles", cor: "#ef4444" },
    
    // CUSTOMIZAÇÃO E UI
    { nome: "Configurações de Visualização", rota: "/admin/ui-settings", cor: "#8b5cf6" },
    { nome: "Visibilidade de Módulos", rota: "/admin/modulos-visiveis", cor: "#f59e0b" },

    // REGRAS E PARÂMETROS GLOBAIS
    { nome: "Parâmetros do Sistema", rota: "/admin/parametros-globais", cor: "#10b981" },
    { nome: "Dicionário de Dados / Labels", rota: "/admin/labels", cor: "#06b6d4" },

    // AUDITORIA E COMPLIANCE
    { nome: "Trilha de Auditoria (Logs de Ações)", rota: "/admin/audit-trail", cor: "#6366f1" },
    { nome: "Políticas de Segurança e LGPD", rota: "/admin/compliance", cor: "#475569" }
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
