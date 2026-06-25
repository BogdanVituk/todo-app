

const SkeletonItem = () => (
  <li className="rounded-lg border border-slate-200 p-4 sm:p-5 space-y-3 animate-pulse">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3 flex-1">
        <div className="w-5 h-5 rounded bg-gray-200 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-2/3" />
        </div>
      </div>
      <div className="w-7 h-7 rounded bg-gray-200 shrink-0" />
    </div>
    <div className="flex gap-2 ml-8">
      <div className="h-5 w-20 bg-gray-200 rounded-full" />
      <div className="h-5 w-24 bg-gray-200 rounded-full" />
    </div>
  </li>
);

const TodoSkeleton = ({ count = 5 }: { count?: number }) => (
  <div>
    <div className="h-7 bg-gray-200 rounded w-24 mx-auto mb-6 animate-pulse" />
    <ul className="space-y-3 sm:space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonItem key={i} />
      ))}
    </ul>
  </div>
);

export default TodoSkeleton;