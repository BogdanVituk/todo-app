import { useMemo, useState } from "react"
import TodosList from "./components/TodosList"
import Container from "./components/Container"
import CreateModal from "./components/CreateModal"
import TodoFilter from "./components/TodoFilter"
import type { FilterStatus } from "./types/types"
import  { Toaster } from "react-hot-toast"
import { useTodos } from "./hooks/useTodos"


function App() {

  const [filter, setFilter] = useState({status: 'all' as FilterStatus,query: ''});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { onAddTodo, onDeleteTodo, onToggleTodo,todos, error, isLoading } = useTodos();


  const filteredTodos = useMemo(() => {
    return  todos.filter((todo) => {
      const matchesSearch =  todo.title.toLowerCase().includes(filter.query.toLowerCase()) || todo.description.toLowerCase().includes(filter.query.toLowerCase());
      
      const matchesStatus = filter.status === 'all' ? true : filter.status === 'active' ? !todo.completed : todo.completed;

      return matchesSearch && matchesStatus;
    })

  }, [filter.query, filter.status, todos])


  return (
    <main>
      <Container>
        <TodoFilter filter={filter} setFilter={setFilter} />
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-6 w-full max-w-xs block ml-0 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
        Add new todo
      </button>
        {error && <div className="text-red-500 text-center">{error}</div>}
        {isLoading ?
          <div className="text-blue-500 text-center">Loading...</div>
          : <TodosList todos={filteredTodos} onDeleteTodo={onDeleteTodo} onToggleTodo={onToggleTodo} />
        }

        {isModalOpen && (
          <CreateModal
            addTodo={onAddTodo}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </Container>
      <Toaster position="bottom-right" />
    </main>

  )
}

export default App
