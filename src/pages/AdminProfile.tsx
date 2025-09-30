import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userServices } from '@/services/usersService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type Profile = {
  _id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  dateOfBirth?: string;
};

const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Profile>>({});
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const resp = await userServices.getProfile();
        const data = resp?.data ?? resp;
        if (!mounted) return;
        // Try common shapes
        const p = data?.data || data || {};
        setProfile({
          _id: p._id || p.id,
          fullName: p.fullName || p.name || p.username,
          email: p.email,
          phoneNumber: p.phoneNumber || p.phone || p.mobile,
          role: p.role || 'Admin',
          dateOfBirth: p.dateOfBirth,
        });
        setForm({
          fullName: p.fullName || p.name || p.username,
          email: p.email,
          phoneNumber: p.phoneNumber || p.phone || p.mobile,
          role: p.role || 'Admin',
          dateOfBirth: p.dateOfBirth,
        });
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Không tải được thông tin');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  const auth = useAuth();
  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch {
      try { await userServices.logout(); } catch {}
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-mint-pastel/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Profile quản trị viên</h1>
            <p className="text-muted-foreground">Quản lý thông tin tài khoản admin</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate('/admin')}>Quay lại Dashboard</Button>
            <Button variant="ghost" onClick={handleLogout}>Đăng xuất</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
            <CardDescription>Thông tin tài khoản và quyền hạn</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <div>Đang tải thông tin...</div>}
            {error && <div className="text-red-600">{error}</div>}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 flex flex-col items-center justify-center p-6">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-mint-pastel to-pink-pastel flex items-center justify-center text-white text-2xl font-bold">
                    {profile?.fullName ? profile.fullName.split(' ').slice(-1)[0].charAt(0).toUpperCase() : 'A'}
                  </div>
                  <h3 className="mt-4 font-medium text-lg">{profile?.fullName || '—'}</h3>
                  <p className="text-sm text-muted-foreground">{profile?.role || 'Admin'}</p>
                </div>

                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Họ và tên</label>
                      {!editing ? (
                        <div className="mt-1 text-lg font-medium">{profile?.fullName || '—'}</div>
                      ) : (
                        <input aria-label="Họ và tên" placeholder="Họ và tên" className="mt-1 w-full border rounded px-3 py-2" value={form.fullName || ''} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Email</label>
                      {!editing ? (
                        <div className="mt-1 text-lg">{profile?.email || '—'}</div>
                      ) : (
                        <input aria-label="Email" placeholder="example@domain.com" type="email" className="mt-1 w-full border rounded px-3 py-2" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Số điện thoại</label>
                      {!editing ? (
                        <div className="mt-1 text-lg">{profile?.phoneNumber || '—'}</div>
                      ) : (
                        <input aria-label="Số điện thoại" placeholder="0123456789" className="mt-1 w-full border rounded px-3 py-2" value={form.phoneNumber || ''} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Vai trò</label>
                      {!editing ? (
                        <div className="mt-1 text-lg">{profile?.role || 'Admin'}</div>
                      ) : (
                        <input aria-label="Vai trò" placeholder="Admin" className="mt-1 w-full border rounded px-3 py-2" value={form.role || ''} onChange={e => setForm({ ...form, role: e.target.value })} />
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Ngày sinh</label>
                      {!editing ? (
                        <div className="mt-1 text-lg">{profile?.dateOfBirth || '—'}</div>
                      ) : (
                        <input aria-label="Ngày sinh" title="Ngày sinh" type="date" className="mt-1 w-full border rounded px-3 py-2" value={form.dateOfBirth ? form.dateOfBirth.split('T')[0] : ''} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} />
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-2">
                    {!editing ? (
                      <>
                        <Button onClick={() => setEditing(true)}>Chỉnh sửa</Button>
                        <Button variant="outline" onClick={() => alert('Chức năng đổi mật khẩu sẽ được phát triển sau')}>Đổi mật khẩu</Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={async () => {
                          setLoading(true);
                          try {
                            // client-side validation
                            if (!form.fullName || form.fullName.trim().length < 3) {
                              toast.error('Họ và tên phải có ít nhất 3 ký tự');
                              setLoading(false);
                              return;
                            }
                            if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
                              toast.error('Email không hợp lệ');
                              setLoading(false);
                              return;
                            }
                            if (form.phoneNumber && !/^\+?[0-9]{7,15}$/.test(form.phoneNumber)) {
                              toast.error('Số điện thoại không hợp lệ');
                              setLoading(false);
                              return;
                            }

                            const body = {
                              fullName: form.fullName,
                              email: form.email,
                              phoneNumber: form.phoneNumber,
                              role: form.role,
                              dateOfBirth: form.dateOfBirth,
                            };
                            await userServices.updateProfile(body);
                            // reload profile
                            const resp = await userServices.getProfile();
                            const data = resp?.data ?? resp;
                            const p = data?.data || data || {};
                            setProfile({
                              _id: p._id || p.id,
                              fullName: p.fullName || p.name || p.username,
                              email: p.email,
                              phoneNumber: p.phoneNumber || p.phone || p.mobile,
                              role: p.role || 'Admin',
                              dateOfBirth: p.dateOfBirth,
                            });
                            setEditing(false);
                            toast.success('Cập nhật thông tin thành công');
                          } catch (e: any) {
                            const msg = e?.response?.data?.message || e?.message || 'Không cập nhật được';
                            setError(msg);
                            toast.error(msg);
                          } finally {
                            setLoading(false);
                          }
                        }}>Lưu</Button>
                        <Button variant="outline" onClick={() => { setEditing(false); setForm({ fullName: profile?.fullName, email: profile?.email, phoneNumber: profile?.phoneNumber, role: profile?.role, dateOfBirth: profile?.dateOfBirth }); }}>Hủy</Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfile;
