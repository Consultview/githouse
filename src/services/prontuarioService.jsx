import { supabase } from '../SupabaseClient';

export const prontuarioService = {

  // 🔥 RENOMEADO: De getUsuario para getUsuarioByEmail (como o Hook pede)
  async getUsuarioByEmail(email) {
    if (!email) return null;
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email) 
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // 🔥 ADICIONADO: Função que a tela de validação está procurando
  async getProntuariosParaValidacao(userProfile) {
    try {
      let query = supabase
        .from('moradores')
        .select(`
          id,
          usuario_id,
          condominio_id,
          usuarios ( id, nome, perfil ),
          documentos ( id, tipo, url, status, morador_id )
        `);

      // Segurança: Síndico (3) só vê o seu condomínio
      if (Number(userProfile?.perfil) === 3) {
        query = query.eq('condominio_id', userProfile.condominio_id);
      }

      const { data, error } = await query.order('id', { ascending: false });
      if (error) throw error;
      
      return (data || []).filter(item => item.documentos?.length > 0);
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  async getOrCreateMorador(usuarioIdInteiro, condominio_id) {
    if (!usuarioIdInteiro) return null;
    let { data, error } = await supabase.from('moradores').select('*').eq('usuario_id', usuarioIdInteiro).maybeSingle();
    
    if (!data && !error) {
      const { data: novo, error: err } = await supabase.from('moradores').insert({
        usuario_id: usuarioIdInteiro,
        condominio_id: condominio_id ? parseInt(condominio_id) : null,
        ativo: true
      }).select().single();
      data = novo;
    }
    return data;
  },

  async getDocumentos(moradorId) {
    if (!moradorId) return [];
    const { data } = await supabase.from('documentos').select('*').eq('morador_id', moradorId).order('created_at', { ascending: false });
    return data || [];
  },

  async uploadDocumento({ file, moradorId, tipo, origem = 'WEB' }) {
    if (!file || !moradorId) return;
    const ext = file.name.split('.').pop();
    const path = `documentos/${moradorId}/${tipo}_${Date.now()}.${ext}`;
    await supabase.storage.from('anexos').upload(path, file);
    const { data: urlData } = supabase.storage.from('anexos').getPublicUrl(path);

    const { data: existing } = await supabase.from('documentos').select('id').eq('morador_id', moradorId).eq('tipo', tipo).maybeSingle();

    if (existing) {
      await supabase.from('documentos').update({ url: urlData.publicUrl, status: 'pendente' }).eq('id', existing.id);
    } else {
      await supabase.from('documentos').insert({ morador_id: moradorId, tipo, url: urlData.publicUrl, status: 'pendente', origem });
    }
  },

  async aprovarDocumento(id) {
    await supabase.from('documentos').update({ status: 'aprovado' }).eq('id', id);
  },

  async rejeitarDocumento(id, motivo = null) {
    await supabase.from('documentos').update({ status: 'rejeitado', observacoes: motivo }).eq('id', id);
  }
};
