const labels = {
  ABERTA: 'Aberta',
  EM_ANALISE: 'Em análise',
  EM_ATENDIMENTO: 'Em atendimento',
  RESOLVIDA: 'Resolvida',
  CANCELADA: 'Cancelada',
};

export default function StatusBadge({ status }) {
  return <span className={`badge status-${status}`}>{labels[status] || status}</span>;
}
