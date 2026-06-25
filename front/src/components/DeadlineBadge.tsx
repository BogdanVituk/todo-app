import { formatDeadline, getDeadlineStatus } from "../utils/deadline";

const styles = {
  overdue: 'bg-red-100 text-red-700',
  today:   'bg-amber-100 text-amber-700',
  ok:      'bg-green-100 text-green-700',
};
const labels = {
  overdue: '⚠ Прострочено',
  today:   '⏰ Сьогодні',
  ok:      '',
};

export function DeadlineBadge({ deadline }: { deadline: string | null | undefined }) {
    if (!deadline) return null;
  if (!deadline) return null;
  const status = getDeadlineStatus(deadline);
  if (!status) return null;
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status]}`}>
      {status === 'ok' ? `📅 ${formatDeadline(deadline)}` : labels[status]}
    </span>
  );
}