import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import type { TodoRequestBody } from "../types/types";

const todoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(5, "Description must be at least 5 characters long"),
});

type TodoFormData = z.infer<typeof todoSchema>;

interface CreateFormProps {
  addTodo: (data: TodoRequestBody) => Promise<void>;
  onClose: () => void;
}

const CreateForm = ({ addTodo, onClose }: CreateFormProps) => {

  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<TodoFormData> = async (data) => {
    setSubmitError("");

    try {
      await addTodo(data);
      reset();
      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setSubmitError(message);
    }
  };

  return (
    <form className="flex flex-col gap-3 w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Title</span>
        <input
          type="text"
          placeholder="Enter title"
          className="border border-gray-300 rounded p-2"
          {...register("title")}
        />
        {errors.title && <span className="text-red-500">{errors.title.message}</span>}
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Description</span>
        <input
          type="text"
          placeholder="Enter description"
          className="border border-gray-300 rounded p-2"
          {...register("description")}
        />
        {errors.description && <span className="text-red-500">{errors.description.message}</span>}
      </label>

      {submitError && <div className="text-red-500">{submitError}</div>}

      <button
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default CreateForm;
