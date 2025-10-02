import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { packetServices } from '@/services/packetService';
import { Package } from '@/types/packet';
import { toast } from 'sonner';

const EditPacket: React.FC<{ packet: Package; onUpdated?: () => void }> = ({ packet, onUpdated }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Package>(packet);
  const [loading, setLoading] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const save = async () => {
    if (!packet._id) return;
    setLoading(true);
    try {
      await packetServices.updatePackage(packet._id, { name: form.name, description: form.description, price: form.price, duration: form.duration, unit: form.unit, features: form.features });
      toast.success('Cập nhật gói thành công');
      setEditing(false);
      onUpdated?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || 'Không thể cập nhật');
    } finally {
      setLoading(false);
    }
  };

  if (!editing) {
    return <Button onClick={() => setEditing(true)}>Sửa</Button>;
  }

  return (
    <div className="flex items-center space-x-2">
      <label className="sr-only" htmlFor={`edit-desc-${packet._id}`}>Mô tả</label>
      <input id={`edit-desc-${packet._id}`} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border rounded px-2 py-1" placeholder="Mô tả ngắn" />
      <label className="sr-only" htmlFor={`edit-name-${packet._id}`}>Tên</label>
      <input id={`edit-name-${packet._id}`} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border rounded px-2 py-1" placeholder="Tên gói" />
      <label className="sr-only" htmlFor={`edit-price-${packet._id}`}>Giá</label>
      <input id={`edit-price-${packet._id}`} type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="border rounded px-2 py-1" placeholder="Giá" />
      <div className="flex items-center space-x-2">
        <input placeholder="Thêm tính năng" value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); const v = featureInput.trim(); if (v && !form.features.includes(v)) setForm({ ...form, features: [...form.features, v] }); setFeatureInput(''); }
        }} className="border rounded px-2 py-1" />
        <Button onClick={() => { const v = featureInput.trim(); if (v && !form.features.includes(v)) setForm({ ...form, features: [...form.features, v] }); setFeatureInput(''); }}>Thêm</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {form.features?.map((f, i) => (
          <div key={i} className="px-2 py-1 bg-gray-100 rounded-full flex items-center space-x-2">
            <span className="text-sm">{f}</span>
            <button className="text-xs text-red-600" onClick={() => setForm({ ...form, features: form.features.filter((x) => x !== f) })}>×</button>
          </div>
        ))}
      </div>
      <Button onClick={save} disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</Button>
      <Button variant="ghost" onClick={() => setEditing(false)}>Hủy</Button>
    </div>
  );
};

export default EditPacket;
