import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { packetServices } from '@/services/packet';
import { Package } from '@/types/packet';
import CreatePacket from './CreatePacket';
import EditPacket from './EditPacket';
import DeletePacket from './DeletePacket';

const PacketManagement: React.FC = () => {
  const [packets, setPackets] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

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
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Package — Quản lý gói dịch vụ</h2>
        <Button onClick={() => setShowCreate(true)}>Thêm gói</Button>
      </div>
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
    </div>
  );
};

export default PacketManagement;
