import { useState, useCallback } from 'react';
import { chamadosRepo } from '../database/ChamadosRepo';

export function useChamados(user) { // 1. Recebe o user como parâmetro
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChamados = useCallback(async () => {
    if (!user) return; // Segurança: não busca se não houver usuário

    try {
      setLoading(true);
      // 2. Passa o user para o fetchAll filtrar no banco
      const data = await chamadosRepo.fetchAll(user);
      setChamados(data);
    } catch (err) {
      console.error('Erro ao carregar:', err);
    } finally {
      setLoading(false);
    }
  }, [user]); // 3. Adiciona user às dependências do useCallback

  // As estatísticas agora refletem apenas o que o usuário pode ver (Performance total)
  const stats = {
    totalAbertos: chamados.filter(c => c.status === 'ABERTO').length,
    totalAndamento: chamados.filter(c => c.status === 'EM_ANDAMENTO').length,
    totalConcluidos: chamados.filter(c => c.status === 'CONCLUIDO').length,
    totalCancelados: chamados.filter(c => c.status === 'CANCELADO').length,
  };

  return { chamados, loading, fetchChamados, stats };
}
