import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { prontuarioService } from '../../services/prontuarioService';
import './validacaodocumento.css';

export default function ValidacaoDocumentos() {
  const { user, loadingAuth } = useAuth();
  const [lista, setLista] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      // Passa o objeto do usuário para filtrar por condomínio se necessário
      const data = await prontuarioService.getProntuariosParaValidacao(user);
      setLista(data || []);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    if (!loadingAuth && user) {
      loadData();
    }
  }, [loadingAuth, user, loadData]);

  const aprovar = async (id) => {
    try {
      await prontuarioService.aprovarDocumento(id, user?.perfil);
      setPreviewDoc(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const rejeitar = async (id) => {
    try {
      const motivo = window.prompt("Digite o motivo da rejeição:");
      if (motivo === null) return;
      await prontuarioService.rejeitarDocumento(id, user?.perfil, motivo);
      setPreviewDoc(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loadingAuth || !user) return null;

  return (
    <div className="ch-app-wrapper">
      <Sidebar user={user} isOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />

      <main className="ch-main-content">
        <div className="page-container">
          <header className="top-actions">
            <h2>Validação de Documentos</h2>
          </header>

          <div className="data-display-area">
            <div className="table-responsive">
              <table className="standard-table">
                <thead>
                  <tr>
                    <th className="col-id">ID</th>
                    <th>USUÁRIO</th>
                    <th>DOCUMENTO</th>
                    <th>STATUS</th>
                    <th className="col-actions">AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((item) => (
                    <tr key={item.id}>
                      <td className="text-id">#{item.id.toString().padStart(4, '0')}</td>
                      <td>
                        <div className="user-info-cell">
                          <span className="text-bold">{item.usuarios?.nome || 'Sem nome'}</span>
                          <small>Usuário #{item.usuario_id}</small>
                        </div>
                      </td>
                      <td>
                        <div className="doc-list">
                          {item.documentos?.map((doc) => (
                            <div key={doc.id} className="doc-chip">{doc.tipo}</div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="doc-list">
                          {item.documentos?.map((doc) => (
                            <span key={doc.id} className={`status-pill ${doc.status}`}>{doc.status}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="doc-actions-list">
                          {item.documentos?.map((doc) => (
                            <div key={doc.id} className="table-actions-group">
                              <button className="btn-icon-action" onClick={() => setPreviewDoc(doc)}>👁️</button>
                              {doc.status === 'pendente' && (
                                <>
                                  <button className="btn-icon-action success" onClick={() => aprovar(doc.id)}>✔️</button>
                                  <button className="btn-icon-action danger" onClick={() => rejeitar(doc.id)}>❌</button>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {previewDoc && (
        <div className="modal-overlay" onClick={() => setPreviewDoc(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{previewDoc.tipo}</h2>
              <button onClick={() => setPreviewDoc(null)}>&times;</button>
            </div>
            <iframe src={previewDoc.url} title="documento" style={{width: '100%', height: '500px', border: 'none'}} />
          </div>
        </div>
      )}
    </div>
  );
}
