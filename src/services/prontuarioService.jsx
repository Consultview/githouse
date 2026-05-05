// services/prontuarioService.js

import { supabase } from '../SupabaseClient';

export const prontuarioService = {

  async getUsuario(userId) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async getOrCreateMorador(userId, condominio_id) {
    let { data, error } = await supabase
      .from('moradores')
      .select('*')
      .eq('usuario_id', userId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      const { data: novo, error: insertError } = await supabase
        .from('moradores')
        .insert({
          usuario_id: userId,
          condominio_id,
          ativo: true
        })
        .select()
        .single();

      if (insertError) throw insertError;
      data = novo;
    }

    return data;
  },

  async getDocumentos(moradorId) {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('morador_id', moradorId);

    if (error) throw error;
    return data || [];
  },

  async uploadDocumento({ file, userId, moradorId, tipo }) {

    const ext = file.name.split('.').pop();
    const path = `${userId}/${tipo}_${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('anexos')
      .upload(path, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('anexos')
      .getPublicUrl(path);

    const fileUrl = data.publicUrl;

    const { data: existing } = await supabase
      .from('documentos')
      .select('id')
      .eq('morador_id', moradorId)
      .eq('tipo', tipo)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('documentos')
        .update({
          url: fileUrl,
          status: 'pendente'
        })
        .eq('id', existing.id);

      if (error) throw error;

    } else {
      const { error } = await supabase
        .from('documentos')
        .insert({
          morador_id: moradorId,
          usuario_id: userId,
          tipo,
          url: fileUrl,
          status: 'pendente'
        });

      if (error) throw error;
    }
  },

  async getAllDocumentosComUsuario() {
    const { data, error } = await supabase
      .from('documentos')
      .select(`
        *,
        moradores (
          id,
          usuario_id,
          usuarios (
            nome
          )
        )
      `);

    if (error) throw error;
    return data;
  },

  async getProntuariosParaValidacao() {
    const { data, error } = await supabase
      .from('moradores')
      .select(`
        id,
        usuario_id,
        usuarios (
          nome
        ),
        documentos (*)
      `);

    if (error) throw error;
    return data;
  }, // 🔥 vírgula corrigida

  // 🔥 NOVAS FUNÇÕES

  async getAllDocumentos() {
    const { data, error } = await supabase
      .from('documentos')
      .select('*');

    if (error) throw error;
    return data || [];
  },

  async aprovarDocumento(id) {
    const { error } = await supabase
      .from('documentos')
      .update({ status: 'aprovado' })
      .eq('id', id);

    if (error) throw error;
  },




async rejeitarDocumento(id, motivo = null) {
  const { error } = await supabase
    .from('documentos')
    .update({
      status: 'rejeitado', // ✅ CORRETO
      observacoes: motivo
    })
    .eq('id', id);

  if (error) {
    console.error(error);
    throw error;
  }
}
 
};
