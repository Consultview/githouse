import { useState, useCallback, useRef } from 'react';
import { supabase } from '../SupabaseClient';

export function useUsuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchingRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('moradores')
        .select(`
          id,
          usuario_id,
          condominio_id,
          bloco,
          unidade,
          status_identidade,
          status_contrato,
          status_financeiro,

          usuarios (
            id,
            nome,
            email,
            perfil
          )
        `)
        .order('id', { ascending: true });

      if (error) throw error;

      // 🔥 NORMALIZA JOIN (EVITA ARRAY / NULL / INCONSISTÊNCIA)
      const normalized = (data || []).map((item) => ({
        ...item,
        usuarios: Array.isArray(item.usuarios)
          ? item.usuarios[0] || null
          : item.usuarios || null
      }));

      setUsers(normalized);

    } catch (err) {
      console.error('Erro ao buscar moradores:', err.message);
      setUsers([]);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  return {
    users,
    fetchData,
    loading
  };
}
