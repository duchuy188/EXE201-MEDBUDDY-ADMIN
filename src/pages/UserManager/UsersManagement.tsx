import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { userServices } from '@/services/usersService';
import { UserWithoutPassword } from '@/types/auth';

const QuanLyNguoiDung: React.FC = () => {
  const [users, setUsers] = useState<UserWithoutPassword[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const resp = await userServices.getAllUsers({ page, limit });
        console.log('[UsersManagement] getAllUsers response ->', resp);
        const data = resp?.data ?? resp;
        // API may return the list under different keys depending on backend:
        // - { data: [...] }
        // - { users: [...] }
        // - directly an array [...]
        const list = data?.data ?? data?.users ?? (Array.isArray(data) ? data : undefined) ?? [];
        const pagination = data?.pagination ?? data?.meta ?? undefined;
        if (!mounted) return;
        setUsers(Array.isArray(list) ? list : []);
        if (pagination) {
          setTotalPages(pagination.totalPages ?? pagination.total_pages ?? 1);
          setTotalUsers(pagination.totalUsers ?? pagination.total_users ?? pagination.total ?? 0);
        }
      } catch (e: any) {
        console.error('[UsersManagement] getAllUsers error ->', e);
        setError(e?.response?.data?.message || e?.message || 'Không tải được người dùng');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [page, limit]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý người dùng</CardTitle>
        <CardDescription>Danh sách và quản lý tất cả người dùng trong hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <Button variant="outline">Tất cả</Button>
            <Button variant="outline">Người bệnh</Button>
            <Button variant="outline">Người thân</Button>
          </div>
          <Button>Thêm người dùng</Button>
        </div>

        {loading && <div>Đang tải...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
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
                    <TableCell className="font-medium">{u._id ? `#${u._id.slice(0, 6)}` : `#${idx + 1}`}</TableCell>
                    <TableCell>{u.fullName || u.name || u.username || '—'}</TableCell>
                    <TableCell>{u.email || '—'}</TableCell>
                    <TableCell>{u.role || '—'}</TableCell>
                    <TableCell>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : (u.dateCreated || '—')}</TableCell>
                    <TableCell><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Hoạt động</span></TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">Xem</Button>
                        <Button variant="ghost" size="sm">Sửa</Button>
                        <Button variant="ghost" size="sm" className="text-red-600">Khóa</Button>
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
          </>
        )}

      </CardContent>
    </Card>
  );
};

export default QuanLyNguoiDung;
