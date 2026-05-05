import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { prontuarioService } from '../../services/prontuarioService';
import './validacaodocumento.css';

export default function ValidacaoDocumentos() {

  const { user, loadingAuth } = useAuth();
  const [lista, setLista] = useState([]);

  // 🔥 controle correto por documento
  const [aberto, setAberto] = useState({
    docId: null,
    moradorId: null
  });

  useEffect(() => {
    if (!loadingAuth && user) {
      loadData();
    }
  }, [loadingAuth, user]);

  const loadData = async () => {
    const data = await prontuarioService.getProntuariosParaValidacao();
    setLista(data || []);
  };

  const aprovar = async (id) => {
    await prontuarioService.aprovarDocumento(id);
    loadData();
  };

  const rejeitar = async (id) => {
    await prontuarioService.rejeitarDocumento(id);
    loadData();
  };

  if (loadingAuth) {
    return <div className="docs-loading">Carregando...</div>;
  }

  return (
    <div className="docs-layout">

      <Sidebar user={user} />

      <main className="docs-content">

        <h1>Validação de Documentos</h1>

        <div className="docs-grid">

          {lista.map((item) => (

            <div key={item.id} className="doc-card">

              <div className="doc-header">
                <h3>{item.usuarios?.nome || 'Sem nome'}</h3>

                {/* 🔥 corrigido: não é ID do morador, é do usuário */}
                <span className="txt-small">
                  Usuário #{item.usuario_id}
                </span>
              </div>

              {(item.documentos || []).map((doc) => (

                <div key={doc.id} className="doc-item">

                  <div className="doc-top">

                    <span className="doc-tipo">{doc.tipo}</span>

                    <span className={`status-badge ${doc.status}`}>
                      {doc.status}
                    </span>

                    <button
                      className="btn-view"
                      onClick={() =>
                        setAberto({
                          docId: aberto.docId === doc.id ? null : doc.id,
                          moradorId: item.id
                        })
                      }
                    >
                      Ver
                    </button>

                  </div>

                  {aberto.docId === doc.id && (

                    <div className="doc-preview">

                      {/* 🔥 preview mais seguro */}
                      <iframe
                        src={doc.url}
                        title="documento"
                      />

                      {doc.status === 'pendente' && (
                        <div className="doc-actions">

                          <button
                            className="btn-ok"
                            onClick={() => aprovar(doc.id)}
                          >
                            Aprovar
                          </button>

                          <button
                            className="btn-bad"
                            onClick={() => rejeitar(doc.id)}
                          >
                            Rejeitar
                          </button>

                        </div>
                      )}

                    </div>

                  )}

                </div>

              ))}

            </div>

          ))}

        </div>

      </main>
    </div>
  );
}
