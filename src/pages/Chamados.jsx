import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './../SupabaseClient';
import Sidebar from '../components/Sidebar';
import FormChamado from './FormChamado';
import './chamados.css';

export default function Chamados() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChamado, setSelectedChamado] = useState(null);

  const statusConfig = {
    'ABERTO': { class: 'st-aberto', label: 'Aberto' },
    'EM_ANDAMENTO': { class: 'st-progresso', label: 'Em Andamento' },
    'CONCLUIDO': { class: 'st-concluido', label: 'Concluído' },
    'CANCELADO': { class: 'st-cancelado', label: 'Cancelado' }
  };

  useEffect(() => {
    const sessionData = localStorage.getItem('cityhouse_session');
    if (sessionData) {
      setUser(JSON.parse(sessionData));
      fetchChamados();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  async function fetchChamados() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chamados')
        .select('*, condominios (nome)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChamados(data || []);
    } catch (err) {
      console.error('Erro ao carregar chamados:', err);
    } finally {
      setLoading(false);
    }
  }

  // Cálculos para os 4 Cards de Resumo
  const totalAbertos = chamados.filter(c => c.status === 'ABERTO').length;
  const totalAndamento = chamados.filter(c => c.status === 'EM_ANDAMENTO').length;
  const totalConcluidos = chamados.filter(c => c.status === 'CONCLUIDO').length;
  const totalCancelados = chamados.filter(c => c.status === 'CANCELADO').length;

  const handleOpenModal = (chamado = null) => {
    setSelectedChamado(chamado);
    setIsModalOpen(true);
  };

  async function handleSave(dadosForm) {
    try {
      setSaving(true);
      if (selectedChamado) {
        const { error } = await supabase.from('chamados').update(dadosForm).eq('id', selectedChamado.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('chamados').insert([dadosForm]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      fetchChamados();
    } catch (err) {
      alert("Erro ao salvar o chamado.");
    } finally {
      setSaving(false);
    }
  }

  const formatID = (id) => id?.toString().padStart(5, '0') || '00000';
  const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR');

  if (!user) return null;

  return (
    <div className="ch-app-wrapper">
      <Sidebar user={user} isOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />

      <main className="ch-main-content">
        <div className="page-container">

          {/* 4 CARDS DE RESUMO */}
          <div className="stats-summary-grid">
            <div className="stat-card sc-aberto">
              <div className="stat-info">
                <span className="stat-label">Novos / Aberto</span>
                <p className="stat-value">{totalAbertos}</p>
              </div>
              <div className="stat-icon">📂</div>
            </div>

            <div className="stat-card sc-andamento">
              <div className="stat-info">
                <span className="stat-label">Em Atendimento</span>
                <p className="stat-value">{totalAndamento}</p>
              </div>
              <div className="stat-icon">🛠️</div>
            </div>

            <div className="stat-card sc-concluido">
              <div className="stat-info">
                <span className="stat-label">Concluídos</span>
                <p className="stat-value">{totalConcluidos}</p>
              </div>
              <div className="stat-icon">✅</div>
            </div>

            <div className="stat-card sc-cancelado">
              <div className="stat-info">
                <span className="stat-label">Cancelados</span>
                <p className="stat-value">{totalCancelados}</p>
              </div>
              <div className="stat-icon">🚫</div>
            </div>
          </div>

          <div className="data-display-area">
            <div className="top-actions" style={{justifyContent: 'flex-end', marginBottom: '20px'}}>
              <button className="btn-add-condo" onClick={() => handleOpenModal()}>
                + Abrir Chamado
              </button>
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

                    <div className="card-body">
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
                      <button className="btn-view" onClick={() => navigate(`/detalhe/${item.id}`)}>
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
                <div className="modal-header">
                  <h2>{selectedChamado ? `Chamado #${formatID(selectedChamado.id)}` : 'Novo Chamado'}</h2>
                  <button className="btn-close" onClick={() => setIsModalOpen(false)}>&times;</button>
                </div>
                <FormChamado
                  user={user}
                  chamadoEdicao={selectedChamado}
                  onSave={handleSave}
                  onCancel={() => setIsModalOpen(false)}
                  saving={saving}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
