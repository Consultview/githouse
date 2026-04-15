import { useState, useCallback } from 'react';
import { acessosRepo } from '../database/AcessosRepo';

export function useAcessos() {
  const [condominios, setCondominios] = useState([]);
  const [permissoes, setPermissoes] = useState({});
  const [loading, setLoading] = useState(false);

  const loadCondos = useCallback(async () => {
    try {
      const data = await acessosRepo.fetchCondominios();
      setCondominios(data);
      return data;
    } catch (err) {
      console.error("Erro ao carregar condomínios:", err);
      return [];
    }
  }, []);

  const loadPerms = useCallback(async (idCondo, idPerfil) => {
    if (!idCondo || !idPerfil) return;

    try {
      setLoading(true);
      setPermissoes({}); // Limpa estado anterior

      const data = await acessosRepo.fetchPermissoes(idCondo, idPerfil);
      const novoEstado = {};

      data.forEach(regra => {
        // Mapeamento idêntico ao que o componente Acessos.jsx usa nos switches
        novoEstado[`${regra.modulo_id}-Ver`] = !!regra.p_ver;
        novoEstado[`${regra.modulo_id}-Criar`] = !!regra.p_criar;
        novoEstado[`${regra.modulo_id}-Editar`] = !!regra.p_editar;
        novoEstado[`${regra.modulo_id}-Excluir`] = !!regra.p_excluir;
      });

      setPermissoes(novoEstado);
    } catch (err) {
      console.error("Erro ao processar permissões:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const togglePerm = (moduloId, acao) => {
    const chave = `${moduloId}-${acao}`;
    setPermissoes(prev => ({
      ...prev,
      [chave]: !prev[chave]
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
