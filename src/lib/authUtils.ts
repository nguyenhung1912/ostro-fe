import axios from "axios";
import { toast } from "sonner";

const AUTH_TOAST_ID = "auth-status";
const EXPLICIT_SIGN_OUT_KEY = "ostro-explicit-sign-out";

export const explicitSignOut = {
  check: (): boolean => {
    try {
      return localStorage.getItem(EXPLICIT_SIGN_OUT_KEY) === "true";
    } catch {
      return false;
    }
  },
  mark: (): void => {
    try {
      localStorage.setItem(EXPLICIT_SIGN_OUT_KEY, "true");
    } catch {
      /* ignore */
    }
  },
  clear: (): void => {
    try {
      localStorage.removeItem(EXPLICIT_SIGN_OUT_KEY);
    } catch {
      /* ignore */
    }
  },
};

export const authToast = {
  success: (message: string) => toast.success(message, { id: AUTH_TOAST_ID }),
  error: (message: string) => toast.error(message, { id: AUTH_TOAST_ID }),
};

export const getAuthErrorMessage = (
  error: unknown,
  fallback: string,
  statusMessages: Partial<Record<number, string>> = {},
): string => {
  if (!axios.isAxiosError(error)) return fallback;

  if (!error.response) {
    return "Không thể kết nối máy chủ. Hãy kiểm tra backend và thử lại!";
  }

  return (
    statusMessages[error.response.status] ||
    (error.response.data as { message?: string })?.message ||
    fallback
  );
};
