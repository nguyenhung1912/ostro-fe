import api from "@/lib/axios";
import type { AccessTokenResponse, FetchMeResponse } from "@/types/store";

export const authService = {
  signUp: async (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => {
    await api.post("/auth/signup", {
      username,
      password,
      email,
      firstName,
      lastName,
    });
  },

  signIn: async (username: string, password: string) => {
    const { data } = await api.post<AccessTokenResponse>("/auth/signin", {
      username,
      password,
    });
    return data;
  },

  signOut: async () => {
    await api.post("/auth/signout");
  },

  fetchMe: async () => {
    const { data } = await api.get<FetchMeResponse>("/users/me");
    return data.user;
  },

  refresh: async () => {
    const { data } = await api.post<AccessTokenResponse>("/auth/refresh");
    return data.accessToken;
  },
};
