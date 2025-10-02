export interface PayOsResponse {
    success: boolean;
    data: PayOsData;
}

export interface PayOsData {
    payments: Payment[]; // Thay đổi từ string[] thành Payment[]
    pagination: Pagination;
    statistics: Statistics;
}

export interface Payment {
    _id: string;
    orderCode: number;
    userId: {
        _id: string;
        fullName: string;
        email: string;
        phoneNumber: string;
        role: string;
        avatar: string;
    };
    packageId: {
        _id: string;
        name: string;
        description: string;
        price: number;
        duration: number;
        unit: string;
        features: string[];
    };
    amount: number;
    description: string;
    status: 'PAID' | 'PENDING' | 'CANCELLED' | 'EXPIRED';
    paymentMethod: string;
    paymentUrl: string;
    createdAt: string;
    updatedAt: string;
    paidAt?: string;
    payosData?: {
        accountNumber: string;
        amount: number;
        description: string;
        reference: string;
        transactionDateTime: string;
        virtualAccountNumber: string;
        counterAccountBankId: string;
        counterAccountBankName: string;
        counterAccountName: string;
        counterAccountNumber: string;
        virtualAccountName: string;
        currency: string;
        orderCode: number;
        paymentLinkId: string;
        code: string;
        desc: string;
    };
    __v: number;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export interface Statistics {
    totalAmount: number;
    totalPaid: number;
    totalPending: number;
    totalCancelled: number;
    totalExpired: number;
    countPaid: number;
    countPending: number;
    countCancelled: number;
    countExpired: number;
}

export interface DashboardStatsResponse {
    success: boolean;
    data: DashboardStatsData;
}

export interface DashboardStatsData {
    overview: Overview;
    dailyStats: DailyStat[];
    packageStats: PackageStat[];
}

export interface Overview {
    totalRevenue: number;
    totalTransactions: number;
    successfulTransactions: number;
    pendingTransactions: number;
    cancelledTransactions: number;
    expiredTransactions: number;
    averageTransactionValue: number;
    successRate: number;
}

export interface DailyStat {
    _id: string;
    totalCount: number;
    totalAmount: number;
}

export interface PackageStat {
    packageName: string;
    count: number;
    totalRevenue: number;
}



