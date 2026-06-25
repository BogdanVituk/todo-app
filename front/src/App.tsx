import { useState } from "react"
import TodosList from "./components/TodosList"
import Container from "./components/Container"
import CreateModal from "./components/CreateModal"
import TodoFilter from "./components/TodoFilter"
import ShareModal from "./components/ShareModal"
import Pagination from "./components/Pagination"
import { useTodoContext } from "./context/TodoContext"
import Header from "./components/Header"
import { ActionButtonsRow } from "./components/ActionButtonsRow"
import { ProgressBar } from "./components/ProgressBar"
import type { FilterState, Todo } from "./types/types"
import { useFilteredTodos } from "./hooks/useFilteredTodo"
import EditModal from "./components/EditForm"


function App() {
  const [filter, setFilter] = useState<FilterState>({ status: 'all', query: '',   priority: 'all', sortBy: 'default' })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  
  const { todos, error } = useTodoContext()

  const filteredTodos = useFilteredTodos(todos, filter)
  

  return (
    <main>
      <Container>
        <Header/>
        <TodoFilter filter={filter} setFilter={setFilter} />
        <ActionButtonsRow
          onCreateClick={() => setIsModalOpen(true)}
          onShareClick={() => setIsShareModalOpen(true)}
          isShareDisabled={todos.length === 0}
        />
        <ProgressBar todos={todos} />
        {error && <div className="text-red-500 text-center text-sm sm:text-base lg:text-lg bg-red-50 p-4 rounded-lg border border-red-200">{error}</div>} 
        <TodosList todos={filteredTodos} isReadOnly={false} onEdit={setEditingTodo} />
        <Pagination/>
      </Container>
      
       { isModalOpen && ( <CreateModal onClose={() => setIsModalOpen(false)} /> )}
       { isShareModalOpen && (<ShareModal  todos={todos} onClose={() => setIsShareModalOpen(false)} />)}
       {editingTodo && <EditModal todo={editingTodo} onClose={() => setEditingTodo(null)} />}
    </main>

  )
}


export default App
