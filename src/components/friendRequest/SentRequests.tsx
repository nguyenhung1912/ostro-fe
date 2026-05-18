import { useFriendStore } from "@/stores/useFriendStore";
import FriendRequestItem from "./FriendRequestItem";

const SentRequests = () => {
  const { sentList } = useFriendStore();

  if (!sentList || sentList.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center mt-6 py-4">
        Bạn chưa gửi lời mời kết bạn nào
      </p>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      <>
        {sentList.map((req) => (
          <FriendRequestItem
            key={req._id}
            requestInfo={req}
            type="sent"
            actions={
              <p className="text-muted-foreground text-xs font-medium px-3 py-1 rounded-full bg-white/10 dark:bg-white/5 border border-white/10">
                Đang chờ...
              </p>
            }
          />
        ))}
      </>
    </div>
  );
};
export default SentRequests;
