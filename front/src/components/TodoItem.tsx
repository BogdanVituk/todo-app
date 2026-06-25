import { Trash2 } from "lucide-react";
import type { Todo } from "../types/types";
import { PriorityBadge } from "./PriorityBadge";
import { DeadlineBadge } from "./DeadlineBadge";

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
  isReadOnly?: boolean;
}

const TodoItem = ({ todo, onToggle, onDelete, isReadOnly = false }: TodoItemProps) => {
  return (
    <li className="grid grid-cols-1 sm:grid-cols-[2fr_3fr_auto_auto] lg:grid-cols-[1fr_2fr_auto_auto] items-start gap-3 sm:gap-4 rounded-lg border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition">
      <div className={`font-semibold text-sm sm:text-base lg:text-lg overflow-hidden line-clamp-2 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
        {todo.title}
      </div>
      <div className="text-xs sm:text-sm lg:text-base text-slate-600 overflow-hidden line-clamp-3 lg:line-clamp-2">
        {todo.description}
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo)}
            disabled={isReadOnly}
            className={`w-5 sm:w-6 h-5 sm:h-6 cursor-pointer accent-blue-500 ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={todo.completed ? "Mark as active" : "Mark as completed"}
          />
        </label>
        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          disabled={isReadOnly}
          aria-label="Delete todo"
          className={`text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 sm:p-2 rounded transition shrink-0 ${isReadOnly ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
        >
          <Trash2 size={20} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
        </button>
      </div>
       <div className="flex items-center gap-2 flex-wrap ml-8">
        <PriorityBadge priority={todo.priority} />
        <DeadlineBadge deadline={todo.deadline} />
      </div>
    </li>
  );
};

export default TodoItem;
