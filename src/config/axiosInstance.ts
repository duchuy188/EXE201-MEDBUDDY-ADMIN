import axios, { AxiosError, AxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Attach access token to each request if present
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token && config && config.headers) {
        // ensure headers object exists
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore localStorage errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: on 401 try refreshing token and retry original requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = (error.config || {}) as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      // don't try to refresh if the failed request was the refresh endpoint itself
      const requestUrl = originalRequest.url || '';
      if (requestUrl.includes('/auth/refresh-token')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // queue the request until refresh finishes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve: (token?: string) => {
            if (token && originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${token}`;
            // @ts-ignore
            resolve(axiosInstance(originalRequest));
          }, reject });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        isRefreshing = false;
        processQueue(new Error('No refresh token'));
        return Promise.reject(error);
      }

      try {
        // use a plain axios instance to avoid triggering interceptors
        const refreshAxios = axios.create({ baseURL, withCredentials: true });
        const resp = await refreshAxios.post('/auth/refresh-token', { refreshToken });
        const data = resp?.data ?? resp;

        const newAccess = data?.accessToken || data?.access_token || data?.token || data?.data?.accessToken || null;
        const newRefresh = data?.refreshToken || data?.refresh_token || data?.data?.refreshToken || null;

        if (newAccess) {
          try { localStorage.setItem('accessToken', newAccess); } catch {}
          if (newRefresh) {
            try { localStorage.setItem('refreshToken', newRefresh); } catch {}
          }
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
          processQueue(null, newAccess);
          if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          // @ts-ignore
          return axiosInstance(originalRequest);
        }

        processQueue(new Error('Refresh did not return access token'));
        return Promise.reject(error);
      } catch (err) {
        processQueue(err);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;