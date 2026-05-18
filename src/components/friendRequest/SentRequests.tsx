import { useFriendStore } from "@/stores/useFriendStore";
import FriendRequestItem from "./FriendRequestItem";

const SentRequests = () => {
  const { sentList } = useFriendStore();

  if (!sentList || sentList.length === 0) {
    return (
      <p className="text-sm text-black font-bold uppercase tracking-wider p-4 border-[2px] border-black text-center mt-4 bg-white shadow-[2px_2px_0px_0px_#000000]">
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
              <p className="text-black font-bold text-xs uppercase tracking-tight bg-accent border-[2px] border-black px-2 py-1 shadow-[2px_2px_0px_0px_#000000]">
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
