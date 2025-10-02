
import axios from 'axios';



export const getMedications = async (params?: Record<string, any>) => {
    // params ví dụ: { page: 1, pageSize: 20, q: 'aspirin' }
    const res = await axios.get(`/medications`, { params });
    return res.data;
};

export const getMedication = async (id: string | number) => {
    if (id === undefined || id === null) throw new Error('id is required');
    const res = await axios.get(`/medications/${encodeURIComponent(String(id))}`);
    return res.data;
};
