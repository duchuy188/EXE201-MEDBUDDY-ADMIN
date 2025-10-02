
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Users, Package, Activity, Calendar, TrendingUp, Bell, Settings, Gift, Eye, EyeOff } from "lucide-react";
import Header from '@/components/Header';
import UsersManagement from './UserManager/UsersManagement';
import PacketManagement from './PacketManager/PacketManagement';
import { getDashboardStats } from '@/services/payOsService';
import { DashboardStatsData } from '@/types/payOs';
import LoadingIndicator from '@/components/LoadingIndicator';
import '../styles/dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  
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

  const fetchDashboardData = async (customDateRange?: { startDate?: string; endDate?: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = customDateRange || (dateRange.startDate && dateRange.endDate ? dateRange : undefined);
      const response = await getDashboardStats(params);
      
      if (response && response.success) {
        setDashboardData(response.data);
      } else {
        setError(response?.message || 'Không thể tải dữ liệu dashboard');
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Đã xảy ra lỗi khi tải dữ liệu';
      setError(errorMessage);
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

  const stats = dashboardData?.overview ? [
    { 
      title: "Tổng doanh thu", 
      value: formatCurrency(dashboardData.overview.totalRevenue || 0), 
      emoji: "💰", 
      change: `${(dashboardData.overview.successRate || 0).toFixed(1)}% thành công` 
    },
    { 
      title: "Tổng giao dịch", 
      value: formatNumber(dashboardData.overview.totalTransactions || 0), 
      emoji: "📦", 
      change: `${formatNumber(dashboardData.overview.successfulTransactions || 0)} thành công` 
    },
    { 
      title: "Giao dịch chờ xử lý", 
      value: formatNumber(dashboardData.overview.pendingTransactions || 0), 
      emoji: "⏳", 
      change: `${formatNumber(dashboardData.overview.cancelledTransactions || 0)} đã hủy` 
    },
    { 
      title: "Giá trị TB/giao dịch", 
      value: formatCurrency(dashboardData.overview.averageTransactionValue || 0), 
      emoji: "📊", 
      change: `${formatNumber(dashboardData.overview.expiredTransactions || 0)} hết hạn` 
    },
  ] : [
    { title: "Tổng doanh thu", value: "---", emoji: "💰", change: "Đang tải..." },
    { title: "Tổng giao dịch", value: "---", emoji: "📦", change: "Đang tải..." },
    { title: "Giao dịch chờ xử lý", value: "---", emoji: "⏳", change: "Đang tải..." },
    { title: "Giá trị TB/giao dịch", value: "---", emoji: "📊", change: "Đang tải..." },
  ];



  const systemAlerts = [
    { id: 1, message: "Server load cao - 85%", type: "warning", time: "5 phút trước" },
    { id: 2, message: "Backup database thành công", type: "success", time: "1 giờ trước" },
    { id: 3, message: "Phát hiện 3 người dùng mới đăng ký", type: "info", time: "2 giờ trước" },
  ];

  const renderOverview = () => {
    if (loading) {
      return (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col justify-center items-center h-32">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-3 mb-4">
                <LoadingIndicator />
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">⏳ Đang tải dữ liệu...</h3>
              <p className="text-blue-700 text-sm">Vui lòng chờ trong giây lát</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 shadow-lg">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Bell className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-red-800 mb-3">⚠️ Có lỗi xảy ra</h3>
              <p className="text-red-600 mb-6 max-w-md mx-auto">{error}</p>
              <Button 
                variant="outline" 
                onClick={() => fetchDashboardData()}
                className="bg-white hover:bg-red-50 border-red-300 text-red-700 shadow-md"
              >
                🔄 Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-xl bounce-in">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">🎉 Chào mừng đến với Dashboard Admin</h2>
                <p className="text-purple-100">
                  Theo dõi và quản lý hoạt động của hệ thống MedBuddy
                </p>
              </div>
              <div className="hidden md:block">
                <TrendingUp className="h-16 w-16 text-purple-200 pulse-slow" />
              </div>
            </div>
            {dashboardData && (
              <div className="mt-4 pt-4 border-t border-purple-400">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="slide-in">
                    <div className="text-2xl font-bold">{formatNumber(dashboardData.overview.totalTransactions || 0)}</div>
                    <div className="text-purple-200 text-sm">Tổng giao dịch</div>
                  </div>
                  <div className="slide-in">
                    <div className="text-2xl font-bold">{formatCurrency(dashboardData.overview.totalRevenue || 0)}</div>
                    <div className="text-purple-200 text-sm">Tổng doanh thu</div>
                  </div>
                  <div className="slide-in">
                    <div className="text-2xl font-bold">{(dashboardData.overview.successRate || 0).toFixed(1)}%</div>
                    <div className="text-purple-200 text-sm">Tỷ lệ thành công</div>
                  </div>
                  <div className="slide-in">
                    <div className="text-2xl font-bold">{formatNumber(dashboardData.packageStats?.length || 0)}</div>
                    <div className="text-purple-200 text-sm">Gói dịch vụ</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Date Filter */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-900">Bộ lọc thời gian</CardTitle>
            </div>
            <CardDescription className="text-blue-700">
              Chọn khoảng thời gian để xem thống kê chi tiết
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label htmlFor="startDate" className="block text-sm font-semibold mb-2 text-gray-700">
                  📅 Từ ngày
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="endDate" className="block text-sm font-semibold mb-2 text-gray-700">
                  📅 Đến ngày
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => fetchDashboardData()}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                >
                  ✨ Áp dụng
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setDateRange({ startDate: '', endDate: '' });
                    fetchDashboardData({});
                  }}
                  disabled={loading}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  🔄 Xóa bộ lọc
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const gradients = [
              'bg-gradient-to-br from-emerald-400 to-emerald-600',
              'bg-gradient-to-br from-blue-400 to-blue-600', 
              'bg-gradient-to-br from-amber-400 to-orange-500',
              'bg-gradient-to-br from-purple-400 to-purple-600'
            ];
            const textColors = [
              'text-emerald-600',
              'text-blue-600',
              'text-orange-600', 
              'text-purple-600'
            ];
            const bgColors = [
              'bg-emerald-50',
              'bg-blue-50',
              'bg-orange-50',
              'bg-purple-50'
            ];
            
            return (
              <Card key={index} className={`${bgColors[index]} border-0 shadow-lg dashboard-card fade-in floating`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-700">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-full ${gradients[index]} shadow-md flex items-center justify-center`}>
                    <span className="text-xl">{stat.emoji}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <p className="text-xs flex items-center">
                    <span className={`${textColors[index]} font-medium`}>
                      {stat.change}
                    </span>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Data Message */}
        {dashboardData && dashboardData.overview.totalTransactions === 0 && (
          <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 shadow-lg">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Package className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">📊 Chưa có dữ liệu</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Hiện tại chưa có giao dịch nào trong khoảng thời gian này. 
                  Hãy thử chọn khoảng thời gian khác hoặc xem tất cả dữ liệu.
                </p>
                {(dateRange.startDate || dateRange.endDate) && (
                  <Button 
                    variant="outline" 
                    className="mt-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 shadow-md"
                    onClick={() => {
                      setDateRange({ startDate: '', endDate: '' });
                      fetchDashboardData({});
                    }}
                  >
                    🔍 Xem tất cả dữ liệu
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Package Statistics */}
        {dashboardData?.packageStats && dashboardData.packageStats.length > 0 && (
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-indigo-900">📦 Thống kê theo gói dịch vụ</CardTitle>
              </div>
              <CardDescription className="text-indigo-700">
                Doanh thu và số lượng bán theo từng gói dịch vụ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border border-indigo-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-indigo-100 hover:bg-indigo-100">
                      <TableHead className="font-semibold text-indigo-900">🏷️ Tên gói</TableHead>
                      <TableHead className="font-semibold text-indigo-900">📊 Số lượng</TableHead>
                      <TableHead className="font-semibold text-indigo-900">💰 Doanh thu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.packageStats.map((pkg, index) => (
                      <TableRow key={index} className="hover:bg-indigo-50 transition-colors">
                        <TableCell className="font-medium text-gray-900">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                            <span>{pkg.packageName || 'Không rõ'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-blue-700">
                          {formatNumber(pkg.count || 0)} gói
                        </TableCell>
                        <TableCell className="font-bold text-green-700">
                          {formatCurrency(pkg.totalRevenue || 0)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Statistics Chart */}
        {dashboardData?.dailyStats && dashboardData.dailyStats.length > 0 && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-green-900">📈 Thống kê theo ngày</CardTitle>
              </div>
              <CardDescription className="text-green-700">
                Doanh thu và số lượng giao dịch hàng ngày (7 ngày gần nhất)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.dailyStats.slice(0, 7).map((day, index) => {
                  const maxAmount = Math.max(...dashboardData.dailyStats.slice(0, 7).map(d => d.totalAmount || 0));
                  const percentage = maxAmount > 0 ? ((day.totalAmount || 0) / maxAmount) * 100 : 0;
                  const roundedPercentage = Math.round(percentage / 10) * 10; // Round to nearest 10
                  
                  return (
                    <div key={index} className="relative">
                      <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm font-semibold text-gray-800">
                            📅 {typeof day._id === 'string' && day._id !== 'string' 
                              ? new Date(day._id).toLocaleDateString('vi-VN')
                              : day._id}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-green-700">
                            💰 {formatCurrency(day.totalAmount || 0)}
                          </div>
                          <div className="text-xs text-gray-600">
                            📊 {formatNumber(day.totalCount || 0)} giao dịch
                          </div>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-1 h-1 bg-green-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full stats-progress-bar`}
                          data-width={roundedPercentage}
                        ></div>
                      </div>
                    </div>
                  );
                })}
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
      { id: 'payos', label: 'Thống kê thanh toán người dùng', icon: Activity },
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <Header />

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-200 mb-8">
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'overview', label: 'Tổng quan', emoji: '📊' },
              { id: 'users', label: 'Người dùng', emoji: '👥' },
              { id: 'medicines', label: 'Thuốc', emoji: '💊' },
              { id: 'packets', label: 'Gói dịch vụ', emoji: '🎁' },
              { id: 'payos', label: 'Thống kê thanh toán', emoji: '💳' },
              { id: 'settings', label: 'Cài đặt', emoji: '⚙️' },
            ]
            .filter(tab => visibleTabs[tab.id as keyof typeof visibleTabs])
            .map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`flex-1 min-w-fit transition-all duration-200 ${
                  activeTab === tab.id 
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:from-blue-700 hover:to-blue-800" 
                    : "hover:bg-blue-50 text-gray-700 hover:text-blue-700"
                }`}
                onClick={() => navigate(tabRoutes[tab.id])}
              >
                <span className="mr-2">{tab.emoji}</span>
                <span className="font-medium">{tab.label}</span>
              </Button>
            ))}
          </div>
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
