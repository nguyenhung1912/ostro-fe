import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  PASSWORD_POLICY_MESSAGE,
  strongPasswordPattern,
} from "@/lib/passwordPolicy";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Nhập mật khẩu hiện tại"),
    newPassword: z
      .string()
      .min(10, PASSWORD_POLICY_MESSAGE)
      .regex(strongPasswordPattern, PASSWORD_POLICY_MESSAGE),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

const getDeleteSchema = (isGoogleUser: boolean) =>
  z
    .object({
      password: z.string().optional(),
      confirmText: z.literal("DELETE", {
        error: "Nhập DELETE để xác nhận",
      }),
    })
    .refine(
      (data) => {
        if (!isGoogleUser && !data.password) {
          return false;
        }
        return true;
      },
      {
        message: "Nhập mật khẩu để xoá tài khoản",
        path: ["password"],
      },
    );

type PasswordFormValues = z.infer<typeof passwordSchema>;
type DeleteFormValues = z.infer<ReturnType<typeof getDeleteSchema>>;

const PrivacySettings = () => {
  const { user } = useAuthStore();
  const isGoogleUser = !!user?.googleId;
  const { changePassword, deleteAccount } = useUserStore();

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const deleteForm = useForm<DeleteFormValues>({
    resolver: zodResolver(getDeleteSchema(isGoogleUser)),
    defaultValues: {
      password: "",
      confirmText: "" as DeleteFormValues["confirmText"],
    },
  });

  const handleChangePassword = async (data: PasswordFormValues) => {
    await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    passwordForm.reset();
  };

  const handleDeleteAccount = async (data: DeleteFormValues) => {
    await deleteAccount(data.password ?? "");
  };

  return (
    <Card className="rounded-2xl glass">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 uppercase tracking-tight">
          <Shield className="h-5 w-5 text-primary" />
          Quyền riêng tư & Bảo mật
        </CardTitle>
        <CardDescription>
          Quản lý mật khẩu và các thao tác nhạy cảm của tài khoản
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {!isGoogleUser && (
          <form
            onSubmit={passwordForm.handleSubmit(handleChangePassword)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...passwordForm.register("currentPassword")}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="error-message">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...passwordForm.register("newPassword")}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="error-message">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...passwordForm.register("confirmPassword")}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="error-message">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
            >
              {passwordForm.formState.isSubmitting
                ? "Đang đổi mật khẩu..."
                : "Đổi mật khẩu"}
            </Button>
          </form>
        )}

        <div
          className={`pt-5 ${!isGoogleUser ? "border-t border-border/50" : ""}`}
        >
          <h4 className="mb-3 flex items-center gap-2 font-medium text-destructive">
            <Trash2 className="size-4" />
            Khu vực nguy hiểm
          </h4>

          <form
            onSubmit={deleteForm.handleSubmit(handleDeleteAccount)}
            className="space-y-4"
          >
            {!isGoogleUser && (
              <div className="space-y-2">
                <Label htmlFor="deletePassword">
                  Vui lòng nhập lại mật khẩu của bạn, để xác thực
                </Label>
                <Input
                  id="deletePassword"
                  type="password"
                  {...deleteForm.register("password")}
                />
                {deleteForm.formState.errors.password && (
                  <p className="error-message">
                    {deleteForm.formState.errors.password.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="confirmText">
                Để xác nhận, hãy gõ
                <span className="text-destructive">"DELETE"</span>vào ô bên dưới
              </Label>
              <Input id="confirmText" {...deleteForm.register("confirmText")} />
              {deleteForm.formState.errors.confirmText && (
                <p className="error-message">
                  {deleteForm.formState.errors.confirmText.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="destructive"
              disabled={deleteForm.formState.isSubmitting}
              className="w-full"
            >
              {deleteForm.formState.isSubmitting
                ? "Đang xoá tài khoản..."
                : "Xoá tài khoản"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;
