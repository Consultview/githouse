import { useState, useCallback } from 'react';
import { usuariosRepo } from '../database/UsuariosRepo';

export function useUsuarios() {
  const [users, setUsers] = useState([]);
  const [condominios, setCondominios] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [resUsers, resCondos] = await Promise.all([
        usuariosRepo.fetchAll(),
        usuariosRepo.fetchCondominios()
      ]);
      setUsers(resUsers);
      setCondominios(resCondos);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { users, condominios, loading, fetchData };
}
