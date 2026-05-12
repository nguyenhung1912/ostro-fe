import type { Conversation, Message } from "./chat";
import type { User } from "./user";

export interface AccessTokenResponse {
  accessToken: string;
}

export interface FetchMeResponse {
  user: User;
}

export interface FetchMeOptions {
  showErrorToast?: boolean;
}

export interface RefreshOptions {
  showErrorToast?: boolean;
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  authChecked: boolean;

  setAccessToken: (accessToken: string) => void;
  clearState: () => void;
  signUp: (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => Promise<boolean>;
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  fetchMe: (options?: FetchMeOptions) => Promise<boolean>;
  refresh: (options?: RefreshOptions) => Promise<boolean>;
  initializeAuth: () => Promise<void>;
}

export interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

export interface ChatState {
  conversations: Conversation[];
  messages: Record<
    string,
    {
      items: Message[];
      hasMore: boolean;
      nextCursor?: string | null;
    }
  >;
  activeConversationId: string | null;
  loading: boolean;
  reset: () => void;
  
  setActiveConversation: (id: string | null) => void;
  fetchConversations: () => Promise<void>;
}
