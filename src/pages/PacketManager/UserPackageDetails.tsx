import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { userServices } from '@/services/usersService';
import { packetServices } from '@/services/packetService';
import { User } from '@/types/auth';
import PackageDetailModal from './PackageDetail';
import { Eye } from 'lucide-react';

// Interface for users response from /admin/users
interface UsersResponse {
  message: string;
  data: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Interface for user with package info
interface UserWithPackage extends User {
  packageStatus?: {
    hasPackage: boolean;
    packageName?: string;
    isActive?: boolean;
    daysRemaining?: number;
  };
}

const UserPackageDetails: React.FC = () => {
  const [users, setUsers] = useState<UserWithPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const limit = 10;

  const fetchAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userServices.getAllUsers({
        page: currentPage,
        limit: limit,
        search: searchTerm
      });

      console.log('API Response:', response.data); // Debug log

      const responseData = response.data as UsersResponse;

      // Extract users array from response.data.data
      const usersArray: User[] = responseData.data || [];

      // Extract pagination info
      const pagination = responseData.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: usersArray.length,
        itemsPerPage: limit
      };

      // Map users with default package status first
      const usersWithPackageInfo: UserWithPackage[] = usersArray.map(user => ({
        ...user,
        packageStatus: {
          hasPackage: false,
          packageName: 'Chưa có gói',
          isActive: false,
          daysRemaining: 0
        }
      }));

      // Then fetch package status for each user
      const updatedUsers = await Promise.all(
        usersWithPackageInfo.map(async (user) => {
          try {
            const packageResponse = await packetServices.getUserPackageDetails(user._id);
            const packageData = packageResponse.data.data;

            // Get package name from packageId (can be object or string)
            const packageName = typeof packageData.activePackage?.packageId === 'object'
              ? packageData.activePackage?.packageId?.name || 'Có gói'
              : 'Có gói';

            return {
              ...user,
              packageStatus: {
                hasPackage: true,
                packageName,
                isActive: packageData.activePackage?.isActive || false,
                daysRemaining: packageData.daysRemaining || 0
              }
            };
          } catch (error) {
            // User doesn't have package - keep default status
            return user;
          }
        })
      );

      setUsers(updatedUsers);
      setTotalUsers(pagination.totalItems);
      setTotalPages(pagination.totalPages);
    } catch (error: any) {
      console.error('Error getting users:', error);
      setError(error?.response?.data?.message || error?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, [currentPage, searchTerm]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchAllUsers();
  };

  const handleViewDetail = (userId: string) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUserId('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <>
      {/* Modal */}
      <PackageDetailModal
        isOpen={showModal}
        onClose={handleCloseModal}
        userId={selectedUserId}
      />
      <div className="max-w-full mx-auto px-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Danh sách người dùng và thông tin gói dịch vụ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex-1"></div>
              <div className="flex gap-2 items-center">
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm theo tên, email..."
                  className="w-64"
                />
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? 'Đang tải...' : 'Tìm kiếm'}
                </Button>
                <Button onClick={fetchAllUsers} disabled={loading} variant="outline">
                  Làm mới
                </Button>
              </div>
            </div>

            {error && (
              <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-lg">
                <p className="font-semibold">Lỗi:</p>
                <p>{error}</p>
              </div>
            )}

            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">Đang tải danh sách user...</div>
              </div>
            )}

            {!loading && users.length > 0 && (
              <>
                <div className="border rounded-lg overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px] min-w-[150px]">Họ tên</TableHead>
                        <TableHead className="w-[300px] min-w-[250px]">Email</TableHead>
                        <TableHead className="w-[150px] min-w-[120px]">Số điện thoại</TableHead>
                        <TableHead className="w-[120px] min-w-[100px]">Trạng thái</TableHead>
                        <TableHead className="w-[120px] min-w-[100px]">Ngày tạo</TableHead>
                        <TableHead className="w-[120px] min-w-[100px]">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium py-4 px-4">{user.fullName}</TableCell>
                          <TableCell className="py-4 px-4">{user.email}</TableCell>
                          <TableCell className="py-4 px-4">{user.phoneNumber || 'N/A'}</TableCell>
                          <TableCell className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.packageStatus?.hasPackage && user.packageStatus?.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}>
                              {user.packageStatus?.hasPackage && user.packageStatus?.isActive ? 'Hoạt động' : 'Không hoạt động'}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm py-4 px-4">
                            {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                          </TableCell>
                          <TableCell className="py-4 px-4">
                            <Button
                              onClick={() => handleViewDetail(user._id)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                   
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || loading}
                    variant="outline"
                  >
                    Trang trước
                  </Button>

                  <span className="text-sm text-gray-600">
                    Trang {currentPage} / {totalPages}
                  </span>

                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage >= totalPages || loading}
                    variant="outline"
                  >
                    Trang sau
                  </Button>
                </div>
              </>
            )}

            {!loading && users.length === 0 && !error && (
              <div className="text-center py-8 text-gray-500">
                Không tìm thấy user nào
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default UserPackageDetails;