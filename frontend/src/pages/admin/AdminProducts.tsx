import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, CheckCircle2 } from 'lucide-react';
import { productsApi } from '../../services/api';
import { Category, Product } from '../../types';
import { formatPrice } from '../../components/common/ProductCard';
import toast from 'react-hot-toast';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    categoryId: '',
    images: '',
    stock: 10,
    isFeatured: false,
  });

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        productsApi.getAll({ limit: 100 }),
        productsApi.getCategories(),
      ]);
      setProducts(pRes.data.data.items || []);
      setCategories(cRes.data.data || []);
    } catch (error) {
      console.error('Lỗi tải sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      categoryId: categories[0]?._id || '',
      images: '',
      stock: 10,
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    const catId = typeof product.category === 'object' ? product.category._id : product.category;
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      categoryId: catId,
      images: product.images ? product.images.join('\n') : '',
      stock: product.stock,
      isFeatured: product.isFeatured || false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.error('Vui lòng điền đủ Tên, Giá và Danh mục');
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        categoryId: formData.categoryId,
        stock: Number(formData.stock),
        isFeatured: formData.isFeatured,
        images: formData.images
          ? formData.images.split('\n').map((url) => url.trim()).filter((url) => url.length > 0)
          : [],
      };

      if (editingProduct) {
        await productsApi.update(editingProduct._id, payload);
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        await productsApi.create(payload);
        toast.success('Thêm sản phẩm mới thành công!');
      }

      setIsModalOpen(false);
      fetchAll();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể lưu sản phẩm');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await productsApi.delete(id);
      toast.success('Đã xóa sản phẩm');
      fetchAll();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi xóa sản phẩm');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Quản Lý Sản Phẩm</h1>
          <p className="text-xs text-gray-500">Danh sách và thông tin các mặt hàng trong kho</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md shadow-emerald-600/20 transition flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Sản Phẩm</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm sản phẩm theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm outline-none bg-transparent"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold border-b border-gray-100">
              <tr>
                <th className="p-4">Hình ảnh</th>
                <th className="p-4">Tên sản phẩm</th>
                <th className="p-4">Danh mục</th>
                <th className="p-4">Giá bán</th>
                <th className="p-4">Kho</th>
                <th className="p-4">Nổi bật</th>
                <th className="p-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    Đang tải danh sách sản phẩm...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const catName = typeof p.category === 'object' ? p.category?.name : '';
                  const img = p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80';
                  return (
                    <tr key={p._id} className="hover:bg-gray-50/80 transition">
                      <td className="p-4">
                        <img src={img} alt={p.name} className="w-12 h-12 rounded-xl object-cover bg-gray-50" />
                      </td>
                      <td className="p-4 font-bold text-gray-900 max-w-xs truncate">{p.name}</td>
                      <td className="p-4 text-xs font-semibold text-emerald-700">
                        <span className="px-2.5 py-1 bg-emerald-50 rounded-md">{catName || 'N/A'}</span>
                      </td>
                      <td className="p-4 font-extrabold text-emerald-600">{formatPrice(p.price)}</td>
                      <td className="p-4 font-semibold text-gray-700">{p.stock}</td>
                      <td className="p-4">
                        {p.isFeatured ? (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold rounded">HOT</span>
                        ) : (
                          <span className="text-gray-300 text-xs">-</span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition"
                          title="Sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition"
                          title="Xóa"
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-lg text-gray-900">
                {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: iPhone 15 Pro Max 256GB"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Giá bán (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Giá gốc niêm yết (nếu có)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Danh mục *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Số lượng kho *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Link hình ảnh (mỗi dòng 1 URL)</label>
                <textarea
                  rows={2}
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Mô tả chi tiết sản phẩm *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Thông số, tính năng nổi bật, chế độ bảo hành..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="isFeatured" className="text-sm font-semibold text-gray-800">
                  Đánh dấu là Sản phẩm nổi bật (Hiển thị trang chủ)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20"
                >
                  {submitting ? 'Đang lưu...' : 'Lưu Sản Phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
