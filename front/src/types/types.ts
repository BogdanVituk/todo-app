export type FilterStatus = 'all' | 'active' | 'completed';

export interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
}


export type TodoRequestBody = Omit<Todo, "id" | "completed">;