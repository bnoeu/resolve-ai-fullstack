import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', senha: '', perfil: 'SOLICITANTE' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Falha no cadastro');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="card auth-card">
      <h1>Criar conta</h1>
      {erro && <div className="alert-erro">{erro}</div>}
      <form onSubmit={handleSubmit}>
        <label>Nome
          <input value={form.nome} onChange={(e) => set('nome', e.target.value)} required />
        </label>
        <label>E-mail
          <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
        </label>
        <label>Senha
          <input type="password" value={form.senha} onChange={(e) => set('senha', e.target.value)} required minLength={6} />
        </label>
        <label>Perfil
          <select value={form.perfil} onChange={(e) => set('perfil', e.target.value)}>
            <option value="SOLICITANTE">Solicitante</option>
            <option value="GESTOR">Gestor</option>
          </select>
        </label>
        <button type="submit" disabled={carregando}>{carregando ? 'Criando...' : 'Cadastrar'}</button>
      </form>
      <p>Já tem conta? <Link to="/login">Entrar</Link></p>
    </div>
  );
}
