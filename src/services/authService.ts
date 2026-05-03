import api from "@/lib/axios";
import type { User } from "@/types/user";

interface AccessTokenResponse {
  accessToken: string;
}

interface FetchMeResponse {
  user: User;
}

export const authService = {
  signUp: async (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => {
    await api.post(
      "/auth/signup",
      { username, password, email, firstName, lastName },
      { withCredentials: true },
    );
  },

  signIn: async (username: string, password: string) => {
    const { data } = await api.post<AccessTokenResponse>(
      "/auth/signin",
      { username, password },
      { withCredentials: true },
    );
    return data;
  },

  signOut: async () => {
    await api.post("/auth/signout", {}, { withCredentials: true });
  },

  fetchMe: async () => {
    const { data } = await api.get<FetchMeResponse>("/users/me", {
      withCredentials: true,
    });
    return data.user;
  },

  refresh: async () => {
    const { data } = await api.post<AccessTokenResponse>(
      "/auth/refresh",
      {},
      { withCredentials: true },
    );
    return data.accessToken;
  },
};
