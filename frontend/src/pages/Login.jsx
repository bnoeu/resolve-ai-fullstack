import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await login(email, senha);
      navigate('/ocorrencias');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Falha no login');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="card auth-card">
      <h1>Entrar</h1>
      {erro && <div className="alert-erro">{erro}</div>}
      <form onSubmit={handleSubmit}>
        <label>E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>Senha
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </label>
        <button type="submit" disabled={carregando}>{carregando ? 'Entrando...' : 'Entrar'}</button>
      </form>
      <p>Não tem conta? <Link to="/register">Cadastre-se</Link></p>
    </div>
  );
}
