import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { UserPlus } from "lucide-react";
import type { User } from "@/types/user";
import { useFriendStore } from "@/stores/useFriendStore";
import { useForm, useWatch } from "react-hook-form";
import { sileo } from "sileo";
import SearchForm from "../add-friend-modal/SearchForm";
import SendFriendRequestForm from "../add-friend-modal/SendFriendRequestForm";
import { UserSearch } from "lucide-react";

export interface IFormValues {
  username: string;
  message: string;
}

const AddFriendModal = () => {
  const [isFound, setIsFound] = useState<boolean | null>(null);
  const [searchUser, setSearchUser] = useState<User>();
  const [searchedUsername, setSearchedUsername] = useState("");
  const [sendError, setSendError] = useState("");
  const { loading, searchByUsername, addFriend } = useFriendStore();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: { username: "", message: "" },
  });

  const usernameValue = useWatch({ control, name: "username" }) ?? "";

  const handleSearch = handleSubmit(async (data) => {
    const username = data.username.trim();
    if (!username) return;

    setIsFound(null);
    setSearchedUsername(username);
    setSendError("");

    try {
      const foundUser = await searchByUsername(username);
      if (foundUser) {
        setIsFound(true);
        setSearchUser(foundUser);
      } else {
        setIsFound(false);
      }
    } catch (error) {
      console.error("[AddFriendModal] Failed to handle user search:", error);
      setIsFound(false);
    }
  });

  const handleSend = handleSubmit(async (data) => {
    if (!searchUser) return;

    try {
      setSendError("");
      await addFriend(searchUser._id, data.message.trim());
      sileo.success({
        title: "Lời mời đã được gửi",
        description: `${searchUser.displayName} sẽ nhận được thông báo và có thể chấp nhận lời mời của bạn.`,
      });

      handleCancel();
    } catch (error) {
      console.error("[AddFriendModal] Failed to send friend request:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Gửi lời mời kết bạn thất bại. Vui lòng thử lại.";

      setSendError(message);
      sileo.error({
        title: "Gửi lời mời thất bại",
        description:
          "Yêu cầu kết bạn đã được gửi trước đó hoặc tài khoản không tồn tại.",
      });
    }
  });

  const handleCancel = () => {
    reset();
    setSearchedUsername("");
    setIsFound(null);
    setSearchUser(undefined);
    setSendError("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-center items-center size-5 rounded-full hover:bg-sidebar-accent cursor-pointer z-10">
          <UserPlus className="size-4" />
          <span className="sr-only">Kết bạn</span>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader className="mb-2">
          <DialogTitle className="flex items-center gap-2 font-semibold text-xl text-foreground">
            <UserSearch className="w-5 h-5 text-muted-foreground" />
            Thêm bạn bè
          </DialogTitle>
        </DialogHeader>

        {/* form search by username */}
        {!isFound && (
          <>
            <SearchForm
              register={register}
              errors={errors}
              usernameValue={usernameValue}
              loading={loading}
              isFound={isFound}
              searchedUsername={searchedUsername}
              onSubmit={handleSearch}
              onCancel={handleCancel}
            />
          </>
        )}

        {/* form send friend request */}
        {isFound && (
          <>
            <SendFriendRequestForm
              register={register}
              loading={loading}
              foundUser={searchUser!}
              error={sendError}
              onSubmit={handleSend}
              onBack={() => {
                setIsFound(null);
                setSendError("");
              }}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendModal;
