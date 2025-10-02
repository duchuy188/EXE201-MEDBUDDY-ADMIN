import axiosInstance from '../config/axiosInstance';


export const getBloodPressureReminders = async (params?: Record<string, any>) => {
    // params ví dụ: { page: 1, pageSize: 20 }
    const res = await axiosInstance.get(`/blood-pressure-reminder`, { params });
    return res.data;
};

export const createBloodPressureReminder = async (payload: Record<string, any>) => {
    const res = await axiosInstance.post(`/blood-pressure-reminder`, payload);
    return res.data;
};

export const getBloodPressureReminder = async (id: string | number) => {
    if (id === undefined || id === null) throw new Error('id is required');
    const res = await axiosInstance.get(`/blood-pressure-reminder/${encodeURIComponent(String(id))}`);
    return res.data;
};

export const updateBloodPressureReminder = async (id: string | number, payload: Record<string, any>) => {
    if (id === undefined || id === null) throw new Error('id is required');
    const res = await axiosInstance.put(`/blood-pressure-reminder/${encodeURIComponent(String(id))}`, payload);
    return res.data;
};

export const deleteBloodPressureReminder = async (id: string | number) => {
    if (id === undefined || id === null) throw new Error('id is required');
    const res = await axiosInstance.delete(`/blood-pressure-reminder/${encodeURIComponent(String(id))}`);
    return res.data;
};