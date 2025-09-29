import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userServices } from '@/services/usersService';
import { toast } from 'sonner';

const CreateUser: React.FC<{ onCreated?: () => void }> = ({ onCreated }) => {
  const [form, setForm] = useState({ fullName: '', email: '', phoneNumber: '', password: '', role: 'relative', dateOfBirth: '' });
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await userServices.createUser(form);
      toast.success('Tạo người dùng thành công');
      onCreated?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || 'Không thể tạo người dùng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo người dùng</CardTitle>
        <CardDescription>Thêm người dùng mới vào hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input placeholder="Họ và tên" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="border rounded px-3 py-2" />
          <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border rounded px-3 py-2" />
          <input placeholder="Số điện thoại" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} className="border rounded px-3 py-2" />
          <input placeholder="Mật khẩu" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="border rounded px-3 py-2" />
          <input placeholder="Ngày sinh" type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} className="border rounded px-3 py-2" />
          <label className="sr-only" htmlFor="create-role">Vai trò</label>
          <select id="create-role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="border rounded px-3 py-2">
            <option value="relative">Người thân</option>
            <option value="patient">Người bệnh</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mt-4 flex space-x-2">
          <Button onClick={handleCreate} disabled={loading}>{loading ? 'Đang tạo...' : 'Tạo'}</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateUser;
