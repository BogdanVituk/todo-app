import { useMemo, useState } from "react"
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
import type { FilterState } from "./types/types"


function App() {
  const [filter, setFilter] = useState<FilterState>({ status: 'all', query: '',   priority: 'all' , })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const { todos, error } = useTodoContext()

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch =
        todo.title.toLowerCase().includes(filter.query.toLowerCase()) ||
        todo.description.toLowerCase().includes(filter.query.toLowerCase())

      const matchesStatus =
        filter.status === 'all'
          ? true
          : filter.status === 'active'
            ? !todo.completed
            : todo.completed

      const matchesPriority =
        filter.priority === 'all' ? true : todo.priority === filter.priority

      return matchesSearch && matchesStatus && matchesPriority

    })

  }, [filter.query, filter.status, filter.priority, todos])

  

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
        <TodosList todos={filteredTodos} isReadOnly={false} />
        <Pagination/>
      </Container>
      
       { isModalOpen && ( <CreateModal onClose={() => setIsModalOpen(false)} /> )}
       { isShareModalOpen && (<ShareModal  todos={todos} onClose={() => setIsShareModalOpen(false)} />)}
    
    </main>

  )
}


export default App
