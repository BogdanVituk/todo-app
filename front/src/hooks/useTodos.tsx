import { useState, useEffect } from "react";
import { getTodos, createTodo, deleteTodo, toggleTodo } from "../API/TodoService";
import { useFetching } from "./useFetching";
import toast from "react-hot-toast";
import type { Todo, TodoRequestBody } from "../types/types";

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);


  const [fetchTodos, isLoading, error] = useFetching(async () => {
    const res = await getTodos();
    setTodos(res);
  });

  useEffect(() => {
    fetchTodos();
  }, []);


  const onAddTodo = async (data: TodoRequestBody) => {
        createTodo(data)
        .then(createdTodo => {setTodos((prev) => [...prev, createdTodo]);});
  };


  const onDeleteTodo = (id: number) => {
    const loadingToast = toast.loading("Deleting...");
    deleteTodo(id)
        .then(() => {
          setTodos(prev => prev.filter(todo => todo.id !== id))
          toast.success("Todo deleted", { id: loadingToast })
        })
        .catch(err => {
          toast.error(`Failed to delete todo ${err.message}`, { id: loadingToast })
        })
  };


  const onToggleTodo = (todo: Todo) => {
    const loadingToast = toast.loading("Updating...");
    toggleTodo(todo.id, todo.completed)
      .then((updatedTodo) => {
        setTodos((prev) => prev.map((t) => (t.id === todo.id ? updatedTodo : t)));
        toast.success("Status updated!", { id: loadingToast });
      })
      .catch((err) => {
        toast.error(`Error: ${err.message}`, { id: loadingToast });
      });
  };

  return { todos, isLoading, error, onAddTodo, onDeleteTodo, onToggleTodo };
}