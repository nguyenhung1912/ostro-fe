import type { UseFormRegister } from "react-hook-form";
import type { IFormValues } from "../chat/AddFriendModal";
import type { SubmitEventHandler } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";

interface SendFriendRequestProps {
  register: UseFormRegister<IFormValues>;
  loading: boolean;
  searchedUsername: string;
  error?: string;
  onSubmit?: SubmitEventHandler<HTMLFormElement>;
  onBack: () => void;
}

const SendFriendRequestForm = ({
  register,
  loading,
  searchedUsername,
  error,
  onSubmit,
  onBack,
}: SendFriendRequestProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <span className="text-foreground bg-primary/10 border border-primary/20 rounded-xl p-3 font-medium block">
          Đã tìm thấy{" "}
          <span className="font-black text-primary">@{searchedUsername}</span>!
        </span>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-semibold">
            Giới thiệu
          </Label>
          <Textarea
            id="message"
            rows={3}
            placeholder="Xin chào, mình có thể kết bạn không?..."
            className="h-20 resize-none"
            {...register("message")}
          />
          {error && <p className="error-message">{error}</p>}
        </div>

        <DialogFooter>
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
