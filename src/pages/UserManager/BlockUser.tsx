import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userServices } from '@/services/usersService';
import { toast } from 'sonner';

const BlockUser: React.FC<{ userId: string; onDone?: () => void }> = ({ userId, onDone }) => {
  const [loading, setLoading] = useState(false);

  const handleBlock = async () => {
    setLoading(true);
    try {
      await userServices.changeUserStatus(userId, { status: 'blocked' });
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
      await userServices.changeUserStatus(userId, { status: 'active' });
      toast.success('Mở khóa người dùng thành công');
      onDone?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || 'Không thể mở khóa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý khóa người dùng</CardTitle>
        <CardDescription>Khóa hoặc mở khóa tài khoản người dùng</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Button variant="outline" className="text-red-600" onClick={handleBlock} disabled={loading}>Khóa</Button>
          <Button variant="outline" onClick={handleUnblock} disabled={loading}>Mở khóa</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockUser;
