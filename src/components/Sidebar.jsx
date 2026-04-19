import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './sidebar.css';

export default function Sidebar({ isOpen, toggleMenu, user }) {
  const navigate = useNavigate();

  // Informações de Governança de Software
  const SYS_DATA = {
    version: "2.0.1",
    license: "Enterprise",
    env: "Production",
    copyright: "© 2026 CITYHOUSE"
  };

  const handleLogout = () => {
    localStorage.removeItem('cityhouse_session');
    window.location.href = '/login'; 
  };

  const goHome = () => {
    navigate('/servicos');
    if (isOpen) toggleMenu();
  };

  const allMenuItems = [
    { id: 'serv', path: '/servicos', label: 'Serviços' },
    { id: 'dash', path: '/dashboard', label: 'Dashboard' },
    { id: 'cham', path: '/chamados', label: 'Chamados (Tickets)' },
    { id: 'resv', path: '/reservas', label: 'Reservas' },
    { id: 'cond', path: '/condominios', label: 'Condomínios' },
    { id: 'user', path: '/usuarios', label: 'Usuários' },
    { id: 'aces', path: '/acessos', label: 'Gestão de Acessos' },
    { id: 'conf', path: '/configuracoes', label: 'Configurações' },
    { id: 'home', path: '/', label: 'Sobre' },
  ];

  const filteredMenu = allMenuItems
    .filter(item => {
      if (!user) return item.path === '/';
      if (Number(user.perfil) === 1) return true;
      if (item.path === '/servicos' || item.path === '/') return true;

      const permissao = user.permissoes?.find(p => String(p.modulo_id) === String(item.id));
      return (permissao?.p_ver === true || permissao?.p_ver === 1);
    })
    .sort((a, b) => {
      if (a.id === 'serv') return -1;
      if (b.id === 'serv') return 1;
      if (a.id === 'home') return 1;
      if (b.id === 'home') return -1;
      return a.label.localeCompare(b.label);
    });

  return (
    <>
      <header className="ch-mobile-header">
        <div className="logo-full clickable" onClick={goHome}>
          City<span>House</span>
        </div>
        <button className="ch-hamburger-btn" onClick={toggleMenu}>
          <div className={`hamburger-icon ${isOpen ? 'open' : ''}`}></div>
        </button>
      </header>

      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={toggleMenu}></div>

      <aside className={`ch-sidebar-modern ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-container">

          <div className="sidebar-logo-area">
            <div className="logo-full clickable" onClick={goHome}>
              City<span>House</span>
            </div>
          </div>

          {user && user.id && (
            <div className="sidebar-user" style={{ justifyContent: 'center' }}>
              <div className="user-info" style={{ textAlign: 'center', width: '100%', alignItems: 'center' }}>
                {user?.nome_condominio && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '800',
                    color: '#3498db',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '4px',
                    letterSpacing: '0.5px'
                  }}>
                    {user.nome_condominio}
                  </span>
                )}
                <span className="user-name" style={{ display: 'block' }}>{user?.nome || "Usuário"}</span>
                <span className="user-role" style={{ display: 'block' }}>
                  {Number(user?.perfil) === 1 ? "Administrador" :
                   Number(user?.perfil) === 2 ? "Suporte" :
                   Number(user?.perfil) === 3 ? "Gestor" :
                   Number(user?.perfil) === 4 ? "Técnico" :
                   Number(user?.perfil) === 5 ? "Morador" : "Acesso Restrito"}
                </span>
              </div>
            </div>
          )}

          <nav className="sidebar-nav">
            {filteredMenu.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={() => window.innerWidth < 1025 && toggleMenu()}
              >
                <span className="label">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer" style={{ padding: '20px 15px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            {user && user.id && (
              <button onClick={handleLogout} className="btn-logout" style={{ width: '100%', marginBottom: '18px' }}>
                Sair do Sistema
              </button>
            )}
            
            {/* Metadata de Auditoria e Conformidade */}
            <div className="system-metadata" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94a3b8', fontWeight: 'bold' }}>
                <span>VERSÃO</span>
                <span style={{ color: '#1e293b' }}>{SYS_DATA.version}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94a3b8', fontWeight: 'bold' }}>
                <span>LICENÇA</span>
                <span style={{ color: '#1e293b' }}>{SYS_DATA.license}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94a3b8', fontWeight: 'bold' }}>
                <span>AMBIENTE</span>
                <span style={{ color: '#2563eb' }}>{SYS_DATA.env.toUpperCase()}</span>
              </div>
              
              <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '5px', paddingTop: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '9px', color: '#cbd5e1', fontWeight: '700', letterSpacing: '0.5px' }}>
                  {SYS_DATA.copyright}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
