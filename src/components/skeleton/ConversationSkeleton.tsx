const ConversationSkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="p-3 bg-white dark:bg-card border-3 border-black shadow-[4px_4px_0px_0px_var(--shadow-color)] mb-3 flex items-center gap-3 animate-pulse"
        >
          {/* Avatar skeleton */}
          <div className="size-10 rounded-none border-2 border-black bg-muted shadow-[2px_2px_0px_0px_var(--shadow-color)]" />

          {/* Info skeleton */}
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 bg-muted border-2 border-black rounded-none" />
            <div className="h-3 w-3/4 bg-muted border-2 border-black rounded-none" />
          </div>
        </div>
      ))}
    </>
  );
};

export default ConversationSkeleton;
