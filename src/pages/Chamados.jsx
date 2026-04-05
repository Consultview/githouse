import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './../SupabaseClient';
import Sidebar from '../components/Sidebar';
import FormChamado from './FormChamado';
import './chamados.css';

export default function Chamados() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [condominios, setCondominios] = useState([]);
  const [moradores, setMoradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ticketSelecionado, setTicketSelecionado] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sessionData = localStorage.getItem('cityhouse_session');
    if (sessionData) {
      setUser(JSON.parse(sessionData));
      fetchData();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  async function fetchData() {
    try {
      setLoading(true);
      const [resTickets, resTecnicos, resCondos, resMoradores] = await Promise.all([
        supabase.from('chamados').select('*').order('created_at', { ascending: false }),
        supabase.from('usuarios').select('id, nome').eq('perfil', '3'),
        supabase.from('condominios').select('id, nome'),
        supabase.from('usuarios').select('id, condominio_id, bloco, numero_casa')
      ]);

      setTickets(resTickets.data || []);
      setTecnicos(resTecnicos.data || []);
      setCondominios(resCondos.data || []);
      setMoradores(resMoradores.data || []);
    } catch (err) {
      console.error("Erro ao carregar:", err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveNovoChamado = async (dados) => {
    setSaving(true);
    try {
      let publicUrl = null;

      if (dados.anexo_arquivo) {
        const fileName = `ticket_${Date.now()}.jpg`;
        const filePath = `fotos/${fileName}`;

        const res = await fetch(dados.anexo_arquivo);
        const blob = await res.blob();

        const { error: uploadError } = await supabase.storage
          .from('anexos')
          .upload(filePath, blob, { contentType: 'image/jpeg' });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('anexos')
          .getPublicUrl(filePath);
        
        publicUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from('chamados').insert([{
        titulo: dados.titulo,
        descricao_morador: dados.descricao_morador,
        local_exato: `${dados.bloco} - ${dados.numero_unidade}`,
        categoria: dados.categoria,
        prioridade: dados.prioridade,
        condominio_id: dados.condominio_id,
        usuario_aberto_id: user.id,
        foto_url: publicUrl
      }]);

      if (error) throw error;
      setIsAdding(false);
      fetchData();
    } catch (err) {
      alert("Erro ao abrir chamado: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const getPriorityClass = (prio) => {
    if (prio === 'URGENTE' || prio === 'ALTA') return 'prio-high';
    if (prio === 'MEDIA') return 'prio-medium';
    return 'prio-low';
  };

  if (!user) return null;

  return (
    <div className="admin-layout">
      <Sidebar user={user} isOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />

      <main className="admin-main">
        <header className="admin-header" style={{ justifyContent: 'flex-end', marginBottom: '20px' }}>
          {!isAdding && !ticketSelecionado && (
            <button className="btn-primary-new" onClick={() => setIsAdding(true)}>
              + NOVO CHAMADO
            </button>
          )}
        </header>

        {isAdding ? (
          <FormChamado
            onCancel={() => setIsAdding(false)}
            onSave={handleSaveNovoChamado}
            saving={saving}
            user={user}
            condominios={condominios}
            usuarios={moradores}
          />
        ) : ticketSelecionado ? (
          <div className="anim-up detail-view">
             <button className="btn-secondary" onClick={() => setTicketSelecionado(null)} style={{marginBottom: '20px'}}>
               ← VOLTAR À LISTA
             </button>
             <div className="table-container card-detail">
                <div className="detail-header">
                    <h2>{ticketSelecionado.id_formatado}</h2>
                    <span className={`status-pill status-${ticketSelecionado.status?.toLowerCase().replace(" ", "-")}`}>
                        {ticketSelecionado.status || 'ABERTO'}
                    </span>
                </div>
                <hr />
                <div className="detail-grid">
                    <div className="detail-info">
                        <p><strong>Título:</strong> {ticketSelecionado.titulo}</p>
                        <p><strong>Categoria:</strong> {ticketSelecionado.categoria}</p>
                        <p><strong>Local:</strong> {ticketSelecionado.local_exato}</p>
                        <p><strong>Aberto em:</strong> {new Date(ticketSelecionado.created_at).toLocaleString()}</p>
                        <p><strong>Descrição do Morador:</strong></p>
                        <div className="description-box">{ticketSelecionado.descricao_morador}</div>
                    </div>
                    
                    {ticketSelecionado.foto_url && (
                    <div className="detail-photo">
                        <p><strong>Evidência Fotográfica:</strong></p>
                        <a href={ticketSelecionado.foto_url} target="_blank" rel="noreferrer">
                            <img src={ticketSelecionado.foto_url} alt="Evidência" className="img-evidence" />
                        </a>
                    </div>
                    )}
                </div>
             </div>
          </div>
        ) : (
          <section className="table-container anim-fade">
            <div className="table-responsive">
              <table className="standard-table">
                <thead>
                  <tr>
                    <th width="120">CÓDIGO</th>
                    <th>ASSUNTO / CATEGORIA</th>
                    <th>LOCAL</th>
                    <th width="120">PRIORIDADE</th>
                    <th>TÉCNICO</th>
                    <th width="130">STATUS</th>
                    <th width="80">AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" className="text-center">Carregando chamados...</td></tr>
                  ) : tickets.map((t) => {
                    const tecnico = tecnicos.find(tec => tec.id === t.tecnico_atribuido_id);
                    return (
                      <tr key={t.id}>
                        <td className="text-id">{t.id_formatado}</td>
                        <td>
                          <div className="user-info-cell">
                            <span className="text-bold">{t.titulo}</span>
                            <span className="perfil-tag">{t.categoria}</span>
                          </div>
                        </td>
                        <td>
                          <div className="contact-info-cell">
                            <span>{t.local_exato}</span>
                            <small>{new Date(t.created_at).toLocaleDateString()}</small>
                          </div>
                        </td>
                        <td>
                          <span className={`prio-indicator ${getPriorityClass(t.prioridade)}`}>
                            {t.prioridade}
                          </span>
                        </td>
                        <td className="text-muted">{tecnico ? tecnico.nome : '--'}</td>
                        <td>
                          <span className={`status-pill status-${t.status?.toLowerCase().replace(" ", "-")}`}>
                            {t.status || 'ABERTO'}
                          </span>
                        </td>
                        <td className="text-center">
                          <button className="btn-icon-view" onClick={() => setTicketSelecionado(t)}>
                             🔍
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
