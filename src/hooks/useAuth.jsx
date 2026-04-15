import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useAuth() {
  const navigate = useNavigate();
  const location = useLocation(); // Adicionado para re-checar ao mudar de rota
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const sessionData = localStorage.getItem('cityhouse_session');

      if (sessionData) {
        const parsedUser = JSON.parse(sessionData);
        setUser(parsedUser);
        setLoadingAuth(false);
      } else {
        setLoadingAuth(false);
        // Evita loop infinito se já estiver no login
        if (location.pathname !== '/login') {
          navigate('/login');
        }
      }
    };

    checkAuth();
  }, [navigate, location.pathname]); // Re-executa se mudar de página

  return { user, loadingAuth };
}
