import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { userServices } from '@/services/usersService';
import { useNavigate } from 'react-router-dom';
import { UserWithoutPassword } from '@/types/auth';
import BlockUser from './BlockUser';
import CreateUser from './CreateUser';
import { TbLock, TbLockOpen2 } from 'react-icons/tb';
import { FiFilter } from 'react-icons/fi';

const QuanLyNguoiDung: React.FC = () => {
  const [users, setUsers] = useState<UserWithoutPassword[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [blockUserId, setBlockUserId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
  const params: any = { page, limit };
  if (roleFilter && roleFilter !== 'all') params.role = roleFilter;
  const resp = await userServices.getAllUsers(params);
        const data = resp?.data ?? resp;
        const list = data?.data ?? data?.users ?? (Array.isArray(data) ? data : undefined) ?? [];
        const pagination = data?.pagination ?? data?.meta ?? undefined;
        if (!mounted) return;
        setUsers(Array.isArray(list) ? list : []);
        if (pagination) {
          setTotalPages(pagination.totalPages ?? pagination.total_pages ?? 1);
          setTotalUsers(pagination.totalUsers ?? pagination.total_users ?? pagination.total ?? 0);
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Không tải được người dùng');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [page, limit, roleFilter]);

  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý người dùng</CardTitle>
        <CardDescription>Danh sách và quản lý tất cả người dùng trong hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <label htmlFor="role-filter" className="sr-only">Bộ lọc loại người dùng</label>
            <div className="relative flex items-center">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select
                id="role-filter"
                value={roleFilter}
                onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
                className="pl-9 pr-4 py-2 border rounded shadow bg-white text-gray-800 focus:outline-none min-w-[140px]"
              >
                <option value="all">Tất cả</option>
                <option value="patient">Người bệnh</option>
                <option value="relative">Người thân</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
          </div>
          <Button onClick={() => setShowCreate(true)}>Thêm người dùng</Button>
        </div>

        {loading && <div>Đang tải...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u: any, idx) => (
                  <TableRow key={u._id || u.id || idx}>
                    <TableCell>{u.fullName || u.name || u.username || '—'}</TableCell>
                    <TableCell>{u.email || '—'}</TableCell>
                    <TableCell>{
                      u.role === 'admin' ? 'Quản trị viên'
                      : u.role === 'patient' ? 'Người bệnh'
                      : u.role === 'relative' ? 'Người thân'
                      : '—'
                    }</TableCell>
                    <TableCell>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : (u.dateCreated || '—')}</TableCell>
                    <TableCell>
                      {u.isBlocked || u.blocked ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Đã khoá</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Hoạt động</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/users/${u._id || u.id}`)}>Xem</Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/users/${u._id || u.id}/edit`)}>Sửa</Button>
                        {u.isBlocked || u.blocked ? (
                          <Button variant="ghost" size="sm" className="text-green-600" title="Mở khoá" onClick={() => setBlockUserId(u._id || u.id)}>
                            <TbLockOpen2 className="w-5 h-5" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-red-600" title="Khoá" onClick={() => setBlockUserId(u._id || u.id)}>
                            <TbLock className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {users.length > 0 && (
              <div className="flex items-center justify-end space-x-2 mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Prev
                </Button>
                {Array.from({ length: Math.max(1, totalPages) }).map((_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? 'default' : 'ghost'}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            )}
            {blockUserId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 min-w-[340px] max-w-[90vw] animate-fadeIn flex flex-col">
                  {modalLoading && <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10"><span className="loader" /></div>}
                  <BlockUser userId={blockUserId} onDone={async () => {
                    setModalLoading(true);
                    setBlockUserId(null);
                    await new Promise(r => setTimeout(r, 300));
                    setPage(1);
                    setModalLoading(false);
                  }} />
                  <div className="flex justify-end mt-2">
                    <Button variant="ghost" onClick={() => setBlockUserId(null)}>Đóng</Button>
                  </div>
                </div>
              </div>
            )}
            {showCreate && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 min-w-[400px] max-w-[95vw] animate-fadeIn flex flex-col">
                  {modalLoading && <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10"><span className="loader" /></div>}
                  <CreateUser onCreated={async () => {
                    setModalLoading(true);
                    setShowCreate(false);
                    setPage(1); // luôn về trang 1
                    // Đợi load lại danh sách user mới nhất
                    await new Promise(r => setTimeout(r, 300));
                    setModalLoading(false);
                  }} />
                </div>
              </div>
            )}
          </>
        )}

      </CardContent>
    </Card>
  );
};

export default QuanLyNguoiDung;
