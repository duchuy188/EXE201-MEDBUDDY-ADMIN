import { User } from "@/types/auth";
import axiosInstance from "../config/axiosInstance";
import axios from 'axios';

export const userServices = {
  // auth
  login: (email: string, password: string) => {
    return axiosInstance.post('/auth/login', { email, password });
  },
  logout: () => {
    return axiosInstance.post('/auth/logout');
  },
  refreshToken: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    // use a plain axios instance to avoid interceptor recursion
    const raw = axios.create({ baseURL: import.meta.env.VITE_REACT_APP_BASE_URL, withCredentials: true });
    return raw.post('/auth/refresh-token', { refreshToken });
  },

  // profile
  getProfile: () => {
    return axiosInstance.get('/users/profile');
  },
  updateProfile: (body: any) => {
    return axiosInstance.put('/users/profile', body);
  },

  // ----- User management (admin) -----
  // list users with optional query params (page, limit, filters, q...)


  // get users with query params (pagination, search, filter)
  getAllUsers: (params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isBlocked?: boolean;
  }) => {
    return axiosInstance.get('/admin/users', { params });
  },


  // get single user
  getUser: (id: string) => {
    return axiosInstance.get(`/admin/users/${id}`);
  },

  // create
  createUser: (body: any) => {
    return axiosInstance.post('/admin/users', body);
  },

  // update
  updateUser: (id: string, body: Partial<User>) => {
    return axiosInstance.put(`/admin/users/${id}`, body);
  },

  // bloack user
  blockUser: (id: string) => {
    return axiosInstance.patch(`/admin/users/${id}/block`);
  },
  // Unblock user
  unblockUser: (id: string) => {
    return axiosInstance.patch(`/admin/users/${id}/unblock`);
  },
};