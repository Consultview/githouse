import React from 'react';

const DashboardIndicadores = () => {
  // Dados simulados
  const stats = {
    condominios: { ativos: 70, inativos: 30 }, // em porcentagem para o gráfico
    usuarios: 45,
    moradores: 120,
    chamados: 85
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ color: '#333', marginBottom: '30px' }}>Dashboard de Indicadores</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '25px' 
      }}>
        
        {/* Gráfico de Pizza (SVG) */}
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 20px 0', color: '#666' }}>Condomínios</h4>
          <svg width="150" height="150" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#eee" strokeWidth="3.5" />
            <circle cx="18" cy="18" r="16" fill="none" stroke="#4facfe" strokeWidth="3.5" 
              strokeDasharray={`${stats.condominios.ativos}, 100`} strokeLinecap="round" transform="rotate(-90 18 18)" />
          </svg>
          <div style={{ marginTop: '15px', fontSize: '14px', color: '#777' }}>
            <span style={{ color: '#4facfe' }}>●</span> {stats.condominios.ativos}% Ativos
          </div>
        </div>

        {/* Gráfico de Colunas (CSS Flex) */}
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 20px 0', color: '#666' }}>População</h4>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', height: '120px', width: '100%' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ background: '#667eea', width: '100%', height: '40%', borderRadius: '8px 8px 0 0' }}></div>
              <span style={{ fontSize: '12px', marginTop: '8px' }}>Usuários ({stats.usuarios})</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ background: '#764ba2', width: '100%', height: '90%', borderRadius: '8px 8px 0 0' }}></div>
              <span style={{ fontSize: '12px', marginTop: '8px' }}>Moradores ({stats.moradores})</span>
            </div>
          </div>
        </div>

        {/* Indicador de Chamados (Card Moderno) */}
        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#fff' }}>
          <h4 style={{ margin: '0', opacity: 0.9 }}>Total de Chamados</h4>
          <div style={{ fontSize: '48px', fontWeight: 'bold', margin: '15px 0' }}>{stats.chamados}</div>
          <div style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', fontSize: '12px' }}>
            +12% desde o último mês
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardIndicadores;
