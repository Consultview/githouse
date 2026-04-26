import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { useAcessos } from '../hooks/useAcessos';
import { acessosRepo } from '../database/AcessosRepo';
import './acessos.css';

const ESTRUTURA_MODULOS = [
  {
    categoria: "Operacional",
    itens: [
      { id: 'dash', label: 'Dashboard', desc: 'Métricas e performance' },
      { id: 'port', label: 'Portaria', desc: 'Controle de acesso e visitantes' },
      { id: 'cham', label: 'Chamados', desc: 'Tickets e manutenções' },
      { id: 'pets', label: 'Pets', desc: 'Cadastro de animais' },
      { id: 'pani', label: 'Pânico', desc: 'Alertas de emergência' }
    ]
  },
  {
    categoria: "Social & Reservas",
    itens: [
      { id: 'resv', label: 'Reservas', desc: 'Áreas comuns' },
      { id: 'avis', label: 'Mural de Avisos', desc: 'Comunicados' }
    ]
  },
  {
    categoria: "Administrativo",
    itens: [
      { id: 'cond', label: 'Condomínios', desc: 'Gestão de unidades' },
      { id: 'user', label: 'Usuários', desc: 'Perfis de acesso' },
      { id: 'mora', label: 'Moradores', desc: 'Gestão, Documentos e Multas' }, // Módulo Moradores adicionado
      { id: 'conf', label: 'Configurações', desc: 'Parâmetros do sistema' }
    ]
  }
];

export default function Acessos() {
  const { user, loadingAuth } = useAuth();
  const { condominios, permissoes, loading, loadCondos, loadPerms, togglePerm } = useAcessos();

  const [selectedOrg, setSelectedOrg] = useState("");
  const [activePerfil, setActivePerfil] = useState(1);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    loadCondos().then(data => {
      if (data?.length > 0) setSelectedOrg(data[0].id);
    });
  }, [loadCondos]);

  useEffect(() => {
    if (selectedOrg && activePerfil) {
      loadPerms(selectedOrg, activePerfil);
    }
  }, [selectedOrg, activePerfil, loadPerms]);

  const handleSalvar = async () => {
    if (!selectedOrg || !activePerfil) return;

    setSaving(true);
    try {
      // Coleta todos os IDs de módulos da estrutura atualizada
      const modulosIds = ESTRUTURA_MODULOS.flatMap(cat => cat.itens.map(i => i.id));

      const rows = modulosIds.map(mId => ({
        id_condominio: Number(selectedOrg),
        id_perfil: Number(activePerfil),
        modulo_id: mId,
        // O USO DE !! GARANTE QUE 'UNDEFINED' VIRE 'FALSE' E NÃO QUEBRE O BANCO
        p_ver: !!permissoes[`${mId}-Ver`],
        p_criar: !!permissoes[`${mId}-Criar`],
        p_editar: !!permissoes[`${mId}-Editar`],
        p_excluir: !!permissoes[`${mId}-Excluir`]
      }));

      await acessosRepo.upsertPermissoes(rows);
      
      // Recarrega as permissões para garantir que a UI está sincronizada
      await loadPerms(selectedOrg, activePerfil);

      alert("Privilégios de acesso atualizados!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar no Supabase: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loadingAuth || !user) return null;

  return (
    <div className="sh-layout-root">
      <Sidebar user={user} isOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />

      <main className="acessos-container">
        <header className="acessos-header">
          <div className="title-block">
            <h1>Privilégios de Acesso</h1>
            <p>Gerencie permissões para o módulo <strong>Moradores</strong> e outros.</p>
          </div>
          <div className="header-buttons">
            <button 
              className="btn-save" 
              onClick={handleSalvar} 
              disabled={saving || loading}
            >
              {saving ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
            </button>
          </div>
        </header>

        <section className="acessos-content">
          <div className="acessos-selectors">
            <div className="select-group">
              <label className="ch-label-mini">CONDOMÍNIO</label>
              <select
                className="ch-select-custom"
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
              >
                {condominios.map(c => (
                  <option key={c.id} value={c.id}>{c.nome.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="perfil-tabs-wrapper">
              <label className="ch-label-mini">PERFIL DE USUÁRIO</label>
              <div className="perfil-selector">
                {[
                  { id: 1, n: 'ADM' },
                  { id: 2, n: 'SUPORTE' },
                  { id: 3, n: 'SINDICO' },
                  { id: 4, n: 'TECNICO' },
                  { id: 5, n: 'MORADOR' }
                ].map(p => (
                  <button
                    key={p.id}
                    className={activePerfil === p.id ? 'active' : ''}
                    onClick={() => setActivePerfil(p.id)}
                  >
                    {p.n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="tree-wrapper">
            {loading ? (
              <div className="loader-perms">Sincronizando permissões...</div>
            ) : (
              ESTRUTURA_MODULOS.map((cat, idx) => (
                <div key={idx} className="tree-group">
                  <div className="tree-category">{cat.categoria}</div>
                  {cat.itens.map(mod => (
                    <div key={mod.id} className="tree-node">
                      <div className="node-info">
                        <span className="node-label">{mod.label}</span>
                        <span className="node-desc">{mod.desc}</span>
                      </div>
                      <div className="node-actions">
                        {['Ver', 'Criar', 'Editar', 'Excluir'].map(acao => (
                          <div key={acao} className="action-toggle">
                            <span>{acao}</span>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={!!permissoes[`${mod.id}-${acao}`]}
                                onChange={() => togglePerm(mod.id, acao)}
                              />
                              <span className="slider"></span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
