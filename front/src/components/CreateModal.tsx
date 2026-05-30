
import type { TodoRequestBody } from "../types/types";
import CreateForm from "./CreateForm";

interface Props {
  addTodo: (data: TodoRequestBody) => Promise<void>;
  onClose: () => void;
}

const CreateModal = ({ addTodo, onClose }: Props) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-todo-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded bg-white p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 id="create-todo-title" className="text-xl font-semibold">
            Create New Task
          </h2>
          <button type="button" onClick={onClose} className="text-xl leading-none">×</button>
        </div>
        <div className="mt-4">
          <CreateForm addTodo={addTodo} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
