import { useState, useCallback } from 'react';
import { acessosRepo } from '../database/AcessosRepo';

export function useAcessos() {
  const [condominios, setCondominios] = useState([]);
  const [permissoes, setPermissoes] = useState({});
  const [loading, setLoading] = useState(false);

  const loadCondos = useCallback(async () => {
    try {
      const data = await acessosRepo.fetchCondominios();
      setCondominios(data || []);
      return data || [];
    } catch (err) {
      console.error("Erro ao carregar condomínios:", err);
      return [];
    }
  }, []);

  const loadPerms = useCallback(async (condominioId, perfilId) => {
    if (!condominioId || !perfilId) return;

    try {
      setLoading(true);
      setPermissoes({});



// Dentro do seu loadPerms no useAcessos.js
const data = await acessosRepo.fetchPermissoes(condominioId, perfilId);

const novoEstado = {};
(data || []).forEach(regra => {
  novoEstado[regra.modulo_id] = {
    ver: !!regra.p_ver,
    criar: !!regra.p_criar,
    editar: !!regra.p_editar,
    excluir: !!regra.p_excluir
  };
});
setPermissoes(novoEstado);


    } catch (err) {
      console.error("Erro ao processar permissões:", err);
    } finally {
      setLoading(false);
    }
  }, []);




  const togglePerm = (moduloId, acao) => {
    setPermissoes(prev => ({
      ...prev,
      [moduloId]: {
        ...prev[moduloId],
        [acao]: !prev?.[moduloId]?.[acao]
      }
    }));
  };

  return {
    condominios,
    permissoes,
    loading,
    loadCondos,
    loadPerms,
    togglePerm,
    setPermissoes
  };
}
