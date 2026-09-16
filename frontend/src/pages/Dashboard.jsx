import { useEffect, useState } from 'react';
import api from '../api/client';

export default function Dashboard() {
  const [ind, setInd] = useState(null);

  useEffect(() => {
    api.get('/dashboard/indicadores').then((r) => setInd(r.data));
  }, []);

  if (!ind) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="card kpi">
        <span className="kpi-num">{ind.total}</span>
        <span>Total de ocorrências</span>
      </div>
      <div className="cards-grid">
        <Bloco titulo="Por status" itens={ind.porStatus} chave="status" />
        <Bloco titulo="Por prioridade" itens={ind.porPrioridade} chave="prioridade" />
        <Bloco titulo="Por categoria" itens={ind.porCategoria} chave="categoria" />
      </div>
    </div>
  );
}

function Bloco({ titulo, itens, chave }) {
  return (
    <div className="card">
      <h2>{titulo}</h2>
      <ul className="kpi-list">
        {itens.length === 0 && <li><span>Sem dados</span></li>}
        {itens.map((i) => (
          <li key={i[chave]}><span>{i[chave]}</span><strong>{i.total}</strong></li>
        ))}
      </ul>
    </div>
  );
}
