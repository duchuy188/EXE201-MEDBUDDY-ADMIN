import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import LoadingIndicator from '@/components/LoadingIndicator';
import Spinner from '@/components/Spinner';
import { getPayments } from '@/services/payOsService';
import { PayOsResponse, Payment } from '@/types/payOs';
import PaymentDetailModal from '@/components/PaymentDetailModal';
import { 
  DollarSign, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';

const PayosUser = () => {
  const [data, setData] = useState<PayOsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // Filters state
  const [filters, setFilters] = useState({
    status: '',
    paymentMethod: '',
    userId: '',
    search: '',
    startDate: '',
    endDate: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Fetch payments data
  const fetchPayments = async (page: number = 1, customFilters?: Partial<typeof filters>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare API parameters
      const apiParams: Record<string, any> = {
        page,
        limit: pageSize,
        ...filters,
        ...customFilters
      };

      // Remove empty filters
      Object.keys(apiParams).forEach(key => {
        if (apiParams[key] === '' || apiParams[key] === null || apiParams[key] === undefined) {
          delete apiParams[key];
        }
      });
      
      // Call real API
      const response = await getPayments(apiParams);
      
      if (response.success) {
        setData(response);
      } else {
        setError('Không thể tải dữ liệu thanh toán');
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(currentPage);
  }, []); // Only fetch on mount, page changes are handled by handlePageChange

  // Format currency
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(num || 0);
  };

  // Format number with thousand separators
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num || 0);
  };

  // Calculate success rate
  const getSuccessRate = () => {
    if (!data?.data.statistics) return '0';
    const { countPaid, countPending, countCancelled, countExpired } = data.data.statistics;
    const total = countPaid + countPending + countCancelled + countExpired;
    return total > 0 ? ((countPaid / total) * 100).toFixed(1) : '0';
  };

  // Statistics cards data
  const statsCards = data ? [
    {
      title: "Tổng số tiền",
      value: formatCurrency(data.data.statistics.totalAmount),
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Đã thanh toán",
      value: formatCurrency(data.data.statistics.totalPaid),
      subtitle: `${formatNumber(data.data.statistics.countPaid)} giao dịch`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Đang chờ",
      value: formatCurrency(data.data.statistics.totalPending),
      subtitle: `${formatNumber(data.data.statistics.countPending)} giao dịch`,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Đã hủy",
      value: formatCurrency(data.data.statistics.totalCancelled),
      subtitle: `${formatNumber(data.data.statistics.countCancelled)} giao dịch`,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Hết hạn",
      value: formatCurrency(data.data.statistics.totalExpired),
      subtitle: `${formatNumber(data.data.statistics.countExpired)} giao dịch`,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Tỷ lệ thành công",
      value: `${getSuccessRate()}%`,
      subtitle: "Giao dịch thành công",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ] : [];

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && data && newPage <= data.data.pagination.totalPages) {
      setCurrentPage(newPage);
      fetchPayments(newPage);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingIndicator />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-700 mb-2">Lỗi tải dữ liệu</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => fetchPayments(currentPage)} variant="outline">
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header - Extra Compact */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Thống kê thanh toán người dùng</h1>
          <p className="text-gray-600 text-xs">Quản lý các giao dịch thanh toán</p>
        </div>
      </div>

      {/* Statistics Cards - Minimal version */}
      <div className="grid grid-cols-6 gap-1 mb-2">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-sm">
            <CardContent className="p-2">
              <div className="text-center">
                <div className={`inline-flex p-1.5 rounded-full ${stat.bgColor} mb-1`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="text-xs font-medium text-gray-600 mb-0.5 leading-none">{stat.title}</p>
                <p className="text-xs font-bold text-gray-900 mb-0.5 leading-none">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-xs text-gray-500 leading-none">{stat.subtitle}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Section */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                aria-label="Chọn trạng thái thanh toán"
                title="Chọn trạng thái thanh toán"
              >
                <option value="">Tất cả</option>
                <option value="PAID">Đã thanh toán</option>
                <option value="PENDING">Đang chờ</option>
                <option value="CANCELLED">Đã hủy</option>
                <option value="EXPIRED">Hết hạn</option>
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức</label>
              <select
                value={filters.paymentMethod}
                onChange={(e) => setFilters({...filters, paymentMethod: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                aria-label="Chọn phương thức thanh toán"
                title="Chọn phương thức thanh toán"
              >
                <option value="">Tất cả</option>
                <option value="PayOS">PayOS</option>
                <option value="BANK_TRANSFER">Chuyển khoản</option>
                <option value="QR_CODE">QR Code</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                placeholder="Tìm theo mã đơn hàng..."
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                aria-label="Chọn ngày bắt đầu"
                title="Chọn ngày bắt đầu"
                placeholder="Chọn ngày bắt đầu"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                aria-label="Chọn ngày kết thúc"
                title="Chọn ngày kết thúc"
                placeholder="Chọn ngày kết thúc"
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-2">
              <Button
                onClick={() => fetchPayments(1)}
                disabled={loading}
                size="sm"
              >
                Áp dụng bộ lọc
              </Button>
              <Button
                onClick={() => {
                  setFilters({
                    status: '',
                    paymentMethod: '',
                    userId: '',
                    search: '',
                    startDate: '',
                    endDate: '',
                    sortBy: 'createdAt',
                    sortOrder: 'desc'
                  });
                  fetchPayments(1, {
                    status: '',
                    paymentMethod: '',
                    userId: '',
                    search: '',
                    startDate: '',
                    endDate: '',
                    sortBy: 'createdAt',
                    sortOrder: 'desc'
                  });
                }}
                variant="outline"
                size="sm"
              >
                Xóa bộ lọc
              </Button>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sắp xếp:</label>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setFilters({...filters, sortBy, sortOrder});
                }}
                className="p-1 border border-gray-300 rounded text-sm"
                aria-label="Chọn cách sắp xếp"
                title="Chọn cách sắp xếp"
              >
                <option value="createdAt-desc">Mới nhất</option>
                <option value="createdAt-asc">Cũ nhất</option>
                <option value="amount-desc">Số tiền giảm dần</option>
                <option value="amount-asc">Số tiền tăng dần</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table - Compact */}
      <Card className="flex-1">
        <CardHeader className="pb-2 px-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-base font-semibold">Danh sách giao dịch</CardTitle>
              <CardDescription className="text-xs">
                {data && `Hiển thị ${data.data.pagination.itemsPerPage} trên tổng số ${formatNumber(data.data.pagination.totalItems)} giao dịch`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {data?.data.payments && data.data.payments.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-b border-gray-200 bg-gray-50">
                    <TableHead className="text-left py-2 px-3 font-semibold text-gray-700 text-xs">STT</TableHead>
                    <TableHead className="text-left py-2 px-3 font-semibold text-gray-700 text-xs">MÃ ĐƠN HÀNG</TableHead>
                    <TableHead className="text-left py-2 px-3 font-semibold text-gray-700 text-xs">KHÁCH HÀNG</TableHead>
                    <TableHead className="text-left py-2 px-3 font-semibold text-gray-700 text-xs">GÓI DỊCH VỤ</TableHead>
                    <TableHead className="text-left py-2 px-3 font-semibold text-gray-700 text-xs">SỐ TIỀN</TableHead>
                    <TableHead className="text-left py-2 px-3 font-semibold text-gray-700 text-xs">TRẠNG THÁI</TableHead>
                    <TableHead className="text-left py-2 px-3 font-semibold text-gray-700 text-xs">THỜI GIAN</TableHead>
                    <TableHead className="text-left py-2 px-3 font-semibold text-gray-700 text-xs">THAO TÁC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.payments.map((payment, index) => {
                    const getStatusColor = (status: string) => {
                      const statusColors = {
                        'PAID': 'bg-green-100 text-green-800',
                        'PENDING': 'bg-yellow-100 text-yellow-800',
                        'CANCELLED': 'bg-red-100 text-red-800',
                        'EXPIRED': 'bg-gray-100 text-gray-800'
                      };
                      return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
                    };

                    const getStatusText = (status: string) => {
                      const statusText = {
                        'PAID': 'Đã thanh toán',
                        'PENDING': 'Đang chờ',
                        'CANCELLED': 'Đã hủy',
                        'EXPIRED': 'Hết hạn'
                      };
                      return statusText[status as keyof typeof statusText] || status;
                    };

                    return (
                      <TableRow key={payment._id || index} className="hover:bg-gray-50 border-b border-gray-100">
                        <TableCell className="py-2 px-3 text-center">
                          <span className="font-medium text-gray-900 text-xs">
                            {(currentPage - 1) * pageSize + index + 1}
                          </span>
                        </TableCell>
                        <TableCell className="py-2 px-3 font-mono text-xs font-medium text-blue-600">
                          {typeof payment === 'string' ? payment : payment.orderCode}
                        </TableCell>
                        <TableCell className="py-2 px-3">
                          {typeof payment === 'object' && payment.userId ? (
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900 text-xs">{payment.userId.fullName}</span>
                              <span className="text-xs text-gray-500">{payment.userId.email}</span>
                              <span className="text-xs text-gray-400">{payment.userId.phoneNumber}</span>
                            </div>
                          ) : '--'}
                        </TableCell>
                        <TableCell className="py-2 px-3">
                          {typeof payment === 'object' && payment.packageId ? (
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900 text-xs">{payment.packageId.name}</span>
                              <span className="text-xs text-gray-500 max-w-xs truncate">{payment.packageId.description}</span>
                              <span className="text-xs text-blue-600">
                                {payment.packageId.duration} {payment.packageId.unit === 'month' ? 'tháng' : 'ngày'}
                              </span>
                            </div>
                          ) : '--'}
                        </TableCell>
                        <TableCell className="py-2 px-3 font-semibold text-green-600 text-xs">
                          {typeof payment === 'object' && payment.amount ? formatCurrency(payment.amount) : '--'}
                        </TableCell>
                        <TableCell className="py-2 px-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            typeof payment === 'object' && payment.status ? getStatusColor(payment.status) : 'bg-gray-100 text-gray-800'
                          }`}>
                            {typeof payment === 'object' && payment.status ? getStatusText(payment.status) : 'Chưa xác định'}
                          </span>
                        </TableCell>
                        <TableCell className="py-2 px-3 text-xs text-gray-600">
                          {typeof payment === 'object' && payment.createdAt ? (
                            <div className="flex flex-col">
                              <span className="font-medium text-xs">
                                Tạo: {new Date(payment.createdAt).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              {payment.paidAt && (
                                <span className="text-green-600 text-xs">
                                  TT: {new Date(payment.paidAt).toLocaleDateString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              )}
                            </div>
                          ) : '--'}
                        </TableCell>
                        <TableCell className="py-2 px-3">
                          {typeof payment === 'object' && payment.payosData ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPayment(payment);
                                setShowModal(true);
                              }}
                              className="text-xs"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Chi tiết
                            </Button>
                          ) : (
                            <span className="text-gray-400 text-xs">--</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Compact Pagination */}
              {data.data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-0 px-3 py-2 bg-gray-50 border-t">
                  <div className="text-xs text-gray-700 font-medium">
                    Trang {data.data.pagination.currentPage} / {data.data.pagination.totalPages}
                    <span className="ml-2 text-xs text-gray-500">
                      ({formatNumber(data.data.pagination.totalItems)} giao dịch)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1 || loading}
                      className="px-2 py-1 text-xs"
                    >
                      <ChevronLeft className="h-3 w-3 mr-1" />
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= data.data.pagination.totalPages || loading}
                      className="px-2 py-1 text-xs"
                    >
                      Sau
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có dữ liệu</h3>
              <p className="text-gray-600">Không có giao dịch nào để hiển thị</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PayOS Details Modal */}
      <PaymentDetailModal
        payment={selectedPayment}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedPayment(null);
        }}
      />
    </div>
  );
};

export default PayosUser;
