import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { IFormValues } from "./AddFriendModal";
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
      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="username"
            className="text-sm font-semibold text-foreground/90"
          >
            Tên người dùng
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="username"
              placeholder="Nhập tên người dùng..."
              className="h-10 pl-9 bg-white/5 border-border/50 focus-visible:ring-1"
              {...register("username", {
                required: "Username không được bỏ trống",
              })}
            />
          </div>
          {errors.username && (
            <p className="text-xs font-medium text-red-500 mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {isFound === false && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium">
            <span>
              Không tìm thấy{" "}
              <span className="font-bold">@{searchedUsername}</span>
            </span>
          </div>
        )}
      </div>

      <DialogFooter className="mt-6 pt-4 border-t border-border/30">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl border border-border/50 bg-white/5 hover:bg-white/10 font-medium h-10 transition-all"
            onClick={onCancel}
          >
            Hủy
          </Button>
        </DialogClose>

        <Button
          type="submit"
          disabled={loading || !usernameValue?.trim()}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed h-10 font-medium"
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
