import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { packetServices } from '@/services/packetService';
import { toast } from 'sonner';

const DeletePacket: React.FC<{ packetId: string; onDeleted?: () => void }> = ({ packetId, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const remove = async () => {
    if (!packetId) return;
    setLoading(true);
    try {
      await packetServices.deletePackage(packetId);
      toast.success('Xóa gói thành công');
      onDeleted?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || 'Không thể xóa');
    } finally {
      setLoading(false);
    }
  };

  return <Button variant="ghost" className="text-red-600" onClick={remove} disabled={loading}>{loading ? 'Đang...' : 'Xóa'}</Button>;
};

export default DeletePacket;
