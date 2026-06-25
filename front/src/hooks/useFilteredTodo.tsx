import { useMemo } from "react"
import type { FilterState, Priority, Todo } from "../types/types"

const PRIORITY_WEIGHT: Record<Priority, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
}

export const useFilteredTodos = (todos: Todo[], filter: FilterState) => {
  return useMemo(() => {
    const result = todos.filter((todo) => {
      const matchesSearch =
        todo.title.toLowerCase().includes(filter.query.toLowerCase()) ||
        todo.description.toLowerCase().includes(filter.query.toLowerCase())

      const matchesStatus =
        filter.status === 'all' ? true
        : filter.status === 'active' ? !todo.completed
        : todo.completed

      const matchesPriority =
        filter.priority === 'all' ? true : todo.priority === filter.priority

      return matchesSearch && matchesStatus && matchesPriority
    })

    if (filter.sortBy === 'priority') {
      result.sort((a, b) => {
        const wa = a.priority ? PRIORITY_WEIGHT[a.priority] : 0
        const wb = b.priority ? PRIORITY_WEIGHT[b.priority] : 0
        return wb - wa
      })
    } else if (filter.sortBy === 'deadline') {
      result.sort((a, b) => {
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      })
    } else if (filter.sortBy === 'createdAt') {
      result.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    }

    return result
  }, [filter.query, filter.status, filter.priority, filter.sortBy, todos])
}