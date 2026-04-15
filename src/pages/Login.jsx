import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './../SupabaseClient';
import './styles/login.css';

export default function Login({ setUser }) { // Recebe setUser para atualizar o App.jsx
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lockMessage, setLockMessage] = useState('');

  const getDeviceKey = () => {
    let token = localStorage.getItem('ch_device_token');
    if (!token) {
      token = 'dev_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('ch_device_token', token);
    }
    return token;
  };

  useEffect(() => { checkLockout(); }, []);

  const checkLockout = () => {
    const deviceId = getDeviceKey();
    const lockUntil = localStorage.getItem(`ch_lock_until_${deviceId}`);
    if (lockUntil) {
      const remaining = new Date(lockUntil).getTime() - new Date().getTime();
      if (remaining > 0) {
        setLockMessage(`Bloqueado. Tente em ${Math.ceil(remaining / 60000)} min.`);
        return true;
      }
      localStorage.removeItem(`ch_lock_until_${deviceId}`);
      setLockMessage('');
    }
    return false;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (checkLockout()) return;
    setLoading(true);

    try {
      // 1. Validação de Usuário via RPC
      const { data: users, error: rpcError } = await supabase.rpc('login_seguro', {
        email_input: email,
        senha_input: senha
      });

      // O RPC geralmente retorna um array ou objeto único dependendo da sua função
      const user = users && users.length > 0 ? users[0] : (users || null);

      if (rpcError || !user) {
        handleFailure();
        return;
      }

      // 2. PERFORMANCE: Busca Permissões e Condomínio EM PARALELO
      // Buscamos todas as colunas (p_criar, p_editar, etc) para as permissões funcionarem
      const [permsResponse, condoResponse] = await Promise.all([
        supabase
          .from('permissoes_acesso')
          .select('modulo_id, p_ver, p_criar, p_editar, p_excluir')
          .eq('id_condominio', user.condominio_id)
          .eq('id_perfil', user.perfil),
        supabase
          .from('condominios')
          .select('nome')
          .eq('id', user.condominio_id)
          .single()
      ]);

      // 3. SUCESSO: Limpa bloqueios localmente
      const deviceId = getDeviceKey();
      localStorage.removeItem(`ch_attempts_${deviceId}`);
      localStorage.removeItem(`ch_lock_until_${deviceId}`);

      // 4. ESTRUTURA DA SESSÃO
      const sessionData = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        condominio_id: user.condominio_id,
        nome_condominio: condoResponse.data?.nome || user.nome_condominio || '',
        permissoes: permsResponse.data || [], 
        login_at: new Date().toISOString()
      };

      // 5. ATUALIZA ESTADO GLOBAL E STORAGE
      localStorage.setItem('cityhouse_session', JSON.stringify(sessionData));
      if (setUser) setUser(sessionData);

      navigate('/servicos');

    } catch (err) {
      console.error('Erro no Login:', err);
      alert('Erro na conexão com o banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleFailure = () => {
    const deviceId = getDeviceKey();
    const attemptKey = `ch_attempts_${deviceId}`;
    let attempts = parseInt(localStorage.getItem(attemptKey) || '0') + 1;
    localStorage.setItem(attemptKey, attempts);

    if (attempts >= 5) {
      const until = new Date(new Date().getTime() + 10 * 60000).toISOString();
      localStorage.setItem(`ch_lock_until_${deviceId}`, until);
      setLockMessage(`Muitas tentativas. Bloqueado por 10 minutos.`);
    } else {
      alert(`E-mail ou senha incorretos! Tentativa ${attempts} de 5.`);
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
            <div className="lock-alert" style={{color: '#d32f2f', background: '#ffebee', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold'}}>
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
              {loading ? "Processando..." : "Entrar na plataforma"}
            </button>
          </form>

          <div className="divider"><span>ou</span></div>
          <button type="button" className="btn-google" disabled={!!lockMessage}>Continuar com Google</button>
        </div>
      </div>
    </div>
  );
}
