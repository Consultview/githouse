import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Importação necessária para o menu aparecer
import './styles/servicoshome.css';

export default function ServicosHome() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sessionData = localStorage.getItem('cityhouse_session');
    
    if (sessionData) {
      const session = JSON.parse(sessionData);
      const agora = new Date().getTime();
      const quinzeMinutos = 15 * 60 * 1000;

      if (agora - new Date(session.login_at).getTime() > quinzeMinutos) {
        localStorage.removeItem('cityhouse_session');
        setUser(null);
        navigate('/login');
      } else {
        setUser(session);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const servicos = [
    { nome: "Dashboard", rota: "/dashboard", cor: "#0f172a" },
    { nome: "Condomínios", rota: "/condominios", cor: "#2563eb" },
    { nome: "Portaria", rota: "/portaria", cor: "#10b981" },
    { nome: "Chamados", rota: "/chamados", cor: "#f59e0b" },
    { nome: "Reservas", rota: "/reservas", cor: "#8b5cf6" },
    { nome: "Avisos", rota: "/avisos", cor: "#ef4444" },
    { nome: "Pets", rota: "/pets", cor: "#06b6d4" },
    { nome: "Emergências", rota: "/panico", cor: "#dc2626" },
    
    { nome: "Usuários", rota: "/usuarios", cor: "#64748b" },

        { nome: "Configurações", rota: "/configuracoes", cor: "#f59e0b" }
  ];

  if (!user) return null;

  return (
    <div className="sh-layout-root">
      {/* Sidebar agora recebe o user, então os itens do menu aparecem */}
      <Sidebar 
        user={user} 
        isOpen={menuOpen} 
        toggleMenu={() => setMenuOpen(!menuOpen)} 
      />

      <main className="sh-container">
        <header className="sh-header-clean">
          <div className="sh-badge-large">Acesso Rápido</div>
        </header>

        <div className="sh-grid">
          {servicos.map((s, i) => (
            <Link key={i} to={s.rota} className="sh-card">
              <span className="sh-card-name">{s.nome}</span>
              <div className="sh-card-line" style={{ backgroundColor: s.cor }}></div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
