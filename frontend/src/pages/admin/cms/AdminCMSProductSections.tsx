import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  Flame,
  TrendingUp,
  Package,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { useSiteConfigStore } from '../../../store/useSiteConfigStore';
import { useLanguageStore } from '../../../store/useLanguageStore';
import { ProductSelectorModal } from '../../../components/common/ProductSelectorModal';
import { productsApi } from '../../../services/api';
import { Product } from '../../../types';
import { formatPrice } from '../../../components/common/ProductCard';
import { translateDynamic } from '../../../i18n/translator';
import toast from 'react-hot-toast';

export const AdminCMSProductSections: React.FC = () => {
  const { config, updateConfig } = useSiteConfigStore();
  const { currentLanguage } = useLanguageStore();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    // Flash Sale
    flashSaleBadge: config.flashSaleBadge || 'Hôm Nay',
    flashSaleTitle: config.flashSaleTitle || 'Flash Sale Thời Trang',
    flashSaleSubtitle: config.flashSaleSubtitle || 'Giảm giá sốc có giới hạn thời gian',
    flashSaleDiscount: config.flashSaleDiscount || 35,
    flashSaleHours: config.flashSaleHours || 24,
    flashSaleMode: (config.flashSaleMode || 'AUTO') as 'AUTO' | 'CUSTOM',
    flashSaleProductIds: config.flashSaleProductIds || [],

    // Best Sellers
    bestSellingBadge: config.bestSellingBadge || 'Tháng Này',
    bestSellingTitle: config.bestSellingTitle || 'Mẫu Bán Chạy Nhất',
    bestSellingSubtitle: config.bestSellingSubtitle || 'Những thiết kế được yêu thích nhất',
    bestSellingMode: (config.bestSellingMode || 'AUTO') as 'AUTO' | 'CUSTOM',
    bestSellingProductIds: config.bestSellingProductIds || [],

    // Explore Products
    exploreBadge: config.exploreBadge || 'Sản Phẩm Của Chúng Tôi',
    exploreTitle: config.exploreTitle || 'Khám Phá Thời Trang',
    exploreSubtitle: config.exploreSubtitle || 'Cập nhật những mẫu mới nhất',
    exploreMode: (config.exploreMode || 'AUTO') as 'AUTO' | 'CUSTOM',
    exploreProductIds: config.exploreProductIds || [],
  });

  // Modal selector states
  const [activeSelector, setActiveSelector] = useState<'flashSale' | 'bestSelling' | 'explore' | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productsApi.getAll({ limit: 100 });
        setAllProducts(res.data.data.items || []);
      } catch (err) {
        console.error('Lỗi tải sản phẩm:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    toast.success('Đã lưu cấu hình các khối sản phẩm Trang Chủ thành công!');
  };

  const removeProductFromSection = (section: 'flashSale' | 'bestSelling' | 'explore', id: string) => {
    if (section === 'flashSale') {
      setFormData({
        ...formData,
        flashSaleProductIds: formData.flashSaleProductIds.filter((pId) => pId !== id),
      });
    } else if (section === 'bestSelling') {
      setFormData({
        ...formData,
        bestSellingProductIds: formData.bestSellingProductIds.filter((pId) => pId !== id),
      });
    } else if (section === 'explore') {
      setFormData({
        ...formData,
        exploreProductIds: formData.exploreProductIds.filter((pId) => pId !== id),
      });
    }
  };

  const renderSelectedProductsPreview = (
    productIds: string[],
    section: 'flashSale' | 'bestSelling' | 'explore'
  ) => {
    const selected = allProducts.filter((p) => productIds.includes(p._id));
    if (selected.length === 0) {
      return (
        <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-400">
          {translateDynamic('Chưa có sản phẩm nào được chọn thủ công. Hãy bấm nút bên dưới để chọn.', currentLanguage)}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
        {selected.map((p) => {
          const img = p.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=150&q=80';
          return (
            <div
              key={p._id}
              className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center gap-2.5 shadow-sm relative group"
            >
              <img src={img} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {translateDynamic(p.name, currentLanguage)}
                </p>
                <p className="text-[11px] font-bold text-exclusive-red">{formatPrice(p.price)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeProductFromSection(section, p._id)}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition cursor-pointer"
                title="Bỏ chọn"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-5xl font-poppins animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-exclusive-red" />
            <span>{translateDynamic('Cấu Hình Khối Sản Phẩm Trang Chủ', currentLanguage)}</span>
          </h1>
          <p className="text-xs text-slate-500">
            {translateDynamic('Tùy biến tiêu đề, nhãn huy hiệu và chọn thủ công các sản phẩm hiển thị cho Flash Sale, Mẫu Bán Chạy Nhất và Khám Phá Sản Phẩm', currentLanguage)}
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{translateDynamic('Lưu Thay Đổi', currentLanguage)}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* ========================================================================= */}
        {/* KHỐI 1: FLASH SALE THỜI TRANG */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-exclusive-red flex items-center justify-center font-bold">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  1. {translateDynamic('Khối Flash Sale Thời Trang', currentLanguage)}
                </h2>
                <p className="text-xs text-slate-400">
                  Hiển thị hàng đầu trang kèm đồng hồ đếm ngược Flash Sale
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {translateDynamic('Nhãn Huy Hiệu (Badge)', currentLanguage)}
              </label>
              <input
                type="text"
                value={formData.flashSaleBadge}
                onChange={(e) => setFormData({ ...formData, flashSaleBadge: e.target.value })}
                placeholder="VD: Hôm Nay, Siêu Sale, Giảm Sốc..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {translateDynamic('Tiêu Đề Khối', currentLanguage)} *
              </label>
              <input
                type="text"
                required
                value={formData.flashSaleTitle}
                onChange={(e) => setFormData({ ...formData, flashSaleTitle: e.target.value })}
                placeholder="VD: Flash Sale Thời Trang, Siêu Giảm Giá Mùa Hè..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {translateDynamic('% Giảm Giá Hiển Thị', currentLanguage)}
              </label>
              <input
                type="number"
                min="5"
                max="90"
                value={formData.flashSaleDiscount}
                onChange={(e) => setFormData({ ...formData, flashSaleDiscount: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {translateDynamic('Thời Gian Đếm Ngược (Giờ)', currentLanguage)}
              </label>
              <input
                type="number"
                min="1"
                max="720"
                value={formData.flashSaleHours}
                onChange={(e) => setFormData({ ...formData, flashSaleHours: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Selection Mode */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="text-xs font-bold text-slate-700">
              {translateDynamic('Chế Độ Chọn Sản Phẩm Flash Sale', currentLanguage)}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                  formData.flashSaleMode === 'AUTO'
                    ? 'bg-red-50/50 border-exclusive-red text-slate-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="flashSaleMode"
                  value="AUTO"
                  checked={formData.flashSaleMode === 'AUTO'}
                  onChange={() => setFormData({ ...formData, flashSaleMode: 'AUTO' })}
                  className="accent-exclusive-red"
                />
                <div className="text-xs">
                  <p className="font-bold">Tự động (Mặc định)</p>
                  <p className="text-slate-400 text-[11px]">Tự động lấy các sản phẩm mới nhất / có giảm giá</p>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                  formData.flashSaleMode === 'CUSTOM'
                    ? 'bg-red-50/50 border-exclusive-red text-slate-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="flashSaleMode"
                  value="CUSTOM"
                  checked={formData.flashSaleMode === 'CUSTOM'}
                  onChange={() => setFormData({ ...formData, flashSaleMode: 'CUSTOM' })}
                  className="accent-exclusive-red"
                />
                <div className="text-xs">
                  <p className="font-bold">Chọn thủ công theo ý muốn</p>
                  <p className="text-slate-400 text-[11px]">Chỉ hiển thị các mẫu thời trang do bạn chọn</p>
                </div>
              </label>
            </div>

            {formData.flashSaleMode === 'CUSTOM' && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Danh sách sản phẩm đã chọn ({formData.flashSaleProductIds.length}):
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveSelector('flashSale')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Chọn / Thay đổi sản phẩm Flash Sale</span>
                  </button>
                </div>

                {renderSelectedProductsPreview(formData.flashSaleProductIds, 'flashSale')}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* KHỐI 2: MẪU BÁN CHẠY NHẤT (BEST SELLERS) */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  2. {translateDynamic('Khối Mẫu Bán Chạy Nhất (Best Sellers)', currentLanguage)}
                </h2>
                <p className="text-xs text-slate-400">
                  Hiển thị khu vực sản phẩm bán chạy nhất trong tháng
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {translateDynamic('Nhãn Huy Hiệu (Badge)', currentLanguage)}
              </label>
              <input
                type="text"
                value={formData.bestSellingBadge}
                onChange={(e) => setFormData({ ...formData, bestSellingBadge: e.target.value })}
                placeholder="VD: Tháng Này, Best Seller, Xu Hướng..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {translateDynamic('Tiêu Đề Khối', currentLanguage)} *
              </label>
              <input
                type="text"
                required
                value={formData.bestSellingTitle}
                onChange={(e) => setFormData({ ...formData, bestSellingTitle: e.target.value })}
                placeholder="VD: Mẫu Bán Chạy Nhất, Thiết Kế Yêu Thích 2026..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Selection Mode */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="text-xs font-bold text-slate-700">
              {translateDynamic('Chế Độ Chọn Sản Phẩm Bán Chạy', currentLanguage)}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                  formData.bestSellingMode === 'AUTO'
                    ? 'bg-emerald-50/50 border-emerald-500 text-slate-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="bestSellingMode"
                  value="AUTO"
                  checked={formData.bestSellingMode === 'AUTO'}
                  onChange={() => setFormData({ ...formData, bestSellingMode: 'AUTO' })}
                  className="accent-emerald-600"
                />
                <div className="text-xs">
                  <p className="font-bold">Tự động (Mặc định)</p>
                  <p className="text-slate-400 text-[11px]">Hệ thống tự động chọn 4 sản phẩm nổi bật</p>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                  formData.bestSellingMode === 'CUSTOM'
                    ? 'bg-emerald-50/50 border-emerald-500 text-slate-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="bestSellingMode"
                  value="CUSTOM"
                  checked={formData.bestSellingMode === 'CUSTOM'}
                  onChange={() => setFormData({ ...formData, bestSellingMode: 'CUSTOM' })}
                  className="accent-emerald-600"
                />
                <div className="text-xs">
                  <p className="font-bold">Chọn thủ công theo ý muốn</p>
                  <p className="text-slate-400 text-[11px]">Chỉ hiển thị các mẫu bán chạy do bạn chỉ định</p>
                </div>
              </label>
            </div>

            {formData.bestSellingMode === 'CUSTOM' && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Danh sách sản phẩm đã chọn ({formData.bestSellingProductIds.length}):
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveSelector('bestSelling')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Chọn / Thay đổi sản phẩm Bán Chạy</span>
                  </button>
                </div>

                {renderSelectedProductsPreview(formData.bestSellingProductIds, 'bestSelling')}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* KHỐI 3: KHÁM PHÁ THỜI TRANG (EXPLORE PRODUCTS) */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  3. {translateDynamic('Khối Khám Phá Sản Phẩm (Explore Products)', currentLanguage)}
                </h2>
                <p className="text-xs text-slate-400">
                  Thanh slider hiển thị bộ sưu tập sản phẩm phong phú
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {translateDynamic('Nhãn Huy Hiệu (Badge)', currentLanguage)}
              </label>
              <input
                type="text"
                value={formData.exploreBadge}
                onChange={(e) => setFormData({ ...formData, exploreBadge: e.target.value })}
                placeholder="VD: Sản Phẩm Của Chúng Tôi, Khám Phá..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {translateDynamic('Tiêu Đề Khối', currentLanguage)} *
              </label>
              <input
                type="text"
                required
                value={formData.exploreTitle}
                onChange={(e) => setFormData({ ...formData, exploreTitle: e.target.value })}
                placeholder="VD: Khám Phá Thời Trang, BST Quần Áo Mới Nhất..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Selection Mode */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="text-xs font-bold text-slate-700">
              {translateDynamic('Chế Độ Chọn Sản Phẩm Khám Phá', currentLanguage)}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                  formData.exploreMode === 'AUTO'
                    ? 'bg-blue-50/50 border-blue-500 text-slate-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="exploreMode"
                  value="AUTO"
                  checked={formData.exploreMode === 'AUTO'}
                  onChange={() => setFormData({ ...formData, exploreMode: 'AUTO' })}
                  className="accent-blue-600"
                />
                <div className="text-xs">
                  <p className="font-bold">Tự động (Mặc định)</p>
                  <p className="text-slate-400 text-[11px]">Tự động tải tất cả sản phẩm trong kho</p>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                  formData.exploreMode === 'CUSTOM'
                    ? 'bg-blue-50/50 border-blue-500 text-slate-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="exploreMode"
                  value="CUSTOM"
                  checked={formData.exploreMode === 'CUSTOM'}
                  onChange={() => setFormData({ ...formData, exploreMode: 'CUSTOM' })}
                  className="accent-blue-600"
                />
                <div className="text-xs">
                  <p className="font-bold">Chọn thủ công theo ý muốn</p>
                  <p className="text-slate-400 text-[11px]">Chỉ hiển thị các mẫu thời trang bạn chọn</p>
                </div>
              </label>
            </div>

            {formData.exploreMode === 'CUSTOM' && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Danh sách sản phẩm đã chọn ({formData.exploreProductIds.length}):
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveSelector('explore')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Chọn / Thay đổi sản phẩm Khám Phá</span>
                  </button>
                </div>

                {renderSelectedProductsPreview(formData.exploreProductIds, 'explore')}
              </div>
            )}
          </div>
        </div>

        {/* Save Button Bottom */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-10 py-3.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-sm font-bold rounded-xl shadow-lg transition cursor-pointer"
          >
            {translateDynamic('Lưu Toàn Bộ Cấu Hình Khối Sản Phẩm', currentLanguage)}
          </button>
        </div>
      </form>

      {/* Product Selector Modal */}
      <ProductSelectorModal
        isOpen={activeSelector !== null}
        onClose={() => setActiveSelector(null)}
        title={
          activeSelector === 'flashSale'
            ? 'Chọn Sản Phẩm Cho Khối Flash Sale'
            : activeSelector === 'bestSelling'
            ? 'Chọn Sản Phẩm Cho Khối Mẫu Bán Chạy Nhất'
            : 'Chọn Sản Phẩm Cho Khối Khám Phá'
        }
        selectedIds={
          activeSelector === 'flashSale'
            ? formData.flashSaleProductIds
            : activeSelector === 'bestSelling'
            ? formData.bestSellingProductIds
            : formData.exploreProductIds
        }
        onSave={(ids) => {
          if (activeSelector === 'flashSale') {
            setFormData({ ...formData, flashSaleProductIds: ids });
          } else if (activeSelector === 'bestSelling') {
            setFormData({ ...formData, bestSellingProductIds: ids });
          } else if (activeSelector === 'explore') {
            setFormData({ ...formData, exploreProductIds: ids });
          }
        }}
      />
    </div>
  );
};
