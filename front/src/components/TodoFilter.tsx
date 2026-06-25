import type { Dispatch, SetStateAction } from "react";
import type { FilterPriority, FilterState, FilterStatus } from "../types/types";


interface TodoFilterProps {
  filter: FilterState;
  setFilter: Dispatch<SetStateAction<FilterState>>;
}


const priorityOptions: { value: FilterPriority; label: string }[] = [
  { value: 'all',    label: 'Будь-який' },
  { value: 'HIGH',   label: '🔴 Важливо' },
  { value: 'MEDIUM', label: '🟡 Середній' },
  { value: 'LOW',    label: '🔵 Низький' },
]

const TodoFilter = ({ filter, setFilter }: TodoFilterProps) => {
  const handleQueryChange = (query: string) => {
    setFilter((current) => ({ ...current, query }));
  };

  const handleStatusChange = (status: FilterStatus) => {
    setFilter((current) => ({ ...current, status }));
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-5 my-4 sm:my-5 lg:my-6 items-stretch sm:items-center">
      <input
        className="flex-1 rounded-lg border border-gray-300 p-3 sm:p-4 lg:p-4 text-sm sm:text-base lg:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        value={filter.query}
        onChange={(event) => handleQueryChange(event.target.value)}
        placeholder="Search todos..."
        aria-label="Search todos"
      />
      <select
        value={filter.status}
        onChange={(event) => handleStatusChange(event.target.value as FilterStatus)}
        className="flex-1 sm:flex-none rounded-lg border border-gray-300 p-3 sm:p-4 lg:p-4 text-sm sm:text-base lg:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        aria-label="Filter todos by status"
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>

      <div className="flex gap-2 flex-wrap">
        {priorityOptions.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter((f) => ({ ...f, priority: value }))}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition border
              ${filter.priority === value
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
              }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TodoFilter;