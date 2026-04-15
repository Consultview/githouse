import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
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

  // Lista mestre com o novo módulo 'Pets' adicionado (id: pets)
  const allServicos = [
    { id: 'dash', nome: "Dashboard", rota: "/dashboard", cor: "#0f172a" },
    { id: 'cond', nome: "Condomínios", rota: "/condominios", cor: "#2563eb" },
    { id: 'port', nome: "Portaria", rota: "/portaria", cor: "#10b981" },
    { id: 'cham', nome: "Chamados", rota: "/chamados", cor: "#f59e0b" },
    { id: 'resv', nome: "Reservas", rota: "/reservas", cor: "#8b5cf6" },
    { id: 'avis', nome: "Avisos", rota: "/avisos", cor: "#ef4444" },
    { id: 'pets', nome: "Pets", rota: "/pets", cor: "#10b981" }, // ✅ ADICIONADO
  
    
    { id: 'conf', nome: "Configurações", rota: "/configuracoes", cor: "#f59e0b" }
  ];

  // FILTRO DE SERVIÇOS: Só mostra o card se o usuário tiver p_ver = true
  const servicosFiltrados = allServicos.filter(servico => {
    if (!user) return false;

    // Perfil 1 (ADM) vê todos os cards
    if (Number(user.perfil) === 1) return true;

    // Busca a permissão 'p_ver' dentro do array salvo no login
    const permissao = user.permissoes?.find(p => p.modulo_id === servico.id);
    return permissao?.p_ver === true;
  });

  if (!user) return null;

  return (
    <div className="sh-layout-root">
      <Sidebar
        user={user}
        isOpen={menuOpen}
        toggleMenu={() => setMenuOpen(!menuOpen)}
      />

      <main className="sh-container">
        <header className="sh-header-clean">
          <div className="sh-badge-large">Acesso Rápido - {user.nome_condominio}</div>
        </header>

        <div className="sh-grid">
          {servicosFiltrados.map((s, i) => (
            <Link key={i} to={s.rota} className="sh-card">
              <span className="sh-card-name">{s.nome}</span>
              <div className="sh-card-line" style={{ backgroundColor: s.cor }}></div>
            </Link>
          ))}

          {/* Se a lista estiver vazia, mostra um aviso */}
          {servicosFiltrados.length === 0 && (
            <p style={{color: '#64748b', gridColumn: '1/-1', textAlign: 'center', marginTop: '20px'}}>
              Você não possui módulos liberados. Entre em contato com o administrador.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
