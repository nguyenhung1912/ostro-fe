import { useAuthStore } from "@/stores/useAuthStore";
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

interface AccessTokenResponse {
  accessToken: string;
}

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _isRetry?: boolean;
};

let refreshTokenRequest: Promise<string> | null = null;

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true, 
});

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

const getFreshAccessToken = () => {
  if (!refreshTokenRequest) {
    refreshTokenRequest = api
      .post<AccessTokenResponse>("/auth/refresh", {}, { withCredentials: true })
      .then((res) => res.data.accessToken)
      .finally(() => {
        refreshTokenRequest = null;
      });
  }

  return refreshTokenRequest;
};

const shouldSkipRefresh = (url: string) =>
  url.includes("/auth/signin") ||
  url.includes("/auth/signup") ||
  url.includes("/auth/refresh");

api.interceptors.response.use(
  (res) => res, 
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const requestUrl = originalRequest?.url ?? "";

    if (!originalRequest || shouldSkipRefresh(requestUrl)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 403 && !originalRequest._isRetry) {
      
      originalRequest._isRetry = true;

      try {
        const newAccessToken = await getFreshAccessToken();

        useAuthStore.getState().setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
        
      } catch (refreshError) {
        useAuthStore.getState().clearState();
        return Promise.reject(refreshError);
      }
    }

    // Các lỗi khác (404, 500...) ném ra ngoài như bình thường
    return Promise.reject(error);
  },
);

export default api;