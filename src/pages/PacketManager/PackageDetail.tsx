import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { packetServices } from '@/services/packetService';
import { X, Calendar, XCircle } from 'lucide-react';
import { UserPackageDetailsData, UserPackageDetailsResponse } from '@/types/packet';
import { toast } from 'react-toastify';

interface PackageDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
}

const PackageDetailModal: React.FC<PackageDetailModalProps> = ({ isOpen, onClose, userId }) => {
    const [packageDetail, setPackageDetail] = useState<UserPackageDetailsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [extendLoading, setExtendLoading] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [additionalDuration, setAdditionalDuration] = useState<number>(30);
    const [unit, setUnit] = useState<'day' | 'month' | 'year'>('day');

    // Auto-fetch when modal opens with userId
    useEffect(() => {
        if (isOpen && userId) {
            handleGetPackageDetail();
        }
    }, [isOpen, userId]);

    const handleGetPackageDetail = async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);
        try {
            const response = await packetServices.getUserPackageDetails(userId);
            const responseData = response.data as UserPackageDetailsResponse;
            setPackageDetail(responseData.data);
        } catch (error: any) {
            console.error('Error getting package details:', error);

            // Check if error is "user hasn't purchased any package" - treat as normal case, not error
            const errorMessage = error?.response?.data?.message || error?.message || '';
            if (errorMessage.includes('not purchased') || errorMessage.includes('không có gói') || error?.response?.status === 404) {
                // User hasn't purchased a package - this is normal, not an error
                setPackageDetail(null);
                setError(null);
            } else {
                // Real error occurred
                setError(errorMessage || 'Có lỗi xảy ra');
                setPackageDetail(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleExtendPackage = async () => {
        if (!userId) return;

        setExtendLoading(true);
        try {
            const extendData = {
                additionalDuration,
                unit
            };
            await packetServices.extendUserPackage(userId, extendData);
            toast.success(`Gia hạn gói thành công thêm ${additionalDuration} ${unit}!`, {
                position: "top-right",
                autoClose: 3000,
            });
            // Reload package details to get updated info
            await handleGetPackageDetail();
        } catch (error: any) {
            console.error('Error extending package:', error);
            toast.error(error?.response?.data?.message || error?.message || 'Không thể gia hạn gói', {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setExtendLoading(false);
        }
    };

    const handleCancelPackage = async () => {
        if (!userId) return;

        // Confirm before canceling
        const confirmed = window.confirm(
            'Bạn có chắc chắn muốn hủy gói dịch vụ của user này? Hành động này không thể hoàn tác.'
        );

        if (!confirmed) return;

        setCancelLoading(true);
        try {
            await packetServices.cancelUserPackage(userId);
            toast.success('Hủy gói dịch vụ thành công!', {
                position: "top-right",
                autoClose: 3000,
            });
            // Reload package details to get updated info
            await handleGetPackageDetail();
        } catch (error: any) {
            console.error('Error canceling package:', error);
            toast.error(error?.response?.data?.message || error?.message || 'Không thể hủy gói', {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setCancelLoading(false);
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

    const getPackageName = (packageId: any) => {
        if (typeof packageId === 'object' && packageId?.name) {
            return packageId.name;
        }
        return 'Gói dịch vụ';
    };

    const getPackagePrice = (packageId: any) => {
        if (typeof packageId === 'object' && packageId?.price !== undefined) {
            return packageId.price.toLocaleString('vi-VN') + ' VNĐ';
        }
        return 'N/A';
    };

    const getPackageDuration = (packageId: any) => {
        if (typeof packageId === 'object' && packageId?.duration && packageId?.unit) {
            return `${packageId.duration} ${packageId.unit}`;
        }
        return 'N/A';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[85vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-3 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Chi tiết gói dịch vụ </h2>
                    <Button onClick={onClose} variant="outline" size="sm">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-4 space-y-3">

                    {error && (
                        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-lg">
                            <p className="font-semibold">Lỗi:</p>
                            <p>{error}</p>
                        </div>
                    )}

                    {loading && (
                        <div className="flex justify-center items-center py-8">
                            <div className="text-gray-500">Đang tải thông tin gói...</div>
                        </div>
                    )}

                    {!loading && packageDetail && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* User Information */}
                            <Card className="border-blue-200">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-blue-700 text-base">Thông tin User</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div>
                                        <label className="text-xs font-medium text-gray-600">Họ tên:</label>
                                        <p className="font-semibold">{packageDetail.user.fullName}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-600">Email:</label>
                                        <p>{packageDetail.user.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-600">Số điện thoại:</label>
                                        <p>{packageDetail.user.phoneNumber || 'N/A'}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Active Package Information */}
                            <Card className="border-green-200">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-green-700 text-base">Thông tin gói dịch vụ</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div>
                                        <label className="text-xs font-medium text-gray-600">Ngày bắt đầu:</label>
                                        <p className="text-xs">{formatDate(packageDetail.activePackage.startDate)}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-600">Ngày kết thúc:</label>
                                        <p className="text-xs">{formatDate(packageDetail.activePackage.endDate)}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-600">Trạng thái:</label>
                                        <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${packageDetail.activePackage.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {packageDetail.activePackage.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-600">Số ngày còn lại:</label>
                                        <p className={`font-bold ${packageDetail.daysRemaining > 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {packageDetail.daysRemaining} ngày
                                        </p>
                                    </div>


                                    {/* Extend Package Form */}
                                    <div className="pt-3 border-t space-y-2">
                                        <div>
                                            <label className="text-xs font-medium text-gray-600 block mb-1">
                                                Thời gian gia hạn:
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={additionalDuration}
                                                    onChange={(e) => setAdditionalDuration(Number(e.target.value))}
                                                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    placeholder="30"
                                                />
                                                <select
                                                    value={unit}
                                                    onChange={(e) => setUnit(e.target.value as 'day' | 'month' | 'year')}
                                                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                >
                                                    <option value="day">Ngày</option>
                                                    <option value="month">Tháng</option>
                                                    <option value="year">Năm</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <Button
                                                onClick={handleExtendPackage}
                                                disabled={extendLoading || additionalDuration <= 0}
                                                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 text-sm py-2"
                                                size="sm"
                                            >
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {extendLoading ? 'Đang gia hạn...' : 'Gia hạn'}
                                            </Button>

                                            <Button
                                                onClick={handleCancelPackage}
                                                disabled={cancelLoading}
                                                className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 text-sm py-2"
                                                size="sm"
                                            >
                                                <XCircle className="w-3 h-3 mr-1" />
                                                {cancelLoading ? 'Đang hủy...' : 'Hủy gói'}
                                            </Button>
                                        </div>

                                        <p className="text-xs text-gray-500 text-center">
                                            Gia hạn để kích hoạt lại gói dịch vụ hoặc hủy gói vĩnh viễn
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {!loading && !packageDetail && !error && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Calendar className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Chưa mua gói dịch vụ
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    User này chưa mua gói dịch vụ nào. <br />
                                    Họ cần mua gói để sử dụng các tính năng premium.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PackageDetailModal;