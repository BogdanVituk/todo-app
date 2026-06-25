import { useTodoContext } from "../context/TodoContext";
import type { Todo } from "../types/types";
import TodoItem from "./TodoItem";
import TodoSkeleton from "./TodoSkeleton";

interface Props {
  todos: Todo[];
  isReadOnly?: boolean;
  onEdit?: (todo: Todo) => void; 
}


const TodosList = ({ isReadOnly, todos, onEdit }: Props) => {

  const { onDeleteTodo, onToggleTodo, isLoading} = useTodoContext();

  if (isLoading) return <TodoSkeleton />;

  if (!todos.length) {
    return <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-6 text-center text-gray-600">No todos found</h2>
  }

  return (
    <div>
      <ul className="space-y-3 sm:space-y-4 lg:space-y-5">
        {
          todos?.map((todo) => {
            return (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggleTodo}
                onDelete={onDeleteTodo}
                isReadOnly={isReadOnly}
                onEdit={onEdit}
              />
            )
          })
        }
      </ul>
    </div>

  )
}


export default TodosList;