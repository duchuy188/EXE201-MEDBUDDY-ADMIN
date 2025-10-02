import { Package, CheckFeatureResponse, UserPackageDetailsResponse } from '@/types/packet';
import axiosInstance from '../config/axiosInstance';

export const packetServices = {
  // create 3 default packages (testing/basic/advanced)
  // createDefaultPackages: () => {
  //   return axiosInstance.post('/package/create');
  // },

  // create a new package (admin only)
  createPackage: (body: any) => {
    return axiosInstance.post('/package', body);
  },

  // get all packages (optional query params)
  getPackages: (params?: Record<string, any>) => {
    return axiosInstance.get('/package', { params });
  },

  // update package by id (admin only)
  updatePackage: (id: string, body: any) => {
    return axiosInstance.put(`/package/${id}`, body);
  },

  // delete package by id (admin only)
  deletePackage: (id: string) => {
    return axiosInstance.delete(`/package/${id}`);
  },

  // Cancel user's package (admin only)
  cancelUserPackage: (userId: string) => {
    return axiosInstance.put(`/user-package/admin/cancel/${userId}`);
  },

  // Extend user's package (admin only)
  extendUserPackage: (userId: string) => {
    return axiosInstance.put(`/user-package/admin/extend/${userId}`);
  },

  // Get package statistics (admin only)
  getPackageStats: () => {
    return axiosInstance.get('/user-package/admin/stats');
  },

  // Get user details and package (admin only)
  getUserPackageDetails: (userId: string) => {
    return axiosInstance.get<UserPackageDetailsResponse>(`/user-package/admin/user/${userId}`);
  },

};

export default packetServices;
