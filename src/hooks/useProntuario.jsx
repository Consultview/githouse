// hooks/useProntuario.js

import { useState, useCallback } from 'react';
import { prontuarioService } from '../services/prontuarioService';

export function useProntuario(user) {

  const [usuario, setUsuario] = useState(null);
  const [morador, setMorador] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      if (!user?.id) return;

      setLoading(true);

      const usuarioData = await prontuarioService.getUsuario(user.id);
      setUsuario(usuarioData);

      const moradorData = await prontuarioService.getOrCreateMorador(
        user.id,
        usuarioData.condominio_id
      );

      setMorador(moradorData);

      const docs = await prontuarioService.getDocumentos(moradorData.id);
      setDocumentos(docs);

    } catch (err) {
      console.error(err);
      alert('Erro ao carregar prontuário');
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    usuario,
    morador,
    documentos,
    loading,
    fetchData
  };
}
