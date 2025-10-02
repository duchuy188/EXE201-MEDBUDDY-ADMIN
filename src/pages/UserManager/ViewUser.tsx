/* eslint-disable bem/class-names */
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userServices } from '@/services/usersService';
import { toast } from 'react-toastify';

interface ViewUserProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  onUpdated?: () => void;
}

const ViewUser: React.FC<ViewUserProps> = ({ isOpen, onClose, userId, onUpdated }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<any>({ fullName: '', email: '', phoneNumber: '', role: 'relative', dateOfBirth: '' });
  const [blockedByUser, setBlockedByUser] = useState<any>(null);

  // Function to translate role to Vietnamese
  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'relative': 'Người thân',
      'patient': 'Người bệnh', 
      'admin': 'Quản trị viên'
    };
    return roleMap[role] || role;
  };

  // Function to load blocked by user info if it's just an ID
  const loadBlockedByUser = async (blockedById: string) => {
    try {
      const resp = await userServices.getUser(blockedById);
      const data = resp?.data ?? resp;
      const blockedByUserData = data?.data ?? data?.user ?? data ?? null;
      setBlockedByUser(blockedByUserData);
    } catch (e) {
      console.error('Error loading blocked by user:', e);
      setBlockedByUser(null);
    }
  };

  useEffect(() => {
    if (!isOpen || !userId) {
      setUser(null);
      setError(null);
      return;
    }
    
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const resp = await userServices.getUser(userId);
        const data = resp?.data ?? resp;
        // Handle possible response shapes: { data: {...} }, { user: {...} }, or the user object directly
        const u = data?.data ?? data?.user ?? data ?? null;
        if (!mounted) return;
        setUser(u);
        
        // Initialize form data for editing
        if (u) {
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

          // Load blocked by user info if it's just an ID string
          if (u.blockedBy && typeof u.blockedBy === 'string' && u.blockedBy.length > 0) {
            loadBlockedByUser(u.blockedBy);
          } else {
            setBlockedByUser(null);
          }
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Không tải được người dùng');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [isOpen, userId]);

  const handleUpdate = async () => {
    if (!userId) return;

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
      const updateData = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber?.trim() || '',
        role: form.role,
        dateOfBirth: form.dateOfBirth || null
      };

      await userServices.updateUser(userId, updateData);

      toast.success('Cập nhật thành công', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true
      });

      // Reload user data
      const resp = await userServices.getUser(userId);
      const data = resp?.data ?? resp;
      const u = data?.data ?? data?.user ?? data ?? null;
      setUser(u);
      setIsEditing(false);
      onUpdated?.();

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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-none shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <div>
              <CardTitle>{isEditing ? 'Chỉnh sửa người dùng' : 'Chi tiết người dùng'}</CardTitle>
              <CardDescription>{isEditing ? 'Chỉnh sửa thông tin người dùng' : 'Thông tin đầy đủ của người dùng'}</CardDescription>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button 
                    size="sm" 
                    onClick={handleUpdate}
                    disabled={loading || !form.fullName.trim() || !form.email.trim()}
                  >
                    {loading ? 'Đang lưu...' : 'Lưu'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                  >
                    Hủy
                  </Button>
                </>
              ) : null}

            </div>
          </CardHeader>
          <CardContent className="pt-6">
        {loading && <div>Đang tải...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {user && !isEditing && (
          <div className="flex flex-col sm:flex-row gap-8 items-start mt-2">
            {/* Avatar + tên */}
            <div className="flex flex-col items-center min-w-[180px]">
              {user.avatar ? (
                <img src={user.avatar} alt={user.fullName || user.name} className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 shadow" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center text-4xl text-gray-400 border-4 border-gray-200 shadow">—</div>
              )}
              <div className="mt-3 text-xl font-bold text-gray-900">{user.fullName || user.name || '—'}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
              <div className="text-sm text-gray-500">{user.phoneNumber || '—'}</div>
              {!isEditing && (
                <Button 
                  className="mt-3"
                  variant="outline" 
                  size="md" 
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                >
                  Chỉnh sửa thông tin
                </Button>
              )}
            </div>
            {/* Info */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <div>
                <div className="text-gray-500 text-xs font-medium mb-1">Vai trò</div>
                <div className="font-semibold text-base text-gray-800">{getRoleDisplayName(user.role) || '—'}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs font-medium mb-1">Ngày sinh</div>
                <div className="font-semibold text-base text-gray-800">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '—'}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs font-medium mb-1">Ngày tạo</div>
                <div className="font-semibold text-base text-gray-800">{user.createdAt ? new Date(user.createdAt).toLocaleString() : (user.dateCreated || '—')}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs font-medium mb-1">Cập nhật</div>
                <div className="font-semibold text-base text-gray-800">{user.updatedAt ? new Date(user.updatedAt).toLocaleString() : '—'}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs font-medium mb-1">Trạng thái</div>
                {user.isBlocked ? (
                  <span className="inline-block px-3 py-1 rounded-full text-xs bg-red-100 text-red-800 font-semibold">Bị khóa</span>
                ) : (
                  <span className="inline-block px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 font-semibold">Hoạt động</span>
                )}
              </div>
              {(user.blockedAt || user.blockedBy || user.isBlocked) && (
                <div className="col-span-2 mt-2">
                  <div className="text-gray-500 text-xs font-medium mb-1">Thông tin khóa</div>
                  <div className="bg-gray-50 rounded p-3 flex flex-col gap-2">
                    <div><span className="font-medium">Thời gian bị khóa:</span> {user.blockedAt ? new Date(user.blockedAt).toLocaleString() : '—'}</div>
                    {user.blockedBy && typeof user.blockedBy === 'object' ? (
                      <div className="flex items-center gap-3">
                        {user.blockedBy.avatar ? (
                          <img src={user.blockedBy.avatar} alt={user.blockedBy.fullName || 'blockedBy'} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">—</div>
                        )}
                        <div>
                          <div className="font-medium">Khóa bởi: {user.blockedBy.fullName || user.blockedBy.name || '—'}</div>
                          <div className="text-sm text-gray-500">{user.blockedBy.email || '—'}</div>
                        </div>
                      </div>
                    ) : blockedByUser ? (
                      <div className="flex items-center gap-3">
                        {blockedByUser.avatar ? (
                          <img src={blockedByUser.avatar} alt={blockedByUser.fullName || 'blockedBy'} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">—</div>
                        )}
                        <div>
                          <div className="font-medium">Khóa bởi: {blockedByUser.fullName || blockedByUser.name || '—'}</div>
                          <div className="text-sm text-gray-500">{blockedByUser.email || '—'}</div>
                        </div>
                      </div>
                    ) : (
                      <div><span className="font-medium">Khóa bởi:</span> {user.blockedBy ? 'Đang tải thông tin...' : '—'}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Form */}
        {user && isEditing && (
          <div className="mt-4">
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

              <div className="space-y-1 sm:col-span-2">
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
          </div>
        )}
      </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewUser;
