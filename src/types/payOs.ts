export interface PayOsResponse {
    success: boolean;
    data: PayOsData;
}

export interface PayOsData {
    payments: string[]; // nếu mỗi payment là object thay string bằng interface tương ứng
    pagination: Pagination;
    statistics: Statistics;
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



