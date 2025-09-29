
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Package, Activity, Calendar, TrendingUp, Bell, Settings, Gift } from "lucide-react";
import Header from '@/components/Header';
import UsersManagement from './UserManager/UsersManagement';
import PacketManagement from './PacketManager/PacketManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Map tab id to route
  const tabRoutes = {
    overview: "/admin",
    users: "/admin/users",
    medicines: "/admin/medicines",
    packets: "/admin/packets",
    settings: "/admin/settings",
  };

  // Determine active tab from current path
  let activeTab = "overview";
  if (location.pathname.startsWith("/admin/users")) activeTab = "users";
  else if (location.pathname.startsWith("/admin/medicines")) activeTab = "medicines";
  else if (location.pathname.startsWith("/admin/packets")) activeTab = "packets";
  else if (location.pathname.startsWith("/admin/settings")) activeTab = "settings";

  const stats = [
    { title: "Tổng người dùng", value: "2,543", icon: Users, change: "+12%" },
    { title: "Thuốc được quản lý", value: "15,678", icon: Package, change: "+8%" },
    { title: "Lần đo huyết áp", value: "8,234", icon: Activity, change: "+15%" },
    { title: "Lịch tái khám", value: "1,456", icon: Calendar, change: "+5%" },
  ];

  const recentUsers = [
    { id: 1, name: "Nguyễn Văn An", type: "Người bệnh", lastActive: "2 phút trước", status: "active" },
    { id: 2, name: "Trần Thị Bình", type: "Người thân", lastActive: "15 phút trước", status: "active" },
    { id: 3, name: "Lê Văn Cường", type: "Người bệnh", lastActive: "1 giờ trước", status: "inactive" },
    { id: 4, name: "Phạm Thị Dung", type: "Người thân", lastActive: "3 giờ trước", status: "active" },
  ];

  const systemAlerts = [
    { id: 1, message: "Server load cao - 85%", type: "warning", time: "5 phút trước" },
    { id: 2, message: "Backup database thành công", type: "success", time: "1 giờ trước" },
    { id: 3, message: "Phát hiện 3 người dùng mới đăng ký", type: "info", time: "2 giờ trước" },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> so với tháng trước
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Người dùng gần đây</CardTitle>
            <CardDescription>Hoạt động của người dùng trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Hoạt động cuối</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.type}</TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cảnh báo hệ thống</CardTitle>
            <CardDescription>Thông báo và cảnh báo quan trọng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === 'warning' ? 'bg-yellow-500' :
                    alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUsers = () => (
    <UsersManagement />
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cấu hình hệ thống</CardTitle>
          <CardDescription>Quản lý các thiết lập chung của ứng dụng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Thông báo push</h4>
              <p className="text-sm text-muted-foreground">Bật/tắt thông báo đẩy cho người dùng</p>
            </div>
            <Button variant="outline">Cấu hình</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Backup tự động</h4>
              <p className="text-sm text-muted-foreground">Sao lưu dữ liệu hằng ngày</p>
            </div>
            <Button variant="outline">Cấu hình</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Bảo mật API</h4>
              <p className="text-sm text-muted-foreground">Quản lý key và quyền truy cập</p>
            </div>
            <Button variant="outline">Cấu hình</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-mint-pastel/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Header />

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          {[
            { id: 'overview', label: 'Tổng quan', icon: TrendingUp },
            { id: 'users', label: 'Người dùng', icon: Users },
            { id: 'medicines', label: 'Thuốc', icon: Package },
            { id: 'packets', label: 'Gói dịch vụ', icon: Gift },
            { id: 'settings', label: 'Cài đặt', icon: Settings },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className="flex-1"
              onClick={() => navigate(tabRoutes[tab.id])}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div>
          {/* If at /admin (overview), render overview; otherwise render nested route via Outlet
             This ensures nested routes like /admin/users/:id are shown instead of being overridden */}
          {location.pathname === "/admin" || location.pathname === "/admin/" ? (
            renderOverview()
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
