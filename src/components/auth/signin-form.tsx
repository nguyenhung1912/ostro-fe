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
  const navigate = useNavigate();
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
      <Card className="overflow-hidden p-0 border-border bg-card shadow-sm">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-4 md:p-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              {/* header - logo*/}
              <div className="flex flex-col items-center text-center gap-2">
                <Link to="/" className="mx-auto block w-fit text-center">
                  <img src="/logo.svg" alt="logo" />
                </Link>

                <h1 className="text-2xl font-bold">Chào mừng quay lại</h1>
                <p className="text-muted-foreground text-balance">
                  Đăng nhập vào tài khoản Ostro của bạn
                </p>
              </div>

              {/* username */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username" className="block text-sm">
                  Tên đăng nhập
                </Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="john_doe"
                  {...register("username")}
                />
                {/* error message */}
                {errors.username && (
                  <p className="error-message">{errors.username.message}</p>
                )}
              </div>

              {/* password */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="block text-sm">
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {/* error message */}
                {errors.password && (
                  <p className="error-message">{errors.password.message}</p>
                )}
              </div>

              {/* sign in button */}
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                Đăng nhập
              </Button>

              <div className="text-center text-sm">
                Chưa có tài khoản?{" "}
                <Link
                  to="/signup"
                  className="underline underline-offset-4"
                  viewTransition
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-transparent md:block mix-blend-overlay">
            <img
              src="/placeholder.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offset-4">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
        <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  );
}
