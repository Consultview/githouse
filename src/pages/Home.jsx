import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './home.css';

export default function Home() {
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
      } else {
        setUser(session);
      }
    }
  }, []);

  return (
    <div className="ch-app-wrapper">
      <Sidebar user={user} isOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />

      <main className="ch-main-content">
        <section className="hero-section">
          <div className="container">
            <div className="marketing-hero">
              <span className="badge-premium">Acesso Rápido</span>
              <h1>Gestão Inteligente de Imóveis.</h1>
              <p>Reduza custos operacionais e aumente a satisfação dos moradores com a plataforma CityHouse.</p>
              {!user && (
                <button className="btn-main" onClick={() => navigate('/login')}>Entrar no Sistema →</button>
              )}
            </div>
          </div>
        </section>

        <section className="bento-grid container">
          {/* 1. Dashboard (Largo) */}
          <div className="bento-card card-wide">
            <div className="card-inner">
              <span className="card-tag">BI & Analytics</span>
              <h3>Dashboard Estratégico</h3>
              <p>Métricas analíticas e visão estratégica da saúde do condomínio em tempo real para decisões precisas.</p>
            </div>
            <div className="card-line" style={{ background: '#0f172a' }}></div>
          </div>

          {/* 2. Portaria */}
          <div className="bento-card">
            <div className="card-inner">
              <span className="card-tag">Segurança</span>
              <h3>Portaria Digital</h3>
              <p>Controle rigoroso de acessos, visitantes e encomendas 24h.</p>
            </div>
            <div className="card-line" style={{ background: '#10b981' }}></div>
          </div>

          {/* 3. Chamados */}
          <div className="bento-card">
            <div className="card-inner">
              <span className="card-tag">Operação</span>
              <h3>Chamados</h3>
              <p>Tickets de manutenção com histórico e fotos para agilizar reparos.</p>
            </div>
            <div className="card-line" style={{ background: '#f59e0b' }}></div>
          </div>

          {/* 4. Pânico (Alto) */}
          <div className="bento-card card-tall">
            <div className="card-inner">
              <span className="card-tag urgent">Emergência</span>
              <h3>Protocolo de Pânico</h3>
              <p>Alerta instantâneo para situações críticas, garantindo resposta imediata da administração em segundos com total prioridade.</p>
            </div>
            <div className="card-line" style={{ background: '#dc2626' }}></div>
          </div>

          {/* 5. Condomínios */}
          <div className="bento-card">
            <div className="card-inner">
              <span className="card-tag">Gestão</span>
              <h3>Condomínios</h3>
              <p>Gestão completa de unidades, blocos e configurações estruturais.</p>
            </div>
            <div className="card-line" style={{ background: '#2563eb' }}></div>
          </div>

          {/* 6. Reservas */}
          <div className="bento-card">
            <div className="card-inner">
              <span className="card-tag">Social</span>
              <h3>Reservas</h3>
              <p>Agendamento online de áreas comuns eliminando conflitos de horários.</p>
            </div>
            <div className="card-line" style={{ background: '#8b5cf6' }}></div>
          </div>

          {/* 7. Avisos (Largo) */}
          <div className="bento-card card-wide">
            <div className="card-inner">
              <span className="card-tag">Comunicação</span>
              <h3>Mural Digital de Avisos</h3>
              <p>Comunicados oficiais e convocações com garantia de entrega e leitura confirmada para todos os moradores.</p>
            </div>
            <div className="card-line" style={{ background: '#ef4444' }}></div>
          </div>

          {/* 8. Pets */}
          <div className="bento-card">
            <div className="card-inner">
              <span className="card-tag">Animais</span>
              <h3>Gestão de Pets</h3>
              <p>Cadastro detalhado e controle de vacinação para convivência segura.</p>
            </div>
            <div className="card-line" style={{ background: '#06b6d4' }}></div>
          </div>

          {/* 9. Usuários */}
          <div className="bento-card">
            <div className="card-inner">
              <span className="card-tag">Acessos</span>
              <h3>Usuários</h3>
              <p>Níveis de permissão personalizados para síndicos e moradores.</p>
            </div>
            <div className="card-line" style={{ background: '#64748b' }}></div>
          </div>
        </section>

        <footer className="marketing-footer">
          <p>CityHouse • Tecnologia a serviço da convivência.</p>
        </footer>
      </main>
    </div>
  );
}
