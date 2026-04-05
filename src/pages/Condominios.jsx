import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './../SupabaseClient';
import Sidebar from '../components/Sidebar';
import FormCondominio from './FormCondominio';
import './condominios.css';

export default function Condominios() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [condominios, setCondominios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Estado para o menu

  const [novoCondo, setNovoCondo] = useState({
    nome: '', cnpj: '', email_contato: '', telefone: '',
    cep: '', endereco: '', numero: '', bairro: '', cidade: '', estado: '',
    status: true
  });

  const formatID = (id) => id.toString().padStart(4, '0');
  const maskCNPJ = (v) => v ? v.replace(/\D/g, '').replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5") : '-';
  const maskPhone = (v) => v ? v.replace(/\D/g, '').replace(/^(\d{2})(\d{5}|\d{4})(\d{4})$/, "($1) $2-$3") : '-';

  useEffect(() => {
    const sessionData = localStorage.getItem('cityhouse_session');
    if (sessionData) {
      setUser(JSON.parse(sessionData));
      fetchCondominios();
    } else { navigate('/login'); }
  }, [navigate]);

  async function fetchCondominios() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('condominios').select('*').order('id', { ascending: true });
      if (error) throw error;
      setCondominios(data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
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
      const { error } = await supabase.from('condominios').insert([dadosLimpos]);
      if (error) throw error;
      setIsAdding(false);
      setNovoCondo({ nome: '', cnpj: '', email_contato: '', telefone: '', cep: '', endereco: '', numero: '', bairro: '', cidade: '', estado: '', status: true });
      fetchCondominios();
    } catch (err) { alert("Erro ao salvar"); } finally { setSaving(false); }
  }

  if (!user) return null;

  return (
    <div className="ch-app-wrapper">
      <Sidebar user={user} isOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />
      
      <main className="ch-main-content">
        <div className="page-container">
          
          {isAdding ? (
            <FormCondominio
              novoCondo={novoCondo} setNovoCondo={setNovoCondo}
              onSave={handleSave} onCancel={() => setIsAdding(false)} saving={saving}
            />
          ) : (
            <div className="data-display-area">
              <div className="top-actions">
                <button className="btn-add-condo" onClick={() => setIsAdding(true)}>
                  + Novo Condomínio
                </button>
              </div>

              <div className="condo-grid">
                {condominios.map((c) => (
                  <div key={c.id} className="condo-card">
                    <div className="card-header">
                      <span className="card-id">#{formatID(c.id)}</span>
                      <span className={`status-pill ${c.status ? 'active' : 'inactive'}`}>
                        {c.status ? 'ATIVO' : 'INATIVO'}
                      </span>
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
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
