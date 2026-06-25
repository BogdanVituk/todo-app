import type { Todo } from "../types/types";

interface Props {
  todos: Todo[];
}

export function ProgressBar({ todos }: Props) {
    
  if (todos.length === 0) return null;
  const done = todos.filter(t => t.completed).length;
  const pct = Math.round((done / todos.length) * 100);
  const allDone = done === todos.length;

  return (
    <div className="flex items-center gap-3 px-1 mb-4">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 bg-emerald-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm text-gray-500 whitespace-nowrap">
        {done} з {todos.length}
      </span>
      {allDone && <span className="text-base">🎉</span>}
    </div>
  );
}