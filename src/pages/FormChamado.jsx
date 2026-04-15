import React, { useState, useEffect } from 'react';
import { supabase } from './../SupabaseClient';
import './styles/formchamado.css';

export default function FormChamado({ onSave, onCancel, saving, user, chamado, readOnly }) {
  const [condominios, setCondominios] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [internalSaving, setInternalSaving] = useState(false);

  const initialState = {
    condominio_id: '',
    titulo: '',
    descricao_morador: '',
    local_exato: '',
    categoria: 'MANUTENCAO',
    prioridade: 'MEDIA',
    status: 'ABERTO',
    usuario_aberto_id: '',
    foto_url: '',
    url_anexo_abertura: ''
  };

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    fetchCondos();
    if (chamado) {
      setForm({ ...chamado });
      setPreviewUrl(chamado.foto_url);
    } else {
      setForm({
        ...initialState,
        condominio_id: user?.condominio_id || '',
        usuario_aberto_id: user?.id ? Number(user.id) : ''
      });
      setPreviewUrl(null);
    }
  }, [chamado, user]);

  async function fetchCondos() {
    const { data } = await supabase.from('condominios').select('id, nome').eq('status', true);
    setCondominios(data || []);
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadToSupabase = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `chamados/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('anexos').upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('anexos').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (readOnly) return;
    setInternalSaving(true);
    try {
      let finalData = { ...form };
      if (selectedFile) {
        const publicUrl = await uploadToSupabase(selectedFile);
        finalData.foto_url = publicUrl;
        finalData.url_anexo_abertura = publicUrl;
      }
      await onSave(finalData);
    } catch (error) {
      alert('Erro: ' + error.message);
    } finally {
      setInternalSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modern-form">
      
      {/* SEÇÃO 1: DETALHES (Ordem: Título -> Descrição) */}
      <div className="form-section">
        <h3 className="section-title">📝 Informações do Chamado</h3>
        <div className="form-group">
          <label>Título do Problema</label>
          <input
            type="text"
            value={form.titulo}
            onChange={(e) => !readOnly && setForm({...form, titulo: e.target.value})}
            placeholder="Ex: Vazamento na pia"
            required
            readOnly={readOnly}
          />
        </div>
        <div className="form-group">
          <label>Descrição Detalhada</label>
          <textarea
            value={form.descricao_morador}
            onChange={(e) => !readOnly && setForm({...form, descricao_morador: e.target.value})}
            placeholder="Descreva o que está acontecendo..."
            required
            readOnly={readOnly}
            rows="3"
          />
        </div>
      </div>

      {/* SEÇÃO 2: LOCALIZAÇÃO E CATEGORIA */}
      <div className="form-section">
        <h3 className="section-title">📍 Localização e Tipo</h3>
        <div className="form-group">
          <label>Local Exato (Bloco/Apto/Área)</label>
          <input
            type="text"
            value={form.local_exato}
            onChange={(e) => !readOnly && setForm({...form, local_exato: e.target.value})}
            placeholder="Ex: Bloco B, Apto 102 ou Corredor Principal"
            required
            readOnly={readOnly}
          />
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Condomínio</label>
            <select
              value={form.condominio_id}
              onChange={(e) => !readOnly && setForm({...form, condominio_id: e.target.value})}
              required
              disabled={readOnly || Number(user?.perfil) !== 1}
            >
              <option value="">Selecione...</option>
              {condominios.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Prioridade</label>
            <select
              value={form.prioridade}
              onChange={(e) => !readOnly && setForm({...form, prioridade: e.target.value})}
              disabled={readOnly}
            >
              <option value="BAIXA">Baixa</option>
              <option value="MEDIA">Média</option>
              <option value="ALTA">Alta</option>
              <option value="URGENTE">Urgente</option>
            </select>
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: ANEXO (Upload Zone) */}
      <div className="form-section" style={{ borderBottom: 'none' }}>
        <h3 className="section-title">📸 Foto do Local</h3>
        {previewUrl && (
          <div className="preview-box">
            <img src={previewUrl} alt="Preview" />
          </div>
        )}
        
        {!readOnly && (
          <div className="upload-zone">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <div className="upload-content">
              <span>{selectedFile ? "Trocar Imagem" : "📷 Clique para anexar foto"}</span>
            </div>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          {readOnly ? 'Fechar' : 'Cancelar'}
        </button>
        {!readOnly && (
          <button type="submit" className="btn-save" disabled={internalSaving || saving}>
            {internalSaving || saving ? 'Salvando...' : 'Abrir Chamado'}
          </button>
        )}
      </div>
    </form>
  );
}
