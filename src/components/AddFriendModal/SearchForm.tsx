import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { IFormValues } from "../chat/AddFriendModal";
import type { SubmitEventHandler } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

interface SearchFormProps {
  register: UseFormRegister<IFormValues>;
  errors: FieldErrors<IFormValues>;
  loading: boolean;
  usernameValue: string;
  isFound: boolean | null;
  searchedUsername: string;
  onSubmit?: SubmitEventHandler<HTMLFormElement>;
  onCancel: () => void;
}

const SearchForm = ({
  register,
  errors,
  loading,
  usernameValue,
  isFound,
  searchedUsername,
  onSubmit,
  onCancel,
}: SearchFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-semibold">
          Tìm bằng username
        </Label>
        <Input
          id="username"
          placeholder="Nhập tên người dùng cần tìm..."
          className="bg-white border-[3px] border-black shadow-[2px_2px_0px_0px_#000000] focus-visible:ring-0 focus-visible:border-primary rounded-none font-bold text-black h-12"
          {...register("username", {
            required: "Username không được bỏ trống",
          })}
        />
        {errors.username && (
          <p className="error-message">{errors.username.message}</p>
        )}

        {isFound === false && (
          <span className="error-message">
            Không tìm thấy
            <span className="font-semibold">@{searchedUsername}</span>
          </span>
        )}
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-none border-[3px] border-black bg-white text-black hover:bg-accent font-bold shadow-[2px_2px_0px_0px_#000000] transition-all hover:-translate-y-1 hover:shadow-neobrutal h-12"
            onClick={onCancel}
          >
            Hủy
          </Button>
        </DialogClose>

        <Button
          type="submit"
          disabled={loading || !usernameValue?.trim()}
          className="flex-1 btn-neobrutal bg-primary text-black disabled:opacity-50 disabled:cursor-not-allowed h-12"
        >
          {loading ? (
            <span>Đang tìm...</span>
          ) : (
            <>
              {" "}
              <Search className="size-4 mr-2" /> Tìm
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};
export default SearchForm;
