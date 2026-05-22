export function ListSkeleton() {
  return (
    <div className="p-3 space-y-2 sm:hidden animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-lg p-3 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-4 w-8 bg-muted rounded" />
              </div>
              <div className="h-3 w-48 bg-muted/60 rounded" />
            </div>
            <div className="h-9 w-9 bg-muted rounded" />
          </div>
          <div className="border-t border-border/50 pt-2 flex justify-between">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-3 w-16 bg-muted/60 rounded" />
          </div>
          <div className="flex gap-3">
            <div className="h-3 w-14 bg-muted/40 rounded" />
            <div className="h-3 w-14 bg-muted/40 rounded" />
            <div className="h-3 w-14 bg-muted/40 rounded" />
            <div className="h-3 w-14 bg-muted/40 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="p-4 hidden sm:block animate-pulse">
      <div className="space-y-0">
        <div className="flex items-center gap-3 pb-3 border-b border-border">
          <div className="w-8 h-4 bg-muted rounded" />
          <div className="w-32 h-4 bg-muted rounded" />
          <div className="w-24 h-4 bg-muted rounded hidden md:block" />
          <div className="w-20 h-4 bg-muted rounded" />
          <div className="flex-1" />
          <div className="w-12 h-4 bg-muted rounded" />
          <div className="w-8 h-4 bg-muted rounded" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-border/50">
            <div className="w-7 h-7 bg-muted rounded" />
            <div className="w-36 h-4 bg-muted rounded" />
            <div className="w-20 h-3 bg-muted/60 rounded hidden md:block" />
            <div className="w-24 h-4 bg-muted rounded" />
            <div className="flex-1" />
            <div className="w-10 h-5 bg-muted rounded" />
            <div className="w-7 h-7 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
