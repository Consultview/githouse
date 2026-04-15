import { supabase } from '../SupabaseClient';

export const chamadosRepo = {
  async fetchAll(user) {
    if (!user) return [];

    let query = supabase
      .from('chamados')
      .select('*, condominios (nome)')
      .order('created_at', { ascending: false });

    const perfil = Number(user.perfil);

    // 1. ADM (1) e SUPORTE (2): Enxergam absolutamente tudo
    if (perfil === 1 || perfil === 2) {
      // Nenhuma trava adicional, a query segue limpa
    } 
    
    // 2. GESTOR / SÍNDICO (3): Enxerga todos os chamados do seu condomínio
    else if (perfil === 3) {
      query = query.eq('condominio_id', user.condominio_id);
    } 

    // 3. TÉCNICO (4) e MORADOR (5): Enxergam apenas o que criaram ou o que foi atribuído
    else {
      query = query.or(`usuario_aberto_id.eq.${user.id},tecnico_atribuido_id.eq.${user.id}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar chamados:", error.message);
      throw error;
    }
    return data || [];
  },

  async save(dadosForm, id = null) {
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
