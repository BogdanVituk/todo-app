import type { Priority } from "../types/types";

const map = {
  HIGH:   { label: '🔥 Important', cls: 'bg-red-100 text-red-700' },
  MEDIUM: { label: 'Medium',   cls: 'bg-amber-100 text-amber-700' },
  LOW:    { label: 'Low',    cls: 'bg-blue-100 text-blue-600' },
};

export function PriorityBadge({ priority }: { priority: Priority | undefined }) {
  if (!priority) return null;
  const { label, cls } = map[priority];
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>;
}