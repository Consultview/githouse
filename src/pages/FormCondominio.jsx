import React from 'react';

export default function FormCondominio({ novoCondo, setNovoCondo, onSave, onCancel, saving }) {
  
  // Função para atualizar campos específicos do objeto novoCondo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoCondo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={onSave} className="modern-form">
      <div className="form-grid">
        
        {/* Nome do Condomínio */}
        <div className="input-group span-2">
          <input 
            name="nome"
            value={novoCondo.nome} 
            onChange={handleChange} 
            required 
            placeholder=" " 
          />
          <label>Nome do Condomínio *</label>
        </div>

        {/* CNPJ e Telefone */}
        <div className="input-group">
          <input 
            name="cnpj"
            value={novoCondo.cnpj} 
            onChange={handleChange} 
            required 
            placeholder=" " 
          />
          <label>CNPJ *</label>
        </div>

        <div className="input-group">
          <input 
            name="telefone"
            value={novoCondo.telefone} 
            onChange={handleChange} 
            placeholder=" " 
          />
          <label>Telefone</label>
        </div>

        {/* E-mail de Contato */}
        <div className="input-group span-2">
          <input 
            name="email_contato"
            type="email"
            value={novoCondo.email_contato} 
            onChange={handleChange} 
            placeholder=" " 
          />
          <label>E-mail de Contato</label>
        </div>

        {/* CEP e Bairro */}
        <div className="input-group">
          <input 
            name="cep"
            value={novoCondo.cep} 
            onChange={handleChange} 
            placeholder=" " 
          />
          <label>CEP</label>
        </div>

        <div className="input-group">
          <input 
            name="bairro"
            value={novoCondo.bairro} 
            onChange={handleChange} 
            placeholder=" " 
          />
          <label>Bairro</label>
        </div>

        {/* Endereço e Número */}
        <div className="input-group span-2">
          <input 
            name="endereco"
            value={novoCondo.endereco} 
            onChange={handleChange} 
            placeholder=" " 
          />
          <label>Endereço Completo</label>
        </div>

        {/* Cidade e Estado */}
        <div className="input-group">
          <input 
            name="cidade"
            value={novoCondo.cidade} 
            onChange={handleChange} 
            placeholder=" " 
          />
          <label>Cidade</label>
        </div>

        <div className="input-group">
          <input 
            name="estado"
            value={novoCondo.estado} 
            onChange={handleChange} 
            maxLength="2"
            placeholder=" " 
          />
          <label>UF (Estado)</label>
        </div>

      </div>

      <div className="form-footer">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          CANCELAR
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'SALVANDO...' : 'SALVAR CONDOMÍNIO'}
        </button>
      </div>
    </form>
  );
}
