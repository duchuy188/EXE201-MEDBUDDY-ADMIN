/* eslint-disable bem/class-names */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userServices } from '@/services/usersService';

const ViewUser: React.FC = () => {
  const params = useParams();
  const id = params.id as string | undefined;
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const resp = await userServices.getUser(id);
        const data = resp?.data ?? resp;
        // Handle possible response shapes: { data: {...} }, { user: {...} }, or the user object directly
        const u = data?.data ?? data?.user ?? data ?? null;
        if (!mounted) return;
        setUser(u);
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Không tải được người dùng');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi tiết người dùng</CardTitle>
        <CardDescription>Thông tin đầy đủ của người dùng</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <div>Đang tải...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {user && (
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
            </div>
            {/* Info */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <div>
                <div className="text-gray-500 text-xs font-medium mb-1">Vai trò</div>
                <div className="font-semibold text-base text-gray-800">{user.role || '—'}</div>
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
                    ) : (
                      <div><span className="font-medium">Khóa bởi:</span> {user.blockedBy ? String(user.blockedBy) : '—'}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ViewUser;
