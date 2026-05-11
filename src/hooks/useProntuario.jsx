import { useState, useCallback } from 'react';
import { prontuarioService } from '../services/prontuarioService';

export function useProntuario(user) {
  const [usuario, setUsuario] = useState(null);
  const [morador, setMorador] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    // Usamos o email porque ele é a única ponte confiável entre o Auth e sua tabela Usuarios (Integer)
    if (!user?.email) return; 

    try {
      setLoading(true);
      
      // 1. Busca o perfil do usuário pelo email para obter o ID numérico real
      const uData = await prontuarioService.getUsuarioByEmail(user.email);
      setUsuario(uData);
      
      if (uData?.id) {
        // 2. Agora usamos o uData.id (que é o número correto)
        const mData = await prontuarioService.getOrCreateMorador(uData.id, uData.condominio_id);
        setMorador(mData);

        if (mData?.id) {
          // 3. Busca os documentos vinculados ao ID do morador
          const dData = await prontuarioService.getDocumentos(mData.id);
          setDocumentos(dData || []);
        }
      }
    } catch (err) {
      console.error("Erro no useProntuario:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.email]); // Dependência mudou para email

  return { usuario, morador, documentos, loading, fetchData };
}
