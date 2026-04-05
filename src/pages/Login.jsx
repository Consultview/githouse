import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './../SupabaseClient';
import './login.css';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lockMessage, setLockMessage] = useState('');

  // 1. Identificador do Dispositivo
  const getDeviceKey = () => {
    let token = localStorage.getItem('ch_device_token');
    if (!token) {
      token = 'dev_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('ch_device_token', token);
    }
    return token;
  };

  useEffect(() => {
    checkLockout();
  }, []);

  const checkLockout = () => {
    const deviceId = getDeviceKey();
    const lockUntil = localStorage.getItem(`ch_lock_until_${deviceId}`);
    
    if (lockUntil) {
      const remaining = new Date(lockUntil).getTime() - new Date().getTime();
      if (remaining > 0) {
        setLockMessage(`Acesso bloqueado neste dispositivo. Tente em ${Math.ceil(remaining / 60000)} min.`);
        return true;
      } else {
        localStorage.removeItem(`ch_lock_until_${deviceId}`);
        setLockMessage('');
      }
    }
    return false;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (checkLockout()) return;
    setLoading(true);

    try {
      // 2. Validar usando a RPC (compara texto plano '123' com hash do banco)
      const { data: users, error } = await supabase.rpc('login_seguro', {
        email_input: email,
        senha_input: senha
      });

      // O retorno da RPC vem como uma lista de objetos
      const user = users && users.length > 0 ? users[0] : null;

      if (error || !user) {
        handleFailure();
        return;
      }

      // SUCESSO: Limpa bloqueios do dispositivo
      const deviceId = getDeviceKey();
      localStorage.removeItem(`ch_attempts_${deviceId}`);
      localStorage.removeItem(`ch_lock_until_${deviceId}`);

      const sessionData = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        condominio_id: user.condominio_id,
        login_at: new Date().toISOString()
      };

      localStorage.setItem('cityhouse_session', JSON.stringify(sessionData));
      navigate('/');

    } catch (err) {
      alert('Erro na conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleFailure = () => {
    const deviceId = getDeviceKey();
    const attemptKey = `ch_attempts_${deviceId}`;
    const lockKey = `ch_lock_until_${deviceId}`;

    let attempts = parseInt(localStorage.getItem(attemptKey) || '0') + 1;
    localStorage.setItem(attemptKey, attempts);

    if (attempts >= 5) {
      const multiplier = Math.pow(2, attempts - 5);
      const minutes = 10 * multiplier;
      const until = new Date(new Date().getTime() + minutes * 60000).toISOString();

      localStorage.setItem(lockKey, until);
      setLockMessage(`Muitas tentativas neste dispositivo. Bloqueado por ${minutes} minutos.`);
    } else {
      alert(`Senha incorreta! Tentativa ${attempts} de 5.`);
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-content">
        <header className="auth-header">
          <div className="logo-full" style={{fontSize: '2.5rem', marginBottom: '10px'}}>
            City<span>House</span>
          </div>
          <p className="brand-tagline">Gestão Inteligente de Imóveis</p>
        </header>

        <div className="auth-card">
          {lockMessage && (
            <div style={{color: '#d32f2f', background: '#ffebee', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold'}}>
              {lockMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-field">
              <label>E-mail Corporativo</label>
              <input type="email" placeholder="nome@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={!!lockMessage} />
            </div>

            <div className="form-field">
              <div className="field-header">
                <label>Senha</label>
                <a href="#forgot" className="text-link">Esqueceu a senha?</a>
              </div>
              <input type="password" placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} required disabled={!!lockMessage} />
            </div>

            <button type="submit" className="btn-main" disabled={loading || !!lockMessage}>
              {loading ? <div className="loader"></div> : "Entrar na plataforma"}
            </button>
          </form>

          <div className="divider"><span>ou</span></div>
          <button type="button" className="btn-google" disabled={!!lockMessage}>Continuar com Google</button>
        </div>
      </div>
    </div>
  );
}
