import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { TodoService } from '../API/TodoService';
import type { Todo } from '../types/types';
import Container from '../components/Container';
import TodosList from '../components/TodosList';
import { useFetching } from '../hooks/useFetching';


export default function SharedListPage() {
  
  const { token } = useParams<{ token: string }>();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [fetchSharedTodos , isLoading, error] = useFetching(async () => {
      if(token) {
      const res = await TodoService.getSharedTodos(token);
      setTodos(res);
      }
    })

  useEffect(() => {   
    fetchSharedTodos();
  }, [token]);

  if (isLoading) {
    return (
      <Container>
        <div className="text-blue-500 text-center text-lg sm:text-xl py-8">Завантаження...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="text-red-500 text-center text-base sm:text-lg py-8 px-4">{error}</div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-6 mt-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">📋 Поділений список задач</h1>
        <p className="text-xs sm:text-sm text-gray-600">Режим тільки для читання</p>
      </div>

      {todos.length === 0 ? (
        <div className="text-center text-gray-500 py-8 px-4">
          <p className="text-base sm:text-lg">Список порожній</p>
        </div>
      ) : (
        <div>
          <div className="mb-4 text-xs sm:text-sm text-gray-600 px-2 sm:px-0">
            Всього задач: <strong>{todos.length}</strong>
          </div>
          <TodosList
            todos={todos}
            isReadOnly={true}
          />
        </div>
      )}

      <Toaster position="bottom-right" />
    </Container>
  );
}
