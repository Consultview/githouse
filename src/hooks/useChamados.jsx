import { useState, useCallback, useMemo } from 'react';
import { chamadosRepo } from '../database/ChamadosRepo';

export function useChamados(user) {

  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchChamados = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // 🔥 ideal: repo filtra por usuario_id OU morador_id
      const data = await chamadosRepo.fetchAll(user);

      setChamados(data || []);
    } catch (err) {
      console.error('Erro ao carregar chamados:', err);
      setChamados([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // 🔥 stats otimizadas (evita recalcular sem necessidade)
  const stats = useMemo(() => ({
    totalAbertos: chamados.filter(c => c.status === 'ABERTO').length,
    totalAndamento: chamados.filter(c => c.status === 'EM_ANDAMENTO').length,
    totalConcluidos: chamados.filter(c => c.status === 'CONCLUIDO').length,
    totalCancelados: chamados.filter(c => c.status === 'CANCELADO').length,
  }), [chamados]);

  return {
    chamados,
    loading,
    fetchChamados,
    stats
  };
}
