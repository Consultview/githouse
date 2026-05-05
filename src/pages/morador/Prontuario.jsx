import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProntuario } from '../../hooks/useProntuario';
import { prontuarioService } from '../../services/prontuarioService';

import Sidebar from '../../components/Sidebar';

import CardDados from '../../components/CardDados';
import CardDocumento from '../../components/CardDocumento';
import CardUpload from '../../components/CardUpload';

import './prontuario.css';

export default function Prontuario() {

  const { user } = useAuth();
  const { usuario, morador, documentos, fetchData, loading } = useProntuario(user);

  const [uploading, setUploading] = useState(false);

  // 🔥 RESTAURADO (ESSENCIAL)
  const [files, setFiles] = useState({
    identidade: null,
    contrato: null
  });

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  // 🔥 RESTAURADO
  const handleSelectFile = (file, tipo) => {
    if (!file) return;

    setFiles(prev => ({
      ...prev,
      [tipo]: file
    }));
  };

  // 🔥 ESSA FUNÇÃO É DAQUI (Prontuario.jsx)
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
  origem: 'morador' // 🔥 ESSENCIAL
});

      // limpa arquivo após upload
      setFiles(prev => ({
        ...prev,
        [tipo]: null
      }));

      await fetchData();

    } catch (err) {
      console.error(err);
      alert('Erro no upload');
    } finally {
      setUploading(false);
    }
  };

  const identidade = documentos.find(d => d.tipo === 'identidade');



const contratoSindico = documentos
  .filter(d => d.tipo === 'contrato' && d.origem === 'sindico')
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

const contratoMorador = documentos
  .filter(d => d.tipo === 'contrato' && d.origem === 'morador')
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

  


  
 
  if (loading) return <div className="pt-loading">Carregando...</div>;

  return (
    <div className="pt-wrapper">
      <Sidebar user={user} />

      <main className="pt-content">
        <h1>Prontuário</h1>

        <div className="pt-grid">

          {/* 👤 DADOS */}
          <CardDados usuario={usuario} />

        



<CardDocumento
  titulo="Contrato para Assinatura"
  tipo="contrato"
  descricao={
    contratoSindico
      ? "Baixe o contrato, faça a assinatura via Gov.br."
      : "Aguardando envio do contrato pelo síndico."
  }
  documento={contratoSindico}
  readOnly={true} // 🔥 MELHOR QUE hideUpload
/>


<CardDocumento
  titulo="Identidade / CNH"
  tipo="identidade"
  descricao="Adicione a identidade ou CNH em formato JPEG, PNG ou PDF (máx. 4MB). Envie um arquivo legível e sem cortes. Após o envio, aguarde a aprovação do documento."
  documento={identidade}
  file={files.identidade}
  onSelect={handleSelectFile}
  onUpload={handleUpload}
  loading={uploading}
/>


<CardDocumento
  titulo="Enviar Contrato Assinado"
  tipo="contrato"
  descricao={
    contratoSindico
      ? "Envie o contrato assinado. Após o envio, aguarde a aprovação do documento."
      : "Aguardando contrato do síndico para liberação do envio."
  }
  documento={contratoMorador}
  file={files.contrato}
  onSelect={handleSelectFile}
  onUpload={handleUpload}
  loading={uploading}
  disabled={!contratoSindico} // 🔥 BLOQUEIO
/>

        </div>
      </main>
    </div>
  );
}
