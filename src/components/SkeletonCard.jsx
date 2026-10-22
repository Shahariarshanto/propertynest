/** Skeleton card placeholder for property grid loading state */
export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-6 w-1/3" />
        <div className="flex gap-4">
          <div className="skeleton h-4 w-12" />
          <div className="skeleton h-4 w-12" />
          <div className="skeleton h-4 w-14" />
        </div>
      </div>
    </div>
  );
}

/** Skeleton for a compact list item */
export function SkeletonListItem() {
  return (
    <div className="flex gap-3 p-3">
      <div className="skeleton w-16 h-16 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton h-4 w-1/3" />
      </div>
    </div>
  );
}
