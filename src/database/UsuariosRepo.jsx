import { supabase } from '../SupabaseClient';

export const usuariosRepo = {

  // 🔥 IDENTIDADE (somente usuários base)

  
async fetchAll() {
  const { data, error } = await supabase
    .from('usuarios')
    .select(`
      id,
      nome,
      email,
      telefone,
      perfil,
      status,
      created_at,
      condominio_id,
      bloco,
      numero_casa,
      cpf
    `)
    .order('id', { ascending: true });

  if (error) throw error;
  return data || [];
},



  // 🔥 CONDOMÍNIOS (independente de usuário)
  async fetchCondominios() {
    const { data, error } = await supabase
      .from('condominios')
      .select('id, nome')
      .order('nome', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // 🔥 CREATE / UPDATE (IDENTIDADE PURA)
  async save(dados, id = null) {


const payload = {
  nome: dados.nome,
  cpf: dados.cpf,
  email: dados.email,
  telefone: dados.telefone || null,
  perfil: dados.perfil ? parseInt(dados.perfil) : null,
  condominio_id: dados.condominio_id ? parseInt(dados.condominio_id) : null, // 🔥 ESSENCIAL
  status: dados.status ?? true
};
    // ⚠️ senha idealmente NÃO fica aqui (depende do teu auth)
    if (dados.senha && dados.senha.trim() !== "") {
      payload.senha = dados.senha;
    }

    try {
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

    } catch (error) {
      console.error("Erro no UsuariosRepo:", error.message);
      throw error;
    }
  },

  // 🔥 STATUS
  async updateStatus(id, newStatus) {
    const { error } = await supabase
      .from('usuarios')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }
};
