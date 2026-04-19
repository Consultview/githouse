import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-grid">
          {/* Sobre */}
          <div className="footer-col">
            <h2 className="footer-logo">CITY<span>HOUSE</span></h2>
            <p className="footer-desc">
              Gestão Inteligente de Imóveis.
            </p>
          </div>

          {/* Contato */}
          <div className="footer-col">
            <h4>Contato</h4>
            <p>Telefone: (65) 99354-6706</p>
            <p>E-mail: tijacksonlima@proton.me</p>
            <p>Uberaba - MG</p>
          </div>
        </div>

        {/* Rodapé Final */}
        <div className="footer-bottom">
          <div className="footer-legal">
            <span>© 2026 CITYHOUSE. Todos os Direitos Reservados.</span>
          </div>
          
          <div className="footer-credits" style={{ fontSize: '12px', marginTop: '10px' }}>
            <span>Desenvolvido por </span>
            <a 
              href="https://detoxitsolutions.onrender.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#2563eb', 
                textDecoration: 'none', 
                fontWeight: '700' 
              }}
            >
              DETOX IT SOLUTIONS
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
