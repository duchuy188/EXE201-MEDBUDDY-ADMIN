import axiosInstance from "../config/axiosInstance";

export const userServices = {
  // auth
  login: (email: string, password: string) => {
    return axiosInstance.post('/auth/login', { email, password });
  },
  logout: () => {
    return axiosInstance.post('/auth/logout');
  },
  refreshToken: () => {
    return axiosInstance.post('/auth/refresh-token');
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
  updateUser: (id: string, body: any) => {
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