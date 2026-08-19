import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Edit2, CheckCircle2, AlertCircle, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { translateDynamic } from '../../i18n/translator';

interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minOrderValue: number;
  expiryDate: string;
  isActive: boolean;
  usageCount: number;
}

export const AdminCoupons: React.FC = () => {
  const { currentLanguage } = useLanguageStore();
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('ashashop_coupons');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: '1', code: 'EXCLUSIVE10', discountPercent: 10, minOrderValue: 0, expiryDate: '2026-12-31', isActive: true, usageCount: 42 },
      { id: '2', code: 'ASHASHOP', discountPercent: 15, minOrderValue: 1000000, expiryDate: '2026-10-30', isActive: true, usageCount: 18 },
      { id: '3', code: 'SUMMER50', discountPercent: 50, minOrderValue: 5000000, expiryDate: '2026-09-01', isActive: false, usageCount: 89 },
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    discountPercent: 10,
    minOrderValue: 0,
    expiryDate: '2026-12-31',
    isActive: true,
  });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    localStorage.setItem('ashashop_coupons', JSON.stringify(coupons));
  }, [coupons]);

  const handleOpenModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        minOrderValue: coupon.minOrderValue,
        expiryDate: coupon.expiryDate,
        isActive: coupon.isActive,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        discountPercent: 10,
        minOrderValue: 0,
        expiryDate: '2026-12-31',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleToggleActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleDelete = (id: string, code: string) => {
    if (!confirm(`Bạn có chắc muốn xóa mã giảm giá "${code}"?`)) return;
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    setSuccess(`Đã xóa mã ${code} thành công.`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    if (editingCoupon) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingCoupon.id
            ? { ...c, ...formData, code: formData.code.toUpperCase() }
            : c
        )
      );
      setSuccess('Cập nhật mã giảm giá thành công!');
    } else {
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        code: formData.code.toUpperCase(),
        discountPercent: Number(formData.discountPercent),
        minOrderValue: Number(formData.minOrderValue),
        expiryDate: formData.expiryDate,
        isActive: formData.isActive,
        usageCount: 0,
      };
      setCoupons((prev) => [newCoupon, ...prev]);
      setSuccess('Tạo mã giảm giá mới thành công!');
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-6 font-poppins">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Tag className="w-6 h-6 text-exclusive-red" />
            <span>{translateDynamic('Mã Khuyến Mãi (Coupons)', currentLanguage)}</span>
          </h1>
          <p className="text-sm text-slate-500">
            {translateDynamic('Tạo và quản lý các mã voucher, khuyến mãi chiết khấu cho khách hàng', currentLanguage) || 'Manage discount coupons and vouchers'}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{translateDynamic('Tạo Mã Mới', currentLanguage) || 'Create Coupon'}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3.5 px-4">{translateDynamic('Mã Coupon', currentLanguage) || 'Code'}</th>
                <th className="py-3.5 px-4">{translateDynamic('% Giảm Giá', currentLanguage) || 'Discount'}</th>
                <th className="py-3.5 px-4">{translateDynamic('Đơn Hàng Tối Thiểu', currentLanguage) || 'Min Order'}</th>
                <th className="py-3.5 px-4">{translateDynamic('Hạn Sử Dụng', currentLanguage) || 'Expiry'}</th>
                <th className="py-3.5 px-4">{translateDynamic('Lượt Đã Dùng', currentLanguage) || 'Used'}</th>
                <th className="py-3.5 px-4">{translateDynamic('Trạng Thái', currentLanguage)}</th>
                <th className="py-3.5 px-4 text-right">{translateDynamic('Thao Tác', currentLanguage)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-exclusive-red" />
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
                        {c.code}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-exclusive-red">-{c.discountPercent}%</td>
                  <td className="py-3.5 px-4 text-slate-600">{formatCurrency(c.minOrderValue)}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">{c.expiryDate}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{c.usageCount}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(c.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                        c.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      <span>{c.isActive ? translateDynamic('Đang Hoạt Động', currentLanguage) || 'Active' : translateDynamic('Đã Tắt', currentLanguage) || 'Inactive'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(c)}
                      className="p-1.5 text-slate-600 hover:text-exclusive-red hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Sửa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.code)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingCoupon ? translateDynamic('Chỉnh Sửa Mã Giảm Giá', currentLanguage) || 'Edit Coupon' : translateDynamic('Tạo Mã Giảm Giá Mới', currentLanguage) || 'Create Coupon'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  {translateDynamic('Mã Code', currentLanguage) || 'Coupon Code'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="VD: EXCLUSIVE10"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    {translateDynamic('% Giảm Giá', currentLanguage) || 'Discount %'} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    required
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    {translateDynamic('Hạn Sử Dụng', currentLanguage) || 'Expiry Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  {translateDynamic('Đơn Hàng Tối Thiểu', currentLanguage) || 'Min Order Value'} (VNĐ)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  value={formData.minOrderValue}
                  onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="couponActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-exclusive-red rounded cursor-pointer"
                />
                <label htmlFor="couponActive" className="text-sm text-slate-700 cursor-pointer font-medium">
                  {translateDynamic('Kích hoạt mã giảm giá này ngay lập tức', currentLanguage) || 'Activate coupon immediately'}
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                >
                  {translateDynamic('Hủy', currentLanguage)}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-sm font-bold rounded-lg shadow-sm transition cursor-pointer"
                >
                  {translateDynamic('Lưu Thay Đổi', currentLanguage)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
