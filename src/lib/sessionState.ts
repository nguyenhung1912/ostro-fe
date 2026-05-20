import { AUTH_STORAGE_KEY, CHAT_STORAGE_KEY } from "@/lib/storageKeys";

export const clearPersistedSessionState = () => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
};

export const clearChatScrollSessionState = () => {
  try {
    const keysToRemove: string[] = [];

    for (let index = 0; index < sessionStorage.length; index += 1) {
      const key = sessionStorage.key(index);

      if (key?.startsWith("chat-scroll-")) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => sessionStorage.removeItem(key));
  } catch {
    /* ignore */
  }
};
