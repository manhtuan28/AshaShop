import React, { useState } from 'react';
import { CreditCard, Save } from 'lucide-react';
import { useSiteConfigStore } from '../../../store/useSiteConfigStore';
import { useLanguageStore } from '../../../store/useLanguageStore';
import { translateDynamic } from '../../../i18n/translator';
import toast from 'react-hot-toast';

export const AdminCMSBanking: React.FC = () => {
  const { config, updateConfig } = useSiteConfigStore();
  const { currentLanguage } = useLanguageStore();
  const [formData, setFormData] = useState({
    bankName: config.bankName,
    bankAccountNumber: config.bankAccountNumber,
    bankAccountName: config.bankAccountName,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    toast.success('Đã lưu thông tin tài khoản ngân hàng chuyển khoản!');
  };

  return (
    <div className="space-y-6 max-w-4xl font-poppins animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-exclusive-red" />
            <span>{translateDynamic('Tài Khoản Ngân Hàng Thanh Toán', currentLanguage)}</span>
          </h1>
          <p className="text-xs text-slate-500">
            {translateDynamic('Cấu hình số tài khoản, tên ngân hàng và chủ thụ hưởng hiển thị tại bước Checkout', currentLanguage) || 'Configure bank transfer details for checkout'}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {translateDynamic('Tên Ngân Hàng', currentLanguage) || 'Bank Name'}
            </label>
            <input
              type="text"
              required
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {translateDynamic('Số Tài Khoản', currentLanguage) || 'Account Number'}
            </label>
            <input
              type="text"
              required
              value={formData.bankAccountNumber}
              onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {translateDynamic('Chủ Tài Khoản (Người Thụ Hưởng)', currentLanguage) || 'Account Holder'}
            </label>
            <input
              type="text"
              required
              value={formData.bankAccountName}
              onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
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
