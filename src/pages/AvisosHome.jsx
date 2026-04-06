import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './home.css';

export default function AvisosHome({ user }) {
  const navigate = useNavigate();

  const acoesAvisos = [
    {
      titulo: "Comunicados Oficiais",
      descricao: "Avisos importantes da administração e do síndico.",
      icon: "📢",
      rota: "/avisos/oficiais",
      cor: "#e74c3c" // Vermelho para urgência
    },
    {
      titulo: "Manutenções Programadas",
      descricao: "Calendário de limpeza de caixas d'água, dedetização e elevadores.",
      icon: "🔧",
      rota: "/avisos/manutencao",
      cor: "#f1c40f" // Amarelo para atenção
    },
    {
      titulo: "Classificados e Eventos",
      descricao: "Espaço para moradores anunciarem itens ou eventos sociais.",
      icon: "🤝",
      rota: "/avisos/comunidade",
      cor: "#2ecc71" // Verde para social
    },
    {
      titulo: "Novo Comunicado",
      descricao: "Criar um novo aviso para todo o condomínio (Acesso Admin).",
      icon: "✍️",
      rota: "/avisos/novo",
      cor: "#34495e" // Escuro para gestão
    }
  ];

  return (
    <div className="ch-app-wrapper">
      <Sidebar user={user} />
      
      <main className="ch-main-content">
        <section className="hero-section">
          <div className="container">
            <div className="marketing-hero">
              <span className="badge-live" style={{background: '#e74c3c', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem'}}>Atualizado agora</span>
              <h3 style={{marginTop: '10px'}}>Quadro de Avisos</h3>
              <p>Fique por dentro de tudo o que acontece no CityHouse.</p>
            </div>
          </div>
        </section>

        <section className="features-grid container">
          {acoesAvisos.map((item, index) => (
            <div 
              key={index} 
              className="feature-card" 
              onClick={() => navigate(item.rota)}
              style={{ cursor: 'pointer', borderTop: `4px solid ${item.cor}` }}
            >
              <div className="icon" style={{fontSize: '2.5rem', marginBottom: '10px'}}>{item.icon}</div>
              <h3>{item.titulo}</h3>
              <p>{item.descricao}</p>
              <button className="btn-link" style={{background: 'none', border: 'none', color: item.cor, fontWeight: 'bold', padding: '0', marginTop: '10px', cursor: 'pointer'}}>
                Ver detalhes →
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
