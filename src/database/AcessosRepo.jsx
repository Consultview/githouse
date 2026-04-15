import { supabase } from '../SupabaseClient';

export const acessosRepo = {
  /**
   * Busca a lista de condomínios para o select superior.
   * Ordena por nome para facilitar a localização no mobile.
   */
  async fetchCondominios() {
    const { data, error } = await supabase
      .from('condominios')
      .select('id, nome')
      .order('nome', { ascending: true });
    
    if (error) {
      console.error("Erro ao buscar condomínios:", error.message);
      throw error;
    }
    return data || [];
  },

  /**
   * Busca as regras de acesso para um condomínio e perfil específicos.
   * Retorna as colunas: modulo_id, p_ver, p_criar, p_editar, p_excluir.
   */
  async fetchPermissoes(idCondo, idPerfil) {
    const { data, error } = await supabase
      .from('permissoes_acesso')
      .select('*')
      .eq('id_condominio', idCondo)
      .eq('id_perfil', idPerfil);

    if (error) {
      console.error("Erro ao buscar permissões:", error.message);
      throw error;
    }
    return data || [];
  },

  /**
   * Salva ou Atualiza as permissões em massa.
   * O 'onConflict' garante que não existam duplicatas para o mesmo
   * condomínio, perfil e módulo.
   */
  async upsertPermissoes(rows) {
    // rows deve ser um array de objetos contendo modulo_id, p_ver, etc.
    const { error } = await supabase
      .from('permissoes_acesso')
      .upsert(rows, { 
        onConflict: 'id_condominio,id_perfil,modulo_id',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error("Erro ao salvar permissões:", error.message);
      throw error;
    }
  }
};
