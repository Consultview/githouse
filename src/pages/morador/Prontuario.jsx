import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProntuario } from '../../hooks/useProntuario';
import { prontuarioService } from '../../services/prontuarioService';
import Sidebar from '../../components/Sidebar';
import CardDados from '../../components/CardDados';
import CardDocumento from '../../components/CardDocumento';

// Importe o seu CSS de condomínios aqui
import '../styles/condominios.css'; 

export default function Prontuario() {
  const { user } = useAuth();
  const { usuario, morador, documentos, fetchData, loading } = useProntuario(user);

  const [uploading, setUploading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [files, setFiles] = useState({ identidade: null, contrato: null });

  useEffect(() => {
    if (user?.email) fetchData();
  }, [user?.email, fetchData]);

  const handleSelectFile = (file, tipo) => {
    if (!file) return;
    setFiles(prev => ({ ...prev, [tipo]: file }));
  };

  const handleUpload = async (tipo) => {
    const file = files[tipo];
    if (!file || !user?.id || !morador?.id) return;

    try {
      setUploading(true);
      await prontuarioService.uploadDocumento({
        file,
        userId: user.id,
        moradorId: morador.id,
        tipo,
        origem: 'morador'
      });
      setFiles(prev => ({ ...prev, [tipo]: null }));
      await fetchData();
    } catch (err) {
      alert('Erro no upload');
    } finally {
      setUploading(false);
    }
  };

  // Status seguindo exatamente as classes .status-pill .active/.inactive
  const renderStatus = (doc) => {
    if (!doc) return <span className="status-pill inactive">Pendente</span>;
    if (doc.status === 'aprovado') return <span className="status-pill active">Aprovado</span>;
    if (doc.status === 'rejeitado') return <span className="status-pill inactive">Rejeitado</span>;
    return <span className="status-pill active" style={{background: '#fef3c7', color: '#92400e'}}>Análise</span>;
  };

  const docIdade = useMemo(() => documentos.find(d => d.tipo === 'identidade'), [documentos]);
  const docContrato = useMemo(() => {
    return documentos
      .filter(d => d.tipo === 'contrato' && d.origem === 'morador')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
  }, [documentos]);

  return (
    <div className="ch-app-wrapper">
      <Sidebar user={user} isOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />

      <main className="ch-main-content">
        <div className="page-container">
          <div className="data-display-area">
            
            <div className="top-actions">
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827' }}>
                MEU PRONTUÁRIO
              </h2>
            </div>

            {loading ? (
              <p>Carregando...</p>
            ) : (
              <div className="condo-grid">
                
                {/* CARD 1: DADOS PESSOAIS */}
                <div className="condo-card">
                  <div className="card-header">
                    <span className="card-id">#PERFIL</span>
                    <span className="status-pill active">DADOS</span>
                  </div>
                  <div className="card-body">
                    <CardDados usuario={usuario} />
                  </div>
                </div>

                {/* CARD 2: IDENTIDADE */}
                <div className="condo-card">
                  <div className="card-header">
                    <span className="card-id">#DOC-001</span>
                    {renderStatus(docIdade)}
                  </div>
                  <div className="card-body">
                    <CardDocumento
                      titulo="Identidade / CNH"
                      tipo="identidade"
                      documento={docIdade}
                      file={files.identidade}
                      onSelect={handleSelectFile}
                      onUpload={handleUpload}
                      loading={uploading}
                    />
                  </div>
                </div>

                {/* CARD 3: CONTRATO */}
                <div className="condo-card">
                  <div className="card-header">
                    <span className="card-id">#DOC-002</span>
                    {renderStatus(docContrato)}
                  </div>
                  <div className="card-body">
                    <CardDocumento
                      titulo="Contrato Assinado"
                      tipo="contrato"
                      documento={docContrato}
                      file={files.contrato}
                      onSelect={handleSelectFile}
                      onUpload={handleUpload}
                      loading={uploading}
                    />
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
