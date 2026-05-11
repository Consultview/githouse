import { supabase } from '../SupabaseClient';

export const chamadosRepo = {
  async fetchAll(user) {
    if (!user?.email) return [];

    // 1. Busca o ID INTEIRO e PERFIL do usuário pelo EMAIL (que é único)
    const { data: usuarioRelacional, error: userError } = await supabase
      .from('usuarios')
      .select('id, perfil, condominio_id')
      .eq('email', user.email)
      .single();

    if (userError || !usuarioRelacional) {
      console.error("Usuário não encontrado na tabela pública");
      return [];
    }

    const userIdInteiro = usuarioRelacional.id;
    const perfil = Number(usuarioRelacional.perfil);

    let query = supabase
      .from('chamados')
      .select('*, condominios(nome)')
      .order('created_at', { ascending: false });

    // 2. Aplica os filtros de hierarquia
    if (perfil === 1 || perfil === 2) {
      // ADM e Suporte: Vê tudo, não aplica filtro.
    } 
    else if (perfil === 3) {
      // Síndico: Vê apenas os chamados do condomínio dele
      query = query.eq('condominio_id', usuarioRelacional.condominio_id);
    } 
    else {
      // Morador/Técnico: Vê o que abriu ou o que está atribuído a ele
      query = query.or(
        `usuario_aberto_id.eq.${userIdInteiro},tecnico_atribuido_id.eq.${userIdInteiro}`
      );
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  },

  async save(dadosForm, id = null) {
    // Remove objetos aninhados que o banco não aceita
    const { condominios, ...payload } = dadosForm;

    if (id) {
      const { error } = await supabase
        .from('chamados')
        .update(payload)
        .eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('chamados')
        .insert([payload]);
      if (error) throw error;
    }
  }
};
