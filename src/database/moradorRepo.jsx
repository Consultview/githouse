import { supabase } from '../SupabaseClient';

export const moradorRepo = {

  // 🔥 CORRETO: busca por usuario_id
  async buscarPorUsuario(usuarioId) {
    const { data, error } = await supabase
      .from('moradores')
      .select(`
        *,
        usuarios ( nome, email, telefone )
      `)
      .eq('usuario_id', usuarioId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async buscarPorId(id) {
    const { data, error } = await supabase
      .from('moradores')
      .select(`
        *,
        usuarios ( nome, email, telefone )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // ⚠️ ainda funcional, mas NÃO ideal para escala

 async salvarDocumento(moradorId, usuarioId, file, tipoDoc) {
   const fileExt = file.name.split('.').pop();
   const filePath = `documentos/${moradorId}/${tipoDoc}_${Date.now()}.${fileExt}`;
 
   // 1. Upload para o Storage
   const { error: uploadError } = await supabase.storage
     .from('anexos')
     .upload(filePath, file);
 
   if (uploadError) throw uploadError;
 
   // 2. Insert na tabela CORRETA (documentos)
   const { error: dbError } = await supabase
     .from('documentos')
     .insert([{
       morador_id: moradorId,
       usuario_id: usuarioId, // Você tem essa coluna no banco
       tipo: tipoDoc,
       url: filePath,
       status: 'EM_ANALISE',
       origem: 'WEB' // coluna 'origem' que existe na sua tabela
     }]);
 
   if (dbError) throw dbError;
   return { filePath };
 }
 

  async obterLinkDocumento(path) {
    if (!path) return null;

    const { data, error } = await supabase.storage
      .from('anexos')
      .createSignedUrl(path, 3600);

    if (error) throw error;
    return data.signedUrl;
  },

  async atualizarStatusDocumento(moradorId, campo, status) {
    const { error } = await supabase
      .from('moradores')
      .update({ 
        [campo]: status,
        updated_at: new Date()
      })
      .eq('id', moradorId);

    if (error) throw error;
    return { success: true };
  }
};
