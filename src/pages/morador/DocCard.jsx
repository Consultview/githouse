import React, { useMemo } from 'react';

export default function DocCard({ item, navigate }) {

  const status = useMemo(() => {
    const statusDocs = [
      item.status_identidade, 
      item.status_contrato, 
      item.status_financeiro
    ];

    // Se qualquer um for recusado, o card marca como Recusado
    if (statusDocs.includes('RECUSADO')) {
      return { label: 'Recusado', class: 'st-cancelado' };
    }

    // Se Identidade e Contrato estiverem validados, está Aprovado
    if (item.status_identidade === 'VALIDADO' && item.status_contrato === 'VALIDADO') {
      return { label: 'Aprovado', class: 'st-concluido' };
    }

    return { label: 'Pendente', class: 'st-aberto' };
  }, [item]);

  // AJUSTE: Navegação passando o ID via state (necessário para seu DetalheDocumento)
  const go = () => navigate(`/detalhedoc/${item.id}`, { state: { id: item.id } });

  // Cálculo de progresso baseado nos 3 documentos da sua tabela
  const aprovados = 
    (item.status_identidade === 'VALIDADO' ? 1 : 0) +
    (item.status_contrato === 'VALIDADO' ? 1 : 0) +
    (item.status_financeiro === 'VALIDADO' ? 1 : 0);

  const progresso = (aprovados / 3) * 100;

  return (
    <div className="condo-card">
      <div className="card-header">
        <span>ID #{String(item.id).padStart(4, '0')}</span>
        <span className={`status-pill ${status.class}`}>
          {status.label}
        </span>
      </div>

      <div className="card-body" onClick={go} style={{ cursor: 'pointer' }}>
        {/* EXIBIÇÃO DO NOME REAL */}
        <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '5px' }}>
          {item.usuarios?.nome || `Morador #${item.id}`}
        </strong>

        <div style={{ fontSize: '0.9rem', color: '#666' }}>
          Unidade: {item.unidade || '-'} | Bloco: {item.bloco || '-'}
        </div>

        <div className="progress-container" style={{ marginTop: '15px' }}>
          <small>Progresso da validação: {Math.round(progresso)}%</small>
          <div className="progress-bar" style={{ height: '8px', backgroundColor: '#eee', borderRadius: '4px', marginTop: '5px' }}>
            <div
              className="progress-fill"
              style={{ 
                width: `${progresso}%`, 
                height: '100%', 
                backgroundColor: progresso === 100 ? '#2ecc71' : '#f1c40f',
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>
      </div>

      <div className="card-footer">
        <button onClick={go} className="btn-analisar">
          Analisar Documentos
        </button>
      </div>
    </div>
  );
}
