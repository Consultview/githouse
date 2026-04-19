import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { useUsuarios } from '../../hooks/useUsuarios';
import '../../pages/styles/usuarios.css';

// Componente de Badge com proteção para dados ausentes
function BadgePendencia({ label, ativa, color }) {
  // Se o dado não existir no banco (undefined ou null), tratamos como falso (cinza)
  const isAtiva = !!ativa; 
  return (
    <span style={{
      fontSize: '9px',
      padding: '3px 7px',
      borderRadius: '4px',
      backgroundColor: isAtiva ? color : '#f1f5f9',
      color: isAtiva ? '#ffffff' : '#94a3b8',
      fontWeight: '700',
      border: isAtiva ? 'none' : '1px solid #e2e8f0',
      transition: 'all 0.2s',
      opacity: isAtiva ? 1 : 0.5
    }}>
      {label}
    </span>
  );
}

export default function Validacaodocumentos() {
  const { user, loadingAuth } = useAuth();
  const { users, fetchData, loading } = useUsuarios();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // Filtragem segura: garante que users seja um array antes de filtrar
  const dadosFiltrados = Array.isArray(users) ? users.filter(u => {
    if (!user) return false;
    const perfilLogado = Number(user.perfil);
    
    // Regra: ADM/Suporte vêm tudo, Síndico vê o condomínio dele, Morador vê só ele
    if (perfilLogado <= 2) return true;
    if (perfilLogado === 3) return u.condominio_id === user.condominio_id;
    return u.id === user.id;
  }) : [];

  const verificarStatusDocumento = (dataAprovacao) => {
    if (!dataAprovacao) return { label: 'PENDENTE', class: 'inactive' };
    const hoje = new Date();
    const dataAprov = new Date(dataAprovacao);
    const diferencaDias = Math.floor((hoje - dataAprov) / (1000 * 60 * 60 * 24));
    
    return diferencaDias > 30 
      ? { label: 'EXPIRADO', class: 'inactive' } 
      : { label: 'VALIDADO', class: 'active' };
  };

  if (loadingAuth || loading) {
    return <div className="loading">Carregando dados do sistema...</div>;
  }

  return (
    <div className="ch-app-wrapper">
      <Sidebar user={user} isOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />

      <main className="ch-main-content">
        <div className="page-container">
          <header className="top-actions">
            <div className="title-block">
              <h1>
                {Number(user?.perfil) <= 3 
                  ? "Painel de Validação e Pendências" 
                  : "Meus Documentos e Situação"}
              </h1>
              <p>Condomínio: <strong>{user?.nome_condominio?.toUpperCase() || 'NÃO VINCULADO'}</strong></p>
            </div>
          </header>

          <div className="data-display-area anim-fade">
            <div className="table-responsive">
              <table className="standard-table">
                <thead>
                  <tr>
                    <th>MORADOR / LOCAL</th>
                    <th>STATUS (30 DIAS)</th>
                    <th>PENDÊNCIAS ATIVAS</th>
                    <th className="text-center">AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosFiltrados.length > 0 ? (
                    dadosFiltrados.map((m) => {
                      const statusDoc = verificarStatusDocumento(m.data_ultima_aprovacao);

                      return (
                        <tr key={m.id}>
                          <td>
                            <div className="user-info-cell">
                              <span className="text-bold">{m.nome || 'Usuário sem nome'}</span>
                              <small>
                                {m.bloco ? `Bloco ${m.bloco}` : ''} 
                                {m.numero_casa ? ` - Unidade ${m.numero_casa}` : ' S/N'}
                              </small>
                            </div>
                          </td>
                          <td>
                            <span className={`status-pill ${statusDoc.class}`}>
                              {statusDoc.label}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {/* O uso de ?? false garante que se a coluna não existir, o app não quebra */}
                              <BadgePendencia label="MULTA" ativa={m.tem_multa ?? false} color="#dc2626" />
                              <BadgePendencia label="ALUGUEL" ativa={m.pend_aluguel ?? false} color="#dc2626" />
                              <BadgePendencia label="LUZ" ativa={m.pend_luz ?? false} color="#f59e0b" />
                              <BadgePendencia label="ÁGUA" ativa={m.pend_agua ?? false} color="#2563eb" />
                              <BadgePendencia label="GÁS" ativa={m.pend_gas ?? false} color="#64748b" />
                            </div>
                          </td>
                          <td className="text-center">
                            <div className="table-actions-group">
                              <button className="btn-icon-action" title="Ver Documentos">📂</button>
                              {Number(user?.perfil) <= 3 && (
                                <button className="btn-icon-action" title="Validar">✅</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">Nenhum registro disponível para exibição.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
