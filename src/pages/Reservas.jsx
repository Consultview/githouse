import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './home.css'; // Reutilizando seus estilos de cards

export default function ReservasHome({ user }) {
  const navigate = useNavigate();

  const modulos = [
    {
      titulo: "Minhas Reservas",
      descricao: "Visualize, altere ou cancele seus agendamentos atuais.",
      icon: "📅",
      rota: "/reservas/lista"
    },
    {
      titulo: "Nova Reserva",
      descricao: "Reserve salão de festas, churrasqueira ou quadras.",
      icon: "➕",
      rota: "/reservas/novo"
    },
    {
      titulo: "Gestão de Espaços",
      descricao: "Cadastre novos locais e defina regras de uso (Admin).",
      icon: "🏗️",
      rota: "/reservas/locais"
    },
    {
      titulo: "Lista de Convidados",
      descricao: "Envie a lista de nomes para a portaria liberar o acesso.",
      icon: "👥",
      rota: "/reservas/convidados"
    }
  ];

  return (
    <div className="ch-app-wrapper">
      <Sidebar user={user} />
      
      <main className="ch-main-content">
        <section className="hero-section">
          <div className="container">
            <div className="marketing-hero">
              <h3>Módulo de Reservas</h3>
              <p>Gerencie os espaços comuns do condomínio de forma rápida e organizada.</p>
            </div>
          </div>
        </section>

        <section className="features-grid container">
          {modulos.map((item, index) => (
            <div 
              key={index} 
              className="feature-card" 
              onClick={() => navigate(item.rota)}
              style={{ cursor: 'pointer' }}
            >
              <div className="icon">{item.icon}</div>
              <h3>{item.titulo}</h3>
              <p>{item.descricao}</p>
              <button className="btn-acessar" style={{marginTop: '15px', border: 'none', background: '#e67e22', color: 'white', padding: '8px 15px', borderRadius: '4px'}}>
                Acessar
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
