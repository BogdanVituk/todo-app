import { Trash2 } from "lucide-react";
import type { Todo } from "../types/types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <li className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-3 rounded border border-slate-200 p-3 shadow-sm">
      <div className="font-medium">{todo.title}</div>
      <div className="text-sm text-slate-600">{todo.description}</div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
          className="w-5 h-5 cursor-pointer"
          aria-label={todo.completed ? "Mark as active" : "Mark as completed"}
        />
      </label>
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete todo"
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 size={20} />
      </button>
    </li>
  );
};

export default TodoItem;
