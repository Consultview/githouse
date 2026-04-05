import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/sidebar.css';


export default function Sidebar({ isOpen, toggleMenu, user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('cityhouse_session');
    navigate('/login');
  };

  const goHome = () => {
    navigate('/');
    if (isOpen) toggleMenu();
  };

  const allMenuItems = [
    { path: '/', label: 'Início', roles: [1, 2, 3, 4] },
    { path: '/dashboard', label: 'Dashboard', roles: [1, 2, 3, 4] },
    { path: '/condominios', label: 'Condomínios', roles: [1] },
    { path: '/usuarios', label: 'Usuários/Empresas', roles: [1, 2] },
    { path: '/chamados', label: 'Chamados (Tickets)', roles: [1, 2, 3, 4] },
    { path: '/imoveis', label: 'Imóveis', roles: [1, 2] },
    { path: '/financeiro', label: 'Financeiro', roles: [1] },
    { path: '/reservas', label: 'Reservas', roles: [1, 2, 4] },
    { path: '/configuracoes', label: 'Configurações', roles: [1] },
  ];

  const filteredMenu = allMenuItems.filter(item => {
    if (!user || !user.perfil) return item.path === '/';
    return item.roles.includes(user.perfil);
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

          <div className="sidebar-user">
            <div className="user-info">
              <span className="user-name">{user?.nome || "Visitante"}</span>
              <span className="user-role">
                {user?.perfil === 1 ? "Administrador" :
                 user?.perfil === 2 ? "Gestor/Síndico" :
                 user?.perfil === 3 ? "Manutentor" :
                 user?.perfil === 4 ? "Morador" : "Acesso Público"}
              </span>
            </div>
          </div>

          <nav className="sidebar-nav">
            {filteredMenu.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({isActive}) =>
                  `nav-item ${isActive ? 'active' : ''} ${item.path === '/' ? 'nav-inicio' : ''}`
                }
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
