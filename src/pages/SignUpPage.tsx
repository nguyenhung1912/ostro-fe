import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SignUpForm } from "@/components/auth/SignUpForm";

const SignUpPage = () => {
  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-background"></div>

      {/* Floating Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-white/10 dark:bg-white/5 border border-white/10 rounded-full shadow-lg backdrop-blur-md hover:scale-105 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:-translate-x-0.5 transition-transform" />
          <span>Quay lại trang chủ</span>
        </Link>
      </div>

      <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative z-0">
        <div className="w-full max-w-sm md:max-w-md">
          <SignUpForm />
        </div>
      </div>
    </>
  );
};
export default SignUpPage;
