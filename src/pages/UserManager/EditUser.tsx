import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userServices } from '@/services/usersService';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

const EditUser: React.FC<{ onUpdated?: () => void }> = ({ onUpdated }) => {
  const params = useParams();
  const id = params.id as string | undefined;
  const [form, setForm] = useState<any>({ fullName: '', email: '', phoneNumber: '', role: 'relative', dateOfBirth: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    const load = async () => {
      try {
        const resp = await userServices.getUser(id);
        const data = resp?.data ?? resp;
        const u = data?.data ?? data ?? {};
        if (!mounted) return;
        setForm({ fullName: u.fullName || u.name, email: u.email, phoneNumber: u.phoneNumber, role: u.role || 'relative', dateOfBirth: u.dateOfBirth || '' });
      } catch (e: any) {
        toast.error(e?.response?.data?.message || e?.message || 'Không tải được người dùng');
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  const handleUpdate = async () => {
    if (!id) return;
    setLoading(true);
    try {
      await userServices.updateUser(id, form);
      toast.success('Cập nhật thành công');
      onUpdated?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || 'Không thể cập nhật');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sửa người dùng</CardTitle>
        <CardDescription>Chỉnh sửa thông tin người dùng</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input placeholder="Họ và tên" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="border rounded px-3 py-2" />
          <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border rounded px-3 py-2" />
          <input placeholder="Số điện thoại" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} className="border rounded px-3 py-2" />
          <label className="sr-only" htmlFor="edit-role">Vai trò</label>
          <select id="edit-role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="border rounded px-3 py-2">
            <option value="relative">Người thân</option>
            <option value="patient">Người bệnh</option>
            <option value="admin">Admin</option>
          </select>
          <input placeholder="Ngày sinh" type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} className="border rounded px-3 py-2" />
        </div>

        <div className="mt-4 flex space-x-2">
          <Button onClick={handleUpdate} disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditUser;
