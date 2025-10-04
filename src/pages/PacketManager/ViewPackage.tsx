import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from '@/types/packet';
import { X, Eye, Calendar, DollarSign, Clock, List } from 'lucide-react';

interface ViewPackageProps {
    packet: Package;
}

const ViewPackage: React.FC<ViewPackageProps> = ({ packet }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getUnitText = (unit: string) => {
        switch (unit) {
            case 'day': return 'ngày';
            case 'week': return 'tuần';
            case 'month': return 'tháng';
            case 'year': return 'năm';
            default: return unit;
        }
    };

    return (
        <>
            <Button
                onClick={openModal}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 p-2 h-8 w-8"
                title="Xem chi tiết gói"
            >
                <Eye className="h-3 w-3" />

            </Button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-3xl w-full">
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="flex items-center gap-2 text-blue-700">
                                        <List className="w-5 h-5" />
                                        Chi tiết gói dịch vụ
                                    </CardTitle>
                                    <Button variant="ghost" size="sm" onClick={closeModal}>
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="p-4 space-y-4">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600 block mb-1">TÊN GÓI</label>
                                            <p className="text-xl font-bold text-gray-900">{packet.name}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-green-600" />
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">GIÁ</label>
                                                <p className="text-lg font-bold text-green-600">
                                                    {packet.price === 0 ? 'Miễn phí' : formatPrice(packet.price)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">THỜI LƯỢNG</label>
                                                <p className="text-lg font-bold text-blue-600">
                                                    {packet.duration} {getUnitText(packet.unit)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600 block mb-1">ID GÓI</label>
                                            <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                                                {packet._id.slice(-12)}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-purple-600" />
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">NGÀY TẠO</label>
                                                <p className="text-sm text-purple-600">
                                                    {formatDate(packet.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        {packet.updatedAt && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-orange-600" />
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600">CẬP NHẬT LẦN CUỐI</label>
                                                    <p className="text-sm text-orange-600">
                                                        {formatDate(packet.updatedAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600 block mb-2">MÔ TẢ</label>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-gray-700 text-sm">
                                            {packet.description || 'Không có mô tả'}
                                        </p>
                                    </div>
                                </div>

                                {/* Features */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600 block mb-2">
                                        TÍNH NĂNG ({packet.features?.length || 0})
                                    </label>
                                    {packet.features && packet.features.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                            {packet.features.map((feature, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 bg-blue-50 text-blue-800 px-2 py-1 rounded text-sm"
                                                >
                                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic text-sm">Chưa có tính năng nào</p>
                                    )}
                                </div>

                                {/* Summary Stats */}
                                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded">
                                    <h4 className="font-medium text-gray-700 mb-2 text-center">Tóm tắt</h4>
                                    <div className="grid grid-cols-4 gap-3 text-center">
                                        <div>
                                            <p className="text-xl font-bold text-blue-600">{packet.features?.length || 0}</p>
                                            <p className="text-xs text-gray-600">Tính năng</p>
                                        </div>
                                        <div>
                                            <p className="text-xl font-bold text-green-600">{packet.duration}</p>
                                            <p className="text-xs text-gray-600">{getUnitText(packet.unit)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xl font-bold text-purple-600">
                                                {packet.price === 0 ? '0' : (packet.price / 1000).toFixed(0) + 'K'}
                                            </p>
                                            <p className="text-xs text-gray-600">VNĐ</p>
                                        </div>
                                        <div>
                                            <p className="text-xl font-bold text-orange-600">
                                                {packet._id.slice(-4).toUpperCase()}
                                            </p>
                                            <p className="text-xs text-gray-600">ID</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end pt-3 border-t">
                                    <Button onClick={closeModal} variant="outline" size="sm">
                                        Đóng
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </>
    );
};

export default ViewPackage;