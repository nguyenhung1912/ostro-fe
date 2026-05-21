import { useFriendStore } from "@/stores/useFriendStore";
import FriendRequestItem from "./FriendRequestItem";
import { useState } from "react";
import { sileo } from "sileo";
import { Loader2, X } from "lucide-react";

const SentRequestAction = ({ requestId }: { requestId: string }) => {
  const { cancelRequest } = useFriendStore();
  const [isCanceling, setIsCanceling] = useState(false);

  const handleCancel = async () => {
    try {
      setIsCanceling(true);
      await cancelRequest(requestId);
      sileo.success({ title: "Lời mời đã bị thu hồi", description: "Yêu cầu kết bạn đã được huỷ bỏ. Người dùng sẽ không còn thấy lời mời này." });
    } catch (error) {
      sileo.error({ title: "Thu hồi lời mời thất bại", description: "Không thể huỷ yêu cầu. Kiểm tra kết nối mạng và thử lại." });
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <p className="text-muted-foreground text-xs font-medium px-3 py-1 rounded-full bg-white/10 dark:bg-white/5 border border-white/10">
        Đang chờ...
      </p>
      <button
        onClick={handleCancel}
        disabled={isCanceling}
        className="p-1.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50"
        title="Hủy lời mời"
      >
        {isCanceling ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <X className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

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
    <div className="space-y-3 mt-4 max-h-[224px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <>
        {sentList.map((req) => (
          <FriendRequestItem
            key={req._id}
            requestInfo={req}
            type="sent"
            actions={<SentRequestAction requestId={req._id} />}
          />
        ))}
      </>
    </div>
  );
};

export default SentRequests;
