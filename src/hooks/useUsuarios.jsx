import { useState, useCallback, useRef } from 'react';
import { usuariosRepo } from '../database/UsuariosRepo';

export function useUsuarios() {
  const [users, setUsers] = useState([]);
  const [condominios, setCondominios] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchingRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);

    try {
      const [resUsers, resCondos] = await Promise.all([
        usuariosRepo.fetchAll(),
        usuariosRepo.fetchCondominios()
      ]);

      console.log("USUÁRIOS RAW:", resUsers);
      console.log("CONDOS RAW:", resCondos);

      setUsers(Array.isArray(resUsers) ? resUsers : []);
      setCondominios(Array.isArray(resCondos) ? resCondos : []);

    } catch (err) {
      console.error('Erro ao buscar usuários:', err.message);
      setUsers([]);
      setCondominios([]);

    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  return {
    users,
    condominios,
    loading,
    fetchData
  };
}
