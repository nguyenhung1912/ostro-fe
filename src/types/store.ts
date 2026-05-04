import type { User } from "./user";

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
