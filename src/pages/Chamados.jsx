import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import FormChamado from './FormChamado';
import { useAuth } from '../hooks/useAuth';
import { useChamados } from '../hooks/useChamados';
import { chamadosRepo } from '../database/ChamadosRepo';
import './styles/chamados.css';

export default function Chamados() {
  const navigate = useNavigate();
  const { user, loadingAuth } = useAuth();
  const { chamados, loading, fetchChamados, stats } = useChamados(user);

  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChamado, setSelectedChamado] = useState(null);

  const perms = useMemo(() => {
    if (!user) return { ver: false, criar: false, editar: false, excluir: false };
    if (Number(user.perfil) === 1) return { ver: true, criar: true, editar: true, excluir: true };

    const p = user.permissoes?.find(item => item.modulo_id === 'cham');
    return {
      ver: !!p?.p_ver,
      criar: !!p?.p_criar,
      editar: !!p?.p_editar,
      excluir: !!p?.p_excluir
    };
  }, [user]);

  const statusConfig = {
    'ABERTO': { class: 'st-aberto', label: 'Aberto' },
    'EM_ANDAMENTO': { class: 'st-progresso', label: 'Em Andamento' },
    'CONCLUIDO': { class: 'st-concluido', label: 'Concluído' },
    'CANCELADO': { class: 'st-cancelado', label: 'Cancelado' }
  };

  useEffect(() => {
    if (!loadingAuth) {
      if (!user || !perms.ver) navigate('/servicos');
      else fetchChamados();
    }
  }, [user, loadingAuth, fetchChamados, navigate, perms.ver]);

  const handleOpenModal = (chamado = null) => {
    if (!chamado && !perms.criar) return;
    if (chamado && !perms.editar) {
       navigate(`/detalhe/${chamado.id}`);
       return;
    }
    setSelectedChamado(chamado);
    setIsModalOpen(true);
  };

  async function handleSave(dadosForm) {
    // 🛡️ REFORÇO DE SEGURANÇA: Bloqueia a execução se não houver permissão
    const isEdicao = !!selectedChamado;
    if (isEdicao && !perms.editar) {
      alert("Acesso Negado: Você não tem permissão para editar.");
      return;
    }
    if (!isEdicao && !perms.criar) {
      alert("Acesso Negado: Você não tem permissão para criar.");
      return;
    }

    try {
      setSaving(true);
      await chamadosRepo.save(dadosForm, selectedChamado?.id);
      setIsModalOpen(false);
      fetchChamados();
    } catch (err) {
      alert("Erro ao salvar o chamado.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const formatID = (id) => id?.toString().padStart(5, '0') || '00000';
  const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR');

  if (loadingAuth || !user || !perms.ver) return null;

  return (
    <div className="ch-app-wrapper">
      <Sidebar user={user} isOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />

      <main className="ch-main-content">
        <div className="page-container">
          <div className="stats-summary-grid">
            <div className="stat-card sc-aberto">
              <div className="stat-info">
                <span className="stat-label">Novos / Aberto</span>
                <p className="stat-value">{stats.totalAbertos}</p>
              </div>
              <div className="stat-icon">📂</div>
            </div>
            <div className="stat-card sc-andamento">
              <div className="stat-info">
                <span className="stat-label">Em Atendimento</span>
                <p className="stat-value">{stats.totalAndamento}</p>
              </div>
              <div className="stat-icon">🛠️</div>
            </div>
            <div className="stat-card sc-concluido">
              <div className="stat-info">
                <span className="stat-label">Concluídos</span>
                <p className="stat-value">{stats.totalConcluidos}</p>
              </div>
              <div className="stat-icon">✅</div>
            </div>
            <div className="stat-card sc-cancelado">
              <div className="stat-info">
                <span className="stat-label">Cancelados</span>
                <p className="stat-value">{stats.totalCancelados}</p>
              </div>
              <div className="stat-icon">🚫</div>
            </div>
          </div>

          <div className="data-display-area">
            <div className="top-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              {perms.criar && (
                <button className="btn-add-condo" onClick={() => handleOpenModal()}>
                  + Abrir Chamado
                </button>
              )}
            </div>

            {loading ? (
              <div className="loader-container">Carregando chamados...</div>
            ) : (
              <div className="condo-grid">
                {chamados.map((item) => (
                  <div key={item.id} className="condo-card">
                    <div className="card-header">
                      <span className="card-id">Ticket #{formatID(item.id)}</span>
                      <span className={`status-pill ${statusConfig[item.status]?.class || ''}`}>
                        {statusConfig[item.status]?.label || item.status}
                      </span>
                    </div>

                    <div
                      className="card-body"
                      onClick={() => handleOpenModal(item)}
                      style={{cursor: perms.editar ? 'pointer' : 'default'}}
                    >
                      <div className="name-cell">
                        <strong>{item.titulo}</strong>
                        <span>{item.condominios?.nome || 'Condomínio não identificado'}</span>
                      </div>
                      <div className="info-grid">
                        <div className="info-block">
                          <label>Data</label>
                          <p>{formatDate(item.created_at)}</p>
                        </div>
                        <div className="info-block">
                          <label>Prioridade</label>
                          <p className={`pri-level ${(item.prioridade || 'MEDIA').toLowerCase()}`}>
                            {item.prioridade || 'Média'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer">
                      <button
                        className="btn-view"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/detalhe/${item.id}`);
                        }}
                      >
                        🔍 Acompanhar Chamado
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <FormChamado
                  user={user}
                  chamado={selectedChamado}
                  onSave={handleSave}
                  onCancel={() => setIsModalOpen(false)}
                  saving={saving}
                  readOnly={!perms.editar && !!selectedChamado}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
