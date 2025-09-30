import Package from '@/types/packet';
import axiosInstance from '../config/axiosInstance';

export const packetServices = {
  // create 3 default packages (testing/basic/advanced)
  createDefaultPackages: () => {
    return axiosInstance.post('/package/create');
  },

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
  }
};

export default packetServices;
