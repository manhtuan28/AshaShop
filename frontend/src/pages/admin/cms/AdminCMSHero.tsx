import React, { useState } from 'react';
import { Image as ImageIcon, Save, Flame } from 'lucide-react';
import { useSiteConfigStore } from '../../../store/useSiteConfigStore';
import { useLanguageStore } from '../../../store/useLanguageStore';
import { ImageUpload } from '../../../components/common/ImageUpload';
import { translateDynamic } from '../../../i18n/translator';
import toast from 'react-hot-toast';

export const AdminCMSHero: React.FC = () => {
  const { config, updateConfig } = useSiteConfigStore();
  const { currentLanguage } = useLanguageStore();
  const [formData, setFormData] = useState({
    heroTag: config.heroTag,
    heroTitle: config.heroTitle,
    heroSubtitle: config.heroSubtitle,
    heroButtonText: config.heroButtonText,
    heroButtonLink: config.heroButtonLink,
    heroImageUrl: config.heroImageUrl,
    flashSaleTitle: config.flashSaleTitle,
    flashSaleDiscount: config.flashSaleDiscount,
    flashSaleHours: config.flashSaleHours,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    toast.success('Đã lưu cấu hình Banner Hero & Flash Sale!');
  };

  return (
    <div className="space-y-6 max-w-4xl font-poppins animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-exclusive-red" />
            <span>{translateDynamic('Hero Lookbook & Flash Sale', currentLanguage)}</span>
          </h1>
          <p className="text-xs text-slate-500">
            {translateDynamic('Chỉnh sửa tiêu đề, ảnh lookbook bộ sưu tập và đồng hồ đếm ngược Flash Sale trang chủ', currentLanguage) || 'Edit collection lookbook, banners, and countdown timers'}
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{translateDynamic('Lưu Thay Đổi', currentLanguage)}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hero Section */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>1. {translateDynamic('Banner Hero Chính Trang Chủ (Lookbook Slider)', currentLanguage) || 'Main Hero Lookbook Banner'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {translateDynamic('Nhãn Bộ Sưu Tập (Tag)', currentLanguage) || 'Collection Tag'}
              </label>
              <input
                type="text"
                value={formData.heroTag}
                onChange={(e) => setFormData({ ...formData, heroTag: e.target.value })}
                placeholder="Summer Haute Couture 2026"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {translateDynamic('Tiêu Đề Phụ (Subtitle)', currentLanguage) || 'Subtitle'}
              </label>
              <input
                type="text"
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">
                {translateDynamic('Tiêu Đề Lớn Banner Hero', currentLanguage) || 'Hero Main Title'}
              </label>
              <textarea
                rows={2}
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {translateDynamic('Tên Nút Bấm', currentLanguage) || 'Button Text'}
              </label>
              <input
                type="text"
                value={formData.heroButtonText}
                onChange={(e) => setFormData({ ...formData, heroButtonText: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {translateDynamic('Đường Dẫn Nút Bấm', currentLanguage) || 'Button Link URL'}
              </label>
              <input
                type="text"
                value={formData.heroButtonLink}
                onChange={(e) => setFormData({ ...formData, heroButtonLink: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:border-black"
              />
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
              <ImageUpload
                label={translateDynamic('Hình ảnh', currentLanguage) + ' Lookbook Hero'}
                multiple={false}
                value={formData.heroImageUrl}
                onChange={(img) => setFormData({ ...formData, heroImageUrl: img as string })}
              />
            </div>
          </div>
        </div>

        {/* Flash Sale Section */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-exclusive-red" />
              <span>2. {translateDynamic('Flash Sale Thời Trang', currentLanguage)}</span>
            </h2>
            <a
              href="/admin/cms/sections"
              className="text-xs font-bold text-exclusive-red hover:underline flex items-center gap-1"
            >
              <span>{translateDynamic('Chọn danh sách sản phẩm hiển thị Flash Sale & Mẫu Bán Chạy →', currentLanguage)}</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">
                {translateDynamic('Tiêu Đề Khu Vực Flash Sale', currentLanguage) || 'Flash Sale Title'}
              </label>
              <input
                type="text"
                value={formData.flashSaleTitle}
                onChange={(e) => setFormData({ ...formData, flashSaleTitle: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {translateDynamic('Thời Gian Đếm Ngược (Giờ)', currentLanguage) || 'Countdown Hours'}
              </label>
              <input
                type="number"
                value={formData.flashSaleHours}
                onChange={(e) => setFormData({ ...formData, flashSaleHours: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
          >
            {translateDynamic('Lưu Thay Đổi', currentLanguage)}
          </button>
        </div>
      </form>
    </div>
  );
};
