import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './sidebar.css';

export default function Sidebar({ isOpen, toggleMenu, user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('cityhouse_session');
    navigate('/login');
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

  const filteredMenu = allMenuItems.filter(item => {
    if (!user) return item.path === '/';
    if (Number(user.perfil) === 1) return true;
    if (item.path === '/servicos') return true;

    const permissao = user.permissoes?.find(p => String(p.modulo_id) === String(item.id));
    return (permissao?.p_ver === true || permissao?.p_ver === 1) || item.path === '/';
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

          {/* SEÇÃO DO USUÁRIO CENTRALIZADA E SEM ÍCONE */}
          <div className="sidebar-user" style={{ justifyContent: 'center' }}>
            <div className="user-info" style={{ textAlign: 'center', width: '100%', alignItems: 'center' }}>
              
              {/* NOME DO CONDOMÍNIO ACIMA */}
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

              <span className="user-name" style={{ display: 'block' }}>
                {user?.nome || "Usuário"}
              </span>
              
              <span className="user-role" style={{ display: 'block' }}>
                {user?.perfil === 1 ? "Administrador" :
                 user?.perfil === 2 ? "Suporte" :
                 user?.perfil === 3 ? "Gestor" :
                 user?.perfil === 4 ? "Técnico" :
                 user?.perfil === 5 ? "Morador" : "Acesso Restrito"}
              </span>
            </div>
          </div>

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

            {!user?.id && (
               <NavLink to="/login" className="nav-item btn-login-nav">
                 <span className="label">Entrar no Sistema</span>
               </NavLink>
            )}
          </nav>

          {user?.id && (
            <div className="sidebar-footer">
              <button onClick={handleLogout} className="btn-logout">
                Sair do Sistema
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
