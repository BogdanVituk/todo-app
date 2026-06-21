import { useTodoContext } from "../context/TodoContext";
import type { Todo } from "../types/types";
import TodoItem from "./TodoItem";

interface Props {
  todos: Todo[];
  isReadOnly?: boolean;
}


const TodosList = ({ isReadOnly, todos }: Props) => {

  const { onDeleteTodo, onToggleTodo, isLoading } = useTodoContext();

  if (!todos.length) {
    return <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-6 text-center text-gray-600">No todos found</h2>
  }

  if(isLoading) {
    return <div className="text-blue-500 text-center text-sm sm:text-base lg:text-lg">Loading...</div>
  }

  return (
    <div>
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-5 sm:mb-6 lg:mb-8 text-center text-gray-900">Todos</h2>
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
              />
            )
          })
        }
      </ul>
    </div>

  )
}


export default TodosList;