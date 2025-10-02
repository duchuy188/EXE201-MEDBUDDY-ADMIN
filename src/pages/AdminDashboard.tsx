
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Package, Activity, Calendar, TrendingUp, Bell, Settings, Gift, Eye, EyeOff } from "lucide-react";
import Header from '@/components/Header';
import UsersManagement from './UserManager/UsersManagement';
import PacketManagement from './PacketManager/PacketManagement';
import { getDashboardStats } from '@/services/payOsService';
import { DashboardStatsData } from '@/types/payOs';
import LoadingIndicator from '@/components/LoadingIndicator';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for managing visible tabs
  const [visibleTabs, setVisibleTabs] = useState({
    overview: true,
    users: true,
    medicines: true,
    packets: true,
    payos: true,
    settings: true, // Settings tab is always visible
  });

  // Load tab visibility settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('admin-tab-visibility');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setVisibleTabs(prev => ({ ...prev, ...parsedSettings, settings: true })); // Always keep settings visible
      } catch (error) {
        console.error('Error loading tab visibility settings:', error);
      }
    }
  }, []);

  // Save tab visibility settings to localStorage
  const saveTabVisibility = (newVisibility: typeof visibleTabs) => {
    setVisibleTabs(newVisibility);
    localStorage.setItem('admin-tab-visibility', JSON.stringify(newVisibility));
  };

  // Map tab id to route
  const tabRoutes = {
    overview: "/admin",
    users: "/admin/users",
    medicines: "/admin/medicines",
    packets: "/admin/packets",
    payos: "/admin/payos",
    settings: "/admin/settings",
  };

  // Determine active tab from current path
  let activeTab = "overview";
  if (location.pathname.startsWith("/admin/users")) activeTab = "users";
  else if (location.pathname.startsWith("/admin/medicines")) activeTab = "medicines";
  else if (location.pathname.startsWith("/admin/packets")) activeTab = "packets";
  else if (location.pathname.startsWith("/admin/payos")) activeTab = "payos";
  else if (location.pathname.startsWith("/admin/settings")) activeTab = "settings";

  // Fetch dashboard data when component mounts or when switching to overview
  useEffect(() => {
    if (activeTab === "overview") {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDashboardStats();
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError('Không thể tải dữ liệu dashboard');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Format number with thousand separators
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  // Format currency
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(num);
  };

  const stats = dashboardData ? [
    { 
      title: "Tổng doanh thu", 
      value: formatCurrency(dashboardData.overview.totalRevenue), 
      icon: TrendingUp, 
      change: `${dashboardData.overview.successRate.toFixed(1)}% thành công` 
    },
    { 
      title: "Tổng giao dịch", 
      value: formatNumber(dashboardData.overview.totalTransactions), 
      icon: Package, 
      change: `${formatNumber(dashboardData.overview.successfulTransactions)} thành công` 
    },
    { 
      title: "Giao dịch chờ xử lý", 
      value: formatNumber(dashboardData.overview.pendingTransactions), 
      icon: Activity, 
      change: `${formatNumber(dashboardData.overview.cancelledTransactions)} đã hủy` 
    },
    { 
      title: "Giá trị TB/giao dịch", 
      value: formatCurrency(dashboardData.overview.averageTransactionValue), 
      icon: Calendar, 
      change: `${formatNumber(dashboardData.overview.expiredTransactions)} hết hạn` 
    },
  ] : [
    { title: "Tổng doanh thu", value: "---", icon: TrendingUp, change: "---" },
    { title: "Tổng giao dịch", value: "---", icon: Package, change: "---" },
    { title: "Giao dịch chờ xử lý", value: "---", icon: Activity, change: "---" },
    { title: "Giá trị TB/giao dịch", value: "---", icon: Calendar, change: "---" },
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

  const renderOverview = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <LoadingIndicator />
        </div>
      );
    }

    if (error) {
      return (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                <p>{error}</p>
                <Button 
                  variant="outline" 
                  onClick={fetchDashboardData}
                  className="mt-4"
                >
                  Thử lại
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
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
                  <span className="text-blue-600">{stat.change}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Package Statistics */}
        {dashboardData?.packageStats && dashboardData.packageStats.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Thống kê theo gói dịch vụ</CardTitle>
              <CardDescription>Doanh thu và số lượng theo từng gói</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên gói</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Doanh thu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.packageStats.map((pkg, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{pkg.packageName}</TableCell>
                      <TableCell>{formatNumber(pkg.count)}</TableCell>
                      <TableCell>{formatCurrency(pkg.totalRevenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Daily Statistics Chart Placeholder */}
        {dashboardData?.dailyStats && dashboardData.dailyStats.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Thống kê theo ngày</CardTitle>
              <CardDescription>Doanh thu và giao dịch hàng ngày</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dashboardData.dailyStats.slice(0, 7).map((day, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">
                      {new Date(day._id).toLocaleDateString('vi-VN')}
                    </span>
                    <div className="text-right">
                      <div className="text-sm font-bold">{formatCurrency(day.totalAmount)}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatNumber(day.totalCount)} giao dịch
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        

        
        </div>
      </div>
    );
  };

  const renderUsers = () => (
    <UsersManagement />
  );

  const renderSettings = () => {
    const tabOptions = [
      { id: 'overview', label: 'Tổng quan', icon: TrendingUp },
      { id: 'users', label: 'Người dùng', icon: Users },
      { id: 'medicines', label: 'Thuốc', icon: Package },
      { id: 'packets', label: 'Gói dịch vụ', icon: Gift },
      { id: 'payos', label: 'Thống kê thanh toán', icon: Bell },
    ];

    return (
      <div className="space-y-6">
        {/* Tab Visibility Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Cài đặt hiển thị thanh điều hướng</CardTitle>
            <CardDescription>
              Chọn các tab bạn muốn hiển thị trên thanh điều hướng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tabOptions.map((tab) => (
                <div key={tab.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <tab.icon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">{tab.label}</span>
                  </div>
                  <Button
                    variant={visibleTabs[tab.id as keyof typeof visibleTabs] ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const newVisibility = {
                        ...visibleTabs,
                        [tab.id]: !visibleTabs[tab.id as keyof typeof visibleTabs]
                      };
                      saveTabVisibility(newVisibility);
                    }}
                  >
                    {visibleTabs[tab.id as keyof typeof visibleTabs] ? (
                      <>
                        <Eye className="h-4 w-4 mr-1" />
                        Hiện
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" />
                        Ẩn
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Khôi phục mặc định</h4>
                  <p className="text-sm text-gray-600">Hiển thị lại tất cả các tab</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    const defaultVisibility = {
                      overview: true,
                      users: true,
                      medicines: true,
                      packets: true,
                      payos: true,
                      settings: true,
                    };
                    saveTabVisibility(defaultVisibility);
                  }}
                >
                  Khôi phục
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        
      </div>
    );
  };



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
            { id: 'payos', label: 'Thống kê thanh toán', icon: Bell },
            { id: 'settings', label: 'Cài đặt', icon: Settings },
          ]
          .filter(tab => visibleTabs[tab.id as keyof typeof visibleTabs])
          .map((tab) => (
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
          {/* If at /admin (overview), render overview; if at /admin/settings render settings; otherwise render nested route via Outlet
             This ensures nested routes like /admin/users/:id are shown instead of being overridden */}
          {location.pathname === "/admin" || location.pathname === "/admin/" ? (
            renderOverview()
          ) : location.pathname === "/admin/settings" ? (
            renderSettings()
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
