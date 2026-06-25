'use client';
import React, { createContext, useContext, useState, useEffect } from "react";

import { useFetching } from "../hooks/useFetching";
import toast from "react-hot-toast";
import type { Todo, TodoRequestBody } from "../types/types";
import { TodoService } from "../API/TodoService";
import { useAuth } from "./AuthContext";

interface TodoContextType {
  todos: Todo[];
  isLoading: boolean;
  error: string;
  page: number;
  totalPages: number;
  totalItems: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  onAddTodo: (data: TodoRequestBody) => Promise<void>;
  onDeleteTodo: (id: number) => Promise<void>;
  onToggleTodo: (todo: Todo) => Promise<void>;
  refetchTodos: () => void;
  onEditTodo: (id: number, data: Partial<TodoRequestBody>) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const { isAuthenticated } = useAuth();
  const limit = 5; 

  const [fetchTodos, isLoading, error] = useFetching(async () => {
    const res = await TodoService.getTodos(page, limit);
    setTodos(res.data);
    setTotalPages(res.meta.totalPages);
    setTotalItems(res.meta.totalItems);
  });


  useEffect(() => {
    if (isAuthenticated) {
        fetchTodos();
    }
  }, [page, isAuthenticated]);


  const onAddTodo = async (data: TodoRequestBody) => {
    const loadingToast = toast.loading("Creating...");
    try {
      const createdTodo = await TodoService.createTodo(data);
      
      if (page === 1) {
        setTodos((prev) => [createdTodo, ...prev].slice(0, limit));
      } else {
        setPage(1); 
      }
      toast.success("Todo created!", { id: loadingToast });
    } catch (err: any) {
      toast.error(`Failed to create: ${err.message}`, { id: loadingToast });
    }
  };

  const onEditTodo = async (id: number, data: Partial<TodoRequestBody>) => {
  const loadingToast = toast.loading("Saving...");
  try {
    const updated = await TodoService.updateTodo(id, data);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    toast.success("Saved!", { id: loadingToast });
  } catch (err: any) {
    toast.error(`Error: ${err.message}`, { id: loadingToast });
  }
};

  const onDeleteTodo = async (id: number) => {
    const loadingToast = toast.loading("Deleting...");
    try {
      await TodoService.deleteTodo(id);
      toast.success("Todo deleted", { id: loadingToast });
      
    
      if (todos.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        await fetchTodos(); 
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`, { id: loadingToast });
    }
  };


  const onToggleTodo = async (todo: Todo) => {
    const loadingToast = toast.loading("Updating...");
    try {

      const updatedTodo = await TodoService.toggleTodo(todo.id, todo.completed);
      
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? updatedTodo : t))
      );
      toast.success("Status updated!", { id: loadingToast });
    } catch (err: any) {
      toast.error(`Error: ${err.message}`, { id: loadingToast });
    }
  };

  return (
    <TodoContext.Provider value={{
      onEditTodo,
      todos,
      isLoading,
      error,
      page,
      totalPages,
      totalItems,
      setPage,
      onAddTodo,
      onDeleteTodo,
      onToggleTodo,
      refetchTodos: fetchTodos
    }}>
      {children}
    </TodoContext.Provider>
  );
};


export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoContext має використовуватись всередині TodoProvider");
  }
  return context;
};