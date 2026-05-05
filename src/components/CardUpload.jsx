// components/CardUpload.jsx

export default function CardUpload({
  titulo,
  tipo,
  file,
  onSelect,
  onUpload,
  loading
}) {
  return (
    <div className="pt-card">
      <h3>{titulo}</h3>

      <input
        type="file"
        onChange={(e) => onSelect(e.target.files[0], tipo)}
      />

      {file && (
        <p className="pt-file-name">
          📎 {file.name}
        </p>
      )}

      <button onClick={() => onUpload(tipo)} disabled={!file || loading}>
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
    </div>
  );
}
