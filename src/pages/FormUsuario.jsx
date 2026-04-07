import React from 'react';
import './styles/form.css';

export default function FormUsuario({ novoUser, setNovoUser, onSave, onCancel, saving, condominios = [], isViewOnly = false }) {

  if (!novoUser) return null;

  const perfilNome = { 1: 'Admin', 2: 'Síndico', 3: 'Funcionário', 4: 'Morador' };

  const handleCPF = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setNovoUser({ ...novoUser, cpf: value });
  };

  const handleTelefone = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
    setNovoUser({ ...novoUser, telefone: value });
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'status') value = value === 'true';
    setNovoUser({ ...novoUser, [name]: value });
  };

  return (
    <form onSubmit={onSave} className="modern-form anim-up">
      {/* fieldset disabled trava todos os campos se isViewOnly for true */}
      <fieldset disabled={isViewOnly} style={{ border: 'none', padding: 0, margin: 0 }}>
        <div className="form-grid">
          <div className="input-group span-2">
            <input type="text" required placeholder=" " className="uppercase"
              value={novoUser.nome || ''}
              onChange={e => setNovoUser({...novoUser, nome: e.target.value.toUpperCase()})}
            />
            <label>Nome Completo *</label>
          </div>

          <div className="input-group">
            <input type="text" required placeholder=" " value={novoUser.cpf || ''} onChange={handleCPF} />
            <label>CPF *</label>
          </div>

          <div className="input-group">
            <input type="text" required placeholder=" " value={novoUser.telefone || ''} onChange={handleTelefone} />
            <label>Telefone *</label>
          </div>

          <div className="input-group">
            <input type="email" required placeholder=" " className="lowercase"
              value={novoUser.email || ''}
              onChange={e => setNovoUser({...novoUser, email: e.target.value.toLowerCase()})}
            />
            <label>E-mail *</label>
          </div>

          <div className="input-group">
            <input type="password" required={!novoUser.id} placeholder=" " value={novoUser.senha || ''}
              onChange={e => setNovoUser({...novoUser, senha: e.target.value})}
            />
            <label>{novoUser.id ? 'Senha (deixe vazio p/ manter)' : 'Senha Provisória *'}</label>
          </div>

          <div className="input-group">
            <select required value={novoUser.perfil || ''} onChange={e => setNovoUser({...novoUser, perfil: e.target.value})}>
              <option value="" disabled hidden></option>
              {Object.entries(perfilNome).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
            <label>Perfil de Acesso *</label>
          </div>

          <div className="input-group">
            <select required value={novoUser.condominio_id || ''} onChange={e => setNovoUser({...novoUser, condominio_id: e.target.value})}>
              <option value="" disabled hidden></option>
              {condominios.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
            <label>Condomínio *</label>
          </div>

          <div className="input-group flex-row span-2">
            <div className="sub-group flex-1">
               <input type="text" placeholder=" " className="uppercase" value={novoUser.bloco || ''}
                 onChange={e => setNovoUser({...novoUser, bloco: e.target.value.toUpperCase()})} />
               <label>Bloco / Rua</label>
            </div>
            <div className="sub-group flex-1">
               <input type="text" placeholder=" " className="uppercase" value={novoUser.numero_casa || ''}
                 onChange={e => setNovoUser({...novoUser, numero_casa: e.target.value.toUpperCase()})} />
               <label>Nº Unidade</label>
            </div>
          </div>

          {/* CAMPO STATUS */}
          <div className="input-group span-2">
            <select name="status" value={novoUser.status} onChange={handleChange} className="status-select">
              <option value="true">ATIVO</option>
              <option value="false">INATIVO</option>
            </select>
            <label>Situação do Usuário</label>
          </div>
        </div>
      </fieldset>

      <div className="form-footer">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          {isViewOnly ? "FECHAR" : "CANCELAR"}
        </button>
        {!isViewOnly && (
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
          </button>
        )}
      </div>
    </form>
  );
}
