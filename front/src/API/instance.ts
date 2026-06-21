import axios from "axios";

export const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

export const authInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {  
        "Content-Type": "application/json"
    },
    withCredentials: true       
    }
)

authInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      return Promise.reject(new Error('JWT токен відсутній. Авторизуйтесь.'));
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);