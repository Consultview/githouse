import { supabase } from '../SupabaseClient';

export const acessosRepo = {
  async fetchCondominios() {
    try {
      const { data, error } = await supabase
        .from('condominios')
        .select('id, nome')
        .order('nome', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Erro ao buscar condominios:", err);
      return []; // Retorna array vazio para não travar o .map() no front
    }
  },

  async fetchPermissoes(condominioId, perfilId) {
    if (!perfilId) return []; // Trava de segurança

    let query = supabase.from('permissoes_acesso').select('*');

    // Filtra por condomínio apenas se não for ADM ou Suporte
    if (Number(perfilId) !== 1 && Number(perfilId) !== 2 && condominioId) {
      query = query.eq('id_condominio', condominioId);
    }
    
    query = query.eq('id_perfil', perfilId);

    const { data, error } = await query;
    if (error) return [];
    return data || [];
  },

  async fetchPermissoesPorUsuario(usuarioId) {
    if (!usuarioId) return [];

    const { data: user, error: userErr } = await supabase
      .from('usuarios')
      .select('perfil, condominio_id')
      .eq('id', usuarioId)
      .single();
  
    if (userErr || !user) return [];

    const perfil = Number(user.perfil);

    // 🔥 ADM e Suporte: Liberação Total
    if (perfil === 1 || perfil === 2) {
      const { data: modulos } = await supabase.from('modulos').select('id');
      // Garante que retorne o formato que o seu Hook useAcessos espera
      return (modulos || []).map(m => ({
        modulo_id: m.id,
        p_ver: true,
        p_criar: true,
        p_editar: true,
        p_excluir: true
      }));
    }
  
    const { data: permissoes, error: permErr } = await supabase
      .from('permissoes_acesso')
      .select('*')
      .eq('id_condominio', user.condominio_id)
      .eq('id_perfil', perfil);
  
    if (permErr) return [];
    return permissoes || [];
  },

  async upsertPermissoes(rows) {
    if (!rows || rows.length === 0) return;

    const payload = rows.map(row => ({
      id_condominio: parseInt(row.id_condominio),
      id_perfil: parseInt(row.id_perfil),
      modulo_id: row.modulo_id,
      p_ver: !!row.p_ver,
      p_criar: !!row.p_criar,
      p_editar: !!row.p_editar,
      p_excluir: !!row.p_excluir
    }));

    const { error } = await supabase
      .from('permissoes_acesso')
      .upsert(payload, {
        onConflict: 'id_condominio,id_perfil,modulo_id'
      });

    if (error) throw error;
  }
};
