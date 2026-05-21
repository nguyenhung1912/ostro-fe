import axios from "axios";
import { sileo } from "sileo";
import { EXPLICIT_SIGN_OUT_KEY } from "@/lib/storageKeys";




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
  success: (title: string, description: string) =>
    sileo.success({ title, description }),
  error: (title: string, description: string) =>
    sileo.error({ title, description }),
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
