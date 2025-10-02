import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { packetServices } from '@/services/packetService';
import { PackageHistoryItem } from '@/types/packet';
import LoadingIndicator from '@/components/LoadingIndicator';

const PacketHistory: React.FC = () => {
  const [history, setHistory] = useState<PackageHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await packetServices.getUserPackageHistory();
      const historyData = response?.data?.data || [];
      setHistory(Array.isArray(historyData) ? historyData : []);
    } catch (error) {
      console.error('Error loading package history:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusColors = {
      PAID: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    
    const colorClass = statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {status}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Lịch sử gói dịch vụ</h2>
        <p className="text-sm text-gray-600">Lịch sử giao dịch và thanh toán gói dịch vụ</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử giao dịch</CardTitle>
          <CardDescription>
            Danh sách các giao dịch gói dịch vụ đã được thanh toán
          </CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có lịch sử giao dịch nào
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Tên gói</TableHead>
                  <TableHead>Giá gói</TableHead>
                  <TableHead>Thời lượng</TableHead>
                  <TableHead>Tính năng</TableHead>
                  <TableHead>Số tiền thanh toán</TableHead>
                  <TableHead>Ngày thanh toán</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.orderCode}>
                    <TableCell className="font-mono">
                      {item.orderCode}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.package.name}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(item.package.price)}
                    </TableCell>
                    <TableCell>
                      {item.package.duration} {item.package.unit}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="space-y-1">
                        {item.package.features.map((feature, index) => (
                          <div key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {feature}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(item.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{item.formattedPaidAt}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.paidAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PacketHistory;