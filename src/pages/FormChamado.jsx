import React, { useState, useRef, useMemo, useEffect } from 'react';
import './formchamado.css';

export default function FormChamado({ onSave, onCancel, saving, condominios = [], usuarios = [], user }) {
  const fileInputRef = useRef(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [novo, setNovo] = useState({
    titulo: '',
    descricao_morador: '',
    condominio_id: '',
    bloco: '',
    numero_unidade: '',
    categoria: 'OUTROS',
    prioridade: 'MEDIA',
    anexo_arquivo: null
  });

  useEffect(() => {
    if (user) {
      setNovo(prev => ({
        ...prev,
        condominio_id: user.condominio_id ? String(user.condominio_id) : '',
        bloco: user.bloco || '',
        numero_unidade: user.numero_casa || user.numero_unidade || ''
      }));
    }
  }, [user]);

  const blocosDisponiveis = useMemo(() => {
    if (!novo.condominio_id) return [];
    return usuarios
      .filter(u => String(u.condominio_id) === String(novo.condominio_id))
      .map(u => u.bloco)
      .filter((v, i, s) => v && s.indexOf(v) === i).sort();
  }, [novo.condominio_id, usuarios]);

  const unidadesDisponiveis = useMemo(() => {
    if (!novo.bloco) return [];
    return usuarios
      .filter(u => String(u.condominio_id) === String(novo.condominio_id) && u.bloco === novo.bloco)
      .map(u => u.numero_casa || u.numero_unidade)
      .filter((v, i, s) => v && s.indexOf(v) === i).sort();
  }, [novo.bloco, novo.condominio_id, usuarios]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000; 
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setFotoPreview(compressedBase64);
        setNovo(prev => ({ ...prev, anexo_arquivo: compressedBase64 }));
      };
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'condominio_id') {
      setNovo({ ...novo, [name]: value, bloco: '', numero_unidade: '' });
    } else if (name === 'bloco') {
      setNovo({ ...novo, [name]: value, numero_unidade: '' });
    } else {
      setNovo({ ...novo, [name]: value.toUpperCase() });
    }
  };

  return (
    <section className="form-container anim-up">
      <form onSubmit={(e) => { e.preventDefault(); onSave(novo); }} className="modern-form">
        <div className="form-grid">
          <div className="input-group span-2">
            <input name="titulo" type="text" required placeholder=" " value={novo.titulo} onChange={handleChange} />
            <label>Título do Chamado *</label>
          </div>

          <div className="input-group">
            <select name="condominio_id" required value={novo.condominio_id} onChange={handleChange}>
              <option value=""></option>
              {condominios.map(c => <option key={c.id} value={String(c.id)}>{c.nome}</option>)}
            </select>
            <label>Condomínio *</label>
          </div>

          <div className="input-group">
            <select name="bloco" required value={novo.bloco} onChange={handleChange} disabled={!novo.condominio_id}>
              <option value=""></option>
              {blocosDisponiveis.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <label>Bloco / Rua *</label>
          </div>

          <div className="input-group">
            <select name="numero_unidade" required value={novo.numero_unidade} onChange={handleChange} disabled={!novo.bloco}>
              <option value=""></option>
              {unidadesDisponiveis.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <label>Unidade *</label>
          </div>

          <div className="input-group">
            <select name="categoria" required value={novo.categoria} onChange={handleChange}>
              <option value="OUTROS">OUTROS</option>
              <option value="ELETRICA">ELÉTRICA</option>
              <option value="HIDRAULICA">HIDRÁULICA</option>
              <option value="PINTURA">PINTURA</option>
            </select>
            <label>Categoria *</label>
          </div>

          <div className="input-group">
            <select name="prioridade" required value={novo.prioridade} onChange={handleChange}>
              <option value="BAIXA">BAIXA</option>
              <option value="MEDIA">MÉDIA</option>
              <option value="ALTA">ALTA</option>
            </select>
            <label>Prioridade *</label>
          </div>

          <div className="input-group span-2">
            <textarea
              name="descricao_morador"
              required
              placeholder=" "
              value={novo.descricao_morador}
              onChange={e => setNovo({...novo, descricao_morador: e.target.value.toUpperCase()})}
            />
            <label>Descrição do Problema *</label>
          </div>

          {/* Miniatura Discreta */}
          <div className="input-group">
            <input type="file" accept="image/*" capture="environment" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
            <div className={`photo-thumb ${fotoPreview ? 'has-photo' : ''}`} onClick={() => fileInputRef.current.click()}>
              {fotoPreview ? (
                <img src={fotoPreview} className="img-preview" alt="Preview" />
              ) : (
                <div className="photo-info">
                  <span style={{fontSize: '20px'}}>📷</span>
                  <small>FOTO</small>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
           <button type="button" className="btn-secondary" onClick={onCancel}>CANCELAR</button>
           <button type="submit" className="btn-primary" disabled={saving}>
             {saving ? 'SALVANDO...' : 'ABRIR CHAMADO'}
           </button>
        </div>
      </form>
    </section>
  );
}
