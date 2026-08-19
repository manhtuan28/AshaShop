import React, { useState } from 'react';
import { PhoneCall, Save } from 'lucide-react';
import { useSiteConfigStore } from '../../../store/useSiteConfigStore';
import { useLanguageStore } from '../../../store/useLanguageStore';
import { translateDynamic } from '../../../i18n/translator';
import toast from 'react-hot-toast';

export const AdminCMSFooter: React.FC = () => {
  const { config, updateConfig } = useSiteConfigStore();
  const { currentLanguage } = useLanguageStore();
  const [formData, setFormData] = useState({
    hotline: config.hotline,
    supportEmail: config.supportEmail,
    address: config.address,
    workingHours: config.workingHours,
    footerDescription: config.footerDescription,
    footerAppDiscount: config.footerAppDiscount,
    copyrightText: config.copyrightText,
    facebookUrl: config.facebookUrl,
    instagramUrl: config.instagramUrl,
    twitterUrl: config.twitterUrl,
    linkedinUrl: config.linkedinUrl,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    toast.success('Đã lưu thông tin liên hệ và chân trang (Footer)!');
  };

  return (
    <div className="space-y-6 max-w-4xl font-poppins animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <PhoneCall className="w-6 h-6 text-exclusive-red" />
            <span>{translateDynamic('Thông Tin Liên Hệ & Chân Trang (Footer)', currentLanguage)}</span>
          </h1>
          <p className="text-xs text-slate-500">
            {translateDynamic('Chỉnh sửa Hotline, Email, Địa chỉ cửa hàng, Bản quyền và các liên kết mạng xã hội', currentLanguage) || 'Edit Hotline, Email, Store Address, Copyright and Social Links'}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Hotline</label>
            <input
              type="text"
              required
              value={formData.hotline}
              onChange={(e) => setFormData({ ...formData, hotline: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Email Hỗ Trợ</label>
            <input
              type="email"
              required
              value={formData.supportEmail}
              onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {translateDynamic('Địa chỉ', currentLanguage) || 'Address'}
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {translateDynamic('Thời gian hoạt động', currentLanguage) || 'Working Hours'}
            </label>
            <input
              type="text"
              required
              value={formData.workingHours}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            {translateDynamic('Mô Tả Chân Trang (Footer Bio)', currentLanguage) || 'Footer Bio'}
          </label>
          <textarea
            rows={2}
            value={formData.footerDescription}
            onChange={(e) => setFormData({ ...formData, footerDescription: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            {translateDynamic('Bản quyền Footer', currentLanguage) || 'Copyright Text'}
          </label>
          <input
            type="text"
            value={formData.copyrightText}
            onChange={(e) => setFormData({ ...formData, copyrightText: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Facebook URL</label>
            <input
              type="text"
              value={formData.facebookUrl}
              onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Instagram URL</label>
            <input
              type="text"
              value={formData.instagramUrl}
              onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
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
