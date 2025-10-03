import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { packetServices } from '@/services/packetService';
import { Package } from '@/types/packet';
import { toast } from 'sonner';
import { TbEdit, TbX } from 'react-icons/tb';

const EditPacket: React.FC<{ packet: Package; onUpdated?: () => void }> = ({ packet, onUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<Package>(packet);
  const [loading, setLoading] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const openModal = () => {
    setForm(packet);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setForm(packet);
    setFeatureInput('');
    setErrors({});
  };

  const validate = () => {
    const newErrors: { [k: string]: string } = {};
    if (!form.name?.trim()) newErrors.name = 'Tên gói là bắt buộc';
    if (!form.description?.trim()) newErrors.description = 'Mô tả là bắt buộc';
    if (!form.price || form.price <= 0) newErrors.price = 'Giá phải lớn hơn 0';
    if (!form.duration || form.duration <= 0) newErrors.duration = 'Thời lượng phải lớn hơn 0';
    if (!form.unit?.trim()) newErrors.unit = 'Đơn vị là bắt buộc';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const save = async () => {
    if (!validate() || !packet._id) return;

    setLoading(true);
    try {
      await packetServices.updatePackage(packet._id, {
        name: form.name,
        description: form.description,
        price: form.price,
        duration: form.duration,
        unit: form.unit,
        features: form.features
      });
      toast.success('Cập nhật gói thành công');
      closeModal();
      onUpdated?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || 'Không thể cập nhật');
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    const v = featureInput.trim();
    if (v && !form.features?.includes(v)) {
      setForm({ ...form, features: [...(form.features || []), v] });
      setFeatureInput('');
    }
  };

  const removeFeature = (feature: string) => {
    setForm({
      ...form,
      features: form.features?.filter(f => f !== feature) || []
    });
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={openModal}
        className="p-2 h-8 w-8"
        title="Chỉnh sửa gói"
      >
        <TbEdit className="w-4 h-4" />
      </Button>      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa gói dịch vụ</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Đóng"
              >
                <TbX className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Form Content */}
            <div className="space-y-4">
              {/* Package Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên gói <span className="text-red-500">*</span>
                </label>
                <Input
                  value={form.name || ''}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Nhập tên gói"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description || ''}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Nhập mô tả gói"
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Price and Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={form.price || ''}
                    onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                    placeholder="0"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời lượng <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={form.duration || ''}
                      onChange={e => setForm({ ...form, duration: Number(e.target.value) })}
                      placeholder="1"
                      className={errors.duration ? 'border-red-500' : ''}
                    />
                    <select
                      value={form.unit || 'month'}
                      onChange={e => setForm({ ...form, unit: e.target.value })}
                      className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.unit ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="day">Ngày</option>
                      <option value="month">Tháng</option>
                      <option value="year">Năm</option>
                    </select>
                  </div>
                  {(errors.duration || errors.unit) && (
                    <p className="text-red-500 text-sm mt-1">{errors.duration || errors.unit}</p>
                  )}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tính năng
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                    placeholder="Nhập tính năng"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addFeature} variant="outline">
                    Thêm
                  </Button>
                </div>

                {form.features && form.features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.features.map((feature, index) => (
                      <div
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-1 text-sm"
                      >
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <Button variant="outline" onClick={closeModal} disabled={loading}>
                Hủy
              </Button>
              <Button onClick={save} disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditPacket;
