import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../SupabaseClient';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import './detalheDocumento.css';

export default function DetalheDocumento() {
  const { id } = useParams();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data, error } = await supabase
        .from('moradores')
        .select(`
          *,
          usuarios (
            id,
            nome,
            email,
            perfil
          )
        `)
        .eq('id', Number(id))
        .single();

      if (error) {
        console.error(error);
        setData(null);
      } else {
        setData(data);
      }

      setLoading(false);
    }

    load();
  }, [id]);

  const updateStatus = async (campo, status) => {
    const { error } = await supabase
      .from('moradores')
      .update({ [campo]: status })
      .eq('id', Number(id));

    if (!error) {
      setData((prev) => ({
        ...prev,
        [campo]: status
      }));
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (!data) return <div>Não encontrado</div>;

  const usuario = data.usuarios;

  return (
    <div className="detalhe-container">

      <Sidebar user={user} />

      <main className="detalhe-content">

        <h1>Detalhe do Morador</h1>

        <section className="card">
          <h2>Usuário</h2>
          <p>Nome: {usuario?.nome}</p>
          <p>Email: {usuario?.email}</p>
        </section>

        <section className="card">
          <h2>Identidade</h2>

          <p>Status: {data.status_identidade}</p>

          <button onClick={() => updateStatus('status_identidade', 'APROVADO')}>
            Aprovar
          </button>

          <button onClick={() => updateStatus('status_identidade', 'RECUSADO')}>
            Recusar
          </button>

          {data.url_identidade && (
            <a href={data.url_identidade} target="_blank">
              Ver documento
            </a>
          )}
        </section>

        <section className="card">
          <h2>Contrato</h2>

          <p>Status: {data.status_contrato}</p>

          <button onClick={() => updateStatus('status_contrato', 'APROVADO')}>
            Aprovar
          </button>

          <button onClick={() => updateStatus('status_contrato', 'RECUSADO')}>
            Recusar
          </button>

          {data.url_contrato_locacao && (
            <a href={data.url_contrato_locacao} target="_blank">
              Ver contrato
            </a>
          )}
        </section>

        <section className="card">
          <h2>Financeiro</h2>

          <p>Status: {data.status_financeiro}</p>

          <button onClick={() => updateStatus('status_financeiro', 'APROVADO')}>
            Aprovar
          </button>

          <button onClick={() => updateStatus('status_financeiro', 'RECUSADO')}>
            Recusar
          </button>

          {data.url_ultimo_comprovante_pagamento && (
            <a href={data.url_ultimo_comprovante_pagamento} target="_blank">
              Ver comprovante
            </a>
          )}
        </section>

      </main>
    </div>
  );
}
