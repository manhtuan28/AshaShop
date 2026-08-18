import React, { useState } from 'react';
import { User, Phone, MapPin, KeyRound, Save, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { usersApi } from '../services/api';
import toast from 'react-hot-toast';

export const Profile: React.FC = () => {
  const { user, setUser } = useAuthStore();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatar: user?.avatar || '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatePayload: any = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        avatar: formData.avatar,
      };
      if (formData.password) {
        updatePayload.password = formData.password;
      }

      const res = await usersApi.updateProfile(updatePayload);
      setUser(res.data.data);
      toast.success('Cập nhật thông tin thành công!');
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể cập nhật hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Hồ Sơ Cá Nhân
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Quản lý thông tin tài khoản và địa chỉ giao hàng của bạn
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
            <img
              src={formData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={formData.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
            />
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-gray-900">{user?.name}</h3>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md uppercase">
                <ShieldCheck className="w-3.5 h-3.5" /> {user?.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" /> Họ và tên
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> Số điện thoại
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Chưa cập nhật"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Địa chỉ giao hàng mặc định
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Nhập địa chỉ nhà riêng hoặc văn phòng"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Link ảnh đại diện (Avatar URL)</label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-1">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" /> Đổi mật khẩu mới (bỏ trống nếu không đổi)
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Nhập mật khẩu mới từ 6 ký tự..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
