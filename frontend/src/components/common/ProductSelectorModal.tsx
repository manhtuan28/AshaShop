import React, { useState, useEffect } from 'react';
import { Search, X, Check, Filter, Package, AlertCircle } from 'lucide-react';
import { productsApi } from '../../services/api';
import { Product, Category } from '../../types';
import { formatPrice } from './ProductCard';
import { useLanguageStore } from '../../store/useLanguageStore';
import { translateDynamic } from '../../i18n/translator';

interface ProductSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onSave: (ids: string[]) => void;
  title?: string;
  maxSelect?: number;
}

export const ProductSelectorModal: React.FC<ProductSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedIds,
  onSave,
  title = 'Chọn Sản Phẩm Hiển Thị',
  maxSelect = 20,
}) => {
  const { currentLanguage } = useLanguageStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [tempSelected, setTempSelected] = useState<string[]>(selectedIds);

  useEffect(() => {
    if (isOpen) {
      setTempSelected(selectedIds || []);
      const fetchAll = async () => {
        try {
          setLoading(true);
          const [prodRes, catRes] = await Promise.all([
            productsApi.getAll({ limit: 100 }),
            productsApi.getCategories(),
          ]);
          setProducts(prodRes.data.data.items || []);
          setCategories(catRes.data.data || []);
        } catch (err) {
          console.error('Lỗi tải sản phẩm cho bộ chọn:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchAll();
    }
  }, [isOpen, selectedIds]);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    if (tempSelected.includes(id)) {
      setTempSelected(tempSelected.filter((item) => item !== id));
    } else {
      if (tempSelected.length >= maxSelect) {
        alert(`Bạn chỉ có thể chọn tối đa ${maxSelect} sản phẩm cho khối này.`);
        return;
      }
      setTempSelected([...tempSelected, id]);
    }
  };

  const handleSelectAllFiltered = () => {
    const ids = filteredProducts.map((p) => p._id);
    const combined = Array.from(new Set([...tempSelected, ...ids])).slice(0, maxSelect);
    setTempSelected(combined);
  };

  const handleDeselectAll = () => {
    setTempSelected([]);
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const catId = typeof p.category === 'object' ? p.category?._id : p.category;
    const matchCat = selectedCat === 'ALL' || catId === selectedCat;
    return matchSearch && matchCat;
  });

  const handleConfirm = () => {
    onSave(tempSelected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 font-poppins">
      <div className="bg-white rounded-2xl max-w-4xl w-full flex flex-col max-h-[90vh] shadow-2xl overflow-hidden animate-fade-in border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-exclusive-red" />
              <span>{translateDynamic(title, currentLanguage)}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {translateDynamic('Đã chọn', currentLanguage)}: <strong className="text-exclusive-red">{tempSelected.length}</strong> / {maxSelect} {translateDynamic('sản phẩm', currentLanguage)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 bg-white border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              placeholder={translateDynamic('Tìm kiếm theo tên mẫu thời trang...', currentLanguage)}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-black font-medium"
            >
              <option value="ALL">{translateDynamic('Tất cả danh mục', currentLanguage)}</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {translateDynamic(c.name, currentLanguage)}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleSelectAllFiltered}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl whitespace-nowrap transition cursor-pointer"
            >
              {translateDynamic('Chọn tất cả lọc', currentLanguage) || 'Select all'}
            </button>
            {tempSelected.length > 0 && (
              <button
                type="button"
                onClick={handleDeselectAll}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl whitespace-nowrap transition cursor-pointer"
              >
                {translateDynamic('Bỏ chọn hết', currentLanguage) || 'Deselect all'}
              </button>
            )}
          </div>
        </div>

        {/* Product Grid / List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-sm">
              {translateDynamic('Đang tải danh sách sản phẩm...', currentLanguage)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-sm">
              {translateDynamic('Không tìm thấy sản phẩm nào.', currentLanguage)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredProducts.map((p) => {
                const isSelected = tempSelected.includes(p._id);
                const img = p.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=150&q=80';
                const catName = typeof p.category === 'object' ? p.category?.name : '';

                return (
                  <div
                    key={p._id}
                    onClick={() => toggleSelect(p._id)}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition cursor-pointer select-none ${
                      isSelected
                        ? 'bg-red-50/80 border-exclusive-red shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                      <img src={img} alt={p.name} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-exclusive-red/40 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                        {translateDynamic(p.name, currentLanguage)}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {translateDynamic(catName, currentLanguage) || 'Thời trang'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-exclusive-red">
                          {formatPrice(p.price)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Kho: {p.stock}
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                          isSelected
                            ? 'bg-exclusive-red border-exclusive-red text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-white">
          <span className="text-xs text-slate-500">
            {translateDynamic('Đã chọn', currentLanguage)}: <strong className="text-slate-800 font-bold">{tempSelected.length}</strong> {translateDynamic('sản phẩm', currentLanguage)}
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              {translateDynamic('Hủy', currentLanguage)}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-2.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-xs sm:text-sm font-bold rounded-xl shadow transition cursor-pointer"
            >
              {translateDynamic('Xác Nhận Chọn', currentLanguage) || 'Confirm Selection'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
