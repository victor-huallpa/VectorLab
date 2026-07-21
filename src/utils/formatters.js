export function formatDate(isoString) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatNumber(value, decimals = 2) {
  if (!Number.isFinite(value)) return '—';
  return value.toFixed(decimals);
}
