import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../SupabaseClient';

export function useDocumentoDetalhe(id, user, perfil, navigate) {
  const [morador, setMorador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDados = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // 1. Iniciamos a query com o SELECT que traz os dados do usuário (JOIN)
      let query = supabase
        .from('moradores')
        .select(`
          *,
          usuarios (
            nome,
            email,
            telefone
          )
        `);

      // 2. Aplicamos os filtros de segurança (🔐 ADMIN vs 🔒 USUÁRIO)
      if (perfil === 1 || perfil === 3) {
        if (!id) throw new Error('ID não informado para admin');
        query = query.eq('id', id);
      } else {
        query = query
          .eq('usuario_id', user.id)
          .eq('condominio_id', user.condominio_id);

        if (user.unidade) {
          query = query.eq('unidade', user.unidade);
        }
      }

      // 3. Executamos a query final
      const { data, error: queryError } = await query.maybeSingle();

      if (queryError) throw queryError;

      if (!data) {
        throw new Error('Registro não encontrado ou acesso negado');
      }

      // Agora 'data' contém o objeto 'usuarios' dentro dele
      setMorador(data);

    } catch (err) {
      console.error('Erro ao buscar detalhes:', err.message);
      setError(err.message);
      
      // Só redireciona se for erro crítico de acesso
      if (navigate && err.message.includes('negado')) {
        navigate('/home');
      }
    } finally {
      setLoading(false);
    }
  }, [id, perfil, user, navigate]);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  return {
    morador,
    loading,
    error,
    refresh: fetchDados
  };
}
