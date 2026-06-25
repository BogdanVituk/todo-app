import type { Todo } from '../types/types';

export const ProgressBar = ({ todos }: { todos: Todo[] }) => {
  if (todos.length === 0) return null;

  const done = todos.filter(t => t.completed).length;
  const pct = Math.round((done / todos.length) * 100);
  const allDone = done === todos.length;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700">
          {todos.length} {todos.length === 1 ? 'задача' : 'задачі'} · {done} виконано
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-gray-400">{pct}%</span>
          {allDone && <span className="animate-bounce">🎉</span>}
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};