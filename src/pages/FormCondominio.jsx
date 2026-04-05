import React from 'react';
import './form.css';

export default function FormCondominio({ novoCondo, setNovoCondo, onSave, onCancel, saving }) {
  
  const handleKeyPressNumeric = (e) => { 
    if (!/[0-9]/.test(e.key)) e.preventDefault(); 
  };

  const handleCEPBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br{cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setNovoCondo({
            ...novoCondo,
            endereco: data.logradouro.toUpperCase(),
            bairro: data.bairro.toUpperCase(),
            cidade: data.localidade.toUpperCase(),
            estado: data.uf.toUpperCase()
          });
        }
      } catch (err) { console.error("Erro CEP"); }
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cnpj') {
      value = value.replace(/\D/g, '').slice(0, 14).replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
    } else if (name === 'cep') {
      value = value.replace(/\D/g, '').slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2');
    } else if (name === 'telefone') {
      value = value.replace(/\D/g, '').slice(0, 11).replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
    } else if (name !== 'email_contato') { value = value.toUpperCase(); }
    setNovoCondo({ ...novoCondo, [name]: value });
  };

  return (
    <section className="form-container anim-up">
      <form onSubmit={onSave} className="modern-form">
        <h2 className="form-title">Cadastro de Condomínio</h2>
        
        <div className="form-grid">
          {/* NOME */}
          <div className="input-group span-2">
            <input name="nome" value={novoCondo.nome} onChange={handleChange} required placeholder=" " className="uppercase" />
            <label>Nome do Condomínio *</label>
          </div>

          {/* CNPJ */}
          <div className="input-group">
            <input name="cnpj" value={novoCondo.cnpj} onChange={handleChange} onKeyPress={handleKeyPressNumeric} required placeholder=" " />
            <label>CNPJ *</label>
          </div>

          {/* TELEFONE */}
          <div className="input-group">
            <input name="telefone" value={novoCondo.telefone} onChange={handleChange} onKeyPress={handleKeyPressNumeric} placeholder=" " />
            <label>Telefone</label>
          </div>

          {/* CEP */}
          <div className="input-group">
            <input name="cep" value={novoCondo.cep} onChange={handleChange} onBlur={handleCEPBlur} onKeyPress={handleKeyPressNumeric} required placeholder=" " />
            <label>CEP *</label>
          </div>

          {/* ENDEREÇO */}
          <div className="input-group span-2">
            <input name="endereco" value={novoCondo.endereco} onChange={handleChange} placeholder=" " className="uppercase" />
            <label>Endereço / Logradouro</label>
          </div>

          {/* NÚMERO */}
          <div className="input-group">
            <input name="numero" value={novoCondo.numero} onChange={handleChange} placeholder=" " className="uppercase" />
            <label>Número</label>
          </div>

          {/* BAIRRO */}
          <div className="input-group">
            <input name="bairro" value={novoCondo.bairro} onChange={handleChange} placeholder=" " className="uppercase" />
            <label>Bairro</label>
          </div>

          {/* CIDADE E UF */}
          <div className="input-group flex-row">
            <div className="sub-group flex-3">
               <input name="cidade" value={novoCondo.cidade} onChange={handleChange} placeholder=" " className="uppercase" />
               <label>Cidade</label>
            </div>
            <div className="sub-group flex-1">
               <input name="estado" value={novoCondo.estado} onChange={handleChange} maxLength="2" placeholder=" " className="uppercase" />
               <label>UF</label>
            </div>
          </div>

          {/* EMAIL */}
          <div className="input-group span-2">
            <input type="email" name="email_contato" value={novoCondo.email_contato} onChange={handleChange} placeholder=" " className="lowercase" />
            <label>E-mail de Contato</label>
          </div>
        </div>

        <div className="form-footer">
          <button type="button" className="btn-secondary" onClick={onCancel}>CANCELAR</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "SALVANDO..." : "SALVAR CONDOMÍNIO"}
          </button>
        </div>
      </form>
    </section>
  );
}
