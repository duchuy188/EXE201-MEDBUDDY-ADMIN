import React from 'react';
import { X } from 'lucide-react';
import { Payment } from '../types/payOs';

interface PaymentDetailModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({ 
  payment, 
  isOpen, 
  onClose 
}) => {
  if (!isOpen || !payment) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Chi tiết PayOS</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Đóng"
            aria-label="Đóng modal"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Payment Info */}
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Thông tin đơn hàng</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium">{payment.orderCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-bold text-green-600">
                    {payment.amount?.toLocaleString()} đ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    payment.status === 'PAID' ? 'bg-green-100 text-green-800' :
                    payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span className="font-medium">
                    {new Date(payment.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Khách hàng</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tên:</span>
                  <span className="font-medium">{payment.userId?.fullName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{payment.userId?.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số điện thoại:</span>
                  <span className="font-medium">{payment.userId?.phoneNumber || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Package & PayOS Info */}
          <div className="space-y-4">
            {/* Package Info */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Gói dịch vụ</h3>
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm">Tên gói:</span>
                  <span className="font-medium">{payment.packageId?.name || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm">Mô tả:</span>
                  <span className="font-medium text-sm leading-relaxed">
                    {payment.packageId?.description || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá gói:</span>
                  <span className="font-bold text-green-600">
                    {payment.packageId?.price?.toLocaleString()} đ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời hạn:</span>
                  <span className="font-medium">{payment.packageId?.duration} tháng</span>
                </div>
              </div>
            </div>

            {/* PayOS Info */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Thông tin PayOS</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã tham chiếu:</span>
                  <span className="font-medium text-sm break-all">
                    {payment.payosData?.reference || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-medium text-sm break-all">
                    {payment.payosData?.transactionDateTime || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gateway:</span>
                  <span className="font-medium">{payment.payosData?.counterAccountName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tài khoản:</span>
                  <span className="font-medium">{payment.payosData?.counterAccountNumber || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailModal;