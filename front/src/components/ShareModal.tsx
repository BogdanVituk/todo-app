import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import type { Todo } from '../types/types';
import { TodoService } from '../API/TodoService';

const shareSchema = z.object({
  email: z
    .string()
    .min(1, 'Емейл обов\'язковий')
    .email('Невалідна емейл-адреса'),
});

type ShareFormData = z.infer<typeof shareSchema>;

interface ShareModalProps {
  todos: Todo[];
  onClose: () => void;
}

export default function ShareModal({ todos, onClose }: ShareModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ShareFormData>({
    resolver: zodResolver(shareSchema),
  });

  const onSubmit = async (data: ShareFormData) => {
    if (todos.length === 0) {
      toast.error('Немає задач для поділу');
      return;
    }

    setIsLoading(true);
    try {
      await TodoService.shareTodos(data.email);
      toast.success('Список задач відправлено успішно!');
      reset();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Помилка при відправленні');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Поділитись списком</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Емейл отримувача:
            </label>
            <input
              id="email"
              type="email"
              placeholder="user@example.com"
              disabled={isLoading}
              className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4 p-3 bg-gray-100 rounded text-xs sm:text-sm text-gray-600">
            <p>
              <strong>Буде поділено:</strong> {todos.length} задач(и)
            </p>
          </div>

          <div className="flex gap-2 sm:gap-3 justify-end flex-col-reverse sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 text-sm sm:text-base"
              disabled={isLoading}
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 text-sm sm:text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Відправлення...' : 'Поділитись'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
