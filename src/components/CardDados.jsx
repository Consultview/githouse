// pages/morador/components/CardDados.jsx

export default function CardDados({ usuario }) {
  return (
    <div className="pt-card">
      <h3>Dados do Morador</h3>

      <p><strong>Nome:</strong> {usuario?.nome}</p>
      <p><strong>Email:</strong> {usuario?.email}</p>
      <p><strong>Telefone:</strong> {usuario?.telefone || '-'}</p>
    </div>
  );
}
