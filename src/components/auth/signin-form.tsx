import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { useAuthStore } from "@/stores/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { authToast } from "@/lib/authUtils";

const signInSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const signIn = useAuthStore((s) => s.signIn);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const navigate = useNavigate();
  const loading = useAuthStore((s) => s.loading);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    const { username, password } = data;
    const signedIn = await signIn(username, password);
    if (signedIn) {
      navigate("/", { viewTransition: true });
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border/50 bg-card/50 backdrop-blur-xl shadow-xl rounded-2xl">
        <CardContent className="p-0">
          <form
            className="p-6 md:p-8 flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* header - logo*/}
            <div className="flex flex-col items-center text-center gap-3 mb-2">
              <Link
                to="/"
                className="mx-auto block w-fit text-center transition-transform hover:scale-105 active:scale-95"
              >
                <img
                  src="/logo.svg"
                  alt="logo"
                  className="h-12 w-auto drop-shadow-md"
                />
              </Link>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">
                  Chào mừng quay lại
                </h1>
                <p className="text-muted-foreground/80 text-sm">
                  Đăng nhập vào tài khoản Ostro của bạn
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* username */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Tên đăng nhập
                </Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="john_doe"
                  className="h-11 bg-white/5 border-border/50 focus-visible:bg-white/10 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all rounded-xl"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-[13px] font-medium text-destructive">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* password */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Mật khẩu
                </Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="h-11 bg-white/5 border-border/50 focus-visible:bg-white/10 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all rounded-xl"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-[13px] font-medium text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              className="w-full h-11 text-base font-semibold shadow-md transition-all hover:bg-primary/90 active:scale-[0.98] rounded-xl"
              type="submit"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Hoặc
                </span>
              </div>
            </div>

            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (credentialResponse.credential) {
                    const success = await signInWithGoogle(
                      credentialResponse.credential,
                    );
                    if (success) {
                      navigate("/", { viewTransition: true });
                    }
                  }
                }}
                onError={() => {
                  authToast.error(
                    "Đăng nhập bằng Google thất bại. Vui lòng thử lại.",
                  );
                }}
                useOneTap
                theme="outline"
                shape="rectangular"
                size="large"
                text="continue_with"
              />
            </div>

            <div className="text-center text-sm font-medium text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link
                to="/signup"
                className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                viewTransition
              >
                Đăng ký ngay
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offset-4">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
        <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  );
}
