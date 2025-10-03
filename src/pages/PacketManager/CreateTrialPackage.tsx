import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { packetServices } from '@/services/packetService';
import { toast } from 'sonner';
import { CreatePackageDTO } from '@/types/packet';
import { TbPackages } from 'react-icons/tb';

interface CreateTrialPackageProps {
    onCreated?: () => void;
    packagesCount: number;
}

const CreateTrialPackage: React.FC<CreateTrialPackageProps> = ({ onCreated, packagesCount }) => {
    const [loading, setLoading] = useState(false);

    // Chỉ hiển thị khi không có gói nào
    if (packagesCount > 0) {
        return null;
    }

    // Định nghĩa 3 gói cơ bản
    const defaultPackages: CreatePackageDTO[] = [
        {
            name: 'GÓI DÙNG THỬ',
            description: 'Gói dùng thử miễn phí cho người dùng mới',
            price: 0,
            duration: 7,
            unit: 'day',
            features: ['Theo dõi cơ bản', 'Nhắc nhở uống thuốc', 'Báo cáo sức khỏe đơn giản']
        },
        {
            name: 'GÓI CƠ BẢN',
            description: 'Gói cơ bản với các tính năng thiết yếu',
            price: 99000,
            duration: 1,
            unit: 'month',
            features: ['Theo dõi sức khỏe toàn diện', 'Nhắc nhở uống thuốc thông minh', 'Báo cáo chi tiết', 'Tư vấn cơ bản']
        },
        {
            name: 'GÓI NÂNG CAO',
            description: 'Gói cao cấp với đầy đủ tính năng premium',
            price: 199000,
            duration: 1,
            unit: 'month',
            features: ['Tất cả tính năng gói cơ bản', 'Theo dõi sức khỏe AI', 'Tư vấn chuyên gia 24/7', 'Báo cáo y khoa chuyên sâu', 'Ưu tiên hỗ trợ']
        }
    ];

    const handleCreateAllPackages = async () => {
        setLoading(true);
        try {
            // Tạo tuần tự từng gói để tránh conflict
            for (let i = 0; i < defaultPackages.length; i++) {
                const pkg = defaultPackages[i];
                await packetServices.createPackage(pkg);
                toast.success(`Đã tạo thành công: ${pkg.name}`);
            }

            toast.success('🎉 Tạo đủ 3 gói dịch vụ cơ bản thành công!');
            onCreated?.(); // Reload danh sách gói
        } catch (error: any) {
            console.error('Error creating packages:', error);
            toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo gói dịch vụ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleCreateAllPackages}
            disabled={loading}
            variant="outline"
            className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
        >
            <TbPackages className="w-4 h-4 mr-2" />
            {loading ? 'Đang tạo 3 gói...' : 'Tạo 3 gói cơ bản'}
        </Button>
    );
};

export default CreateTrialPackage;