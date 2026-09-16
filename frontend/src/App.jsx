import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import OcorrenciasList from './pages/OcorrenciasList';
import NovaOcorrencia from './pages/NovaOcorrencia';
import OcorrenciaDetail from './pages/OcorrenciaDetail';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ocorrencias" element={<ProtectedRoute><OcorrenciasList /></ProtectedRoute>} />
            <Route path="/ocorrencias/nova" element={<ProtectedRoute><NovaOcorrencia /></ProtectedRoute>} />
            <Route path="/ocorrencias/:id" element={<ProtectedRoute><OcorrenciaDetail /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute somenteGestor><Dashboard /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/ocorrencias" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
