import axios from 'axios';


export const getBloodPressureReminders = async (params?: Record<string, any>) => {
    // params ví dụ: { page: 1, pageSize: 20 }
    const res = await axios.get(`/blood-pressure-reminder`, { params });
    return res.data;
};

export const createBloodPressureReminder = async (payload: Record<string, any>) => {
    const res = await axios.post(`/blood-pressure-reminder`, payload);
    return res.data;
};

export const getBloodPressureReminder = async (id: string | number) => {
    if (id === undefined || id === null) throw new Error('id is required');
    const res = await axios.get(`/blood-pressure-reminder/${encodeURIComponent(String(id))}`);
    return res.data;
};

export const updateBloodPressureReminder = async (id: string | number, payload: Record<string, any>) => {
    if (id === undefined || id === null) throw new Error('id is required');
    const res = await axios.put(`/blood-pressure-reminder/${encodeURIComponent(String(id))}`, payload);
    return res.data;
};

export const deleteBloodPressureReminder = async (id: string | number) => {
    if (id === undefined || id === null) throw new Error('id is required');
    const res = await axios.delete(`/blood-pressure-reminder/${encodeURIComponent(String(id))}`);
    return res.data;
};