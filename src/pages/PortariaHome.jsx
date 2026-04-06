import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './home.css';

export default function PortariaHome({ user }) {
  const navigate = useNavigate();

  const acoesAcesso = [
    {
      titulo: "Registrar Entrada",
      descricao: "Check-in de visitantes, prestadores de serviço ou entregas.",
      icon: "🚗",
      rota: "/portaria/entrada"
    },
    {
      titulo: "Log de Acessos",
      descricao: "Histórico detalhado de quem entrou e saiu do condomínio.",
      icon: "📋",
      rota: "/portaria/historico"
    },
    {
      titulo: "Pré-Autorizados",
      descricao: "Lista de visitantes liberados antecipadamente pelos moradores.",
      icon: "✅",
      rota: "/portaria/autorizados"
    },
    {
      titulo: "Encomendas e Pacotes",
      descricao: "Gestão de recebimento de mercadorias e avisos aos moradores.",
      icon: "📦",
      rota: "/portaria/encomendas"
    }
  ];

  return (
    <div className="ch-app-wrapper">
      <Sidebar user={user} />
      
      <main className="ch-main-content">
        <section className="hero-section">
          <div className="container">
            <div className="marketing-hero">
              <span className="badge-live" style={{background: '#2ecc71', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem'}}>Monitoramento Ativo</span>
              <h3 style={{marginTop: '10px'}}>Controle de Portaria</h3>
              <p>Segurança integrada para o fluxo de pessoas e veículos.</p>
            </div>
          </div>
        </section>

        <section className="features-grid container">
          {acoesAcesso.map((item, index) => (
            <div 
              key={index} 
              className="feature-card" 
              onClick={() => navigate(item.rota)}
              style={{ cursor: 'pointer', borderLeft: '4px solid #2980b9' }}
            >
              <div className="icon">{item.icon}</div>
              <h3>{item.titulo}</h3>
              <p>{item.descricao}</p>
              <span style={{color: '#2980b9', fontWeight: 'bold', fontSize: '0.9rem'}}>Abrir Módulo →</span>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
