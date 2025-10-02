import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { packetServices } from '@/services/packetService';
import { ActivePackageData, ActivePackageResponse } from '@/types/packet';
import LoadingIndicator from '@/components/LoadingIndicator';

const ActivePackage: React.FC = () => {
  const [activePackage, setActivePackage] = useState<ActivePackageData | null>(null);
  const [hasActivePackage, setHasActivePackage] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const loadActivePackage = async () => {
    setLoading(true);
    try {
      const response = await packetServices.getUserActivePackage();
      const data: ActivePackageResponse = response?.data || {};
      
      setHasActivePackage(data.hasActivePackage || false);
      setActivePackage(data.data || null);
    } catch (error) {
      console.error('Error loading active package:', error);
      setHasActivePackage(false);
      setActivePackage(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivePackage();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (isActive: boolean, daysRemaining: number) => {
    if (isActive && daysRemaining > 7) {
      return (
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          Đang hoạt động
        </span>
      );
    } else if (isActive && daysRemaining <= 7) {
      return (
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          Sắp hết hạn
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          Đã hết hạn
        </span>
      );
    }
  };

  const getRemainingDaysColor = (daysRemaining: number) => {
    if (daysRemaining > 7) return 'text-green-600';
    if (daysRemaining > 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return <LoadingIndicator />;
  }

    return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Gói dịch vụ đang sử dụng</h2>
          <p className="text-sm text-gray-600">Thông tin gói dịch vụ hiện tại của người dùng</p>
        </div>
        <Button
          onClick={loadActivePackage}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang tải...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Làm mới
            </>
          )}
        </Button>
      </div>      {!hasActivePackage ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có gói dịch vụ nào</h3>
              <p className="text-gray-500">Người dùng chưa đăng ký gói dịch vụ nào.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Package Overview Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{activePackage?.package.name}</CardTitle>
                  <CardDescription className="mt-1">
                    Gói dịch vụ hiện tại đang được sử dụng
                  </CardDescription>
                </div>
                <div className="text-right">
                  {activePackage && getStatusBadge(activePackage.isActive, activePackage.daysRemaining)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Package Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Giá gói</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {activePackage && formatCurrency(activePackage.package.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Thời lượng</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {activePackage?.package.duration} {activePackage?.package.unit}
                    </p>
                  </div>
                </div>

                {/* Dates Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ngày bắt đầu</p>
                    <p className="text-sm text-gray-900">
                      {activePackage && formatDate(activePackage.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ngày kết thúc</p>
                    <p className="text-sm text-gray-900">
                      {activePackage && formatDate(activePackage.endDate)}
                    </p>
                  </div>
                </div>

                {/* Remaining Days */}
                <div className="flex flex-col justify-center bg-gray-50 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <p className="text-sm font-medium text-gray-500 mb-2">Còn lại</p>
                    <p className={`text-3xl font-bold ${activePackage && getRemainingDaysColor(activePackage.daysRemaining)}`}>
                      {activePackage?.daysRemaining}
                    </p>
                    <p className="text-sm text-gray-500">ngày</p>
                  </div>
                  
                  {/* Progress Bar */}
                  {activePackage && (
                    <div className="w-full">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Đã sử dụng</span>
                        <span>Tổng thời gian</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            activePackage.daysRemaining > 7 ? 'bg-green-500' :
                            activePackage.daysRemaining > 3 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card>
            <CardHeader>
              <CardTitle>Tính năng được sử dụng</CardTitle>
              <CardDescription>
                Danh sách các tính năng có trong gói dịch vụ hiện tại
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activePackage?.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100"
                  >
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-blue-900">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ActivePackage;