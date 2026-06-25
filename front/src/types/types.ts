export type FilterStatus = 'all' | 'active' | 'completed';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type FilterPriority = 'all' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface Todo {
    id: number;
    title: string;
    description: string;
    priority?: Priority;
    deadline?: string;
    completed: boolean;
}


export type TodoRequestBody = Omit<Todo, "id" | "completed">;

export interface FilterState {
  status: FilterStatus;
  query: string;
  priority: FilterPriority;
}
