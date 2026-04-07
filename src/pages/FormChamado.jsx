import React, { useState, useEffect } from 'react';
import { supabase } from './../SupabaseClient';
import './styles/formchamado.css';

export default function FormChamado({ onSave, onCancel, saving, user, chamadoEdicao }) {
  const [condominios, setCondominios] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(chamadoEdicao?.foto_url || null);
  const [internalSaving, setInternalSaving] = useState(false);
  
  const [form, setForm] = useState({
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
  });

  useEffect(() => {
    fetchCondos();
    if (chamadoEdicao) setForm({ ...chamadoEdicao });
    else if (user) {
      setForm(prev => ({
        ...prev,
        condominio_id: user.condominio_id || '',
        usuario_aberto_id: user.id || ''
      }));
    }
  }, [user, chamadoEdicao]);

  async function fetchCondos() {
    const { data } = await supabase.from('condominios').select('id, nome, endereco, numero').eq('status', true);
    setCondominios(data || []);
  }

  // 1. Carrega miniatura local (Blob temporário)
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Pegamos o primeiro arquivo da lista
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 2. Upload Real para o Bucket 'anexos'
  const uploadToSupabase = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `chamados/${fileName}`;

    // AQUI ESTÁ A CORREÇÃO PARA O BUCKET 'anexos'
    const { error: uploadError } = await supabase.storage
      .from('anexos') 
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('anexos').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInternalSaving(true);

    try {
      let finalData = { ...form };

      // O upload só acontece agora, ao clicar em salvar
      if (selectedFile) {
        const publicUrl = await uploadToSupabase(selectedFile);
        finalData.foto_url = publicUrl;
        finalData.url_anexo_abertura = publicUrl;
      }

      await onSave(finalData);
    } catch (error) {
      alert('Erro ao salvar no bucket anexos: ' + error.message);
    } finally {
      setInternalSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modern-form">
      <div className="form-section">
        <h3 className="section-title">📍 Localização</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Condomínio</label>
            <select 
              value={form.condominio_id} 
              onChange={(e) => setForm({...form, condominio_id: e.target.value})} 
              required
              disabled={!!user?.condominio_id && !chamadoEdicao}
            >
              <option value="">Selecione...</option>
              {condominios.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Localização (Bloco/Apto)</label>
            <input 
              type="text" 
              value={form.local_exato} 
              onChange={(e) => setForm({...form, local_exato: e.target.value})}
              placeholder="Ex: Bloco C, Apto 402"
              required 
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">📝 Detalhes</h3>
        <div className="form-group">
          <label>Título / Assunto</label>
          <input type="text" value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} placeholder="Resumo do problema" required />
        </div>
        <div className="form-group">
          <label>Descrição do Morador</label>
          <textarea value={form.descricao_morador} onChange={(e) => setForm({...form, descricao_morador: e.target.value})} rows="3" placeholder="O que está acontecendo?" required />
        </div>
      </div>

      <div className="photo-area">
        <label className="field-label">Evidência Fotográfica</label>
        {previewUrl ? (
          <div className="preview-box">
            <img src={previewUrl} alt="Preview" />
            <button type="button" className="btn-del-photo" onClick={() => {setPreviewUrl(null); setSelectedFile(null);}}>
              Remover Foto
            </button>
          </div>
        ) : (
          <label className="upload-zone">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <div className="upload-content">
              <span>📷 Câmera ou Galeria</span>
            </div>
          </label>
        )}
      </div>

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-save" disabled={saving || internalSaving}>
          {saving || internalSaving ? 'Processando...' : (chamadoEdicao ? 'Salvar Alterações' : 'Abrir Chamado')}
        </button>
      </div>
    </form>
  );
}
