import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useTodoContext } from "../context/TodoContext";

const todoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(5, "Description must be at least 5 characters long"),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  deadline: z.string().optional(),
});

type TodoFormData = z.infer<typeof todoSchema>;

interface CreateFormProps {
  onClose: () => void;
}

const CreateForm = ({ onClose }: CreateFormProps) => {
  const { onAddTodo } = useTodoContext();
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    mode: "onChange",
    defaultValues: {
      priority: "MEDIUM"
    }
  });

  const onSubmit: SubmitHandler<TodoFormData> = async (data) => {
    setSubmitError("");

    try {
      await onAddTodo(data);
      reset();
      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setSubmitError(message);
      return;
    }
  };

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm sm:text-base lg:text-base font-semibold">Title</span>
        <input
          type="text"
          placeholder="Enter title"
          className="border border-gray-300 rounded-lg p-3 sm:p-4 text-sm sm:text-base lg:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          {...register("title")}
        />
        {errors.title && <span className="text-red-500 text-xs sm:text-sm lg:text-sm">{errors.title.message}</span>}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm sm:text-base lg:text-base font-semibold">Description</span>
        <textarea
          placeholder="Enter description"
          rows={3}
          className="border border-gray-300 rounded-lg p-3 sm:p-4 text-sm sm:text-base lg:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
          {...register("description")}
        />
        {errors.description && <span className="text-red-500 text-xs sm:text-sm lg:text-sm">{errors.description.message}</span>}
      </label>
      <select {...register('priority')} className="border rounded px-2 py-1 text-sm">
        <option value="LOW">Низький</option>
        <option value="MEDIUM">Середній</option>
        <option value="HIGH">🔥 Важливо</option>
      </select>

     <label className="flex flex-col gap-1.5">
      <span className="text-sm sm:text-base font-semibold">Дедлайн</span>
      <input
        type="date"
        {...register('deadline')}
        min={new Date().toISOString().split('T')[0]}
        className="border border-gray-300 rounded-lg p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      </label>

      {submitError && <div className="text-red-500 text-sm sm:text-base bg-red-50 p-3 rounded-lg border border-red-200">{submitError}</div>}

      <button
        className="bg-blue-500 text-white p-3 sm:p-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base lg:text-base font-semibold mt-2"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Create Task"}
      </button>
    </form>
  );
};

export default CreateForm;
