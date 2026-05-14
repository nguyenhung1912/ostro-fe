import { AUTH_STORAGE_KEY, CHAT_STORAGE_KEY } from "@/lib/storageKeys";

export const clearPersistedSessionState = () => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
};
