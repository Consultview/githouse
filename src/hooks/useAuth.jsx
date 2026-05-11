import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const sessionData = localStorage.getItem('cityhouse_session');

        if (!sessionData) {
          setUser(null);
          setLoadingAuth(false);

          if (location.pathname !== '/login') {
            navigate('/login');
          }

          return;
        }

        const parsedUser = JSON.parse(sessionData);

        setUser(parsedUser);
        setLoadingAuth(false);

      } catch (err) {
        console.error('Erro ao ler sessão:', err);
        localStorage.removeItem('cityhouse_session');
        setUser(null);
        setLoadingAuth(false);

        if (location.pathname !== '/login') {
          navigate('/login');
        }
      }
    };

    checkAuth();
  }, []); // 🔥 roda só uma vez

  return { user, loadingAuth };
}
