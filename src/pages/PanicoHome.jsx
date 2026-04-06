import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './styles/servicoshome.css';
import { useAuth } from '../hooks/useAuth';

export default function PanicoHome() {
const { user, loadingAuth } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const alertas = [
    { nome: "Emergência Médica", rota: "/panico/medico", cor: "#ef4444" },
    { nome: "Invasão / Suspeito", rota: "/panico/seguranca", cor: "#dc2626" },
    { nome: "Incêndio", rota: "/panico/fogo", cor: "#f97316" },
    { nome: "Vazamento de Gás", rota: "/panico/gas", cor: "#f59e0b" }
  ];

  return (
    <div className="sh-layout-root">
      <Sidebar 
        user={user} 
        isOpen={menuOpen} 
        toggleMenu={() => setMenuOpen(!menuOpen)} 
      />

      <main className="sh-container">
        <header className="sh-header-clean">
          <div className="sh-badge-large" style={{ backgroundColor: '#dc2626', color: 'white' }}>
            Central de Emergência
          </div>
        </header>

        <div className="sh-grid">
          {alertas.map((a, i) => (
            <Link key={i} to={a.rota} className="sh-card">
              <span className="sh-card-name">{a.nome}</span>
              <div className="sh-card-line" style={{ backgroundColor: a.cor }}></div>
            </Link>
          ))}
        </div>
        
        <p style={{ 
          marginTop: '20px', 
          fontSize: '0.85rem', 
          color: '#64748b', 
          textAlign: 'center',
          fontWeight: '500' 
        }}>
          O uso indevido gera multas. Acione apenas em caso de necessidade real.
        </p>
      </main>
    </div>
  );
}
