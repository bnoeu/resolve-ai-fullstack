import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { usuario, isGestor, logout } = useAuth();
  const navigate = useNavigate();
  if (!usuario) return null;

  return (
    <nav className="navbar">
      <Link to="/ocorrencias" className="brand">Resolve Aí</Link>
      <div className="nav-links">
        <Link to="/ocorrencias">Ocorrências</Link>
        {!isGestor && <Link to="/ocorrencias/nova">Nova</Link>}
        {isGestor && <Link to="/dashboard">Dashboard</Link>}
        <span className="nav-user">{usuario.nome} · {isGestor ? 'Gestor' : 'Solicitante'}</span>
        <button className="btn-link" onClick={() => { logout(); navigate('/login'); }}>Sair</button>
      </div>
    </nav>
  );
}
