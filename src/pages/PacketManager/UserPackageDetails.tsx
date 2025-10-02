import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { packetServices } from '@/services/packetService';
import { UserPackageDetailsData } from '@/types/packet';

const UserPackageDetails: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [userDetails, setUserDetails] = useState<UserPackageDetailsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetUserDetails = async () => {
    if (!userId.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await packetServices.getUserPackageDetails(userId);
      console.log('User package details response:', response);
      setUserDetails(response.data.data);
    } catch (error: any) {
      console.error('Error getting user package details:', error);
      setError(error?.response?.data?.message || error?.message || 'Có lỗi xảy ra');
      setUserDetails(null);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lấy thông tin gói của User (Admin)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Nhập User ID..."
              className="flex-1"
            />
            <Button 
              onClick={handleGetUserDetails} 
              disabled={loading || !userId.trim()}
            >
              {loading ? 'Đang tải...' : 'Lấy thông tin'}
            </Button>
          </div>

          {error && (
            <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-lg">
              <p className="font-semibold">Lỗi:</p>
              <p>{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {userDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">ID:</label>
                <p className="font-mono">{userDetails.user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Họ tên:</label>
                <p>{userDetails.user.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email:</label>
                <p>{userDetails.user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Số điện thoại:</label>
                <p>{userDetails.user.phoneNumber}</p>
              </div>
            </CardContent>
          </Card>

          {/* Package Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin gói dịch vụ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Trạng thái:</label>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  userDetails.activePackage.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {userDetails.activePackage.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                </span>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Ngày bắt đầu:</label>
                <p>{formatDate(userDetails.activePackage.startDate)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Ngày kết thúc:</label>
                <p>{formatDate(userDetails.activePackage.endDate)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Số ngày còn lại:</label>
                <p className={userDetails.daysRemaining > 0 ? 'text-green-600' : 'text-red-600'}>
                  {userDetails.daysRemaining} ngày
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Features:</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {userDetails.activePackage.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserPackageDetails;