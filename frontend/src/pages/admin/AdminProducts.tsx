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
  Palette,
  Ruler,
  Layers,
  AlertTriangle,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi } from '../../services/api';
import { Category, Product } from '../../types';
import { formatPrice } from '../../components/common/ProductCard';
import { ImageUpload } from '../../components/common/ImageUpload';
import { useLanguageStore } from '../../store/useLanguageStore';
import { translateDynamic } from '../../i18n/translator';

const FASHION_COLOR_PRESETS = [
  'Đen',
  'Trắng',
  'Đỏ Ruby',
  'Xanh Navy',
  'Xám Khói',
  'Be Sữa',
  'Hồng Pastel',
  'Vàng Gold',
  'Nâu Tây',
  'Xanh Rêu',
  'Nâu Camel',
  'Vàng Champagne',
  'Xanh Vintage',
  'Đỏ Rượu',
];

const CLOTHING_SIZE_PRESETS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FreeSize'];
const JEANS_SIZE_PRESETS = ['28', '29', '30', '31', '32', '33', '34', '36'];
const SHOES_SIZE_PRESETS = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];

const MATERIAL_PRESETS = [
  'Lụa Satin Ý',
  'Tuyết mưa cao cấp',
  'Cotton Pique',
  'Cotton Oxford',
  'Denim Cotton Spandex',
  'Dạ ép lông cừu',
  'Da bò thật',
  'Da PU cao cấp',
  'Voan tơ lụa',
  'Nỉ bông 380gsm',
  'Đũi tơ tự nhiên',
];

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

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    categoryId: '',
    images: [] as string[],
    stock: 10,
    isFeatured: false,
    selectedColors: [] as string[],
    selectedSizes: [] as string[],
    material: '',
  });

  const [customColorInput, setCustomColorInput] = useState('');
  const [customSizeInput, setCustomSizeInput] = useState('');

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
      stock: 20,
      isFeatured: false,
      selectedColors: ['Đen', 'Trắng'],
      selectedSizes: ['S', 'M', 'L'],
      material: 'Cotton cao cấp',
    });
    setCustomColorInput('');
    setCustomSizeInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    const catId = typeof product.category === 'object' ? product.category?._id : product.category;

    // Parse existing colors & sizes from attributes
    const attrs = product.attributes || {};
    const rawColors = attrs.MauSac || attrs.color || attrs.colors || '';
    const colorsArray = typeof rawColors === 'string'
      ? rawColors.split(',').map((c) => c.trim()).filter(Boolean)
      : Array.isArray(rawColors) ? rawColors : [];

    const rawSizes = attrs.Size || attrs.size || attrs.sizes || '';
    const sizesArray = typeof rawSizes === 'string'
      ? rawSizes.split(',').map((s) => s.trim()).filter(Boolean)
      : Array.isArray(rawSizes) ? rawSizes : [];

    const rawMaterial = attrs.ChatLieu || attrs.material || '';

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      categoryId: catId || categories[0]?._id || '',
      images: product.images || [],
      stock: product.stock ?? 10,
      isFeatured: product.isFeatured || false,
      selectedColors: colorsArray.length > 0 ? colorsArray : ['Đen'],
      selectedSizes: sizesArray.length > 0 ? sizesArray : ['M'],
      material: String(rawMaterial),
    });
    setCustomColorInput('');
    setCustomSizeInput('');
    setIsModalOpen(true);
  };

  const handleToggleColor = (color: string) => {
    if (formData.selectedColors.includes(color)) {
      setFormData({
        ...formData,
        selectedColors: formData.selectedColors.filter((c) => c !== color),
      });
    } else {
      setFormData({
        ...formData,
        selectedColors: [...formData.selectedColors, color],
      });
    }
  };

  const handleAddCustomColor = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const color = customColorInput.trim();
    if (!color) return;
    if (!formData.selectedColors.includes(color)) {
      setFormData({
        ...formData,
        selectedColors: [...formData.selectedColors, color],
      });
    }
    setCustomColorInput('');
  };

  const handleToggleSize = (size: string) => {
    if (formData.selectedSizes.includes(size)) {
      setFormData({
        ...formData,
        selectedSizes: formData.selectedSizes.filter((s) => s !== size),
      });
    } else {
      setFormData({
        ...formData,
        selectedSizes: [...formData.selectedSizes, size],
      });
    }
  };

  const handleAddCustomSize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const size = customSizeInput.trim();
    if (!size) return;
    if (!formData.selectedSizes.includes(size)) {
      setFormData({
        ...formData,
        selectedSizes: [...formData.selectedSizes, size],
      });
    }
    setCustomSizeInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.error('Vui lòng điền đủ Tên, Giá và Danh mục');
      return;
    }

    setSubmitting(true);
    try {
      const attributes: Record<string, any> = {};
      if (formData.selectedColors.length > 0) {
        attributes.MauSac = formData.selectedColors.join(', ');
      }
      if (formData.selectedSizes.length > 0) {
        attributes.Size = formData.selectedSizes.join(', ');
      }
      if (formData.material.trim()) {
        attributes.ChatLieu = formData.material.trim();
      }

      const payload: any = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        categoryId: formData.categoryId,
        stock: Number(formData.stock),
        isFeatured: formData.isFeatured,
        images: formData.images,
        attributes,
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

  const getStockBadge = (stock: number) => {
    if (stock <= 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
          <AlertTriangle className="w-3 h-3" /> Hết hàng (0)
        </span>
      );
    }
    if (stock <= 5) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
          <AlertTriangle className="w-3 h-3" /> Sắp hết ({stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
        <Check className="w-3 h-3" /> Còn hàng ({stock})
      </span>
    );
  };

  return (
    <div className="space-y-8 font-poppins">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {translateDynamic('Quản Lý Sản Phẩm & Kho Hàng', currentLanguage)}
          </h1>
          <p className="text-sm text-slate-500">
            {translateDynamic('Cấu hình chi tiết Màu sắc, Bảng Size, Tồn kho, Giá bán và Ảnh mẫu sản phẩm', currentLanguage)}
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>{translateDynamic('Thêm Sản Phẩm Mới', currentLanguage)}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            placeholder={translateDynamic('Tìm kiếm sản phẩm theo tên...', currentLanguage)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-black focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-black font-medium"
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">{translateDynamic('Hình ảnh', currentLanguage)}</th>
                <th className="p-4">{translateDynamic('Tên sản phẩm', currentLanguage)}</th>
                <th className="p-4">{translateDynamic('Danh mục', currentLanguage)}</th>
                <th className="p-4">{translateDynamic('Màu & Size', currentLanguage)}</th>
                <th className="p-4">{translateDynamic('Giá bán', currentLanguage)}</th>
                <th className="p-4">{translateDynamic('Kho hàng', currentLanguage)}</th>
                <th className="p-4">{translateDynamic('Nổi bật', currentLanguage)}</th>
                <th className="p-4 text-right">{translateDynamic('Thao Tác', currentLanguage)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    {translateDynamic('Đang tải dữ liệu...', currentLanguage)}
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    {translateDynamic('Không tìm thấy sản phẩm nào', currentLanguage)}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const catName = typeof p.category === 'object' ? p.category?.name : '';
                  const img = p.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=150&q=80';
                  const colors = p.attributes?.MauSac || p.attributes?.color || '';
                  const sizes = p.attributes?.Size || p.attributes?.size || '';

                  return (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4">
                        <img
                          src={img}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-200"
                        />
                      </td>
                      <td className="p-4 font-semibold text-slate-900 max-w-xs">
                        <span className="line-clamp-2">{translateDynamic(p.name, currentLanguage)}</span>
                      </td>
                      <td className="p-4 text-xs font-semibold text-slate-700">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg">
                          {translateDynamic(catName, currentLanguage) || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4 text-xs space-y-1">
                        {colors && (
                          <div className="flex items-center gap-1 text-slate-700">
                            <span className="font-semibold text-slate-500">Màu:</span>
                            <span className="line-clamp-1">{colors}</span>
                          </div>
                        )}
                        {sizes && (
                          <div className="flex items-center gap-1 text-slate-700">
                            <span className="font-semibold text-slate-500">Size:</span>
                            <span className="line-clamp-1">{sizes}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-exclusive-red text-sm block">
                          {formatPrice(p.price)}
                        </span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatPrice(p.originalPrice)}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {getStockBadge(p.stock ?? 0)}
                      </td>
                      <td className="p-4">
                        {p.isFeatured ? (
                          <span className="px-2.5 py-1 bg-red-50 text-exclusive-red text-xs font-bold rounded-lg">HOT</span>
                        ) : (
                          <span className="text-slate-300 text-xs">-</span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 text-slate-600 hover:text-exclusive-red hover:bg-red-50 rounded-xl transition cursor-pointer"
                          title={translateDynamic('Chỉnh Sửa Sản Phẩm', currentLanguage)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-2 text-slate-600 hover:text-exclusive-red hover:bg-red-50 rounded-xl transition cursor-pointer"
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

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-xl text-slate-900">
                  {editingProduct ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Thiết lập đầy đủ màu sắc, kích thước size và số lượng tồn kho
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-black hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {translateDynamic('Tên sản phẩm', currentLanguage)} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Đầm Nữ Dạ Hội Dáng Xòe Lụa Satin Sang Trọng"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-exclusive-red focus:ring-1 focus:ring-exclusive-red"
                />
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {translateDynamic('Giá bán khuyến mãi', currentLanguage)} (VNĐ) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-exclusive-red focus:outline-none focus:border-exclusive-red"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {translateDynamic('Giá niêm yết gốc (Gạch chân)', currentLanguage)} (VNĐ)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-exclusive-red text-slate-500"
                  />
                </div>
              </div>

              {/* Category & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {translateDynamic('Danh mục thời trang', currentLanguage)} *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-exclusive-red font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.parentId ? `↳ ${c.name}` : `📁 ${c.name}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      {translateDynamic('Số lượng tồn kho', currentLanguage)} *
                    </label>
                    <span className="text-xs font-bold">
                      {formData.stock <= 0 ? (
                        <span className="text-red-500">Hết hàng</span>
                      ) : formData.stock <= 5 ? (
                        <span className="text-amber-500">Sắp hết hàng ({formData.stock})</span>
                      ) : (
                        <span className="text-emerald-600">Còn hàng dồi dào ({formData.stock})</span>
                      )}
                    </span>
                  </div>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-exclusive-red"
                  />
                </div>
              </div>

              {/* COLOR SELECTION SECTION */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-exclusive-red" />
                    <span>Màu Sắc Sản Phẩm ({formData.selectedColors.length} màu đã chọn)</span>
                  </label>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {FASHION_COLOR_PRESETS.map((color) => {
                    const isSelected = formData.selectedColors.includes(color);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleToggleColor(color)}
                        className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                          isSelected
                            ? 'bg-exclusive-red text-white font-bold shadow-sm'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {color}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customColorInput}
                    onChange={(e) => setCustomColorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomColor();
                      }
                    }}
                    placeholder="Nhập màu tùy chỉnh (ví dụ: Xanh Rêu Phối Trắng, Nâu Sáp...)"
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-exclusive-red"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCustomColor()}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    + Thêm màu
                  </button>
                </div>

                {/* Selected Colors Tag List */}
                {formData.selectedColors.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.selectedColors.map((color) => (
                      <span
                        key={color}
                        className="inline-flex items-center gap-1 text-xs bg-red-50 text-exclusive-red border border-red-200 px-2.5 py-0.5 rounded-md font-semibold"
                      >
                        {color}
                        <button
                          type="button"
                          onClick={() => handleToggleColor(color)}
                          className="hover:text-black ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* SIZE SELECTION SECTION */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Ruler className="w-4 h-4 text-exclusive-red" />
                    <span>Kích Cỡ Size ({formData.selectedSizes.length} size đã chọn)</span>
                  </label>
                </div>

                {/* Preset Groups */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-500 font-semibold uppercase">Size Quần Áo:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {CLOTHING_SIZE_PRESETS.map((sz) => {
                        const isSelected = formData.selectedSizes.includes(sz);
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => handleToggleSize(sz)}
                            className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
                              isSelected
                                ? 'bg-exclusive-red text-white font-bold'
                                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-500 font-semibold uppercase">Size Quần Jeans / Kaki:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {JEANS_SIZE_PRESETS.map((sz) => {
                        const isSelected = formData.selectedSizes.includes(sz);
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => handleToggleSize(sz)}
                            className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
                              isSelected
                                ? 'bg-exclusive-red text-white font-bold'
                                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-500 font-semibold uppercase">Size Giày & Boots:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {SHOES_SIZE_PRESETS.map((sz) => {
                        const isSelected = formData.selectedSizes.includes(sz);
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => handleToggleSize(sz)}
                            className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
                              isSelected
                                ? 'bg-exclusive-red text-white font-bold'
                                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Custom Size Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSize();
                      }
                    }}
                    placeholder="Nhập kích cỡ khác (ví dụ: 22cm x 15cm, Dài 120cm...)"
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-exclusive-red"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCustomSize()}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    + Thêm size
                  </button>
                </div>
              </div>

              {/* Material (Chất liệu) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-exclusive-red" />
                  <span>Chất Liệu Vải / Da</span>
                </label>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {MATERIAL_PRESETS.map((mat) => (
                    <button
                      key={mat}
                      type="button"
                      onClick={() => setFormData({ ...formData, material: mat })}
                      className={`text-xs px-2.5 py-0.5 rounded-md transition-colors ${
                        formData.material === mat
                          ? 'bg-slate-900 text-white font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="Ví dụ: Lụa Satin Ý cao cấp, Dạ ép lông cừu..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-exclusive-red focus:bg-white"
                />
              </div>

              {/* Enhanced Image Upload */}
              <ImageUpload
                label={translateDynamic('Hình ảnh sản phẩm (Tối đa 6 ảnh)', currentLanguage)}
                multiple={true}
                maxFiles={6}
                value={formData.images}
                onChange={(images) => setFormData({ ...formData, images: images as string[] })}
              />

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {translateDynamic('Mô tả chi tiết sản phẩm', currentLanguage)} *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Đặc điểm thiết kế, chất liệu, form dáng, cách phối đồ, hướng dẫn giặt ủi..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-exclusive-red resize-none"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 accent-exclusive-red rounded cursor-pointer"
                />
                <label htmlFor="isFeatured" className="text-sm font-bold text-slate-800 cursor-pointer">
                  {translateDynamic('Đánh dấu là sản phẩm Nổi Bật (HOT)', currentLanguage)}
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  {translateDynamic('Hủy', currentLanguage)}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-sm font-bold rounded-xl shadow-md shadow-exclusive-red/20 transition disabled:opacity-50 cursor-pointer"
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
