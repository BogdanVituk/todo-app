import { useTodoContext } from "../context/TodoContext";
import TodoForm, { type TodoFormData } from "./TodoForm";

interface Props {
  onClose: () => void;
}

const CreateModal = ({ onClose }: Props) => {
  const { onAddTodo } = useTodoContext();

  const handleSubmit = async (data: TodoFormData) => {
    await onAddTodo(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold">New todo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">✕</button>
        </div>
        <TodoForm onSubmit={handleSubmit} onClose={onClose} submitLabel="Create" />
      </div>
    </div>
  );
};

export default CreateModal;