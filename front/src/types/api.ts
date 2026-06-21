export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    totalPages: number;
    totalItems: number;
  };
}

export interface AuthResponse {
  accessToken: string;
}

export interface ErrorResponse {
  message: string;
  statusCode?: number;
}
