import { useTodoContext } from "../context/TodoContext";
import TodoForm, { type TodoFormData } from "./TodoForm";
import type { Todo } from "../types/types";

interface Props {
  todo: Todo;
  onClose: () => void;
}

const EditModal = ({ todo, onClose }: Props) => {
  const { onEditTodo } = useTodoContext();

  const handleSubmit = async (data: TodoFormData) => {
    await onEditTodo(todo.id, data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold">Редагувати задачу</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">✕</button>
        </div>
        <TodoForm initialData={todo} onSubmit={handleSubmit} onClose={onClose} submitLabel="Зберегти" />
      </div>
    </div>
  );
};

export default EditModal;