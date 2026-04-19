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

      // Validação de expiração de sessão
      if (agora - new Date(session.login_at).getTime() > quinzeMinutos) {
        localStorage.removeItem('cityhouse_session');
        setUser(null);
        navigate('/login', { replace: true });
      } else {
        setUser(session);
      }
    } else {
      // Se não houver sessão, limpa estado e redireciona
      setUser(null);
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Lista mestre com todos os módulos disponíveis
  const allServicos = [
    { id: 'pani', nome: "Protocolo de Pânico", rota: "/panico", cor: "#dc2626" },
    { id: 'dash', nome: "Dashboard", rota: "/dashboard", cor: "#0f172a" },
    { id: 'cond', nome: "Condomínios", rota: "/condominios", cor: "#2563eb" },
    { id: 'port', nome: "Portaria", rota: "/portaria", cor: "#10b981" },
    { id: 'cham', nome: "Chamados", rota: "/chamados", cor: "#f59e0b" },
    { id: 'resv', nome: "Reservas", rota: "/reservas", cor: "#8b5cf6" },
    { id: 'avis', nome: "Avisos", rota: "/avisos", cor: "#ef4444" },
    { id: 'mora', nome: "Morador", rota: "/morador", cor: "#ef4444" },
    { id: 'pets', nome: "Pets", rota: "/pets", cor: "#10b981" },
    { id: 'user', nome: "Usuários", rota: "/usuarios", cor: "#64748b" },
    { id: 'conf', nome: "Configurações", rota: "/configuracoes", cor: "#f59e0b" }
  ];

  // 1. Filtra por permissão e 2. Ordena de A a Z
  const servicosFiltrados = allServicos
    .filter(servico => {
      if (!user) return false;

      // ADM (Perfil 1) visualiza todos os módulos
      if (Number(user.perfil) === 1) return true;

      // Verifica se o módulo específico está marcado como 'p_ver' no banco
      const permissao = user.permissoes?.find(p => p.modulo_id === servico.id);
      return permissao?.p_ver === true;
    })
    .sort((a, b) => a.nome.localeCompare(b.nome)); // ✅ Ordenação Alfabética aplicada

  // Bloqueio de renderização caso o usuário tenha deslogado
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
          <div className="sh-badge-large">
            Acesso Rápido - {user.nome_condominio?.toUpperCase()}
          </div>
        </header>

        <div className="sh-grid">
          {servicosFiltrados.map((s, i) => (
            <Link key={i} to={s.rota} className="sh-card">
              <span className="sh-card-name">{s.nome}</span>
              <div 
                className="sh-card-line" 
                style={{ backgroundColor: s.cor }}
              ></div>
            </Link>
          ))}

          {/* Feedback caso o usuário não tenha nenhum acesso liberado */}
          {servicosFiltrados.length === 0 && (
            <p style={{
              color: '#64748b', 
              gridColumn: '1/-1', 
              textAlign: 'center', 
              marginTop: '40px',
              fontWeight: '600'
            }}>
              Nenhum módulo liberado. Contate o administrador do sistema.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
