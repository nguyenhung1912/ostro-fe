import type { UseFormRegister } from "react-hook-form";
import type { IFormValues } from "./AddFriendModal";
import type { SubmitEventHandler } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";
import type { User } from "@/types/user";
import UserAvatar from "@/components/common/avatar/UserAvatar";

interface SendFriendRequestProps {
  register: UseFormRegister<IFormValues>;
  loading: boolean;
  foundUser: User;
  error?: string;
  onSubmit?: SubmitEventHandler<HTMLFormElement>;
  onBack: () => void;
}

const SendFriendRequestForm = ({
  register,
  loading,
  foundUser,
  error,
  onSubmit,
  onBack,
}: SendFriendRequestProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-5">
        <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
          <UserAvatar
            type="sidebar"
            name={foundUser.displayName}
            avatarUrl={foundUser.avatarUrl ?? undefined}
          />
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm">
              {foundUser.displayName}
            </span>
            <span className="text-xs text-muted-foreground">
              @{foundUser.username}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="message"
            className="text-sm font-semibold text-foreground/90"
          >
            Lời nhắn (tùy chọn)
          </Label>
          <Textarea
            id="message"
            rows={3}
            placeholder="Xin chào, mình kết bạn nhé?..."
            className="h-20 resize-none bg-white/5 border-border/50 focus-visible:ring-1"
            {...register("message")}
          />
          {error && (
            <p className="text-xs font-medium text-red-500 mt-1">{error}</p>
          )}
        </div>

        <DialogFooter className="mt-6 pt-4 border-t border-border/30">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl border border-border/50 bg-white/5 hover:bg-white/10 font-medium h-10 transition-all"
            onClick={onBack}
          >
            Quay lại
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed h-10 font-medium"
          >
            {loading ? (
              <span>Đang gửi...</span>
            ) : (
              <>
                <UserPlus className="size-4 mr-2" /> Kết bạn
              </>
            )}
          </Button>
        </DialogFooter>
      </div>
    </form>
  );
};
export default SendFriendRequestForm;
