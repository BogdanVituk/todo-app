import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import type { Todo } from "../types/types";

const todoSchema = z.object({
  title: z.string().min(3, "Мінімум 3 символи"),
  description: z.string().min(5, "Мінімум 5 символів"),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  deadline: z.string().optional(),
});

export type TodoFormData = z.infer<typeof todoSchema>;

interface Props {
  initialData?: Todo;
  onSubmit: (data: TodoFormData) => Promise<void>;
  onClose: () => void;
  submitLabel?: string;
}

const TodoForm = ({ initialData, onSubmit, onClose, submitLabel = 'Save' }: Props) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      priority: initialData?.priority ?? 'MEDIUM',
      deadline: initialData?.deadline
        ? new Date(initialData.deadline).toISOString().split('T')[0]
        : '',
    },
  });

  const handleSubmitForm: SubmitHandler<TodoFormData> = async (data) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit(handleSubmitForm)}>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">Title</span>
        <input
          {...register('title')}
          placeholder="Enter title"
          className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">Description</span>
        <textarea
          {...register('description')}
          placeholder="Enter description"
          rows={3}
          className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
        />
        {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">Priority</span>
        <select
          {...register('priority')}
          className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
        >
          <option value="LOW">🔵 Low</option>
          <option value="MEDIUM">🟡 Medium</option>
          <option value="HIGH">🔴 Important</option>
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">Deadline</span>
        <input
          type="date"
          {...register('deadline')}
          min={new Date().toISOString().split('T')[0]}
          className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </label>

      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 border border-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition text-sm font-semibold"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default TodoForm;