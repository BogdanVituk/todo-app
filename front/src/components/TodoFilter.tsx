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
    <div className="flex justify-between my-3 sm:flex-row sm:items-center">
      <input
        className="w-full max-w-xs block rounded border border-gray-300 p-2"
        value={filter.query}
        onChange={(event) => handleQueryChange(event.target.value)}
        placeholder="Search todos..."
        aria-label="Search todos"
      />
      <select
        value={filter.status}
        onChange={(event) => handleStatusChange(event.target.value as FilterStatus)}
        className="w-full max-w-48 rounded border border-gray-300 p-2"
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