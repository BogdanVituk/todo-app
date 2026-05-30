import axios from "axios"
import type { Todo, TodoRequestBody } from "../types/types";
import { instance } from "./instance";


const extractErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        return typeof responseData === "string" ? responseData : error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return String(error);
}

export const createTodo = async (body: TodoRequestBody): Promise<Todo> => {
    try {
        const res = await instance.post<Todo>("/tasks", body);
        return res.data;
    } catch (error: unknown) {
        throw new Error(extractErrorMessage(error), { cause: error });
    }
}

export const getTodos = async (): Promise<Todo[]> => {
    try {
        const res = await instance.get<Todo[]>("/tasks");
        return res.data;
    } catch (error: unknown) {
        throw new Error(extractErrorMessage(error), { cause: error });
    }
}

export const deleteTodo = async (id: number): Promise<void> => {
    try {
        await instance.delete<void>(`/tasks/${id}`);
    } catch (error: unknown) {
        throw new Error(extractErrorMessage(error), { cause: error });
    }
}

export const toggleTodo = async (id: number, currentStatus: boolean): Promise<Todo> => {
    try {
        const res = await instance.patch<Todo>(`/tasks/${id}/status`, { completed: !currentStatus })
        return res.data
    } catch (error: unknown) {  
        throw new Error(extractErrorMessage(error), { cause: error });
    }
}