import type { Todo, TodoRequestBody } from "../types/types";
import type { PaginatedResponse } from "../types/api";
import { authInstance, instance } from "./instance";
import { extractErrorMessage } from "../utils/errorHandler";

export const TodoService = {
    async createTodo(body: TodoRequestBody): Promise<Todo> {
        try {
            const res = await authInstance.post<Todo>("/tasks", body);
            return res.data;
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error));
        }
    },

    async getTodos(page: number, limit: number): Promise<PaginatedResponse<Todo>> {
        try {
            const res = await authInstance.get<PaginatedResponse<Todo>>("/tasks", {
                params: { page, limit }
            });
            return res.data;
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error));
        }
    },

    async deleteTodo(id: number): Promise<void> {
        try {
            await authInstance.delete<void>(`/tasks/${id}`);
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error));
        }
    },

    async toggleTodo(id: number, currentStatus: boolean): Promise<Todo> {
        try {
            const res = await authInstance.patch<Todo>(`/tasks/${id}/status`, { completed: !currentStatus })
            return res.data
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error));
        }
    },
    async shareTodos(email: string): Promise<void> {
        try {
            await authInstance.post<void>("/tasks/share", {
                email,
            });
        } catch (error: unknown) {
            console.error("Error sharing todos:", error);
            throw new Error(extractErrorMessage(error));
        }
    },

    async getSharedTodos(token: string): Promise<Todo[]> {
        try {
            const res = await instance.get<Todo[]>(`/tasks/shared/${token}`);
            return res.data;
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error));
        }
    }
}

