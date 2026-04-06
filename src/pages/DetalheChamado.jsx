import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './../SupabaseClient';
import Sidebar from '../components/Sidebar';
import './detalhechamado.css';

export default function DetalheChamado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chamado, setChamado] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [status, setStatus] = useState('');
  const [prioridade, setPrioridade] = useState('MEDIA');
  const [tecnicoId, setTecnicoId] = useState('');
  const [novaNota, setNovaNota] = useState('');

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
      fetchDados();
    } else { navigate('/login'); }
  }, [id, navigate]);

  async function fetchDados() {
    try {
      setLoading(true);
      const { data: cham, error } = await supabase.from('chamados')
        .select('*, condominios(nome)').eq('id', id).maybeSingle();
      if (error) throw error;
      if (!cham) return navigate('/chamados');

      setChamado(cham);
      setStatus(cham.status || 'ABERTO');
      setPrioridade(cham.prioridade || 'MEDIA');
      setTecnicoId(cham.tecnico_id || '');

      const { data: users } = await supabase.from('usuarios').select('id, nome').order('nome');
      setTecnicos(users || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleSave() {
    try {
      setSaving(true);
      let historico = Array.isArray(chamado.diagnostico_tecnico) ? chamado.diagnostico_tecnico : [];
      if (novaNota.trim()) {
        historico.push({ data: new Date().toISOString(), autor: user.nome, mensagem: novaNota.trim() });
      }

      const updates = { 
        status, prioridade, tecnico_id: tecnicoId ? parseInt(tecnicoId) : null,
        diagnostico_tecnico: historico,
        updated_at: new Date().toISOString()
      };
      if (status === 'CONCLUIDO') updates.data_conclusao = new Date().toISOString();

      const { error } = await supabase.from('chamados').update(updates).eq('id', chamado.id);
      if (error) throw error;

      alert("Chamado atualizado!");
      navigate('/chamados'); // Força a volta para a lista
    } catch (err) { alert("Erro ao salvar."); }
    finally { setSaving(false); }
  }

  const formatID = (num) => num?.toString().padStart(5, '0') || '00000';

  if (loading) return <div className="loader-full">Carregando detalhes...</div>;

  return (
    <div className="dc-app-container">
      <Sidebar user={user} />
      <main className="dc-main-content">
        <div className="dc-page-wrapper">
          
          <header className="dc-header-flex">
            <h1>Gestão do Chamado</h1>
            <button className="dc-btn-back-top" onClick={() => navigate('/chamados')}>← Voltar para Lista</button>
          </header>

          <div className="dc-content-body">
            
            {/* CARD IDENTICO AO DA LISTA PRINCIPAL */}
            <div className="condo-card">
              <div className="card-header">
                <span className="card-id">Ticket #{formatID(chamado.id)}</span>
                <span className={`status-pill ${statusConfig[chamado.status]?.class || ''}`}>
                  {statusConfig[chamado.status]?.label || chamado.status}
                </span>
              </div>

              <div className="card-body">
                <div className="name-cell">
                  <strong>{chamado.titulo}</strong>
                  <span>{chamado.condominios?.nome}</span>
                </div>
                <div className="info-grid">
                  <div className="info-block">
                    <label>Data de Abertura</label>
                    <p>{new Date(chamado.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="info-block">
                    <label>Prioridade Atual</label>
                    <p className={`pri-level ${chamado.prioridade?.toLowerCase()}`}>{chamado.prioridade}</p>
                  </div>
                </div>
                <div className="dc-relato-visual">
                  <label>Relato do Morador:</label>
                  <p>{chamado.descricao_morador || chamado.descricao}</p>
                </div>
                {chamado.foto_url && (
                  <img src={chamado.foto_url} className="dc-img-preview-card" onClick={() => window.open(chamado.foto_url)} alt="Anexo" />
                )}
              </div>
            </div>

            {/* CHAT DE NOTAS TÉCNICAS */}
            <div className="dc-card-box">
              <span className="dc-card-label">💬 Histórico Técnico</span>
              <div className="dc-chat-bg">
                {Array.isArray(chamado.diagnostico_tecnico) && chamado.diagnostico_tecnico.map((h, i) => (
                  <div key={i} className={`dc-msg ${h.autor === user.nome ? 'dc-msg-sent' : 'dc-msg-received'}`}>
                    <span className="dc-msg-user">{h.autor}</span>
                    <p>{h.mensagem}</p>
                    <span className="dc-msg-time">{new Date(h.data).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                ))}
              </div>
              <textarea className="dc-textarea" value={novaNota} onChange={e => setNovaNota(e.target.value)} placeholder="Escreva uma nova nota técnica..." />
            </div>

            {/* PAINEL DE GESTÃO */}
            <div className="dc-card-box">
              <span className="dc-card-label">🛠️ Alterar Status e Responsável</span>
              <div className="dc-grid-info">
                <div className="dc-item-info">
                  <label>Novo Status</label>
                  <select className="dc-select" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="ABERTO">Aberto</option>
                    <option value="EM_ANDAMENTO">Em Andamento</option>
                    <option value="CONCLUIDO">Concluído</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </div>
                <div className="dc-item-info">
                  <label>Prioridade</label>
                  <select className="dc-select" value={prioridade} onChange={e => setPrioridade(e.target.value)}>
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Média</option>
                    <option value="ALTA">Alta</option>
                    <option value="URGENTE">Urgente</option>
                  </select>
                </div>
                <div className="dc-item-info">
                  <label>Técnico</label>
                  <select className="dc-select" value={tecnicoId} onChange={e => setTecnicoId(e.target.value)}>
                    <option value="">Selecionar...</option>
                    {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </select>
                </div>
              </div>

              <div className="dc-actions-row">
                <button className="dc-btn-back" onClick={() => navigate('/chamados')}>CANCELAR</button>
                <button className="dc-btn-save" onClick={handleSave} disabled={saving}>
                  {saving ? 'GRAVANDO...' : 'SALVAR ALTERAÇÕES'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
