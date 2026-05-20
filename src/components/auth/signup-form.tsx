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

const signUpSchema = z.object({
  firstname: z.string().min(1, "Tên bắt buộc phải có"),
  lastname: z.string().min(1, "Họ bắt buộc phải có"),
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  email: z.email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const signUp = useAuthStore((s) => s.signUp);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const navigate = useNavigate();
  const loading = useAuthStore((s) => s.loading);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    const { firstname, lastname, username, email, password } = data;

    const signedUp = await signUp(
      username,
      password,
      email,
      firstname,
      lastname,
    );
    if (signedUp) {
      navigate("/signin", { viewTransition: true });
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
                  Tạo tài khoản Ostro
                </h1>
                <p className="text-muted-foreground/80 text-sm">
                  Chào mừng bạn! Hãy đăng ký để bắt đầu
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="text-sm font-medium">
                    Họ
                  </Label>
                  <Input
                    type="text"
                    id="lastname"
                    placeholder="Nguyễn"
                    className="h-11 bg-white/5 border-border/50 focus-visible:bg-white/10 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all rounded-xl"
                    {...register("lastname")}
                  />
                  {errors.lastname && (
                    <p className="text-[13px] font-medium text-destructive">
                      {errors.lastname.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="text-sm font-medium">
                    Tên
                  </Label>
                  <Input
                    type="text"
                    id="firstname"
                    placeholder="Văn A"
                    className="h-11 bg-white/5 border-border/50 focus-visible:bg-white/10 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all rounded-xl"
                    {...register("firstname")}
                  />
                  {errors.firstname && (
                    <p className="text-[13px] font-medium text-destructive">
                      {errors.firstname.message}
                    </p>
                  )}
                </div>
              </div>

              {/* username */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Tên đăng nhập
                </Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="nguyenvana123"
                  className="h-11 bg-white/5 border-border/50 focus-visible:bg-white/10 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all rounded-xl"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-[13px] font-medium text-destructive">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* email */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  className="h-11 bg-white/5 border-border/50 focus-visible:bg-white/10 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all rounded-xl"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-[13px] font-medium text-destructive">
                    {errors.email.message}
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
              {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
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
                    "Đăng ký bằng Google thất bại. Vui lòng thử lại.",
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
              Đã có tài khoản?{" "}
              <Link
                to="/signin"
                className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                viewTransition
              >
                Đăng nhập
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
