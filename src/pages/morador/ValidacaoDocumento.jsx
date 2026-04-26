import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { useUsuarios } from '../../hooks/useUsuarios';
import './validacaodocumento.css';

export default function ValidacaoDocumentos() {
  const navigate = useNavigate();
  const { user, loadingAuth } = useAuth();
  const { users, fetchData, loading } = useUsuarios();

  const [menuOpen, setMenuOpen] = useState(false);

  const perfil = Number(user?.perfil) || 99;

  useEffect(() => {
    if (!loadingAuth && user) fetchData();
  }, [loadingAuth, user, fetchData]);

  const baseList = useMemo(() => {
    if (!Array.isArray(users)) return [];

    if (perfil === 1 || perfil === 3) return users;

    return users.filter(
      (u) => String(u.condominio_id) === String(user?.condominio_id)
    );
  }, [users, perfil, user]);

  if (loadingAuth || loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="docs-app-container">

      <Sidebar
        user={user}
        isOpen={menuOpen}
        toggleMenu={() => setMenuOpen(!menuOpen)}
      />

      <main className="docs-main-content">

        <h1>Validação de Documentos</h1>

        <table className="docs-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Morador</th>
              <th>Unidade</th>
              <th>Ação</th>
            </tr>
          </thead>

          <tbody>
            {baseList.map((item) => (
              <tr key={item.id}>
                <td>#{String(item.id).padStart(4, '0')}</td>

                <td>
                  {item.usuarios?.nome || 'Sem nome'}
                </td>

                <td>
                  {item.unidade} {item.bloco && `- ${item.bloco}`}
                </td>

                <td>
                  <button
                    className="btn-analisar"
                    onClick={() => navigate(`/detalhedoc/${item.id}`)}
                  >
                    Abrir
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </main>
    </div>
  );
}
