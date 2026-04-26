import React, { useEffect, useState } from 'react';
import { supabase } from '../../SupabaseClient';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/Sidebar';
import './prontuario.css';

export default function Prontuario() {
  const { user } = useAuth();

  const [morador, setMorador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // 📥 BUSCAR DADOS DO MORADOR
  async function fetchData() {
    setLoading(true);

    const { data, error } = await supabase
      .from('moradores')
      .select('*')
      .eq('usuario_id', user.id)
      .single();

    if (!error) setMorador(data);

    setLoading(false);
  }

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // 📤 UPLOAD + UPDATE DIRETO NA TABELA
  async function uploadFile(file, fieldUrl, fieldStatus) {
    try {
      setUploading(true);

      const fileName = `${user.id}_${fieldUrl}_${Date.now()}`;

      const { error: uploadError } = await supabase.storage
        .from('anexos')
        .upload(fileName, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('anexos')
        .getPublicUrl(fileName);

      const url = data.publicUrl;

      await supabase
        .from('moradores')
        .update({
          [fieldUrl]: url,
          [fieldStatus]: 'PENDENTE',
          updated_at: new Date()
        })
        .eq('id', morador.id);

      fetchData();

    } catch (err) {
      console.error(err);
      alert('Erro ao enviar documento');
    } finally {
      setUploading(false);
    }
  }

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="app-wrapper">
      <Sidebar user={user} />

      <main className="content">

        <h1>📁 Prontuário do Morador (SaaS)</h1>

        {/* 🏠 DADOS GERAIS */}
        <div className="card">
          <h2>Financeiro</h2>
          <p>Status: {morador.status_financeiro || 'PENDENTE'}</p>
          <p>Mês Pago: {morador.mes_referencia_pago || '-'}</p>
          <p>Último envio: {morador.data_envio_pagamento || '-'}</p>
        </div>

        {/* 🪪 IDENTIDADE */}
        <div className="card">
          <h2>Identidade</h2>

          {morador.url_identidade && (
            <a href={morador.url_identidade} target="_blank">
              Visualizar documento
            </a>
          )}

          <input
            type="file"
            onChange={(e) =>
              uploadFile(
                e.target.files[0],
                'url_identidade',
                'status_identidade'
              )
            }
          />

          <Status status={morador.status_identidade} />
        </div>

        {/* 📄 CONTRATO */}
        <div className="card">
          <h2>Contrato de Locação</h2>

          {morador.url_contrato_locacao && (
            <a href={morador.url_contrato_locacao} target="_blank">
              Visualizar contrato
            </a>
          )}

          <input
            type="file"
            onChange={(e) =>
              uploadFile(
                e.target.files[0],
                'url_contrato_locacao',
                'status_contrato'
              )
            }
          />

          <Status status={morador.status_contrato} />
        </div>

        {/* 💰 COMPROVANTE */}
        <div className="card">
          <h2>Comprovante de Pagamento</h2>

          {morador.url_ultimo_comprovante_pagamento && (
            <a href={morador.url_ultimo_comprovante_pagamento} target="_blank">
              Ver comprovante
            </a>
          )}

          <input
            type="file"
            onChange={(e) =>
              uploadFile(
                e.target.files[0],
                'url_ultimo_comprovante_pagamento',
                'status_financeiro'
              )
            }
          />

          <p>Mês referência: {morador.mes_referencia_pago || '-'}</p>
        </div>

        {/* 📝 OBSERVAÇÕES ADMIN */}
        <div className="card">
          <h2>Observações da Administração</h2>
          <textarea
            value={morador.observacoes || ''}
            onChange={(e) =>
              setMorador({ ...morador, observacoes: e.target.value })
            }
          />

          <button
            onClick={async () => {
              await supabase
                .from('moradores')
                .update({ observacoes: morador.observacoes })
                .eq('id', morador.id);

              alert('Salvo!');
            }}
          >
            Salvar observações
          </button>
        </div>

      </main>
    </div>
  );
}

// 🟡 STATUS VISUAL SAAS
function Status({ status }) {
  const color =
    status === 'APROVADO'
      ? 'green'
      : status === 'REJEITADO'
      ? 'red'
      : 'orange';

  return (
    <div style={{ color, fontWeight: 'bold' }}>
      {status || 'PENDENTE'}
    </div>
  );
}
