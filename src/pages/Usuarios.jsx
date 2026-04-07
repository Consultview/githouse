import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './../SupabaseClient';
import Sidebar from '../components/Sidebar';
import FormUsuario from './FormUsuario';
import './styles/usuarios.css';

export default function Usuarios() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [condominios, setCondominios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Estados para Modal e Ações
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  const perfilNome = { 1: 'Admin', 2: 'Síndico', 3: 'Funcionário', 4: 'Morador' };

  const [novoUser, setNovoUser] = useState({
    nome: '', cpf: '', email: '', senha: '', perfil: '',
    condominio_id: '', bloco: '', numero_casa: '', telefone: '', status: true
  });

  const formatID = (id) => id.toString().padStart(4, '0');

  useEffect(() => {
    const sessionData = localStorage.getItem('cityhouse_session');
    if (sessionData) {
      setUser(JSON.parse(sessionData));
      fetchData();
    } else { navigate('/login'); }
  }, [navigate]);

  async function fetchData() {
    try {
      setLoading(true);
      const [resUsers, resCondos] = await Promise.all([
        supabase.from('usuarios').select('*').order('id', { ascending: true }),
        supabase.from('condominios').select('id, nome')
      ]);
      setUsers(resUsers.data || []);
      setCondominios(resCondos.data || []);
    } catch (err) { console.error("Erro:", err); } finally { setLoading(false); }
  }

  const handleOpenModal = (u = null, viewOnly = false) => {
    setIsViewOnly(viewOnly);
    if (u) {
      setEditingId(u.id);
      setNovoUser(u);
    } else {
      setEditingId(null);
      setNovoUser({ nome: '', cpf: '', email: '', senha: '', perfil: '', condominio_id: '', bloco: '', numero_casa: '', telefone: '', status: true });
    }
    setIsModalOpen(true);
  };

  async function toggleStatus(id, currentStatus) {
    try {
      const { error } = await supabase.from('usuarios').update({ status: !currentStatus }).eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) { alert("Erro ao alterar status"); }
  }

  async function handleSave(e) {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase.from('usuarios').update(novoUser).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('usuarios').insert([novoUser]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) { alert("Erro ao salvar: " + err.message); } finally { setSaving(false); }
  }

  if (!user) return null;

  return (
    <div className="ch-app-wrapper">
      <Sidebar user={user} isOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />

      <main className="ch-main-content">
        <div className="page-container">
          
          <header className="top-actions">
             <button className="btn-add-condo" onClick={() => handleOpenModal()}>
                + NOVO USUÁRIO
             </button>
          </header>

          <div className="data-display-area anim-fade">
            <div className="table-responsive">
              <table className="standard-table">
                <thead>
                  <tr>
                    <th className="col-id">ID</th>
                    <th>NOME / PERFIL</th>
                    <th>CONTATO</th>
                    <th>CONDOMÍNIO</th>
                    <th className="col-status">STATUS</th>
                    <th className="col-actions">AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const condo = condominios.find(c => c.id === u.condominio_id);
                    return (
                      <tr key={u.id}>
                        <td className="text-id">#{formatID(u.id)}</td>
                        <td>
                          <div className="user-info-cell">
                            <span className="text-bold">{u.nome}</span>
                            <span className="perfil-tag">{perfilNome[u.perfil]}</span>
                          </div>
                        </td>
                        <td>
                          <div className="contact-info-cell">
                            <span>{u.telefone || '--'}</span>
                            <small>{u.email}</small>
                          </div>
                        </td>
                        <td className="text-muted">{condo?.nome || 'Não Vinculado'}</td>
                        <td>
                          <button 
                            className={`status-pill ${u.status ? 'active' : 'inactive'}`}
                            onClick={() => toggleStatus(u.id, u.status)}
                            title="Clique para alterar status"
                          >
                            {u.status ? 'Ativo' : 'Inativo'}
                          </button>
                        </td>
                        <td className="text-center">
                          <div className="table-actions-group">
                            <button className="btn-icon-action" onClick={() => handleOpenModal(u, true)} title="Visualizar">👁️</button>
                            <button className="btn-icon-action" onClick={() => handleOpenModal(u, false)} title="Editar">✏️</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal - Z-Index superior à Sidebar */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isViewOnly ? 'Visualizar Usuário' : editingId ? 'Editar Usuário' : 'Novo Usuário'}</h2>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <FormUsuario
              novoUser={novoUser} setNovoUser={setNovoUser}
              onSave={handleSave} onCancel={() => setIsModalOpen(false)}
              saving={saving} condominios={condominios} isViewOnly={isViewOnly}
            />
          </div>
        </div>
      )}
    </div>
  );
}
