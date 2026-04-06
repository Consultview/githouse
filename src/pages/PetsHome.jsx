import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './styles/servicoshome.css'; 
import { useAuth } from	'../hooks/useAuth';


export default function PetsHome() {
	const { user, loadingAuth } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const acoes = [
    { nome: "Meus Pets", rota: "/pets/cadastro", cor: "#06b6d4" },
    { nome: "Carteira de Vacinação", rota: "/pets/vacinas", cor: "#10b981" },
    { nome: "Pet Perdido/Achado", rota: "/pets/alertas", cor: "#ef4444" },
    { nome: "Regras do Pet", rota: "/pets/normas", cor: "#64748b" }
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
          <div className="sh-badge-large">Espaço Pet CityHouse</div>
        </header>

        <div className="sh-grid">
          {acoes.map((a, i) => (
            <Link key={i} to={a.rota} className="sh-card">
              <span className="sh-card-name">{a.nome}</span>
              <div className="sh-card-line" style={{ backgroundColor: a.cor }}></div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
