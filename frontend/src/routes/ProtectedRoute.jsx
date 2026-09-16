import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, somenteGestor = false }) {
  const { usuario, isGestor } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  if (somenteGestor && !isGestor) return <Navigate to="/ocorrencias" replace />;
  return children;
}
