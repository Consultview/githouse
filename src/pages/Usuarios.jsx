import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './../SupabaseClient';
import Sidebar from '../components/Sidebar';
import FormUsuario from './FormUsuario';
import './usuarios.css';

export default function Usuarios() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [condominios, setCondominios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Mapeamento de perfis para exibição amigável
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
    } else {
      navigate('/login');
    }
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
    } catch (err) {
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('usuarios').insert([novoUser]);
      if (error) throw error;
      setIsAdding(false);
      setNovoUser({ nome: '', cpf: '', email: '', senha: '', perfil: '', condominio_id: '', bloco: '', numero_casa: '', telefone: '', status: true });
      fetchData();
    } catch (err) {
      alert("Erro ao salvar: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div className="admin-layout">
      <Sidebar user={user} isOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-title">
          
          </div>
          {!isAdding && (
            <button className="btn-primary-new" onClick={() => setIsAdding(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              NOVO USUÁRIO
            </button>
          )}
        </header>

        {isAdding ? (
          <FormUsuario
            novoUser={novoUser}
            setNovoUser={setNovoUser}
            onSave={handleSave}
            onCancel={() => setIsAdding(false)}
            saving={saving}
            condominios={condominios}
          />
        ) : (
          <div className="table-container anim-fade">
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
                            <span className="perfil-tag">{perfilNome[u.perfil] || 'Não definido'}</span>
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
                          <span className={`status-pill ${u.status ? 'active' : 'inactive'}`}>
                            {u.status ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="text-center">
                          <button className="btn-icon-view" title="Ver Detalhes">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
