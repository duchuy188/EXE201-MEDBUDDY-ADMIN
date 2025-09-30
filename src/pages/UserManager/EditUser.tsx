import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userServices } from '@/services/usersService';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

const EditUser: React.FC<{ onUpdated?: () => void }> = ({ onUpdated }) => {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id as string | undefined;
  const [form, setForm] = useState<any>({ fullName: '', email: '', phoneNumber: '', role: 'relative', dateOfBirth: '' });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    const load = async () => {
      try {
        const resp = await userServices.getUser(id);
        const data = resp?.data ?? resp;
        // Support { data: {...} }, { user: {...} }, or direct object
        const u = data?.data ?? data?.user ?? data ?? {};
        if (!mounted) return;
        // Format dateOfBirth to yyyy-MM-dd for input type=date
        let dob = u.dateOfBirth || '';
        if (dob) {
          const d = new Date(dob);
          if (!isNaN(d.getTime())) {
            dob = d.toISOString().slice(0, 10);
          }
        }
        setForm({
          fullName: u.fullName || u.name || '',
          email: u.email || '',
          phoneNumber: u.phoneNumber || '',
          role: u.role || 'relative',
          dateOfBirth: dob,
          isBlocked: typeof u.isBlocked === 'boolean' ? u.isBlocked : false
        });
        setInitialLoad(false);
      } catch (e: any) {
        toast.error(e?.response?.data?.message || e?.message || 'Không tải được người dùng', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true
        });
        setInitialLoad(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  const handleUpdate = async () => {
    if (!id) return;

    // Basic validation
    if (!form.fullName.trim()) {
      toast.error('Vui lòng nhập họ và tên', {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    if (!form.email.trim()) {
      toast.error('Vui lòng nhập email', {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    setLoading(true);
    try {
      // Remove any undefined/null values and format the data
      const updateData = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber?.trim() || '',
        role: form.role,
        dateOfBirth: form.dateOfBirth || null
      };

      await userServices.updateUser(id, updateData);

      toast.success('Cập nhật thành công', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true
      });

      // Call onUpdated callback if provided
      onUpdated?.();

      // Navigate back to users list after successful update
      setTimeout(() => {
        navigate('/admin/users');
      }, 1000);

    } catch (e: any) {
      console.error('Update error:', e);
      const errorMessage = e?.response?.data?.message || e?.message || 'Không thể cập nhật';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Đang tải thông tin người dùng...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sửa người dùng</CardTitle>
        <CardDescription>Chỉnh sửa thông tin người dùng</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Họ và tên *</label>
            <input
              placeholder="Nhập họ và tên"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              placeholder="Nhập email"
              value={form.email}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              type="tel"
              placeholder="Nhập số điện thoại"
              value={form.phoneNumber}
              onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="edit-role">Vai trò</label>
            <select
              id="edit-role"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              <option value="relative">Người thân</option>
              <option value="patient">Người bệnh</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Ngày sinh</label>
            <input
              placeholder="Chọn ngày sinh"
              type="date"
              value={form.dateOfBirth}
              onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          <Button onClick={handleUpdate} disabled={loading || !form.fullName.trim() || !form.email.trim()}>
            {loading ? 'Đang lưu...' : 'Lưu'}
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/users')} disabled={loading}>
            Hủy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditUser;
