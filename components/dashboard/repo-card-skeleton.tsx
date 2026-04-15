export function RepoCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Title */}
          <div className="shimmer h-6 w-32 rounded" />
          {/* Description */}
          <div className="shimmer h-4 w-full rounded" />
          <div className="shimmer h-4 w-2/3 rounded" />
          {/* Meta */}
          <div className="flex gap-4">
            <div className="shimmer h-4 w-16 rounded" />
            <div className="shimmer h-4 w-12 rounded" />
            <div className="shimmer h-4 w-20 rounded" />
          </div>
        </div>
        {/* Score circle */}
        <div className="shimmer h-14 w-14 rounded-full" />
      </div>
      {/* Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="shimmer h-4 w-24 rounded" />
        <div className="shimmer h-9 w-20 rounded-lg" />
      </div>
    </div>
  )
}
