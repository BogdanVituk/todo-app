import type { Todo } from "../types/types";
import TodoItem from "./TodoItem";

interface Props {
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
  onToggleTodo: (todo: Todo) => void;
}


const TodosList = ({ todos, onDeleteTodo, onToggleTodo }: Props) => {

  if (!todos.length) {
    return <h2 className="text-xl font-bold mb-4 text-center">No todos found</h2>
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-center">Todos</h2>
      <ul>
        {
          todos?.map((todo) => {
            return (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggleTodo}
                onDelete={onDeleteTodo}
              />
            )
          })
        }
      </ul>
    </div>

  )
}


export default TodosList;