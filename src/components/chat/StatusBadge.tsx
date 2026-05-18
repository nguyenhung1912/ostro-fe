import { cn } from "@/lib/utils";

const StatusBadge = ({ status }: { status: "online" | "offline" }) => {
  return (
    <div
      className={cn(
        "absolute -bottom-1 -right-1 size-4 z-10",
        status === "online" && "status-online",
        status === "offline" && "status-offline",
      )}
    ></div>
  );
};
export default StatusBadge;
