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
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-fadeIn relative">
      <button type="button" aria-label="Đóng" onClick={onCreated} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold">×</button>
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Tạo người dùng</h2>
      <form
        className="flex flex-col gap-3"
        onSubmit={e => { e.preventDefault(); handleCreate(); }}
        autoComplete="off"
      >
        <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="border border-gray-200 bg-gray-100 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition w-full" placeholder="Họ và tên" required />
        <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border border-gray-200 bg-gray-100 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition w-full" placeholder="Email" type="email" required />
        <input value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} className="border border-gray-200 bg-gray-100 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition w-full" placeholder="Số điện thoại" />
        <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="border border-gray-200 bg-gray-100 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition w-full" placeholder="Mật khẩu" type="password" required />
        <input value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} className="border border-gray-200 bg-gray-100 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition w-full" placeholder="Ngày sinh" type="date" />
        <label htmlFor="role" className="sr-only">Vai trò</label>
        <select id="role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="border border-gray-200 bg-gray-100 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition w-full">
          <option value="relative">Người thân</option>
          <option value="patient">Người bệnh</option>
          <option value="admin">Admin</option>
        </select>
        <Button type="submit" className="w-full mt-2 py-2 text-base font-semibold bg-indigo-700 text-white rounded shadow hover:bg-indigo-800 transition" disabled={loading}>
          {loading ? 'Đang tạo...' : 'Tạo'}
        </Button>
      </form>
    </div>
  );
};

export default CreateUser;
