import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { usersApi } from '../services/api';
import {
  User,
  MapPin,
  CreditCard,
  Package,
  XCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Building,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { ImageUpload } from '../components/common/ImageUpload';
import toast from 'react-hot-toast';

export const Profile: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const { t } = useLanguageStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'address' | 'payment'>('profile');

  // Profile Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatar: user?.avatar || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Address Book State
  const [addresses, setAddresses] = useState<Array<{ id: string; name: string; phone: string; address: string; isDefault: boolean }>>([
    {
      id: '1',
      name: user?.name || 'Khách hàng',
      phone: user?.phone || '0987654321',
      address: user?.address || '111 Cầu Giấy, Quận Cầu Giấy, Hà Nội',
      isDefault: true,
    },
  ]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', phone: '', address: '', isDefault: false });

  // Payment Options State
  const [paymentCards, setPaymentCards] = useState<Array<{ id: string; cardHolder: string; cardNumber: string; expiry: string; isDefault: boolean }>>([
    {
      id: '1',
      cardHolder: (user?.name || 'KHACH HANG').toUpperCase(),
      cardNumber: '**** **** **** 8888',
      expiry: '12/28',
      isDefault: true,
    },
  ]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCard, setNewCard] = useState({ cardHolder: '', cardNumber: '', expiry: '', isDefault: false });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu mới không trùng khớp!');
      return;
    }

    try {
      setLoading(true);
      const payload: any = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        avatar: formData.avatar,
      };

      const res = await usersApi.updateProfile(payload);
      if (res.data.success) {
        setUser(res.data.data);
        setMessage('Cập nhật hồ sơ cá nhân thành công!');
        toast.success('Đã lưu thông tin hồ sơ!');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể cập nhật hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.address || !newAddress.phone) return;
    const added = {
      id: Date.now().toString(),
      name: newAddress.name || user?.name || '',
      phone: newAddress.phone,
      address: newAddress.address,
      isDefault: addresses.length === 0 || newAddress.isDefault,
    };
    if (added.isDefault) {
      setAddresses(addresses.map((a) => ({ ...a, isDefault: false })).concat(added));
    } else {
      setAddresses([...addresses, added]);
    }
    setIsAddingAddress(false);
    setNewAddress({ name: '', phone: '', address: '', isDefault: false });
    toast.success('Đã thêm địa chỉ giao hàng mới!');
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    toast.success('Đã xóa địa chỉ');
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
    toast.success('Đã đặt làm địa chỉ mặc định');
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.cardNumber || !newCard.expiry) return;
    const last4 = newCard.cardNumber.slice(-4) || '1234';
    const card = {
      id: Date.now().toString(),
      cardHolder: newCard.cardHolder.toUpperCase(),
      cardNumber: `**** **** **** ${last4}`,
      expiry: newCard.expiry,
      isDefault: paymentCards.length === 0 || newCard.isDefault,
    };
    if (card.isDefault) {
      setPaymentCards(paymentCards.map((c) => ({ ...c, isDefault: false })).concat(card));
    } else {
      setPaymentCards([...paymentCards, card]);
    }
    setIsAddingCard(false);
    setNewCard({ cardHolder: '', cardNumber: '', expiry: '', isDefault: false });
    toast.success('Đã liên kết phương thức thanh toán mới!');
  };

  const handleDeleteCard = (id: string) => {
    setPaymentCards(paymentCards.filter((c) => c.id !== id));
    toast.success('Đã xóa thẻ thanh toán');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins space-y-10">
      {/* Breadcrumb & Welcome Greeting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-black transition-colors">{t('nav.home')}</Link>
          <span>/</span>
          <span className="text-black font-medium">{t('nav.manageAccount')}</span>
        </nav>

        <p className="text-sm font-medium text-black">
          Xin chào! <span className="text-exclusive-red font-semibold">{user?.name}</span>
        </p>
      </div>

      {/* Main Grid: Sidebar (Left) & Dynamic Tab Content (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Sidebar Menu */}
        <div className="lg:col-span-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-black uppercase tracking-wider text-gray-400">
              Quản Lý Tài Khoản
            </h3>
            <ul className="space-y-1 text-sm">
              <li>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium transition-all text-left ${
                    activeTab === 'profile'
                      ? 'bg-exclusive-red text-white shadow-sm font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Hồ Sơ Của Tôi</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('address')}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium transition-all text-left ${
                    activeTab === 'address'
                      ? 'bg-exclusive-red text-white shadow-sm font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Sổ Địa Chỉ Giao Hàng</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium transition-all text-left ${
                    activeTab === 'payment'
                      ? 'bg-exclusive-red text-white shadow-sm font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Tùy Chọn Thanh Toán</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h3 className="font-bold text-sm text-black uppercase tracking-wider text-gray-400">
              Đơn Hàng & Mua Sắm
            </h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  to="/orders"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-black rounded-xl transition-all"
                >
                  <Package className="w-4 h-4 text-slate-500" />
                  <span>Đơn Hàng Của Tôi</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/cancellations"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
                >
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span>Đơn Hàng Đã Hủy</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/my-reviews"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-amber-600 hover:bg-amber-50 rounded-xl transition-all font-medium"
                >
                  <Star className="w-4 h-4 text-amber-500" />
                  <span>Đánh Giá Của Tôi</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-black rounded-xl transition-all"
                >
                  <Package className="w-4 h-4 text-rose-500" />
                  <span>Danh Sách Yêu Thích</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Tab Content */}
        <div className="lg:col-span-8 bg-white shadow-exclusive-sm border border-gray-100 rounded-2xl p-8 sm:p-10 space-y-6">
          
          {/* TAB 1: EDIT PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-slate-900 border-b border-gray-100 pb-3">
                Chỉnh Sửa Hồ Sơ Cá Nhân
              </h2>

              {message && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{message}</span>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <ImageUpload
                  label="Ảnh Đại Diện (Avatar)"
                  multiple={false}
                  value={formData.avatar}
                  onChange={(img) => setFormData({ ...formData, avatar: img as string })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700">Họ và Tên *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700">Địa chỉ Email</label>
                    <input
                      type="email"
                      disabled
                      value={formData.email}
                      className="w-full bg-gray-100 border border-gray-200 text-gray-400 rounded-lg px-4 py-2.5 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700">Số Điện Thoại</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700">Địa Chỉ Nhận Hàng</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* Password Changes */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="font-bold text-sm text-slate-900">Thay Đổi Mật Khẩu</h3>

                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Mật khẩu hiện tại"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                    />
                    <input
                      type="password"
                      placeholder="Mật khẩu mới"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                    />
                    <input
                      type="password"
                      placeholder="Xác nhận mật khẩu mới"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-bold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50"
                  >
                    {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: ADDRESS BOOK */}
          {activeTab === 'address' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Sổ Địa Chỉ Giao Hàng</h2>
                  <p className="text-xs text-gray-500">Quản lý các địa chỉ nhận hàng của bạn</p>
                </div>
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-xs font-bold rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Địa Chỉ</span>
                </button>
              </div>

              {/* Add Address Form Modal / Inline */}
              {isAddingAddress && (
                <form onSubmit={handleAddAddress} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 animate-fade-in">
                  <h3 className="font-bold text-sm text-slate-900">Thêm Địa Chỉ Nhận Hàng Mới</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Họ và tên người nhận *"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Số điện thoại nhận hàng *"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Địa chỉ chi tiết (Số nhà, Đường, Phường, Quận, Thành phố) *"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                      className="sm:col-span-2 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                        className="accent-exclusive-red rounded"
                      />
                      <span>Đặt làm địa chỉ mặc định</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="px-4 py-2 border border-slate-300 text-xs font-semibold rounded-lg hover:bg-white"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-exclusive-red text-white text-xs font-bold rounded-lg"
                      >
                        Lưu Địa Chỉ
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Address List */}
              <div className="space-y-4">
                {addresses.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{item.name}</span>
                        <span className="text-xs text-gray-400">|</span>
                        <span className="text-xs text-gray-600 font-semibold">{item.phone}</span>
                        {item.isDefault && (
                          <span className="px-2 py-0.5 bg-red-50 text-exclusive-red text-[10px] font-bold rounded-full border border-red-200">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.address}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {!item.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(item.id)}
                          className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition"
                        >
                          Thiết lập mặc định
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa địa chỉ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENT OPTIONS */}
          {activeTab === 'payment' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Tùy Chọn Thanh Toán</h2>
                  <p className="text-xs text-gray-500">Quản lý thẻ ngân hàng và phương thức thanh toán</p>
                </div>
                <button
                  onClick={() => setIsAddingCard(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-xs font-bold rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Thẻ Mới</span>
                </button>
              </div>

              {/* Add Card Form */}
              {isAddingCard && (
                <form onSubmit={handleAddCard} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 animate-fade-in">
                  <h3 className="font-bold text-sm text-slate-900">Liên Kết Thẻ Thanh Toán Mới</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Tên in trên thẻ (Ví dụ: NGUYEN VAN A) *"
                      value={newCard.cardHolder}
                      onChange={(e) => setNewCard({ ...newCard, cardHolder: e.target.value })}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Số thẻ (16 chữ số) *"
                      maxLength={19}
                      value={newCard.cardNumber}
                      onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Hạn thẻ (MM/YY) *"
                      maxLength={5}
                      value={newCard.expiry}
                      onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingCard(false)}
                      className="px-4 py-2 border border-slate-300 text-xs font-semibold rounded-lg hover:bg-white"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-exclusive-red text-white text-xs font-bold rounded-lg"
                    >
                      Lưu Thẻ
                    </button>
                  </div>
                </form>
              )}

              {/* Card List */}
              <div className="space-y-4">
                {paymentCards.map((card) => (
                  <div
                    key={card.id}
                    className="p-5 border border-slate-200 rounded-2xl flex items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-exclusive-red" />
                        <span className="font-mono text-sm tracking-widest">{card.cardNumber}</span>
                      </div>
                      <div className="flex items-center gap-6 text-xs text-slate-300">
                        <div>
                          <p className="text-[10px] text-slate-400">CHỦ THẺ</p>
                          <p className="font-semibold">{card.cardHolder}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400">HẾT HẠN</p>
                          <p className="font-semibold">{card.expiry}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition"
                      title="Xóa thẻ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Additional Payment Methods */}
                <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Building className="w-4 h-4 text-emerald-600" />
                    <span>Thanh toán COD & Chuyển khoản ngân hàng trực tiếp</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Bạn luôn có thể chọn thanh toán Tiền mặt khi nhận hàng (COD) hoặc Quét mã VietQR Techcombank trực tiếp ở bước Đặt hàng.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
