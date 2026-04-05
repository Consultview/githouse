import { useState, useEffect } from 'react';
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
              <h3>Gestão Inteligente de Imóveis.</h3>
              <p>Reduza custos operacionais e aumente a satisfação dos moradores com a plataforma CityHouse.</p>
              
           
            </div>
            
          </div>
        </section>

        <section className="features-grid container">
          <div className="feature-card">
            <div className="icon">🏠</div>
            <h3>Experiência do Morador</h3>
            <p>Abertura de chamados via app com anexos e notificações em tempo real. Menos burocracia, mais agilidade.</p>
          </div>
          <div className="feature-card">
            <div className="icon">🛠️</div>
            <h3>Eficiência Técnica</h3>
            <p>Gestão de ordens de serviço e histórico de manutenções preventivas para evitar gastos imprevistos.</p>
          </div>
          <div className="feature-card">
            <div className="icon">📊</div>
            <h3>Visão Estratégica</h3>
            <p>Dashboards analíticos para síndicos e administradoras tomarem decisões baseadas em dados reais.</p>
          </div>
        </section>

        <section className="trust-bar">
          <p>Utilizado por grandes condomínios para otimizar a gestão diária.</p>
        </section>
      </main>
    </div>
  );
}
