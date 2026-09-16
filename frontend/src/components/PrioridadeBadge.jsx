const labels = { BAIXA: 'Baixa', MEDIA: 'Média', ALTA: 'Alta' };

export default function PrioridadeBadge({ prioridade }) {
  return <span className={`badge prio-${prioridade}`}>{labels[prioridade] || prioridade}</span>;
}
