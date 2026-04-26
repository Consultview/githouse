import { supabase } from '../SupabaseClient';

const COLUNAS_PERMITIDAS = [
  'url_identidade',
  'url_contrato_locacao',
  'url_ultimo_comprovante_pagamento'
];

const STATUS_PERMITIDOS = [
  'status_identidade',
  'status_contrato',
  'status_financeiro'
];

export const moradorRepo = {

  // 1. Busca pelo usuario_id (ID da tabela usuarios/Auth)
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
    return { data };
  },

  // 2. Busca pelo ID da própria tabela moradores
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
    return { data };
  },

  // 3. Upload de Documentos - MELHORADO
  async salvarDocumento(moradorId, file, colUrl, colStatus) {
    if (!COLUNAS_PERMITIDAS.includes(colUrl)) throw new Error('Coluna de URL inválida');
    if (!STATUS_PERMITIDOS.includes(colStatus)) throw new Error('Coluna de status inválida');

    const fileExt = file.name.split('.').pop();
    const filePath = `documentos/${moradorId}/${colUrl}_${Date.now()}.${fileExt}`;

    // Upload para o Bucket 'anexos'
    const { error: uploadError } = await supabase.storage
      .from('anexos')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // IMPORTANTE: Salvamos o PATH (caminho) e não a URL assinada.
    // Isso evita que o acesso ao documento expire após 24h.
    const { error: dbError } = await supabase
      .from('moradores')
      .update({
        [colUrl]: filePath,
        [colStatus]: 'EM_ANALISE',
        updated_at: new Date() // Usando a coluna updated_at da sua tabela
      })
      .eq('id', moradorId);

    if (dbError) throw dbError;

    return { filePath };
  },

  // 4. NOVO: Gerar link temporário para visualização
  // Chame isso apenas quando precisar abrir o documento na tela
  async obterLinkDocumento(path) {
    if (!path) return null;
    const { data, error } = await supabase.storage
      .from('anexos')
      .createSignedUrl(path, 3600); // 1 hora de validade

    if (error) throw error;
    return data.signedUrl;
  },

  async atualizarStatusDocumento(moradorId, campo, status) {
    if (!STATUS_PERMITIDOS.includes(campo)) throw new Error('Campo inválido');

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
