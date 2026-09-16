import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PrioridadeBadge from '../components/PrioridadeBadge';

const STATUS = ['', 'ABERTA', 'EM_ANALISE', 'EM_ATENDIMENTO', 'RESOLVIDA', 'CANCELADA'];
const PRIORIDADES = ['', 'BAIXA', 'MEDIA', 'ALTA'];

export default function OcorrenciasList() {
  const { isGestor } = useAuth();
  const [lista, setLista] = useState([]);
  const [filtros, setFiltros] = useState({ status: '', prioridade: '', categoria: '' });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const params = {};
    Object.entries(filtros).forEach(([k, v]) => { if (v) params[k] = v; });
    setCarregando(true);
    api.get('/ocorrencias', { params })
      .then((r) => setLista(r.data))
      .finally(() => setCarregando(false));
  }, [filtros]);

  return (
    <div>
      <div className="page-head">
        <h1>Ocorrências</h1>
        {!isGestor && <Link to="/ocorrencias/nova" className="btn">+ Nova ocorrência</Link>}
      </div>

      {isGestor && (
        <div className="filtros card">
          <select value={filtros.status} onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}>
            {STATUS.map((s) => <option key={s} value={s}>{s === '' ? 'Todos os status' : s}</option>)}
          </select>
          <select value={filtros.prioridade} onChange={(e) => setFiltros({ ...filtros, prioridade: e.target.value })}>
            {PRIORIDADES.map((p) => <option key={p} value={p}>{p === '' ? 'Todas as prioridades' : p}</option>)}
          </select>
          <input placeholder="Filtrar por categoria" value={filtros.categoria}
            onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })} />
        </div>
      )}

      {carregando ? <p>Carregando...</p> : (
        <table className="tabela">
          <thead>
            <tr><th>#</th><th>Título</th><th>Categoria</th><th>Prioridade</th><th>Status</th></tr>
          </thead>
          <tbody>
            {lista.length === 0 && <tr><td colSpan="5">Nenhuma ocorrência encontrada.</td></tr>}
            {lista.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td><Link to={`/ocorrencias/${o.id}`}>{o.titulo}</Link></td>
                <td>{o.categoria}</td>
                <td><PrioridadeBadge prioridade={o.prioridade} /></td>
                <td><StatusBadge status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
