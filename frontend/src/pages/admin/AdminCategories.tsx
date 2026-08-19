import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, FolderPlus, Search, CheckCircle2, AlertCircle, CornerDownRight, FolderTree, X } from 'lucide-react';
import { productsApi } from '../../services/api';
import { Category } from '../../types';
import { ImageUpload } from '../../components/common/ImageUpload';
import { useLanguageStore } from '../../store/useLanguageStore';
import { translateDynamic } from '../../i18n/translator';
import toast from 'react-hot-toast';

export const AdminCategories: React.FC = () => {
  const { currentLanguage } = useLanguageStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parentId: '' as string | null,
  });
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await productsApi.getCategories();
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        image: cat.image || '',
        parentId: cat.parentId || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', slug: '', description: '', image: '', parentId: '' });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    setFormData({ ...formData, name, slug: editingCategory ? formData.slug : slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        image: formData.image,
        parentId: formData.parentId ? formData.parentId : null,
      };

      if (editingCategory) {
        await productsApi.updateCategory(editingCategory._id, payload);
        toast.success('Cập nhật danh mục thành công!');
      } else {
        await productsApi.createCategory(payload);
        toast.success('Tạo danh mục mới thành công!');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu danh mục.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}" không?`)) return;
    try {
      await productsApi.deleteCategory(id);
      toast.success(`Đã xóa danh mục "${name}"`);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể xóa danh mục này.');
    }
  };

  // Get parent categories for selection (excluding current editing category)
  const parentCandidates = categories.filter(c => !c.parentId && (!editingCategory || c._id !== editingCategory._id));

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-poppins">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-exclusive-red" />
            <span>{translateDynamic('Quản Lý Danh Mục', currentLanguage)}</span>
          </h1>
          <p className="text-sm text-slate-500">
            {translateDynamic('Quản lý phân cấp danh mục chính (Parent) và danh mục con (Subcategories) hiển thị trên website', currentLanguage)}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{translateDynamic('Thêm Danh Mục Mới', currentLanguage)}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder={translateDynamic('Tìm kiếm...', currentLanguage)}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm outline-none bg-transparent"
        />
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3.5 px-4">{translateDynamic('Hình ảnh', currentLanguage)}</th>
                <th className="py-3.5 px-4">{translateDynamic('Danh mục', currentLanguage)}</th>
                <th className="py-3.5 px-4">{translateDynamic('Loại Danh Mục', currentLanguage) || 'Type'}</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4">{translateDynamic('Mô tả', currentLanguage)}</th>
                <th className="py-3.5 px-4 text-right">{translateDynamic('Thao Tác', currentLanguage)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    {translateDynamic('Đang tải dữ liệu...', currentLanguage)}
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <FolderPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>{translateDynamic('Chưa tìm thấy danh mục nào phù hợp.', currentLanguage)}</p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => {
                  const parent = categories.find(p => p._id === cat.parentId);
                  const isChild = !!cat.parentId;
                  return (
                    <tr key={cat._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                            {cat.name.charAt(0)}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {isChild && (
                            <CornerDownRight className="w-4 h-4 text-exclusive-red ml-2" />
                          )}
                          <span className={`font-semibold ${isChild ? 'text-slate-700' : 'text-slate-900 font-bold'}`}>
                            {translateDynamic(cat.name, currentLanguage)}
                          </span>
                        </div>
                        {isChild && parent && (
                          <span className="text-[11px] text-slate-400 ml-6 block">
                            Thuộc: <strong className="text-slate-600">{translateDynamic(parent.name, currentLanguage)}</strong>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {isChild ? (
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-md border border-amber-200">
                            Subcategory
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-900 text-white text-xs font-bold rounded-md">
                            Parent Category
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-exclusive-red bg-red-50/50 px-2 py-0.5 rounded w-fit">
                        {cat.slug}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                        {translateDynamic(cat.description, currentLanguage) || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenModal(cat)}
                          className="p-1.5 text-slate-600 hover:text-exclusive-red hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id, cat.name)}
                          className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
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

      {/* Modal Create / Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">
                {editingCategory ? translateDynamic('Chỉnh sửa danh mục', currentLanguage) : translateDynamic('Thêm Danh Mục Mới', currentLanguage)}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {translateDynamic('Tên danh mục', currentLanguage)} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="Ví dụ: Váy Đầm Dạ Hội"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
                />
              </div>

              {/* Parent Category Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {translateDynamic('Danh Mục Cha (Thuộc nhóm nào)', currentLanguage)}
                </label>
                <select
                  value={formData.parentId || ''}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black bg-slate-50 font-medium"
                >
                  <option value="">-- {translateDynamic('Là Danh Mục Gốc (Không có cha)', currentLanguage)} --</option>
                  {parentCandidates.map((parent) => (
                    <option key={parent._id} value={parent._id}>
                      📁 {translateDynamic(parent.name, currentLanguage)}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  Nếu chọn Danh mục cha, danh mục này sẽ trở thành Danh mục con (Subcategory).
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Đường dẫn Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="vay-dam-da-hoi"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:border-black"
                />
              </div>

              <ImageUpload
                label={translateDynamic('Hình ảnh', currentLanguage)}
                value={formData.image}
                onChange={(img) => setFormData({ ...formData, image: img as string })}
              />

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{translateDynamic('Mô tả', currentLanguage)}</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn về danh mục này..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition cursor-pointer"
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
