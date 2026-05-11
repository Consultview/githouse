export default function CardDocumento({
  titulo,
  tipo,
  descricao,
  documento,
  file,
  onSelect,
  onUpload,
  loading,
  readOnly = false
}) {

  const isImage = (url) => {
    if (!url) return false;
    return url.match(/\.(jpeg|jpg|png|webp)$/i);
  };

  const isAprovado = documento?.status === 'aprovado';

  return (
    <div className="card-body-inner">
      <div className="name-cell">
        <strong>{titulo}</strong>
        {descricao && <span style={{ textTransform: 'none', fontSize: '11px' }}>{descricao}</span>}
      </div>

      <div className="info-grid">
        {/* EXIBIÇÃO DE OBSERVAÇÕES (Onde corrigimos o problema do texto) */}
        {documento?.observacoes && (
          <div className="info-block" style={{ gridColumn: 'span 2' }}>
            <label>{documento.status === 'rejeitado' ? 'Motivo da Rejeição' : 'Observações'}</label>
            <p style={{ color: documento.status === 'rejeitado' ? '#b91c1c' : '#334155' }}>
              {/* Garantimos que exiba o texto. Se vier '1', o problema está no componente de quem envia o dado (Admin) */}
              {documento.observacoes}
            </p>
          </div>
        )}

        {/* PREVIEW */}
        {documento?.url && (
          <div className="info-block" style={{ gridColumn: 'span 2' }}>
            <label>Arquivo atual</label>
            <div className="pt-preview" style={{ marginTop: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
              {isImage(documento.url) ? (
                <a href={documento.url} target="_blank" rel="noreferrer">
                  <img src={documento.url} alt="preview" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                </a>
              ) : (
                <a href={documento.url} target="_blank" rel="noreferrer" className="btn-view" style={{ margin: '10px' }}>
                  📄 Abrir PDF
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER COM INPUT DE UPLOAD IGUAL AO PADRÃO DO SISTEMA */}
      {!readOnly && !isAprovado && (
        <div className="card-footer" style={{ padding: 0, marginTop: '20px' }}>
          <div className="upload-section">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              style={{ fontSize: '11px', marginBottom: '10px', width: '100%' }}
              onChange={(e) => onSelect?.(e.target.files[0], tipo)}
            />
            
            {file && <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px' }}>📎 {file.name}</p>}

            <button 
              onClick={() => onUpload?.(tipo)} 
              disabled={!file || loading}
              className="btn-view"
              style={{ background: file ? '#111827' : '#f1f5f9', color: file ? '#fff' : '#94a3b8' }}
            >
              {loading ? 'ENVIANDO...' : 'CLIQUE PARA ENVIAR'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
