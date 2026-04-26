import { supabase } from '../SupabaseClient';

export const usuariosRepo = {

  // 🔥 PADRÃO: busca usuários já com relacionamento correto
  async fetchAll() {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        *,
        condominios (
          id,
          nome
        )
      `)
      .order('id', { ascending: true })
      .limit(100);

    if (error) throw error;

    return data || [];
  },

  // 🔥 Condominios
  async fetchCondominios() {
    const { data, error } = await supabase
      .from('condominios')
      .select('id, nome')
      .order('nome', { ascending: true });

    if (error) throw error;

    return data || [];
  },

  // 🔥 CREATE / UPDATE
  async save(dados, id = null) {

    // evita enviar campos vazios desnecessários
    const payload = { ...dados };

    if (!payload.senha) {
      delete payload.senha; // não sobrescreve senha sem necessidade
    }

    if (id) {
      const { error } = await supabase
        .from('usuarios')
        .update(payload)
        .eq('id', id);

      if (error) throw error;

      return { success: true, action: 'updated' };
    }

    const { error } = await supabase
      .from('usuarios')
      .insert([payload]);

    if (error) throw error;

    return { success: true, action: 'created' };
  },

  // 🔥 STATUS TOGGLE
  async updateStatus(id, newStatus) {
    const { error } = await supabase
      .from('usuarios')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  }
};
