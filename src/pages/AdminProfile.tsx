import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userServices } from '@/services/usersService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit2,
  Save,
  X,
  ArrowLeft,
  LogOut,
  Key,
  Camera,
  Settings
} from 'lucide-react';

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
      try { await userServices.logout(); } catch { }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
                <p className="text-sm text-gray-500">Quản lý thông tin tài khoản admin</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header Card */}
          <Card className="mb-8 overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
              {/* Avatar */}
              <div className="absolute bottom-0 left-8 transform translate-y-1/2">
                <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-inner">
                    {profile?.fullName ? profile.fullName.split(' ').slice(-1)[0].charAt(0).toUpperCase() : 'A'}
                  </div>
                </div>
                <Button
                  size="sm"
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full p-0 bg-gray-100 text-gray-600 hover:text-gray-900 shadow-lg border"
                  variant="ghost"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <CardContent className="pt-20 pb-8">
              <div className="flex justify-end space-x-3">
                {!editing ? (
                  <>
                    <Button
                      onClick={() => setEditing(true)}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Chỉnh sửa</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => alert('Chức năng đổi mật khẩu sẽ được phát triển sau')}
                      className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6"
                    >
                      <Key className="w-4 h-4" />
                      <span>Đổi mật khẩu</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={async () => {
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
                      }}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-6"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditing(false);
                        setForm({
                          fullName: profile?.fullName,
                          email: profile?.email,
                          phoneNumber: profile?.phoneNumber,
                          role: profile?.role,
                          dateOfBirth: profile?.dateOfBirth
                        });
                      }}
                      className="flex items-center space-x-2 px-6"
                    >
                      <X className="w-4 h-4" />
                      <span>Hủy</span>
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                </CardHeader>
                <CardContent>
                  {loading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600">Đang tải thông tin...</span>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                          <span className="text-white text-xs">!</span>
                        </div>
                        <span className="text-red-700">{error}</span>
                      </div>
                    </div>
                  )}

                  {!loading && !error && (
                    <div className="space-y-6">
                      {/* Name Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Họ và tên</span>
                        </label>
                        {!editing ? (
                          <div className="p-3 bg-gray-50 rounded-lg border">
                            <span className="text-gray-900 font-medium">
                              {profile?.fullName || 'Chưa có thông tin'}
                            </span>
                          </div>
                        ) : (
                          <input
                            aria-label="Họ và tên"
                            placeholder="Nhập họ và tên"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            value={form.fullName || ''}
                            onChange={e => setForm({ ...form, fullName: e.target.value })}
                          />
                        )}
                      </div>

                      {/* Email Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>Email</span>
                        </label>
                        {!editing ? (
                          <div className="p-3 bg-gray-50 rounded-lg border">
                            <span className="text-gray-900">
                              {profile?.email || 'Chưa có email'}
                            </span>
                          </div>
                        ) : (
                          <input
                            aria-label="Email"
                            placeholder="example@domain.com"
                            type="email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                            value={form.email || ''}
                            readOnly
                          />
                        )}
                      </div>

                      {/* Phone Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>Số điện thoại</span>
                        </label>
                        {!editing ? (
                          <div className="p-3 bg-gray-50 rounded-lg border">
                            <span className="text-gray-900">
                              {profile?.phoneNumber || 'Chưa có số điện thoại'}
                            </span>
                          </div>
                        ) : (
                          <input
                            aria-label="Số điện thoại"
                            placeholder="0123456789"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            value={form.phoneNumber || ''}
                            onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                          />
                        )}
                      </div>

                      {/* Role Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                          <Shield className="w-4 h-4" />
                          <span>Vai trò</span>
                        </label>
                        {!editing ? (
                          <div className="p-3 bg-gray-50 rounded-lg border">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {profile?.role || 'Admin'}
                            </span>
                          </div>
                        ) : (
                          <input
                            aria-label="Vai trò"
                            placeholder="Admin"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            value={form.role || ''}
                            onChange={e => setForm({ ...form, role: e.target.value })}
                          />
                        )}
                      </div>

                      {/* Date of Birth Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Ngày sinh</span>
                        </label>
                        {!editing ? (
                          <div className="p-3 bg-gray-50 rounded-lg border">
                            <span className="text-gray-900">
                              {profile?.dateOfBirth ?
                                new Date(profile.dateOfBirth).toLocaleDateString('vi-VN') :
                                'Chưa có thông tin'
                              }
                            </span>
                          </div>
                        ) : (
                          <input
                            aria-label="Ngày sinh"
                            type="date"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            value={form.dateOfBirth ? form.dateOfBirth.split('T')[0] : ''}
                            onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Account Settings Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-purple-600" />
                    <span>Cài đặt tài khoản</span>
                  </CardTitle>
                  <CardDescription>Quản lý bảo mật và quyền hạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Trạng thái tài khoản</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-blue-700">Đang hoạt động</span>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2">Quyền hạn</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Quản lý người dùng</li>
                      <li>• Quản lý gói dịch vụ</li>
                      <li>• Xem báo cáo thống kê</li>
                      <li>• Quản lý thanh toán</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
