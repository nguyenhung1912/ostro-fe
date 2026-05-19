import { SignInForm } from "@/components/auth/signin-form";

const SignInPage = () => {
  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-background">
      </div>
      <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative z-0">
        <div className="w-full max-w-sm md:max-w-4xl">
          <SignInForm />
        </div>
      </div>
    </>
  );
};
export default SignInPage;
