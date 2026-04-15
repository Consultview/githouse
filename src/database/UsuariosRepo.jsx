import { supabase } from '../SupabaseClient';

export const usuariosRepo = {
  async fetchAll() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('id', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async fetchCondominios() {
    const { data, error } = await supabase.from('condominios').select('id, nome');
    if (error) throw error;
    return data || [];
  },

  async save(dados, id = null) {
    if (id) {
      const { error } = await supabase.from('usuarios').update(dados).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('usuarios').insert([dados]);
      if (error) throw error;
    }
  },

  async updateStatus(id, newStatus) {
    const { error } = await supabase.from('usuarios').update({ status: newStatus }).eq('id', id);
    if (error) throw error;
  }
};
