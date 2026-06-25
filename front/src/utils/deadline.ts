
export function getDeadlineStatus(deadline: string | null) {
  if (!deadline) return null;
  const now = new Date();
  const d = new Date(deadline);
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'overdue';
  if (diffDays === 0) return 'today';
  return 'ok';
}

export function formatDeadline(deadline: string) {
  return new Date(deadline).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
}