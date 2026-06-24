import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { AuthService } from '../API/AuthService';
import { extractErrorMessage } from '../utils/errorHandler';


interface AuthFormData {
  email: string;
  password: string;
}

interface AuthFormProps {
  initialMode: 'login' | 'register';
}

export default function AuthForm({ initialMode }: AuthFormProps) {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [isLogin] = useState(initialMode === 'login');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AuthFormData>({
    defaultValues: {
      email: '',
      password: ''
    }
  });


  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    try {
      isLogin ? await AuthService.login(data) : await AuthService.register(data);

      toast.success(isLogin ? 'Успішний вхід!' : 'Реєстрація успішна!');
      loginUser();
    } catch (err: unknown) {
      const msg = extractErrorMessage(err);
      console.error('Auth error:', err);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    const newMode = isLogin ? '/register' : '/login';
    navigate(newMode);
    reset();
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Вхід у систему' : 'Реєстрація'}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {isLogin ? 'Введіть свої дані для доступу до тасок' : 'Створіть акаунт, щоб почати'}
        </p>
      </div>

      
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

       
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Email адреса</label>
          <input
            type="email"
            disabled={loading}
            className={`w-full border rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-50 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            placeholder="you@example.com"
            {...register('email', {
              required: 'Email є обовʼязковим',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Некоректний формат email'
              }
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>

       
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Пароль</label>
          <input
            type="password"
            disabled={loading}
            className={`w-full border rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-50 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            placeholder="••••••••"
            {...register('password', {
              required: 'Пароль є обовʼязковим',
              minLength: {
                value: 6,
                message: 'Пароль має бути не менше 6 символів'
              }
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 text-white rounded-lg font-medium transition duration-200 shadow-sm disabled:opacity-50 ${isLogin ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
            }`}
        >
          {loading ? 'Обробка...' : isLogin ? 'Увійти' : 'Зареєструватися'}
        </button>
      </form>

      <div className="relative flex py-4 items-center">
        <div className="grow border-t border-gray-200"></div>
        <span className="shrink mx-4 text-gray-400 text-xs uppercase">або</span>
        <div className="grow border-t border-gray-200"></div>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={toggleMode}
          disabled={loading}
          className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline focus:outline-none transition"
        >
          {isLogin ? 'Немає акаунту? Створити новий' : 'Вже маєте акаунт? Увійти'}
        </button>
      </div>
    </div>
  );
}