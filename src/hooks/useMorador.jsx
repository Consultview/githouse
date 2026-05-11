import { useState, useCallback, useRef } from 'react';
import { supabase } from '../SupabaseClient';

export function useUsuarios() {
  const [moradores, setMoradores] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchingRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      setLoading(true);

      // Buscamos a partir de 'moradores' fazendo o JOIN com 'usuarios'
      const { data, error } = await supabase
        .from('moradores')
        .select(`
          id,
          usuario_id,
          condominio_id,
          ativo,
          
          usuarios (
            id,
            nome,
            email,
            perfil,
            bloco,
            numero_casa,
            telefone,
            status
          )
        `)
        .order('id', { ascending: true });

      if (error) throw error;

      // Normaliza para facilitar o uso no Front-end
      const normalized = (data || []).map((item) => ({
        morador_id: item.id,
        condominio_id: item.condominio_id,
        ativo: item.ativo,
        // Dados vindos do JOIN com a tabela usuarios
        ...item.usuarios 
      }));

      setMoradores(normalized);

    } catch (err) {
      console.error('Erro ao buscar moradores:', err.message);
      setMoradores([]);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  return {
    moradores,
    fetchData,
    loading
  };
}
