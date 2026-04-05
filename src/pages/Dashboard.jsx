import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/home.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  // Estado para armazenar os dados filtrados
  const [stats, setStats] = useState({
    pendentes: 0,
    emAtendimento: 0,
    aguardando: 0,
    finalizados: 0,
    cancelados: 0
  });

  useEffect(() => {
    const sessionData = localStorage.getItem('cityhouse_session');
    
    if (sessionData) {
      const session = JSON.parse(sessionData);
      setUser(session);
      
      // FUNÇÃO DE CARREGAMENTO COM FILTRO
      fetchDashboardData(session); 
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchDashboardData = (currentUser) => {
    // 1. Aqui simulamos a busca do Banco de Dados
    // No futuro, você enviará o currentUser.condominio_id para o seu Backend
    const todosChamados = [
      { id: 1, status: 'pendente', condominio_id: 101 },
      { id: 2, status: 'finalizado', condominio_id: 102 },
      { id: 3, status: 'pendente', condominio_id: 101 },
      { id: 4, status: 'em_atendimento', condominio_id: 101 },
    ];

    // 2. LÓGICA DE FILTRO: 
    // Se o cargo for 'ADM', vê tudo. Se não, filtra pelo ID do condomínio do usuário.
    const chamadosVisiveis = currentUser.role === 'ADM' 
      ? todosChamados 
      : todosChamados.filter(c => c.condominio_id === currentUser.condominio_id);

    // 3. Contagem dos Status
    setStats({
      pendentes: chamadosVisiveis.filter(c => c.status === 'pendente').length,
      emAtendimento: chamadosVisiveis.filter(c => c.status === 'em_atendimento').length,
      aguardando: chamadosVisiveis.filter(c => c.status === 'aguardando').length,
      finalizados: chamadosVisiveis.filter(c => c.status === 'finalizado').length,
      cancelados: chamadosVisiveis.filter(c => c.status === 'cancelado').length,
    });
  };

  return (
    <div className="ch-app-wrapper">
      <Sidebar user={user} isOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />

      <main className="ch-main-content">
        <header className="container" style={{ marginTop: '2rem' }}>
          <h1>Dashboard {user?.role === 'ADM' ? 'Geral' : 'do Condomínio'}</h1>
          <p>
            {user?.role === 'ADM' 
              ? "Visualizando dados de todos os clientes." 
              : `Resumo da unidade: ${user?.condominio_nome || 'Seu Condomínio'}`}
          </p>
        </header>

        <section className="features-grid container">
          {/* O Card só exibe o número se houver permissão/dados */}
          <div className="feature-card border-pendente">
            <h3>Pendentes</h3>
            <div className="status-number">{stats.pendentes}</div>
          </div>

          <div className="feature-card border-atendimento">
            <h3>Em Atendimento</h3>
            <div className="status-number">{stats.emAtendimento}</div>
          </div>

          <div className="feature-card border-finalizado">
            <h3>Finalizados</h3>
            <div className="status-number">{stats.finalizados}</div>
          </div>

          {/* Se for ADM, talvez você queira mostrar um card extra de faturamento ou total */}
          {user?.role === 'ADM' && (
            <div className="feature-card border-adm">
              <h3>Total Global</h3>
              <div className="status-number">
                {stats.pendentes + stats.emAtendimento + stats.finalizados}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
