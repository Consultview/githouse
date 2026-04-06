import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './../SupabaseClient';
import Sidebar from '../components/Sidebar';
import FormCondominio from './FormCondominio';
import { useAuth } from '../hooks/useAuth'; // ✅ NOVO
import './condominios.css';

export default function Condominios() {
  const navigate = useNavigate();

  const { user, loadingAuth } = useAuth(); // ✅ NOVO

  const [condominios, setCondominios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [novoCondo, setNovoCondo] = useState({
    nome: '', cnpj: '', email_contato: '', telefone: '',
    cep: '', endereco: '', numero: '', bairro: '', cidade: '', estado: '',
    status: true
  });

  const formatID = (id) => id.toString().padStart(4, '0');

  const maskCNPJ = (v) =>
    v ? v.replace(/\D/g, '').replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5") : '-';

  const maskPhone = (v) =>
    v ? v.replace(/\D/g, '').replace(/^(\d{2})(\d{5}|\d{4})(\d{4})$/, "($1) $2-$3") : '-';

  // ✅ NOVO PADRÃO
  useEffect(() => {
    if (!loadingAuth) {
      if (!user) {
        navigate('/login');
      } else {
        fetchCondominios();
      }
    }
  }, [user, loadingAuth]);

  async function fetchCondominios() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('condominios')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setCondominios(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (condo = null) => {
    if (condo) {
      setEditingId(condo.id);
      setNovoCondo(condo);
    } else {
      setEditingId(null);
      setNovoCondo({
        nome: '', cnpj: '', email_contato: '', telefone: '',
        cep: '', endereco: '', numero: '', bairro: '', cidade: '', estado: '',
        status: true
      });
    }
    setIsModalOpen(true);
  };

  async function toggleStatus(id, currentStatus) {
    try {
      const { error } = await supabase
        .from('condominios')
        .update({ status: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchCondominios();
    } catch (err) {
      alert("Erro ao alterar status");
    }
  }

  async function handleSave(e) {
    if (e) e.preventDefault();
    setSaving(true);

    const dadosLimpos = {
      ...novoCondo,
      nome: novoCondo.nome.toUpperCase(),
      cnpj: novoCondo.cnpj.replace(/\D/g, ''),
      cep: novoCondo.cep.replace(/\D/g, ''),
      telefone: novoCondo.telefone.replace(/\D/g, ''),
      endereco: novoCondo.endereco.toUpperCase(),
      bairro: novoCondo.bairro.toUpperCase(),
      cidade: novoCondo.cidade.toUpperCase(),
      estado: novoCondo.estado.toUpperCase()
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from('condominios')
          .update(dadosLimpos)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('condominios')
          .insert([dadosLimpos]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchCondominios();
    } catch (err) {
      alert("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  // ✅ BLOQUEIO DURANTE AUTH
  if (loadingAuth) return null;

  // ✅ SEGURANÇA
  if (!user) return null;

  return (
    <div className="ch-app-wrapper">
      <Sidebar
        user={user}
        isOpen={menuOpen}
        toggleMenu={() => setMenuOpen(!menuOpen)}
      />

      <main className="ch-main-content">
        <div className="page-container">
          <div className="data-display-area">

            <div className="top-actions">
              <button
                className="btn-add-condo"
                onClick={() => handleOpenModal()}
              >
                + Novo Condomínio
              </button>
            </div>

            <div className="condo-grid">
              {condominios.map((c) => (
                <div key={c.id} className="condo-card">

                  <div className="card-header">
                    <span className="card-id">#{formatID(c.id)}</span>

                    <button
                      className={`status-pill ${c.status ? 'active' : 'inactive'}`}
                      onClick={() => toggleStatus(c.id, c.status)}
                    >
                      {c.status ? 'ATIVO' : 'INATIVO'}
                    </button>
                  </div>

                  <div className="card-body">
                    <div className="name-cell">
                      <strong>{c.nome}</strong>
                      <span>{maskCNPJ(c.cnpj)}</span>
                    </div>

                    <div className="info-grid">
                      <div className="info-block">
                        <label>Telefone</label>
                        <p>{maskPhone(c.telefone)}</p>
                      </div>

                      <div className="info-block">
                        <label>Bairro</label>
                        <p>{c.bairro || '-'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button
                      className="btn-view"
                      onClick={() => handleOpenModal(c)}
                    >
                      ✏️ Editar Detalhes
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">

                <div className="modal-header">
                  <h2>
                    {editingId ? 'Editar Condomínio' : 'Novo Condomínio'}
                  </h2>

                  <button
                    className="btn-close"
                    onClick={() => setIsModalOpen(false)}
                  >
                    &times;
                  </button>
                </div>

                <FormCondominio
                  novoCondo={novoCondo}
                  setNovoCondo={setNovoCondo}
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
