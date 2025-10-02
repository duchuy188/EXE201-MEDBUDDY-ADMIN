import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { packetServices } from '@/services/packetService';
import LoadingIndicator from '@/components/LoadingIndicator';
import { PackageStatsItem } from '@/types/packet';


const PackageStats: React.FC = () => {
  const [stats, setStats] = useState<PackageStatsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const loadStats = async () => {
    setLoading(true);
    try {

      const response = await packetServices.getPackageStats();

      
      // API returns structure: { message: string, data: PackageStatsItem[] }
      const statsData = response?.data?.data || [];
      console.log('Extracted stats data:', statsData);
      
      if (Array.isArray(statsData)) {
        setStats(statsData);
        setApiStatus('success');
      } else {
        console.warn('API response data is not an array:', statsData);
        setStats([]);
        setApiStatus('error');
      }
    } catch (error: any) {
      console.error('Error loading package stats:', error);
      console.error('Error details:', error?.response?.data || error?.message);
      setApiStatus('error');
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);



  if (loading && stats.length === 0) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Thống kê gói dịch vụ</h2>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-600">Tổng quan về việc sử dụng gói dịch vụ</p>
            {apiStatus === 'success' && (
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">API OK</span>
            )}
            {apiStatus === 'error' && (
              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">API Error - Endpoint không tồn tại</span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={loadStats}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tải...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Làm mới API
              </>
            )}
          </Button>
          
          <Button
            onClick={() => {
              console.log('Testing direct API call...');
              packetServices.getPackageStats()
                .then(response => {
                  console.log('Direct API test success:', response);
                  alert('API Test Success! Check console for details.');
                })
                .catch(error => {
                  console.error('Direct API test failed:', error);
                  alert('API Test Failed! Check console for error details.');
                });
            }}
            variant="outline"
            size="sm"
          >
            🔍 Test API
          </Button>
        </div>
      </div>

      {stats.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                {apiStatus === 'error' ? (
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {apiStatus === 'error' ? 'API chưa sẵn sàng' : 'Chưa có dữ liệu thống kê'}
              </h3>
              <p className="text-gray-500">
                {apiStatus === 'error' 
                  ? 'Endpoint /user-package/admin/stats chưa được implement trên server.'
                  : 'Không có thông tin về gói dịch vụ nào.'
                }
              </p>
              {apiStatus === 'error' && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700">
                    <strong>Lỗi:</strong> 404 Not Found - API endpoint không tồn tại
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Vui lòng kiểm tra lại backend hoặc implement endpoint này
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tổng quan gói dịch vụ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.length}
                  </div>
                  <p className="text-sm text-blue-600 mt-1">Loại gói dịch vụ</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.reduce((total, item) => total + item.activeUsers, 0)}
                  </div>
                  <p className="text-sm text-green-600 mt-1">Tổng người dùng active</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(stats.reduce((total, item) => total + item.activeUsers, 0) / stats.length)}
                  </div>
                  <p className="text-sm text-purple-600 mt-1">Trung bình/gói</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Details */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết từng gói dịch vụ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.map((pkg, index) => {
                  const totalUsers = stats.reduce((total, item) => total + item.activeUsers, 0);
                  const percentage = totalUsers > 0 ? ((pkg.activeUsers / totalUsers) * 100) : 0;
                  
                  return (
                    <div key={pkg.id || pkg.packageName} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{pkg.packageName}</h4>
                            <p className="text-sm text-gray-500">{pkg.activeUsers} người dùng đang sử dụng</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{pkg.activeUsers}</p>
                          <p className="text-xs text-gray-500">người dùng</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-lg font-semibold text-green-600">{percentage.toFixed(1)}%</p>
                          <p className="text-xs text-gray-500">tỷ lệ sử dụng</p>
                        </div>
                        
                        {/* Visual progress bar */}
                        <div className="w-24">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`bg-blue-500 h-2 rounded-full transition-all duration-300 ${
                                percentage >= 90 ? 'w-full' :
                                percentage >= 75 ? 'w-11/12' :
                                percentage >= 50 ? 'w-3/4' :
                                percentage >= 25 ? 'w-2/4' :
                                percentage >= 10 ? 'w-1/4' : 'w-1/12'
                              }`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Packages */}
          <Card>
            <CardHeader>
              <CardTitle>Gói phổ biến nhất</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats
                  .sort((a, b) => b.activeUsers - a.activeUsers)
                  .slice(0, 3)
                  .map((pkg, index) => (
                    <div key={pkg.id || pkg.packageName} className="flex items-center space-x-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          <span className="font-bold text-sm">#{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{pkg.packageName}</p>
                        <p className="text-sm text-gray-600">{pkg.activeUsers} người dùng active</p>
                      </div>
                      {index === 0 && (
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PackageStats;