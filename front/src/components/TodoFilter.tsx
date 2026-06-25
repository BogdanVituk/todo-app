import type { Dispatch, SetStateAction } from "react";
import type { FilterPriority, FilterState, FilterStatus, SortBy } from "../types/types";

interface TodoFilterProps {
  filter: FilterState;
  setFilter: Dispatch<SetStateAction<FilterState>>;
}

const TodoFilter = ({ filter, setFilter }: TodoFilterProps) => {

  return (
   <div className="flex flex-col gap-3 my-4 sm:my-5 lg:my-6">
      {/* пошук */}
      <input
        className="w-full rounded-lg border border-gray-300 p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        value={filter.query}
        onChange={(e) => setFilter((f) => ({ ...f, query: e.target.value }))}
        placeholder="Search todos..."
        aria-label="Search todos"
      />

      {/* статус + пріоритет + сортування в один рядок */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={filter.status}
          onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value as FilterStatus }))}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filter.priority}
          onChange={(e) => setFilter((f) => ({ ...f, priority: e.target.value as FilterPriority }))}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="all">Any Priority</option>
          <option value="HIGH">🔴 Important</option>
          <option value="MEDIUM">🟡 Medium</option>
          <option value="LOW">🔵 Low</option>
        </select>

        <select
          value={filter.sortBy}
          onChange={(e) => setFilter((f) => ({ ...f, sortBy: e.target.value as SortBy }))}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="default">Sort: Default</option>
          <option value="priority">↑ Priority</option>
          <option value="deadline">↑ Deadline</option>
          <option value="createdAt">↑ Newest</option>
        </select>
      </div>
    </div>
  );
};

export default TodoFilter;