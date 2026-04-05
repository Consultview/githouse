import React from 'react';
import './form.css'; // CERTIFIQUE-SE QUE O ARQUIVO SE CHAMA form.css

export default function FormUsuario({ novoUser, setNovoUser, onSave, onCancel, saving, condominios = [] }) {
  
  // Proteção: Se novoUser não existir ainda, evita que a tela fique branca
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

  return (
    <section className="form-container anim-up">
      <form onSubmit={onSave} className="modern-form">
        <h2 className="form-title">Novo Usuário</h2>

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
            <input type="password" required placeholder=" " value={novoUser.senha || ''}
              onChange={e => setNovoUser({...novoUser, senha: e.target.value})}
            />
            <label>Senha Provisória *</label>
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
            <div className="sub-group">
               <input type="text" placeholder=" " className="uppercase" value={novoUser.bloco || ''}
                 onChange={e => setNovoUser({...novoUser, bloco: e.target.value.toUpperCase()})} />
               <label>Bloco / Rua</label>
            </div>
            <div className="sub-group">
               <input type="text" placeholder=" " className="uppercase" value={novoUser.numero_casa || ''}
                 onChange={e => setNovoUser({...novoUser, numero_casa: e.target.value.toUpperCase()})} />
               <label>Nº Unidade</label>
            </div>
          </div>
        </div>

        <div className="form-footer">
          <button type="button" className="btn-secondary" onClick={onCancel}>CANCELAR</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "SALVANDO..." : "SALVAR CADASTRO"}
          </button>
        </div>
      </form>
    </section>
  );
}
