import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { packetServices } from '@/services/packetService';
import { Package } from '@/types/packet';
import CreatePacket from './CreatePacket';
import CreateTrialPackage from './CreateTrialPackage';
import EditPacket from './EditPacket';
import DeletePacket from './DeletePacket';
import ViewPackage from './ViewPackage';
import { toast } from 'sonner';
import PackageStats from './PackageStats';
import UserPackageDetails from './UserPackageDetails';

const PacketManagement: React.FC = () => {
  const [packets, setPackets] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'packages' | 'stats' | 'userDetails'>('packages');

  const load = async () => {
    setLoading(true);
    try {
      const resp = await packetServices.getPackages({});
      // Support both array and object with data property
      const list = Array.isArray(resp?.data) ? resp.data : (resp?.data?.data ?? []);
      setPackets(Array.isArray(list) ? list : []);
    } catch (e) {
      // ignore for now
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-4">Package — Quản lý gói dịch vụ</h2>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'stats'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            Thống kê
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'packages'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            Quản lý gói
          </button>
          <button
            onClick={() => setActiveTab('userDetails')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'userDetails'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            Dịch vụ gói người dùng
          </button>
        </div>

      </div>

      {/* Content based on active tab */}
      {activeTab === 'packages' ? (
        <>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Danh sách gói</CardTitle>
                  <CardDescription>Quản lý các gói dịch vụ</CardDescription>
                </div>
                <div className="flex gap-2">
                  <CreateTrialPackage onCreated={load} packagesCount={packets.length} />
                  <CreatePacket onCreated={load} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-32">Tên</TableHead>
                      <TableHead className="w-24">Giá</TableHead>
                      <TableHead className="w-28">Thời lượng</TableHead>
                      <TableHead className="max-w-48">Mô tả</TableHead>
                      <TableHead className="max-w-48">Tính Năng</TableHead>
                      <TableHead className="w-32">Ngày tạo</TableHead>
                      <TableHead className="w-32">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {packets.map(p => (
                      <TableRow key={p._id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell className="text-right">{p.price?.toLocaleString()}</TableCell>
                        <TableCell>{`${p.duration} ${p.unit}`}</TableCell>
                        <TableCell className="max-w-48">
                          <div className="truncate" title={p.description}>
                            {p.description}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-48">
                          <div className="truncate" title={p.features?.join(', ')}>
                            {p.features?.join(', ')}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {p.createdAt ? new Date(p.createdAt).toLocaleDateString('vi-VN') : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <ViewPackage packet={p} />
                            <EditPacket key={`edit-${p._id}`} onUpdated={load} packet={p} />
                            <DeletePacket key={`delete-${p._id}`} packetId={p._id} onDeleted={load} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : activeTab === 'stats' ? (
        <PackageStats />
      ) : activeTab === 'userDetails' ? (
        <UserPackageDetails />
      ) : null}
    </div>
  );
};

export default PacketManagement;
