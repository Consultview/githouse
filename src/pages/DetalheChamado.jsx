import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './../SupabaseClient';
import Sidebar from '../components/Sidebar';
import './styles/detalhechamado.css';

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
  const [fotoConclusao, setFotoConclusao] = useState(null);
  const [previewConclusao, setPreviewConclusao] = useState(null);

  const perms = useMemo(() => {
    if (!user || !chamado) return { editar: false };

    const perfilNum = Number(user.perfil);
    const isGestor = perfilNum === 1 || perfilNum === 2;
    const jaFechado = chamado.status === 'CONCLUIDO' || chamado.status === 'CANCELADO';

    if (jaFechado) return { editar: isGestor };

    if (isGestor) return { editar: true };

    const p = user.permissoes?.find(item => item.modulo_id === 'cham');
    return { editar: !!p?.p_editar };
  }, [user, chamado]);

  useEffect(() => {
    const sessionData = localStorage.getItem('cityhouse_session');
    if (sessionData) setUser(JSON.parse(sessionData));
    else navigate('/login');
  }, [navigate]);

  useEffect(() => {
    if (user) fetchDados();
  }, [user, id]);

  async function fetchDados() {
    try {
      setLoading(true);
      const [chamRes, userRes] = await Promise.all([
        supabase.from('chamados').select('*, condominios(nome)').eq('id', id).maybeSingle(),
        supabase.from('usuarios').select('id, nome').eq('perfil', 4).order('nome')
      ]);

      if (chamRes.error) throw chamRes.error;

      const cham = chamRes.data;

      setChamado(cham);
      setStatus(cham.status || 'ABERTO');
      setPrioridade(cham.prioridade || 'MEDIA');
      setTecnicoId(cham.tecnico_atribuido_id || '');
      setTecnicos(userRes.data || []);

      if (cham.foto_conclusao_url) setPreviewConclusao(cham.foto_conclusao_url);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const uploadFoto = async (file) => {
    const fileName = `${Date.now()}_finish_${id}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('anexos').upload(fileName, file);
    if (error) throw error;

    const { data } = supabase.storage.from('anexos').getPublicUrl(fileName);
    return data.publicUrl;
  };

  async function handleSave() {
    if (!perms.editar) return;

    try {
      setSaving(true);

      let historico = Array.isArray(chamado.diagnostico_tecnico)
        ? chamado.diagnostico_tecnico
        : [];

      if (novaNota.trim()) {
        historico.push({
          data: new Date().toISOString(),
          autor: user.nome,
          mensagem: novaNota.trim()
        });
      }

      let urlFoto = chamado.foto_conclusao_url;
      if (fotoConclusao) urlFoto = await uploadFoto(fotoConclusao);

      const updates = {
        status,
        prioridade, // ✔ já integrado
        tecnico_atribuido_id: tecnicoId ? parseInt(tecnicoId) : null,
        diagnostico_tecnico: historico,
        updated_at: new Date().toISOString(),
        foto_conclusao_url: urlFoto
      };

      if (status === 'CONCLUIDO' && !chamado.data_conclusao) {
        updates.data_conclusao = new Date().toISOString();
      }

      const { error } = await supabase
        .from('chamados')
        .update(updates)
        .eq('id', chamado.id);

      if (error) throw error;

      alert("Chamado atualizado com sucesso!");
      navigate('/chamados');

    } catch (err) {
      alert("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  const statusConfig = {
    'ABERTO': { class: 'st-aberto', label: 'Aberto' },
    'EM_ANDAMENTO': { class: 'st-progresso', label: 'Em Andamento' },
    'CONCLUIDO': { class: 'st-concluido', label: 'Concluído' },
    'CANCELADO': { class: 'st-cancelado', label: 'Cancelado' }
  };

  if (loading) return <div className="loader-full">Carregando...</div>;

  return (
    <div className="dc-app-container">
      <Sidebar user={user} />

      <main className="dc-main-content">
        <div className="dc-page-wrapper">

          <header className="dc-header-flex">
            <h1>Gestão do Chamado</h1>
            <button className="dc-btn-back-top" onClick={() => navigate('/chamados')}>
              ← Voltar
            </button>
          </header>

          <div className="dc-content-body">

            <div className="condo-card">
              <div className="card-header">
                <span className="card-id">
                  Ticket #{chamado.id.toString().padStart(5, '0')}
                </span>
                <span className={`status-pill ${statusConfig[chamado.status]?.class || ''}`}>
                  {statusConfig[chamado.status]?.label}
                </span>
              </div>

              <div className="card-body">
                <div className="name-cell">
                  <strong>{chamado.titulo}</strong> | <span>{chamado.condominios?.nome}</span>
                </div>

                <div className="info-grid">
                  <div className="info-block">
                    <label>Abertura</label>
                    <p>{new Date(chamado.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>

                  <div className="info-block">
                    <label>Prioridade</label>
                    <p className={`pri-level ${chamado.prioridade?.toLowerCase()}`}>
                      {chamado.prioridade}
                    </p>
                  </div>
                </div>

                <div className="dc-relato-visual" style={{ borderLeftColor: '#f59e0b', marginTop: '15px' }}>
                  <label>📍 Localização:</label>
                  <p><b>{chamado.local_exato}</b></p>
                </div>

                <div className="dc-relato-visual">
                  <label>Relato do Morador:</label>
                  <p>{chamado.descricao_morador}</p>
                </div>

                {chamado.foto_url && (
                  <img
                    src={chamado.foto_url}
                    className="dc-img-preview-card"
                    onClick={() => window.open(chamado.foto_url)}
                    alt="Abertura"
                  />
                )}
              </div>
            </div>

            <div className="dc-card-box">
              <span className="dc-card-label">💬 Histórico Técnico</span>

              <div className="dc-chat-bg">
                {chamado.diagnostico_tecnico?.map((h, i) => (
                  <div
                    key={i}
                    className={`dc-msg ${h.autor === user.nome ? 'dc-msg-sent' : ''}`}
                  >
                    <span className="dc-msg-user">{h.autor}</span>
                    <p>{h.mensagem}</p>
                  </div>
                ))}
              </div>

              {perms.editar && (
                <textarea
                  className="dc-textarea"
                  value={novaNota}
                  onChange={e => setNovaNota(e.target.value)}
                  placeholder="Nova nota técnica..."
                />
              )}
            </div>

            <div className="dc-card-box">
              <span className="dc-card-label">🛠️ Finalização e Atendimento</span>

              <div className="dc-item-info" style={{ marginBottom: '20px' }}>
                <label>📸 Foto da Conclusão</label>

                {previewConclusao && (
                  <img
                    src={previewConclusao}
                    className="dc-img-preview-card"
                    style={{ maxHeight: '200px', marginBottom: '10px' }}
                    alt="Conclusão"
                  />
                )}

                {perms.editar && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      setFotoConclusao(e.target.files[0]);
                      setPreviewConclusao(URL.createObjectURL(e.target.files[0]));
                    }}
                  />
                )}
              </div>

              <div className="dc-grid-info">
                <div className="dc-item-info">
                  <label>Status</label>
                  <select
                    className="dc-select"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    disabled={!perms.editar}
                  >
                    <option value="ABERTO">Aberto</option>
                    <option value="EM_ANDAMENTO">Em Andamento</option>
                    <option value="CONCLUIDO">Concluído</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </div>

                {/* 🔥 PRIORIDADE ADICIONADA */}
                <div className="dc-item-info">
                  <label>Prioridade</label>
                  <select
                    className="dc-select"
                    value={prioridade}
                    onChange={e => setPrioridade(e.target.value)}
                    disabled={!perms.editar}
                  >
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Média</option>
                    <option value="ALTA">Alta</option>
                  </select>
                </div>

                <div className="dc-item-info">
                  <label>Técnico Responsável</label>
                  <select
                    className="dc-select"
                    value={tecnicoId}
                    onChange={e => setTecnicoId(e.target.value)}
                    disabled={!perms.editar}
                  >
                    <option value="">Selecionar técnico...</option>
                    {tecnicos.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {perms.editar ? (
                <button
                  className="dc-btn-save-full"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </button>
              ) : (
                (chamado.status === 'CONCLUIDO' || chamado.status === 'CANCELADO') && (
                  <div style={{
                    background: '#fef2f2',
                    padding: '15px',
                    borderRadius: '10px',
                    marginTop: '20px',
                    border: '1px solid #fee2e2'
                  }}>
                    <p style={{
                      color: '#991b1b',
                      fontSize: '0.85rem',
                      textAlign: 'center',
                      margin: 0
                    }}>
                      🚨 <b>Solicitação finalizada.</b>
                    </p>
                  </div>
                )
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
