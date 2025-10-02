import axios from 'axios';

export const getPayments = async (params?: Record<string, any>) => {
    // params ví dụ: { page: 1, pageSize: 20, fromDate: '2025-01-01', toDate: '2025-01-31' }
    const res = await axios.get(`payos/admin/payments`, { params });
    return res.data;
};

export const getDashboardStats = async () => {
    const res = await axios.get(`payos/admin/dashboard-stats`);
    return res.data;
};

export const getPaymentByOrderCode = async (orderCode: string) => {
    if (!orderCode) throw new Error('orderCode is required');
    const res = await axios.get(`payos/admin/payment/${encodeURIComponent(orderCode)}`);
    return res.data;
};