export default function CardDocumento({
  titulo,
  tipo,
  descricao, // 🔥 NOVO
  documento,
  file,
  onSelect,
  onUpload,
  loading
}) {

  const getStatusClass = (status) => {
    switch (status) {
      case 'aprovado':
        return 'pt-status aprovado';
      case 'rejeitado':
        return 'pt-status rejeitado';
      default:
        return 'pt-status pendente';
    }
  };

  const isImage = (url) => {
    if (!url) return false;
    return url.match(/\.(jpeg|jpg|png|webp)$/i);
  };

  return (
    <div className="pt-card">
      <h3>{titulo}</h3>

      {/* 📌 DESCRIÇÃO */}
      {descricao && (
        <p className="pt-desc">{descricao}</p>
      )}

      {/* STATUS */}
{documento?.status === 'pendente' && (
  <p className="pt-info">
    Documento em análise. Aguarde aprovação.
  </p>
)}

      
   

      {/* PREVIEW */}
      {documento && (
        <div className="pt-preview">
          {isImage(documento.url) ? (
            <a href={documento.url} target="_blank" rel="noreferrer">
              <img src={documento.url} alt="preview" />
            </a>
          ) : (
            <iframe src={documento.url} title="preview" />
          )}
        </div>
      )}

      {/* UPLOAD */}
      <input
        type="file"
        onChange={(e) => onSelect(e.target.files[0], tipo)}
      />

      {file && (
        <p className="pt-file-name">📎 {file.name}</p>
      )}

      <button onClick={() => onUpload(tipo)} disabled={!file || loading}>
        {loading ? 'Enviando...' : 'Enviar'}
      </button>

    </div>
  );
}
