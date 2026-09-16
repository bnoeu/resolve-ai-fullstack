import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PrioridadeBadge from '../components/PrioridadeBadge';

const PROXIMOS_STATUS = {
  ABERTA: ['EM_ANALISE', 'CANCELADA'],
  EM_ANALISE: ['EM_ATENDIMENTO', 'CANCELADA'],
  EM_ATENDIMENTO: ['RESOLVIDA', 'CANCELADA'],
  RESOLVIDA: [],
  CANCELADA: [],
};

const fmt = (d) => new Date(d).toLocaleString('pt-BR');

export default function OcorrenciaDetail() {
  const { id } = useParams();
  const { usuario, isGestor } = useAuth();
  const [oc, setOc] = useState(null);
  const [erro, setErro] = useState('');
  const [comentario, setComentario] = useState('');

  async function carregar() {
    const { data } = await api.get(`/ocorrencias/${id}`);
    setOc(data);
  }

  useEffect(() => { carregar(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id]);

  async function acao(fn) {
    setErro('');
    try {
      await fn();
      await carregar();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro na operação');
    }
  }

  if (!oc) return <p>Carregando...</p>;

  const podeAvaliar =
    !isGestor && oc.solicitanteId === usuario.id && oc.status === 'RESOLVIDA' && !oc.avaliacao;

  return (
    <div className="detalhe">
      {erro && <div className="alert-erro">{erro}</div>}

      <div className="card">
        <div className="page-head">
          <h1>{oc.titulo}</h1>
          <div><StatusBadge status={oc.status} /> <PrioridadeBadge prioridade={oc.prioridade} /></div>
        </div>
        <p>{oc.descricao}</p>
        <dl className="meta">
          <div><dt>Categoria</dt><dd>{oc.categoria}</dd></div>
          <div><dt>Localização</dt><dd>{oc.localizacao || '—'}</dd></div>
          <div><dt>Solicitante</dt><dd>{oc.solicitante?.nome}</dd></div>
          <div><dt>Responsável</dt><dd>{oc.responsavel?.nome || '—'}</dd></div>
        </dl>
        {oc.imagemUrl && <img src={oc.imagemUrl} alt="Anexo" className="anexo" />}
        {oc.solucaoAplicada && (
          <div className="solucao"><strong>Solução aplicada:</strong> {oc.solucaoAplicada}</div>
        )}
      </div>

      {isGestor && <PainelGestor oc={oc} acao={acao} />}

      {podeAvaliar && <FormAvaliacao id={id} acao={acao} />}
      {oc.avaliacao && (
        <div className="card">
          <h2>Avaliação do solicitante</h2>
          <p>Nota: <strong>{oc.avaliacao.nota}/5</strong></p>
          {oc.avaliacao.comentario && <p>{oc.avaliacao.comentario}</p>}
        </div>
      )}

      <div className="card">
        <h2>Comentários</h2>
        {oc.comentarios?.length ? oc.comentarios.map((c) => (
          <div key={c.id} className="comentario">
            <strong>{c.autor?.nome}</strong>
            <span className="data">{fmt(c.createdAt)}</span>
            <p>{c.texto}</p>
          </div>
        )) : <p>Sem comentários ainda.</p>}
        <form onSubmit={(e) => {
          e.preventDefault();
          acao(async () => {
            await api.post(`/ocorrencias/${id}/comentarios`, { texto: comentario });
            setComentario('');
          });
        }}>
          <textarea rows="2" value={comentario} onChange={(e) => setComentario(e.target.value)}
            placeholder="Escreva um comentário" required />
          <button type="submit">Comentar</button>
        </form>
      </div>

      <div className="card">
        <h2>Histórico de status</h2>
        <ul className="historico">
          {oc.historicos?.map((h) => (
            <li key={h.id}>
              <span className="data">{fmt(h.createdAt)}</span> —{' '}
              {h.statusAnterior ? `${h.statusAnterior} → ` : ''}<strong>{h.statusNovo}</strong>
              {' '}por {h.usuario?.nome}
              {h.observacao && <em> — {h.observacao}</em>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PainelGestor({ oc, acao }) {
  const [status, setStatus] = useState('');
  const [observacao, setObservacao] = useState('');
  const [prioridade, setPrioridade] = useState(oc.prioridade);
  const [responsavelId, setResponsavelId] = useState(oc.responsavelId || '');
  const [solucao, setSolucao] = useState(oc.solucaoAplicada || '');
  const proximos = PROXIMOS_STATUS[oc.status] || [];

  return (
    <div className="card painel-gestor">
      <h2>Ações do gestor</h2>

      <div className="acao-bloco">
        <h3>Mudar status</h3>
        {proximos.length === 0 ? <p>Ocorrência em estado final.</p> : (
          <form onSubmit={(e) => {
            e.preventDefault();
            acao(() => api.patch(`/ocorrencias/${oc.id}/status`, { status, observacao }));
          }}>
            <select value={status} onChange={(e) => setStatus(e.target.value)} required>
              <option value="">Selecione o novo status...</option>
              {proximos.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input placeholder="Observação" value={observacao} onChange={(e) => setObservacao(e.target.value)} />
            <button type="submit">Atualizar</button>
          </form>
        )}
      </div>

      <div className="acao-bloco">
        <h3>Prioridade</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          acao(() => api.patch(`/ocorrencias/${oc.id}/prioridade`, { prioridade }));
        }}>
          <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Média</option>
            <option value="ALTA">Alta</option>
          </select>
          <button type="submit">Salvar</button>
        </form>
      </div>

      <div className="acao-bloco">
        <h3>Responsável (ID do gestor)</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          acao(() => api.patch(`/ocorrencias/${oc.id}/responsavel`, { responsavelId: Number(responsavelId) }));
        }}>
          <input type="number" value={responsavelId} onChange={(e) => setResponsavelId(e.target.value)}
            placeholder="ID" required />
          <button type="submit">Atribuir</button>
        </form>
      </div>

      <div className="acao-bloco">
        <h3>Solução aplicada</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          acao(() => api.patch(`/ocorrencias/${oc.id}/solucao`, { solucaoAplicada: solucao }));
        }}>
          <textarea rows="2" value={solucao} onChange={(e) => setSolucao(e.target.value)} required />
          <button type="submit">Registrar solução</button>
        </form>
      </div>
    </div>
  );
}

function FormAvaliacao({ id, acao }) {
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');

  return (
    <div className="card">
      <h2>Avaliar resolução</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        acao(() => api.post(`/ocorrencias/${id}/avaliacao`, { nota: Number(nota), comentario }));
      }}>
        <label>Nota
          <select value={nota} onChange={(e) => setNota(e.target.value)}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <textarea rows="2" value={comentario} onChange={(e) => setComentario(e.target.value)}
          placeholder="Comentário (opcional)" />
        <button type="submit">Enviar avaliação</button>
      </form>
    </div>
  );
}
