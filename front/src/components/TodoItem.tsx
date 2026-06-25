import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import type { Priority, Todo } from "../types/types";
import { PriorityBadge } from "./PriorityBadge";
import { DeadlineBadge } from "./DeadlineBadge";

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onEdit?: (todo: Todo) => void;
  isReadOnly?: boolean;
}

const priorityBorder: Record<Priority, string> = {
  HIGH:   'border-l-4 border-l-red-400',
  MEDIUM: 'border-l-4 border-l-amber-400',
  LOW:    'border-l-4 border-l-blue-300',
}

const TodoItem = ({ todo, onToggle, onDelete, onEdit, isReadOnly = false }: TodoItemProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <li
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        flex flex-col gap-2 rounded-lg border border-slate-200
        p-4 sm:p-5 shadow-sm hover:shadow-md
        hover:-translate-y-0.5 transition-all duration-200
        ${todo.priority ? priorityBorder[todo.priority] : ''}
        ${todo.completed ? 'opacity-60' : ''}
      `}
    >
      <div className="grid grid-cols-1 sm:grid-cols-[2fr_3fr_auto] lg:grid-cols-[1fr_2fr_auto] items-start gap-3 sm:gap-4">
        
      
        <div className={`font-semibold text-sm sm:text-base lg:text-lg line-clamp-2 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {todo.title}
        </div>

  
        <div className="text-xs sm:text-sm text-slate-500 line-clamp-2">
          {todo.description}
        </div>

    
        <div className="flex items-center gap-1 shrink-0">

       
          <button
            type="button"
            onClick={() => !isReadOnly && onToggle(todo)}
            disabled={isReadOnly}
            aria-label={todo.completed ? "Mark as active" : "Mark as completed"}
            className={`
              w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors
              ${todo.completed
                ? 'bg-blue-500 border-blue-500'
                : 'border-gray-300 hover:border-blue-400'
              }
              ${isReadOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {todo.completed && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

 
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(todo)}
              disabled={isReadOnly}
              aria-label="Edit todo"
              className={`
                p-1.5 rounded transition-all text-gray-400 hover:text-blue-500 hover:bg-blue-50
                ${hovered ? 'opacity-100' : 'opacity-0'}
                ${isReadOnly ? 'hidden' : ''}
              `}
            >
              <Pencil size={16} />
            </button>
          )}

       
          <button
            type="button"
            onClick={() => onDelete(todo.id)}
            disabled={isReadOnly}
            aria-label="Delete todo"
            className={`
              p-1.5 rounded transition-all text-gray-400 hover:text-red-500 hover:bg-red-50
              ${hovered ? 'opacity-100' : 'opacity-0'}
              ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {(todo.priority || todo.deadline) && (
        <div className="flex items-center gap-2 flex-wrap">
          <PriorityBadge priority={todo.priority} />
          <DeadlineBadge deadline={todo.deadline} />
        </div>
      )}
    </li>
  );
};

export default TodoItem;