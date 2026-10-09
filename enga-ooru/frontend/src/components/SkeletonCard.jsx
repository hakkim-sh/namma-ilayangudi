export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 w-full rounded-xl bg-slate-200" />

      {/* Category Tags Skeleton */}
      <div className="mt-3.5 flex items-center gap-2">
        <div className="h-4 w-20 rounded bg-slate-200" />
        <div className="h-4 w-16 rounded bg-slate-200" />
      </div>

      {/* Title Skeleton */}
      <div className="mt-2.5 h-5 w-3/4 rounded bg-slate-200" />

      {/* Location Skeleton */}
      <div className="mt-2 flex items-center gap-1.5">
        <div className="h-3.5 w-3.5 rounded-full bg-slate-200" />
        <div className="h-3.5 w-1/3 rounded bg-slate-200" />
      </div>

      {/* Footer / Button Skeleton */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="h-3.5 w-16 rounded bg-slate-200" />
        <div className="h-4 w-24 rounded bg-slate-200" />
      </div>
    </div>
  )
}