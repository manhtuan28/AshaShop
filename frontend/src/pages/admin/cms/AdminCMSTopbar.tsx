import React, { useState } from 'react';
import { Megaphone, Save } from 'lucide-react';
import { useSiteConfigStore } from '../../../store/useSiteConfigStore';
import { useLanguageStore } from '../../../store/useLanguageStore';
import { translateDynamic } from '../../../i18n/translator';
import toast from 'react-hot-toast';

export const AdminCMSTopbar: React.FC = () => {
  const { config, updateConfig } = useSiteConfigStore();
  const { currentLanguage } = useLanguageStore();
  const [formData, setFormData] = useState({
    showTopBar: config.showTopBar,
    topBarText: config.topBarText,
    topBarDiscount: config.topBarDiscount,
    topBarLink: config.topBarLink,
    topBarButtonText: config.topBarButtonText,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    toast.success('Đã cập nhật thanh thông báo đầu trang!');
  };

  return (
    <div className="space-y-6 max-w-4xl font-poppins animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-exclusive-red" />
            <span>{translateDynamic('Thanh Thông Báo Header (Top Bar)', currentLanguage)}</span>
          </h1>
          <p className="text-xs text-slate-500">
            {translateDynamic('Cấu hình dòng chữ khuyến mãi, nút bấm và đường dẫn trên thanh đen đầu trang', currentLanguage)}
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
        <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <input
            type="checkbox"
            id="showTopBar"
            checked={formData.showTopBar}
            onChange={(e) => setFormData({ ...formData, showTopBar: e.target.checked })}
            className="w-4 h-4 accent-exclusive-red rounded cursor-pointer"
          />
          <label htmlFor="showTopBar" className="text-xs font-bold text-slate-800 cursor-pointer">
            {translateDynamic('Bật hiển thị thanh thông báo khuyến mãi đầu trang', currentLanguage) || 'Enable top notification banner'}
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            {translateDynamic('Nội Dung Thông Báo Khuyến Mãi', currentLanguage) || 'Notification Message'}
          </label>
          <input
            type="text"
            required
            value={formData.topBarText}
            onChange={(e) => setFormData({ ...formData, topBarText: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {translateDynamic('Tên Nút Nhấn (CTA Text)', currentLanguage) || 'Button Text'}
            </label>
            <input
              type="text"
              required
              value={formData.topBarButtonText}
              onChange={(e) => setFormData({ ...formData, topBarButtonText: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {translateDynamic('Đường Dẫn Nút Nhấn (Link URL)', currentLanguage) || 'Button Link URL'}
            </label>
            <input
              type="text"
              required
              value={formData.topBarLink}
              onChange={(e) => setFormData({ ...formData, topBarLink: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
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
