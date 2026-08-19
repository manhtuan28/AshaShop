import React, { useState } from 'react';
import { ShieldCheck, Save, Truck, Headset, RefreshCw } from 'lucide-react';
import { useSiteConfigStore } from '../../../store/useSiteConfigStore';
import { useLanguageStore } from '../../../store/useLanguageStore';
import { translateDynamic } from '../../../i18n/translator';
import toast from 'react-hot-toast';

export const AdminCMSBadges: React.FC = () => {
  const { config, updateConfig } = useSiteConfigStore();
  const { currentLanguage } = useLanguageStore();
  const [formData, setFormData] = useState({
    badgeDeliveryTitle: config.badgeDeliveryTitle,
    badgeDeliveryDesc: config.badgeDeliveryDesc,
    badgeServiceTitle: config.badgeServiceTitle,
    badgeServiceDesc: config.badgeServiceDesc,
    badgeReturnTitle: config.badgeReturnTitle,
    badgeReturnDesc: config.badgeReturnDesc,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    toast.success('Đã lưu 3 cam kết dịch vụ khách hàng!');
  };

  return (
    <div className="space-y-6 max-w-4xl font-poppins animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-exclusive-red" />
            <span>{translateDynamic('Cam Kết & Chứng Nhận Dịch Vụ', currentLanguage)}</span>
          </h1>
          <p className="text-xs text-slate-500">
            {translateDynamic('Chỉnh sửa tiêu đề & mô tả cho 3 chính sách cam kết (Giao hàng, Tư vấn Stylist, Đổi trả)', currentLanguage) || 'Edit 3 core customer service guarantees'}
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
        {/* Badge 1 */}
        <div className="p-4 border border-slate-200 rounded-xl space-y-3 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs font-bold text-exclusive-red uppercase">
            <Truck className="w-4 h-4" />
            <span>1. {translateDynamic('Giao Hàng Nhanh & Miễn Phí', currentLanguage) || 'Free & Fast Delivery'}</span>
          </div>
          <input
            type="text"
            required
            value={formData.badgeDeliveryTitle}
            onChange={(e) => setFormData({ ...formData, badgeDeliveryTitle: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold"
          />
          <input
            type="text"
            required
            value={formData.badgeDeliveryDesc}
            onChange={(e) => setFormData({ ...formData, badgeDeliveryDesc: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-600"
          />
        </div>

        {/* Badge 2 */}
        <div className="p-4 border border-slate-200 rounded-xl space-y-3 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs font-bold text-exclusive-red uppercase">
            <Headset className="w-4 h-4" />
            <span>2. {translateDynamic('Dịch Vụ Khách Hàng 24/7', currentLanguage) || '24/7 Customer Care'}</span>
          </div>
          <input
            type="text"
            required
            value={formData.badgeServiceTitle}
            onChange={(e) => setFormData({ ...formData, badgeServiceTitle: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold"
          />
          <input
            type="text"
            required
            value={formData.badgeServiceDesc}
            onChange={(e) => setFormData({ ...formData, badgeServiceDesc: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-600"
          />
        </div>

        {/* Badge 3 */}
        <div className="p-4 border border-slate-200 rounded-xl space-y-3 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs font-bold text-exclusive-red uppercase">
            <RefreshCw className="w-4 h-4" />
            <span>3. {translateDynamic('Đổi Trả Dễ Dàng & Hoàn Tiền', currentLanguage) || 'Money Back Guarantee'}</span>
          </div>
          <input
            type="text"
            required
            value={formData.badgeReturnTitle}
            onChange={(e) => setFormData({ ...formData, badgeReturnTitle: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold"
          />
          <input
            type="text"
            required
            value={formData.badgeReturnDesc}
            onChange={(e) => setFormData({ ...formData, badgeReturnDesc: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-600"
          />
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
