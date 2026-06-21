import type { Dispatch, SetStateAction } from "react";
import type { FilterStatus } from "../types/types";

interface FilterState {
  status: FilterStatus;
  query: string;
}

interface TodoFilterProps {
  filter: FilterState;
  setFilter: Dispatch<SetStateAction<FilterState>>;
}

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
    </div>
  );
};

export default TodoFilter;