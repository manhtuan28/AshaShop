import React, { useState } from 'react';
import { Palette, Save, CheckCircle2, RotateCcw } from 'lucide-react';
import { useSiteConfigStore } from '../../../store/useSiteConfigStore';
import { useLanguageStore } from '../../../store/useLanguageStore';
import { ImageUpload } from '../../../components/common/ImageUpload';
import { translateDynamic } from '../../../i18n/translator';
import toast from 'react-hot-toast';

export const AdminCMSBranding: React.FC = () => {
  const { config, updateConfig, resetConfig } = useSiteConfigStore();
  const { currentLanguage } = useLanguageStore();
  const [formData, setFormData] = useState({
    brandName: config.brandName,
    brandHighlight: config.brandHighlight,
    tagline: config.tagline,
    customLogoUrl: config.customLogoUrl,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    toast.success('Đã lưu cấu hình Logo & Nhận diện thương hiệu!');
  };

  return (
    <div className="space-y-6 max-w-4xl font-poppins animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Palette className="w-6 h-6 text-exclusive-red" />
            <span>{translateDynamic('Cấu Hình Thương Hiệu & Logo', currentLanguage)}</span>
          </h1>
          <p className="text-xs text-slate-500">
            {translateDynamic('Tùy biến tên thương hiệu, điểm nhấn màu đỏ, slogan và tải logo riêng cho website', currentLanguage)}
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

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {translateDynamic('Tên Thương Hiệu (Chữ Chính)', currentLanguage)}
            </label>
            <input
              type="text"
              required
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              placeholder="Asha"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {translateDynamic('Chữ Điểm Nhấn (Màu Đỏ Nổi Bật)', currentLanguage)}
            </label>
            <input
              type="text"
              value={formData.brandHighlight}
              onChange={(e) => setFormData({ ...formData, brandHighlight: e.target.value })}
              placeholder="Shop"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            {translateDynamic('Khẩu Hiệu / Slogan Thương Hiệu', currentLanguage)}
          </label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="Thời Trang Thiết Kế & Quần Áo Cao Cấp"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
          />
        </div>

        {/* Custom Logo Image Upload */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <ImageUpload
            label={translateDynamic('Hình ảnh', currentLanguage) + ' Logo Website'}
            value={formData.customLogoUrl}
            onChange={(url) => setFormData({ ...formData, customLogoUrl: url as string })}
          />
          <p className="text-[11px] text-slate-400">
            Khuyên dùng: Ảnh PNG trong suốt không nền (Transparent PNG), kích thước chuẩn 240x60px.
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              if (confirm('Khôi phục lại logo và nhận diện thương hiệu mặc định?')) {
                resetConfig();
                toast.success('Đã khôi phục mặc định');
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{translateDynamic('Khôi phục mặc định', currentLanguage) || 'Reset default'}</span>
          </button>

          <button
            type="submit"
            className="px-8 py-2.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
          >
            {translateDynamic('Lưu Thay Đổi', currentLanguage)}
          </button>
        </div>
      </form>
    </div>
  );
};
