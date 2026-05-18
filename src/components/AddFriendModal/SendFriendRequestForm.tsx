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
  onSubmit?: SubmitEventHandler<HTMLFormElement>;
  onBack: () => void;
}

const SendFriendRequestForm = ({
  register,
  loading,
  searchedUsername,
  onSubmit,
  onBack,
}: SendFriendRequestProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <span className="text-black bg-accent border-[2px] border-black p-2 font-bold block shadow-[2px_2px_0px_0px_#000000]">
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
            className="bg-white border-[3px] border-black shadow-[2px_2px_0px_0px_#000000] focus-visible:ring-0 focus-visible:border-primary rounded-none font-bold text-black resize-none"
            {...register("message")}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-none border-[3px] border-black bg-white text-black hover:bg-accent font-bold shadow-[2px_2px_0px_0px_#000000] transition-all hover:-translate-y-1 hover:shadow-neobrutal h-12"
            onClick={onBack}
          >
            Quay lại
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="flex-1 btn-neobrutal bg-primary text-black disabled:opacity-50 disabled:cursor-not-allowed h-12"
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
