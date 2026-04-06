import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './styles/servicoshome.css';
import { useAuth } from '../hooks/useAuth';

export default function AvisosHome() {
 
  const { user, loadingAuth } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const modulos = [
    { nome: "Comunicados Oficiais", rota: "/avisos/oficiais", cor: "#e74c3c" },
    { nome: "Manutenções", rota: "/avisos/manutencao", cor: "#f1c40f" },
    { nome: "Classificados", rota: "/avisos/comunidade", cor: "#2ecc71" },
    { nome: "Documentos e Atas", rota: "/avisos/documentos", cor: "#3498db" },
    { nome: "Novo Comunicado", rota: "/avisos/novo", cor: "#34495e" }
  ];

  // 3. Importante: Impede a renderização enquanto a sessão está sendo carregada
  if (loadingAuth) {
    return <div className="loading">Carregando...</div>;
  }

  // Se após carregar não houver usuário, o useAuth já deve ter feito o push para /login
  if (!user) return null;

  return (
    <div className="sh-layout-root">
      <Sidebar
        user={user}
        isOpen={menuOpen}
        toggleMenu={() => setMenuOpen(!menuOpen)}
      />

      <main className="sh-container">
        <header className="sh-header-clean">
          <div className="sh-badge-large">Mural de Avisos</div>
        </header>

        <div className="sh-grid">
          {modulos.map((m, i) => (
            <Link key={i} to={m.rota} className="sh-card">
              <span className="sh-card-name">{m.nome}</span>
              <div
                className="sh-card-line"
                style={{ backgroundColor: m.cor }}
              ></div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
