import React, { createContext, useContext, useEffect, useState } from 'react';
import { userServices } from '@/services/usersService';

type User = any | null;

type AuthContextType = {
  user: User;
  accessToken: string | null;
  loading: boolean; // for login/logout actions
  checking: boolean; // for initial checking/refresh
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const fetchProfile = async () => {
    try {
      const resp = await userServices.getProfile();
      const data = resp?.data ?? resp;
      const profile = data?.data ?? data ?? null;
      setUser(profile);
      try {
        if (profile) localStorage.setItem('user', JSON.stringify(profile));
      } catch {}
    } catch (e) {
      // keep token but no profile available — log for debugging
      // (network / permission / response-shape issues can cause this)
      // eslint-disable-next-line no-console
      console.debug('fetchProfile failed or returned no profile', e);
      setUser(null);
    }
  };

  const refresh = async (): Promise<boolean> => {
    try {
      const resp = await userServices.refreshToken();
      const data = resp?.data ?? resp;
      const token = data?.accessToken || data?.token || data?.data?.accessToken || null;
      const successFlag = data?.success ?? !!token;
      if (token) {
        localStorage.setItem('accessToken', token);
        setAccessToken(token);
        // if refresh returned a user inside the body, persist it immediately
        const possibleUser = extractUserFromResponse(data);
        if (possibleUser) {
          setUser(possibleUser);
          try { localStorage.setItem('user', JSON.stringify(possibleUser)); } catch {}
        } else {
          await fetchProfile();
        }
        return true;
      }
      if (successFlag) {
        // backend may rely on httpOnly cookie; attempt to fetch profile
        await fetchProfile();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setChecking(true);
      try {
        if (accessToken) {
          await fetchProfile();
        } else {
          await refresh();
        }
      } finally {
        if (mounted) setChecking(false);
      }
    };
    init();

    // Đặt interval tự động refresh token mỗi 50 phút (3000000 ms)
    const interval = setInterval(() => {
      refresh();
    }, 50 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const resp = await userServices.login(email, password);
      const data = resp?.data ?? resp;
      const token = data?.accessToken || data?.token || data?.data?.accessToken || null;
      if (token) {
        localStorage.setItem('accessToken', token);
        setAccessToken(token);
        // if login response already includes user data, persist immediately
        const possibleUser = extractUserFromResponse(data);
        if (possibleUser) {
          setUser(possibleUser);
          try { localStorage.setItem('user', JSON.stringify(possibleUser)); } catch {}
        } else {
          await fetchProfile();
        }
        return { ok: true };
      }
      // if login returns success but no token, still try to fetch profile
      const successFlag = data?.success ?? false;
      if (successFlag) {
        await fetchProfile();
        return { ok: true };
      }
      const err = data?.message || data?.error || 'Đăng nhập thất bại';
      return { ok: false, error: err };
    } catch (e: any) {
      return { ok: false, error: e?.response?.data?.message || e?.message || 'Đăng nhập thất bại' };
    } finally {
      setLoading(false);
    }
  };

  // helper to detect a user object inside various response shapes
  const extractUserFromResponse = (obj: any): any | null => {
    if (!obj) return null;
    if (obj.user) return obj.user;
    if (obj.data) return extractUserFromResponse(obj.data);
    // heuristic: if object has common user fields, treat it as user
    const keys = ['_id', 'id', 'email', 'fullName', 'name'];
    if (typeof obj === 'object' && keys.some(k => Object.prototype.hasOwnProperty.call(obj, k))) return obj;
    return null;
  };

  const logout = async () => {
    setLoading(true);
    try {
      await userServices.logout();
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setAccessToken(null);
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, checking, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
