import React from 'react';

const NaoAutorizado = ({ aoVoltar }) => {
  return (
    <main className="sh-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '75vh' }}>
      <div className="marketing-hero" style={{ textAlign: 'center' }}>
        <span className="badge-premium" style={{ background: '#f59e0b', color: '#fff' }}>Acesso Restrito</span>
        
        <h1 style={{ marginTop: '20px', fontSize: '2.2rem' }}>Acesso Necessário</h1>
        
        <p style={{ maxWidth: '520px', margin: '20px auto', color: '#64748b', lineHeight: '1.6' }}>
          Este recurso ainda não está liberado para o seu perfil. 
          Clique abaixo para solicitar a ativação com o suporte CityHouse.
        </p>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
          <button 
            onClick={aoVoltar} 
            className="btn-main" 
            style={{ background: '#64748b', border: 'none', cursor: 'pointer', color: '#fff' }}
          >
            ← Voltar
          </button>
          
          <a 
            href="whatsapp://send?phone=5565993546706&text=Olá! Gostaria de solicitar acesso ao sistema CityHouse." 
            className="btn-main" 
            style={{ 
              background: '#25D366', 
              textDecoration: 'none', 
              color: '#fff',
              border: 'none',
              display: 'inline-block'
            }}
          >
            Solicitar via WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
};

export default NaoAutorizado;
