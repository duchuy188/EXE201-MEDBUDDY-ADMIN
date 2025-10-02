import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { packetServices } from '@/services/packetService';
import { Package } from '@/types/packet';
import CreatePacket from './CreatePacket';
import EditPacket from './EditPacket';
import DeletePacket from './DeletePacket';
import PackageStats from './PackageStats';
import UserPackageDetails from './UserPackageDetails';

const PacketManagement: React.FC = () => {
  const [packets, setPackets] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
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
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'packages'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Quản lý gói
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'stats'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Thống kê
          </button>
          <button
            onClick={() => setActiveTab('userDetails')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'userDetails'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Chi tiết User
          </button>
        </div>

        {/* Action Button - only show on packages tab */}
        {activeTab === 'packages' && (
          <div className="flex justify-end">
            <Button onClick={() => setShowCreate(true)}>Thêm gói</Button>
          </div>
        )}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'packages' ? (
        <>
          {showCreate && <CreatePacket onCreated={() => { setShowCreate(false); load(); }} />}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách gói</CardTitle>
              <CardDescription>Quản lý các gói dịch vụ</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Thời lượng</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packets.map(p => (
                    <TableRow key={p._id}>
                      <TableCell>{p._id}</TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.price}</TableCell>
                      <TableCell>{`${p.duration} ${p.unit}`}</TableCell>
                      <TableCell className="max-w-xs truncate">{p.description}</TableCell>
                      <TableCell>{p.features?.join(', ')}</TableCell>
                      <TableCell>{p.createdAt ? new Date(p.createdAt).toLocaleString() : '-'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <EditPacket onUpdated={load} packet={p} />
                          <DeletePacket packetId={p._id } onDeleted={load} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
