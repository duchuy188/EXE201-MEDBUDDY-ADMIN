import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { userServices } from '@/services/usersService';
import { toast } from 'sonner';
import { TbLock, TbLockOpen2 } from 'react-icons/tb';

const BlockUser: React.FC<{ userId: string; onDone?: () => void }> = ({ userId, onDone }) => {
  const [loading, setLoading] = useState(false);

  const handleBlock = async () => {
    setLoading(true);
    try {
      await userServices.blockUser(userId);
      toast.success('Người dùng đã bị khóa');
      onDone?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || 'Không thể khóa người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async () => {
    setLoading(true);
    try {
      await userServices.unblockUser(userId);
      toast.success('Mở khóa người dùng thành công');
      onDone?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || 'Không thể mở khóa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-2">
      <div className="bg-yellow-100 rounded-full p-1 mb-1 flex gap-1">
        <TbLock className="text-yellow-500 w-6 h-6" />
        <TbLockOpen2 className="text-yellow-500 w-6 h-6" />
      </div>
      <div className="font-semibold text-base text-center">Bạn có chắc muốn khóa hoặc mở khóa?</div>
      <div className="text-xs text-muted-foreground text-center mt-1 mb-2">Thao tác này sẽ ảnh hưởng đến quyền truy cập của người dùng.</div>
      <div className="flex w-full gap-2 justify-center mt-1">
        <Button className="flex-1 text-red-600 border border-red-200 hover:bg-red-50" style={{ fontWeight: '500' }} variant="outline" onClick={handleBlock} disabled={loading}>Khóa</Button>
        <Button className="flex-1" variant="outline" onClick={handleUnblock} disabled={loading}>Mở khóa</Button>
      </div>
    </div>
  );
};

export default BlockUser;
