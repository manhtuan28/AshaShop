import React, { useEffect, useState } from 'react';
import { User, Shield, ShieldCheck, UserCheck, Trash2, Search, Plus, Mail, Phone, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { usersApi } from '../../services/api';
import { User as UserType } from '../../types';
import { useLanguageStore } from '../../store/useLanguageStore';
import toast from 'react-hot-toast';

export const AdminUsers: React.FC = () => {
  const { t } = useLanguageStore();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer' as 'admin' | 'customer',
    phone: '',
    address: '',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await usersApi.getAll();
      if (res.data?.success && Array.isArray(res.data.data)) {
        setUsers(res.data.data);
      } else if (Array.isArray(res.data)) {
        setUsers(res.data as any);
      }
    } catch (err: any) {
      console.error('Lỗi tải danh sách người dùng:', err);
      toast.error(err.response?.data?.message || 'Không thể tải danh sách người dùng từ CSDL');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Vui lòng điền đủ Tên, Email và Mật khẩu');
      return;
    }

    setSubmitting(true);
    try {
      await usersApi.create(formData);
      toast.success('Tạo người dùng mới thành công!');
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'customer', phone: '', address: '' });
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể tạo người dùng mới');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleRole = async (user: UserType) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    if (!confirm(`Bạn có chắc chắn muốn chuyển vai trò của "${user.name}" thành "${newRole.toUpperCase()}"?`)) return;

    try {
      await usersApi.update(user._id, { role: newRole });
      toast.success(`Đã chuyển vai trò của ${user.name} thành ${newRole.toUpperCase()}`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể cập nhật quyền người dùng.');
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa tài khoản "${name}" khỏi hệ thống CSDL?`)) return;
    try {
      await usersApi.delete(id);
      toast.success(`Đã xóa người dùng "${name}"`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể xóa tài khoản này.');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminCount = users.filter(u => u.role === 'admin').length;
  const customerCount = users.filter(u => u.role === 'customer').length;

  return (
    <div className="space-y-6 font-poppins animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-exclusive-red" />
            <span>Quản Lý Người Dùng & Phân Quyền</span>
          </h1>
          <p className="text-sm text-slate-500">Quản lý tài khoản khách hàng, phân quyền Quản Trị Viên (Admin) và bảo mật hệ thống CSDL</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Tài Khoản Mới</span>
        </button>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Tài Khoản</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{users.length}</p>
          </div>
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
            <User className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quản Trị Viên (Admin)</p>
            <p className="text-2xl font-extrabold text-exclusive-red mt-1">{adminCount}</p>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-exclusive-red">
            <Shield className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Khách Hàng (Customer)</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{customerCount}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm người dùng theo Tên, Email hoặc Số điện thoại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm outline-none bg-transparent"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3.5 px-4">Người Dùng</th>
                <th className="py-3.5 px-4">Email Liên Hệ</th>
                <th className="py-3.5 px-4">Số Điện Thoại</th>
                <th className="py-3.5 px-4">Địa Chỉ</th>
                <th className="py-3.5 px-4">Vai Trò & Quyền</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Đang tải danh sách tài khoản từ CSDL...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Chưa có tài khoản nào phù hợp.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isAdmin = u.role === 'admin';
                  return (
                    <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {u.avatar ? (
                            <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                              {u.name?.charAt(0) || 'U'}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900">{u.name}</p>
                            <p className="text-[11px] text-slate-400">ID: {u._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{u.email}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {u.phone ? (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{u.phone}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Chưa cập nhật</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {u.address || <span className="text-slate-400 text-xs">Chưa cập nhật</span>}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleRole(u)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm ${
                            isAdmin
                              ? 'bg-red-50 text-exclusive-red border border-red-200 hover:bg-red-100'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          }`}
                          title="Bấm để chuyển đổi vai trò Admin / Customer"
                        >
                          {isAdmin ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                          <span>{isAdmin ? 'Quản Trị Viên' : 'Khách Hàng'}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa người dùng"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-exclusive-red" />
                <span>Thêm Tài Khoản Mới</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Họ và Tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email Đăng Nhập *</label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Mật Khẩu *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Vai Trò Phân Quyền</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black bg-slate-50"
                  >
                    <option value="customer">Khách Hàng (Customer)</option>
                    <option value="admin">Quản Trị Viên (Admin)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Số Điện Thoại</label>
                  <input
                    type="text"
                    placeholder="0901234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Địa Chỉ Giao Hàng</label>
                <input
                  type="text"
                  placeholder="Số nhà, Tên đường, Quận/Huyện..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-sm font-semibold rounded-lg shadow-sm"
                >
                  {submitting ? 'Đang tạo...' : 'Tạo Tài Khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
