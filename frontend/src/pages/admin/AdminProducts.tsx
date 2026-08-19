import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  X,
  Package,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi } from '../../services/api';
import { Category, Product } from '../../types';
import { formatPrice } from '../../components/common/ProductCard';
import { ImageUpload } from '../../components/common/ImageUpload';
import { useLanguageStore } from '../../store/useLanguageStore';
import { translateDynamic } from '../../i18n/translator';

export const AdminProducts: React.FC = () => {
  const { currentLanguage } = useLanguageStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');

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
    images: [] as string[],
    stock: 10,
    isFeatured: false,
  });

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productsApi.getAll({ limit: 100 }),
        productsApi.getCategories(),
      ]);
      setProducts(productsRes.data.data.items || []);
      setCategories(categoriesRes.data.data || []);
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
      images: [],
      stock: 10,
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    const catId = typeof product.category === 'object' ? product.category?._id : product.category;
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      categoryId: catId,
      images: product.images || [],
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
        images: formData.images,
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
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm');
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
      toast.error(error.response?.data?.message || 'Không thể xóa sản phẩm này');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const catId = typeof p.category === 'object' ? p.category?._id : p.category;
    const matchCat = selectedCat === 'ALL' || catId === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-8 font-poppins">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {translateDynamic('Quản Lý Sản Phẩm', currentLanguage)}
          </h1>
          <p className="text-sm text-slate-500">
            {translateDynamic('Quản lý kho hàng, giá niêm yết, thông tin chi tiết và album ảnh sản phẩm', currentLanguage)}
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{translateDynamic('Thêm Sản Phẩm Mới', currentLanguage)}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            placeholder={translateDynamic('Tìm kiếm...', currentLanguage)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-black"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-black"
          >
            <option value="ALL">{translateDynamic('Tất cả danh mục', currentLanguage)}</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {translateDynamic(c.name, currentLanguage)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">{translateDynamic('Hình ảnh', currentLanguage)}</th>
                <th className="p-4">{translateDynamic('Tên sản phẩm', currentLanguage)}</th>
                <th className="p-4">{translateDynamic('Danh mục', currentLanguage)}</th>
                <th className="p-4">{translateDynamic('Giá bán', currentLanguage)}</th>
                <th className="p-4">{translateDynamic('Tồn kho', currentLanguage)}</th>
                <th className="p-4">{translateDynamic('Nổi bật', currentLanguage)}</th>
                <th className="p-4 text-right">{translateDynamic('Thao Tác', currentLanguage)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    {translateDynamic('Đang tải dữ liệu...', currentLanguage)}
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    {translateDynamic('Không tìm thấy sản phẩm nào', currentLanguage)}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const catName = typeof p.category === 'object' ? p.category?.name : '';
                  const img = p.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=150&q=80';
                  return (
                    <tr key={p._id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <img src={img} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-slate-200" />
                      </td>
                      <td className="p-4 font-semibold text-slate-900 max-w-xs truncate">
                        {translateDynamic(p.name, currentLanguage)}
                      </td>
                      <td className="p-4 text-xs font-semibold text-slate-700">
                        <span className="px-2.5 py-1 bg-slate-100 rounded">
                          {translateDynamic(catName, currentLanguage) || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-exclusive-red">{formatPrice(p.price)}</td>
                      <td className="p-4 font-semibold text-slate-700">{p.stock}</td>
                      <td className="p-4">
                        {p.isFeatured ? (
                          <span className="px-2 py-0.5 bg-red-50 text-exclusive-red text-xs font-bold rounded">HOT</span>
                        ) : (
                          <span className="text-slate-300 text-xs">-</span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-slate-600 hover:text-exclusive-red hover:bg-red-50 rounded transition cursor-pointer"
                          title={translateDynamic('Chỉnh Sửa Sản Phẩm', currentLanguage)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-1.5 text-slate-600 hover:text-exclusive-red hover:bg-red-50 rounded transition cursor-pointer"
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
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">
                {editingProduct ? translateDynamic('Chỉnh Sửa Sản Phẩm', currentLanguage) : translateDynamic('Thêm Sản Phẩm Mới', currentLanguage)}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {translateDynamic('Tên sản phẩm', currentLanguage)} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Đầm Nữ Dạ Hội Lụa Satin Sang Trọng"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {translateDynamic('Giá bán', currentLanguage)} (VNĐ) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {translateDynamic('Giá niêm yết gốc', currentLanguage)}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {translateDynamic('Danh mục', currentLanguage)} *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {translateDynamic(c.name, currentLanguage)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {translateDynamic('Tồn kho', currentLanguage)} *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Enhanced Image Upload with Live Preview & File Picker */}
              <ImageUpload
                label={translateDynamic('Hình ảnh', currentLanguage)}
                multiple={true}
                maxFiles={6}
                value={formData.images}
                onChange={(images) => setFormData({ ...formData, images: images as string[] })}
              />

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {translateDynamic('Mô tả', currentLanguage)} *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Chất liệu vải, form dáng, bảng size, hướng dẫn giặt ủi..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 accent-exclusive-red rounded cursor-pointer"
                />
                <label htmlFor="isFeatured" className="text-sm font-semibold text-slate-800 cursor-pointer">
                  {translateDynamic('Nổi bật', currentLanguage)} (HOT)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                >
                  {translateDynamic('Hủy', currentLanguage)}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-sm font-bold rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? translateDynamic('Đang lưu...', currentLanguage) : translateDynamic('Lưu Thay Đổi', currentLanguage)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
