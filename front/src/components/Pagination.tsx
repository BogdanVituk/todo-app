
import { useTodoContext } from "../context/TodoContext";


const Pagination = () => {
 
    const { setPage, page, totalPages} = useTodoContext();

    return (
        <div>
        {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm disabled:opacity-50"
          >
            Назад
          </button>
          <span className="text-sm text-gray-600">Сторінка {page} з {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm disabled:opacity-50"
          >
            Вперед
          </button>
        </div>
      )}
        </div>
    )
}

export default Pagination;