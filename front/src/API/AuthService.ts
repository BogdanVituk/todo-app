import { instance } from "./instance";

export interface AuthResponse {
  accessToken: string;
}


export const AuthService = {
  async login(body: { email: string; password: string }): Promise<AuthResponse> {

    try {

      const response = await instance.post("/auth/login", body);
      const { accessToken } = response.data;

      if (!accessToken) {
        throw new Error('Токен не отримано від сервера');
      }

      localStorage.setItem("token", accessToken);
      return { accessToken };

    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  async register(body: { email: string; password: string }): Promise<AuthResponse> {

    try {
      const response = await instance.post("/auth/register", body);

      const { accessToken } = response.data;
      
      if (!accessToken) {
        throw new Error('Токен не отримано від сервера');
      }
      localStorage.setItem("token", accessToken);
      return { accessToken };
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  }
};

