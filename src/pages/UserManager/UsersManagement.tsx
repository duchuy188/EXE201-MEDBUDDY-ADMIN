import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { userServices } from '@/services/usersService';
import { useNavigate } from 'react-router-dom';
import { UserWithoutPassword } from '@/types/auth';
import CreateUser from './CreateUser';
import ViewUser from './ViewUser';
import { TbLock, TbLockOpen2, TbEye } from 'react-icons/tb';
import { FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';
import useLazyLoading from '@/hooks/useLazyLoading';
import LoadingIndicator from '@/components/LoadingIndicator';

// Lazy load CreateUser component
const LazyCreateUser = lazy(() => import('./CreateUser'));

const ConfirmDialogComponent: React.FC<{
  message: string;
  targetElement: HTMLElement;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ message, targetElement, onConfirm, onCancel }) => {
  const [position, setPosition] = useState({ top: 0, left: 0, opacity: 0 });

  useEffect(() => {
    const calculateInitialPosition = () => {
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const dialogWidth = 256;
        const viewportWidth = window.innerWidth;

        let left = rect.left - 100;

        // Boundary checks
        if (left < 10) {
          left = 10;
        }
        if (left + dialogWidth > viewportWidth - 10) {
          left = viewportWidth - dialogWidth - 10;
        }

        // Set position immediately without animation
        setPosition({
          top: Math.max(10, rect.top - 80),
          left: left,
          opacity: 1
        });
      }
    };

    // Calculate position immediately on mount
    calculateInitialPosition();

    const updatePosition = () => {
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const dialogWidth = 256;
        const viewportWidth = window.innerWidth;

        let left = rect.left - 100;

        if (left < 10) {
          left = 10;
        }
        if (left + dialogWidth > viewportWidth - 10) {
          left = viewportWidth - dialogWidth - 10;
        }

        setPosition(prev => ({
          ...prev,
          top: Math.max(10, rect.top - 80),
          left: left
        }));
      }
    };

    // Debounced event listeners for scroll/resize
    let timeoutId: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updatePosition, 16);
    };

    window.addEventListener('scroll', debouncedUpdate, { passive: true });
    window.addEventListener('resize', debouncedUpdate, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', debouncedUpdate);
      window.removeEventListener('resize', debouncedUpdate);
    };
  }, [targetElement]);

  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-lg border p-3 w-64"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        opacity: position.opacity,
        transform: 'translate3d(0, 0, 0)', // Force hardware acceleration
        transition: 'none' // Remove any CSS transitions that could cause flicker
      }}
    >
      <div className="text-sm mb-2">{message}</div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={onCancel}
        >
          Hủy
        </Button>
        <Button
          size="sm"
          className="flex-1 text-xs bg-red-600 hover:bg-red-700 text-white"
          onClick={onConfirm}
        >
          Xác nhận
        </Button>
      </div>
    </div>
  );
};

const QuanLyNguoiDung: React.FC = () => {
  const [users, setUsers] = useState<UserWithoutPassword[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const { silentRefresh } = useLazyLoading();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    targetElement: HTMLElement | null;
  }>({ isOpen: false, message: '', onConfirm: () => { }, targetElement: null });
  const [showCreate, setShowCreate] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [viewUserPopup, setViewUserPopup] = useState<{
    isOpen: boolean;
    userId: string | null;
  }>({ isOpen: false, userId: null });

  // Function to reload table data only without flickering
  const reloadTableData = async (showLoading = false) => {
    if (showLoading) {
      silentRefresh(); // Use silent refresh instead
    }

    try {
      const params: any = { page, limit };
      if (roleFilter && roleFilter !== 'all') params.role = roleFilter;
      const resp = await userServices.getAllUsers(params);
      const data = resp?.data ?? resp;
      const list = data?.data ?? data?.users ?? (Array.isArray(data) ? data : undefined) ?? [];
      const pagination = data?.pagination ?? data?.meta ?? undefined;
      setUsers(Array.isArray(list) ? list : []);
      if (pagination) {
        setTotalPages(pagination.totalPages ?? pagination.total_pages ?? 1);
        setTotalUsers(pagination.totalUsers ?? pagination.total_users ?? pagination.total ?? 0);
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Không tải được người dùng');
    }
  };

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

  const handleBlockUser = async (userId: string, isCurrentlyBlocked: boolean, event: React.MouseEvent) => {
    const action = isCurrentlyBlocked ? 'mở khóa' : 'khóa';
    const message = isCurrentlyBlocked
      ? 'Bạn có chắc chắn muốn mở khóa người dùng này không?'
      : 'Bạn có chắc chắn muốn khóa người dùng này không?';

    const tableCell = (event.currentTarget as HTMLElement).closest('td');

    setConfirmDialog({
      isOpen: true,
      message,
      targetElement: tableCell as HTMLElement,
      onConfirm: async () => {
        setConfirmDialog({ isOpen: false, message: '', onConfirm: () => { }, targetElement: null });

        setActionLoading(userId);
        try {
          if (isCurrentlyBlocked) {
            await userServices.unblockUser(userId);
            toast.success('Mở khóa người dùng thành công', {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true
            });
          } else {
            await userServices.blockUser(userId);
            toast.success('Người dùng đã bị khóa', {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true
            });
          }
          // Reload only table data silently without flickering
          await reloadTableData(false);
          silentRefresh();
        } catch (e: any) {
          toast.error(e?.response?.data?.message || e?.message || `Không thể ${action} người dùng`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true
          });
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  return (
    <>
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
                  <TableHead>Vai trò</TableHead>
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
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Xem chi tiết" 
                          onClick={() => setViewUserPopup({ isOpen: true, userId: u._id || u.id })}
                        >
                          <TbEye className="w-4 h-4" />
                        </Button>
                        {u.isBlocked || u.blocked ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600"
                            title="Mở khoá"
                            onClick={(e) => handleBlockUser(u._id || u.id, true, e)}
                            disabled={actionLoading === (u._id || u.id)}
                          >
                            <TbLockOpen2 className="w-5 h-5" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            title="Khoá"
                            onClick={(e) => handleBlockUser(u._id || u.id, false, e)}
                            disabled={actionLoading === (u._id || u.id)}
                          >
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

            {confirmDialog.isOpen && confirmDialog.targetElement && (
              <Suspense fallback={<LoadingIndicator type="simple" message="Loading..." position="top-right" size="sm" />}>
                <ConfirmDialogComponent
                  message={confirmDialog.message}
                  targetElement={confirmDialog.targetElement}
                  onConfirm={confirmDialog.onConfirm}
                  onCancel={() => setConfirmDialog({ isOpen: false, message: '', onConfirm: () => { }, targetElement: null })}
                />
              </Suspense>
            )}
            {showCreate && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 min-w-[400px] max-w-[95vw] animate-fadeIn flex flex-col">
                  {modalLoading && <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10"><span className="loader" /></div>}
                  <Suspense fallback={<LoadingIndicator type="spinner" message="Đang tải..." position="center" size="md" />}>
                    <LazyCreateUser onCreated={async () => {
                      setModalLoading(true);
                      setShowCreate(false);
                      // Reload table data silently
                      await reloadTableData(false);
                      setModalLoading(false);
                    }} />
                  </Suspense>
                </div>
              </div>
            )}
          </>
        )}

      </CardContent>
    </Card>

    {/* ViewUser Popup */}
    {viewUserPopup.isOpen && (
      <ViewUser
        isOpen={viewUserPopup.isOpen}
        onClose={() => setViewUserPopup({ isOpen: false, userId: null })}
        userId={viewUserPopup.userId}
        onUpdated={() => reloadTableData(true)}
      />
    )}
    </>
  );
};

export default QuanLyNguoiDung;
