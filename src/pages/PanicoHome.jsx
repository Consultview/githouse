import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './home.css';

export default function PanicoHome({ user }) {
  const navigate = useNavigate();

  const alertas = [
    {
      titulo: "Emergência Médica",
      descricao: "Solicitar ajuda imediata para mal-estar, quedas ou acidentes domésticos.",
      icon: "🚑",
      rota: "/panico/medico",
      cor: "#e74c3c"
    },
    {
      titulo: "Invasão / Suspeito",
      descricao: "Alerta silencioso para a portaria sobre presença estranha ou coação.",
      icon: "🚨",
      rota: "/panico/seguranca",
      cor: "#c0392b"
    },
    {
      titulo: "Incêndio",
      descricao: "Notificar focos de fumaça ou fogo na unidade ou áreas comuns.",
      icon: "🔥",
      rota: "/panico/fogo",
      cor: "#d35400"
    },
    {
      titulo: "Vazamento de Gás",
      descricao: "Alerta urgente para evacuação e fechamento de registros.",
      icon: "🧪",
      rota: "/panico/gas",
      cor: "#f39c12"
    }
  ];

  return (
    <div className="ch-app-wrapper">
      <Sidebar user={user} />
      <main className="ch-main-content">
        <section className="hero-section" style={{ background: 'linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)' }}>
          <div className="container">
            <div className="marketing-hero">
              <h3 style={{ color: '#fff' }}>Central de Emergência</h3>
              <p style={{ color: '#fff' }}>O uso indevido gera multas. Acione apenas em caso de necessidade real.</p>
            </div>
          </div>
        </section>

        <section className="features-grid container">
          {alertas.map((item, index) => (
            <div 
              key={index} 
              className="feature-card" 
              onClick={() => navigate(item.rota)}
              style={{ cursor: 'pointer', border: `2px solid ${item.cor}`, textAlign: 'center' }}
            >
              <div className="icon" style={{ fontSize: '3rem' }}>{item.icon}</div>
              <h3 style={{ color: item.cor }}>{item.titulo}</h3>
              <p>{item.descricao}</p>
              <button style={{ background: item.cor, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', marginTop: '10px', fontWeight: 'bold' }}>
                ACIONAR AGORA
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
