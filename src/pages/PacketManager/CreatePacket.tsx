import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { packetServices } from '@/services/packetService';
import { toast } from 'sonner';
import { CreatePackageDTO } from '@/types/packet';

const CreatePacket: React.FC<{ onCreated?: () => void }> = ({ onCreated }) => {
  const [form, setForm] = useState<CreatePackageDTO>({ name: '', description: '', price: 0, duration: 7, unit: 'day', features: [] });
  const [featureInput, setFeatureInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const handleCreate = async () => {
    setLoading(true);
    try {
  const body: CreatePackageDTO = { ...form, features: form.features };
      await packetServices.createPackage(body);
      toast.success('Tạo gói dịch vụ thành công');
      onCreated?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || 'Không thể tạo gói dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo gói dịch vụ</CardTitle>
        <CardDescription>Thêm gói dịch vụ mới (chỉ admin)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Tên gói</label>
            <input aria-label="Tên gói" placeholder="Tên gói" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
            {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium">Giá</label>
            <input aria-label="Giá" type="number" placeholder="Giá" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="mt-1 w-full border rounded px-3 py-2" />
            {errors.price && <div className="text-red-600 text-sm mt-1">{errors.price}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium">Thời lượng</label>
            <input aria-label="Thời lượng" type="number" placeholder="Thời lượng" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} className="mt-1 w-full border rounded px-3 py-2" />
            {errors.duration && <div className="text-red-600 text-sm mt-1">{errors.duration}</div>}
          </div>

          <div>
            <label className="sr-only" htmlFor="create-unit">Đơn vị</label>
            <select id="create-unit" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value as any })} className="mt-1 w-full border rounded px-3 py-2">
              <option value="day">Ngày</option>
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </select>
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-medium">Mô tả</label>
            <textarea aria-label="Mô tả" placeholder="Mô tả ngắn về gói" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" rows={3} />

            <label className="block text-sm font-medium mt-3">Tính năng (thêm từng mục)</label>
            <div className="flex items-center space-x-2 mt-1">
              <input aria-label="Thêm tính năng" placeholder="Thêm tính năng" value={featureInput} onChange={e => setFeatureInput(e.target.value)} className="flex-1 border rounded px-3 py-2" onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  const v = featureInput.trim();
                  if (v && !form.features.includes(v)) setForm({ ...form, features: [...form.features, v] });
                  setFeatureInput('');
                }
              }} />
              <Button onClick={() => {
                const v = featureInput.trim();
                if (v && !form.features.includes(v)) setForm({ ...form, features: [...form.features, v] });
                setFeatureInput('');
              }}>Thêm</Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.features.map((f, i) => (
                <div key={i} className="px-2 py-1 bg-gray-100 rounded-full flex items-center space-x-2">
                  <span className="text-sm">{f}</span>
                  <button className="text-xs text-red-600" onClick={() => setForm({ ...form, features: form.features.filter((x) => x !== f) })} aria-label={`Xóa tính năng ${f}`}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Button onClick={handleCreate} disabled={loading}>{loading ? 'Đang tạo...' : 'Tạo gói'}</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePacket;
