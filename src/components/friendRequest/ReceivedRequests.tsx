import { useFriendStore } from "@/stores/useFriendStore";
import FriendRequestItem from "./FriendRequestItem";
import { Button } from "../ui/button";
import { toast } from "sonner";

const ReceivedRequests = () => {
  const { acceptRequest, declineRequest, loading, receivedList } =
    useFriendStore();

  if (!receivedList || receivedList.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center mt-6 py-4">
        Bạn chưa có lời mời kết bạn nào
      </p>
    );
  }

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest(requestId);
      toast.success("Đã chấp nhận lời mời kết bạn.");
    } catch (error) {
      console.error("[ReceivedRequests] Accept failed:", error);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await declineRequest(requestId);
      toast.info("Đã từ chối lời mời kết bạn.");
    } catch (error) {
      console.error("[ReceivedRequests] Decline failed:", error);
    }
  };

  return (
    <div className="space-y-3 mt-4">
      {receivedList.map((req) => (
        <FriendRequestItem
          key={req._id}
          requestInfo={req}
          actions={
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-primary/90 hover:bg-primary text-white rounded-xl h-8 font-medium transition-all text-xs px-3 disabled:opacity-50"
                onClick={() => handleAccept(req._id)}
                disabled={loading}
              >
                Chấp nhận
              </Button>

              <Button
                size="sm"
                className="bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 text-foreground rounded-xl h-8 font-medium transition-all text-xs px-3 border border-white/10 disabled:opacity-50"
                onClick={() => handleDecline(req._id)}
                disabled={loading}
              >
                Từ chối
              </Button>
            </div>
          }
          type="received"
        />
      ))}
    </div>
  );
};
export default ReceivedRequests;
