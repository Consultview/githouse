import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import FormUsuario from './FormUsuario';
import { useAuth } from '../hooks/useAuth';
import { useUsuarios } from '../hooks/useUsuarios';
import { usuariosRepo } from '../database/UsuariosRepo';
import './styles/usuarios.css';

export default function Usuarios() {
  const navigate = useNavigate();
  const { user, loadingAuth } = useAuth();
  const { users, condominios, loading, fetchData } = useUsuarios();

  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  // ✅ Atualizado para os 5 níveis que definimos
  const perfilNome = { 
    1: 'ADM Dono', 
    2: 'Suporte', 
    3: 'Síndico', 
    4: 'Técnico', 
    5: 'Morador' 
  };

  const [novoUser, setNovoUser] = useState({
    nome: '', cpf: '', email: '', senha: '', perfil: '',
    condominio_id: '', bloco: '', numero_casa: '', telefone: '', status: true
  });

  useEffect(() => {
    if (!loadingAuth) {
      if (!user) navigate('/login');
      else fetchData();
    }
  }, [user, loadingAuth, fetchData, navigate]);

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
      await usuariosRepo.updateStatus(id, !currentStatus);
      fetchData();
    } catch (err) { alert("Erro ao alterar status"); }
  }

  async function handleSave(e) {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await usuariosRepo.save(novoUser, editingId);
      setIsModalOpen(false);
      fetchData();
    } catch (err) { alert("Erro ao salvar: " + err.message); } 
    finally { setSaving(false); }
  }

  const formatID = (id) => id?.toString().padStart(4, '0') || '0000';

  if (loadingAuth || !user) return null;

  return (
    <div className="ch-app-wrapper">
      <Sidebar user={user} isOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />
      <main className="ch-main-content">
        <div className="page-container">
          <header className="top-actions">
             <button className="btn-add-condo" onClick={() => handleOpenModal()}>+ NOVO USUÁRIO</button>
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
                            <span className="perfil-tag">{perfilNome[u.perfil] || 'N/A'}</span>
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
                          <button className={`status-pill ${u.status ? 'active' : 'inactive'}`} onClick={() => toggleStatus(u.id, u.status)}>
                            {u.status ? 'Ativo' : 'Inativo'}
                          </button>
                        </td>
                        <td className="text-center">
                          <div className="table-actions-group">
                            <button className="btn-icon-action" onClick={() => handleOpenModal(u, true)}>👁️</button>
                            <button className="btn-icon-action" onClick={() => handleOpenModal(u, false)}>✏️</button>
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isViewOnly ? 'Visualizar' : editingId ? 'Editar' : 'Novo'} Usuário</h2>
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
