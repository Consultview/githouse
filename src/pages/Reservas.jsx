import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './styles/servicoshome.css'; // Usando o mesmo CSS do primeiro exemplo

export default function ReservasHome({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const modulos = [
    { nome: "Minhas Reservas", rota: "/reservas/lista", cor: "#8b5cf6" },
    { nome: "Nova Reserva", rota: "/reservas/novo", cor: "#10b981" },
    { nome: "Gestão de Espaços", rota: "/reservas/locais", cor: "#2563eb" },
    { nome: "Lista de Convidados", rota: "/reservas/convidados", cor: "#f59e0b" }
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
          <div className="sh-badge-large">Módulo de Reservas</div>
        </header>

        <div className="sh-grid">
          {modulos.map((m, i) => (
            <Link key={i} to={m.rota} className="sh-card">
              <span className="sh-card-name">{m.nome}</span>
              <div className="sh-card-line" style={{ backgroundColor: m.cor }}></div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
