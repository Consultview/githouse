import { useState, useCallback, useRef } from 'react';
import { usuariosRepo } from '../database/UsuariosRepo';

export function useUsuarios() {
  const [users, setUsers] = useState([]);
  const [condominios, setCondominios] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchingRef = useRef(false);

  const normalizeUsers = (list) => {
    return (list || []).map((item) => ({
      ...item,
      usuarios: Array.isArray(item.usuarios)
        ? item.usuarios[0] || null
        : item.usuarios || null
    }));
  };

  const fetchData = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      setLoading(true);

      const [resUsers, resCondos] = await Promise.all([
        usuariosRepo.fetchAll(),
        usuariosRepo.fetchCondominios()
      ]);

      const usersData =
        resUsers?.data ||
        (Array.isArray(resUsers) ? resUsers : []) ||
        [];

      const condosData =
        resCondos?.data ||
        (Array.isArray(resCondos) ? resCondos : []) ||
        [];

      setUsers(normalizeUsers(usersData));
      setCondominios(condosData);

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
