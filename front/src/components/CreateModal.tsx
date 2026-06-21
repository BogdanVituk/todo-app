import CreateForm from "./CreateForm";

interface Props {
  onClose: () => void;
}

const CreateModal = ({ onClose }: Props) => {
  
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-todo-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded bg-white p-4 sm:p-6 shadow-lg max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="create-todo-title" className="text-lg sm:text-xl font-semibold">
            Create New Task
          </h2>
          <button type="button" onClick={onClose} className="text-2xl leading-none hover:text-gray-600 transition">
            ×
          </button>
        </div>
        <div>
          <CreateForm onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
