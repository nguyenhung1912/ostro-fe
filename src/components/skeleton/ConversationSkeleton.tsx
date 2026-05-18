const ConversationSkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="p-3 rounded-2xl bg-white/5 dark:bg-white/[0.03] border border-white/10 mb-3 flex items-center gap-3 animate-pulse"
        >
          {/* Avatar skeleton */}
          <div className="size-10 rounded-full bg-muted/60" />

          {/* Info skeleton */}
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/2 bg-muted/60 rounded-full" />
            <div className="h-2.5 w-3/4 bg-muted/40 rounded-full" />
          </div>
        </div>
      ))}
    </>
  );
};

export default ConversationSkeleton;
