import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './home.css';

export default function PetsHome({ user }) {
  const navigate = useNavigate();

  const acoes = [
    {
      titulo: "Meus Pets",
      descricao: "Cadastre fotos, raças e informações de saúde dos seus animais.",
      icon: "🐕",
      rota: "/pets/cadastro"
    },
    {
      titulo: "Carteira de Vacinação",
      descricao: "Mantenha o histórico de vacinas atualizado para controle do prédio.",
      icon: "💉",
      rota: "/pets/vacinas"
    },
    {
      titulo: "Pet Perdido/Achado",
      descricao: "Emita um alerta para todos os vizinhos se seu pet fugiu.",
      icon: "🔍",
      rota: "/pets/alertas"
    },
    {
      titulo: "Regras do Pet",
      descricao: "Consulte as áreas permitidas e normas de limpeza e circulação.",
      icon: "📜",
      rota: "/pets/normas"
    }
  ];

  return (
    <div className="ch-app-wrapper">
      <Sidebar user={user} />
      <main className="ch-main-content">
        <section className="hero-section">
          <div className="container">
            <div className="marketing-hero">
              <h3>Espaço Pet CityHouse</h3>
              <p>Segurança para o seu melhor amigo e harmonia para o condomínio.</p>
            </div>
          </div>
        </section>

        <section className="features-grid container">
          {acoes.map((item, index) => (
            <div 
              key={index} 
              className="feature-card" 
              onClick={() => navigate(item.rota)}
              style={{ cursor: 'pointer', borderTop: '4px solid #27ae60' }}
            >
              <div className="icon">{item.icon}</div>
              <h3>{item.titulo}</h3>
              <p>{item.descricao}</p>
              <span style={{ color: '#27ae60', fontWeight: 'bold' }}>Acessar →</span>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
