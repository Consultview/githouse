import React from 'react';

export default function DocItem({ doc, perms, onChangeStatus }) {

  const config = {
    PENDENTE: { label: 'Pendente', class: 'st-aberto' },
    VALIDADO: { label: 'Aprovado', class: 'st-concluido' },
    RECUSADO: { label: 'Recusado', class: 'st-cancelado' }
  };

  const isValidUrl = (url) => {
    return typeof url === 'string' && url.trim().length > 0;
  };

  // 🔥 status dinâmico (compatível com seu banco real)
  const status =
    doc.status_identidade ||
    doc.status_contrato ||
    doc.status_financeiro ||
    'PENDENTE';

  const statusInfo = config[status] || config.PENDENTE;

  return (
    <div className="doc-item">

      <div className="doc-header">
        <strong>{doc.tipo || 'Documento'}</strong>

        <span className={`status-pill ${statusInfo.class}`}>
          {statusInfo.label}
        </span>
      </div>

      <div className="doc-body">

        {isValidUrl(doc.url) ? (
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-view"
          >
            📄 Visualizar arquivo
          </a>
        ) : (
          <span className="no-file">
            Nenhum arquivo enviado
          </span>
        )}

        {perms?.editar && (
          <div className="doc-actions">

            <select
              value={status}
              onChange={(e) => {
                onChangeStatus?.(doc.id, e.target.value);
              }}
            >
              <option value="PENDENTE">Pendente</option>
              <option value="VALIDADO">Aprovar</option>
              <option value="RECUSADO">Recusar</option>
            </select>

          </div>
        )}

      </div>

    </div>
  );
}
