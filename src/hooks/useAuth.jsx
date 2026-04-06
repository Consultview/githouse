import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const sessionData = localStorage.getItem('cityhouse_session');
    
    if (sessionData) {
      setUser(JSON.parse(sessionData));
      setLoadingAuth(false);
    } else {
      setLoadingAuth(false);
      navigate('/login');
    }
  }, [navigate]);

  return { user, loadingAuth };
}
