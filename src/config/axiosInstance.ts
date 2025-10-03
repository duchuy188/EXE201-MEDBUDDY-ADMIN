import axios, { AxiosError, AxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL ;

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
        // Clear all auth data and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // queue the request until refresh finishes
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token?: string) => {
              if (token && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(axiosInstance(originalRequest));
            },
            reject
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        isRefreshing = false;
        processQueue(new Error('No refresh token'));
        // Clear all auth data and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // use a plain axios instance to avoid triggering interceptors
        const refreshAxios = axios.create({
          baseURL,
          withCredentials: true,
          timeout: 10000, // 10 second timeout
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const resp = await refreshAxios.post('/auth/refresh-token', { refreshToken });
        const data = resp?.data ?? resp;

        const newAccess = data?.accessToken || data?.access_token || data?.token || data?.data?.accessToken || null;
        const newRefresh = data?.refreshToken || data?.refresh_token || data?.data?.refreshToken || null;

        if (newAccess) {
          // Update localStorage
          try {
            localStorage.setItem('accessToken', newAccess);
          } catch (e) {
            // Handle localStorage errors silently
          }

          // Handle refresh token
          if (newRefresh) {
            try {
              localStorage.setItem('refreshToken', newRefresh);
            } catch (e) {
              // Handle localStorage errors silently
            }
          }

          // Update axios default headers
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;

          // Process queued requests
          processQueue(null, newAccess);

          // Update original request headers
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          }

          return axiosInstance(originalRequest);
        } else {
          processQueue(new Error('Refresh did not return access token'));

          // Clear auth data and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';

          return Promise.reject(error);
        }
      } catch (err: any) {
        // Clear tokens if refresh fails
        try {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        } catch (e) {
          // Handle localStorage errors silently
        }

        processQueue(err);

        // Redirect to login page
        window.location.href = '/login';

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Test function to manually trigger refresh token (for debugging)
export const testRefreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    return false;
  }

  try {
    const refreshAxios = axios.create({ baseURL, withCredentials: true });
    const resp = await refreshAxios.post('/auth/refresh-token', { refreshToken });
    return true;
  } catch (error: any) {
    return false;
  }
};

// Function to check if access token is expired
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const isExpired = now >= exp;
    return isExpired;
  } catch (error) {
    return true;
  }
};

// Function to inspect current tokens
export const inspectTokens = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  return {
    accessToken,
    refreshToken,
    areTokensSame: accessToken === refreshToken,
    accessTokenExpired: accessToken ? isTokenExpired(accessToken) : true
  };
};

// Function to force clear tokens and test refresh
export const forceTestRefresh = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    return false;
  }

  // Clear access token to force 401
  localStorage.removeItem('accessToken');

  try {
    // Make a request that should trigger refresh
    const response = await axiosInstance.get('/users/profile');
    return true;
  } catch (error) {
    return false;
  }
};

// Make test functions available in window for debugging
if (typeof window !== 'undefined') {
  (window as any).testRefreshToken = testRefreshToken;
  (window as any).isTokenExpired = isTokenExpired;
  (window as any).inspectTokens = inspectTokens;
  (window as any).forceTestRefresh = forceTestRefresh;
}

export default axiosInstance;