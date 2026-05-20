import { SignUpForm } from "@/components/auth/signup-form";
import { GoogleOAuthProvider } from "@react-oauth/google";

const SignUpPage = () => {
  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-background"></div>
      <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative z-0">
        <div className="w-full max-w-sm md:max-w-md">
          <GoogleOAuthProvider
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}
          >
            <SignUpForm />
          </GoogleOAuthProvider>
        </div>
      </div>
    </>
  );
};
export default SignUpPage;
