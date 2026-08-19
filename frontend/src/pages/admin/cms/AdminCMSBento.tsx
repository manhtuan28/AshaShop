import React, { useState } from 'react';
import { LayoutGrid, Save, Sparkles } from 'lucide-react';
import { useSiteConfigStore } from '../../../store/useSiteConfigStore';
import { useLanguageStore } from '../../../store/useLanguageStore';
import { ImageUpload } from '../../../components/common/ImageUpload';
import { translateDynamic } from '../../../i18n/translator';
import toast from 'react-hot-toast';

export const AdminCMSBento: React.FC = () => {
  const { config, updateConfig } = useSiteConfigStore();
  const { currentLanguage } = useLanguageStore();
  const [formData, setFormData] = useState({
    promoBadge: config.promoBadge,
    promoTitle: config.promoTitle,
    promoButtonText: config.promoButtonText,
    promoButtonLink: config.promoButtonLink,
    promoImageUrl: config.promoImageUrl,
    bento1: { ...config.bento1 },
    bento2: { ...config.bento2 },
    bento3: { ...config.bento3 },
    bento4: { ...config.bento4 },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    toast.success('Đã lưu cấu hình Lookbook & 4 khối New Arrival Bento!');
  };

  return (
    <div className="space-y-6 max-w-5xl font-poppins animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <LayoutGrid className="w-6 h-6 text-exclusive-red" />
            <span>{translateDynamic('Lookbook 4 Ô (Bento Grid)', currentLanguage)}</span>
          </h1>
          <p className="text-xs text-slate-500">
            {translateDynamic('Chỉnh sửa ảnh, tiêu đề, mô tả và đường dẫn click của khối banner Lookbook và 4 ô New Arrival', currentLanguage) || 'Edit Lookbook and 4 Bento cards'}
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
        {/* Lookbook Promo Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>1. {translateDynamic('Lookbook Trải Nghiệm Thời Trang', currentLanguage) || 'Fashion Experience Lookbook Banner'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {translateDynamic('Nhãn Badge', currentLanguage) || 'Badge'}
              </label>
              <input
                type="text"
                value={formData.promoBadge}
                onChange={(e) => setFormData({ ...formData, promoBadge: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {translateDynamic('Tên Nút Bấm', currentLanguage) || 'Button Text'}
              </label>
              <input
                type="text"
                value={formData.promoButtonText}
                onChange={(e) => setFormData({ ...formData, promoButtonText: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">
                {translateDynamic('Tiêu Đề', currentLanguage) || 'Title'}
              </label>
              <textarea
                rows={2}
                value={formData.promoTitle}
                onChange={(e) => setFormData({ ...formData, promoTitle: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-black resize-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">
                {translateDynamic('Đường Dẫn Nút Bấm', currentLanguage) || 'Button Link URL'}
              </label>
              <input
                type="text"
                value={formData.promoButtonLink}
                onChange={(e) => setFormData({ ...formData, promoButtonLink: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:border-black"
              />
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
              <ImageUpload
                label={translateDynamic('Hình ảnh', currentLanguage) + ' Banner Lookbook'}
                multiple={false}
                value={formData.promoImageUrl}
                onChange={(img) => setFormData({ ...formData, promoImageUrl: img as string })}
              />
            </div>
          </div>
        </div>

        {/* 4 Bento Grid Cards */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-exclusive-red" />
            <span>2. {translateDynamic('Lookbook 4 Ô (Bento Grid)', currentLanguage)}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Bento 1 */}
            <div className="p-4 border border-slate-200 rounded-xl space-y-3 bg-slate-50/50">
              <span className="text-xs font-bold text-exclusive-red uppercase">Bento Card 1 (Khối Lớn Bên Trái)</span>
              <input
                type="text"
                placeholder="Tiêu đề"
                value={formData.bento1.title}
                onChange={(e) => setFormData({ ...formData, bento1: { ...formData.bento1, title: e.target.value } })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
              />
              <input
                type="text"
                placeholder="Mô tả"
                value={formData.bento1.desc}
                onChange={(e) => setFormData({ ...formData, bento1: { ...formData.bento1, desc: e.target.value } })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
              />
              <input
                type="text"
                placeholder="Đường dẫn link"
                value={formData.bento1.link}
                onChange={(e) => setFormData({ ...formData, bento1: { ...formData.bento1, link: e.target.value } })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-mono bg-white"
              />
              <ImageUpload
                label={translateDynamic('Hình ảnh', currentLanguage) + ' Bento 1'}
                value={formData.bento1.imageUrl}
                onChange={(img) => setFormData({ ...formData, bento1: { ...formData.bento1, imageUrl: img as string } })}
              />
            </div>

            {/* Bento 2 */}
            <div className="p-4 border border-slate-200 rounded-xl space-y-3 bg-slate-50/50">
              <span className="text-xs font-bold text-exclusive-red uppercase">Bento Card 2 (Khối Ngang Trên Phải)</span>
              <input
                type="text"
                placeholder="Tiêu đề"
                value={formData.bento2.title}
                onChange={(e) => setFormData({ ...formData, bento2: { ...formData.bento2, title: e.target.value } })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
              />
              <input
                type="text"
                placeholder="Mô tả"
                value={formData.bento2.desc}
                onChange={(e) => setFormData({ ...formData, bento2: { ...formData.bento2, desc: e.target.value } })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
              />
              <input
                type="text"
                placeholder="Đường dẫn link"
                value={formData.bento2.link}
                onChange={(e) => setFormData({ ...formData, bento2: { ...formData.bento2, link: e.target.value } })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-mono bg-white"
              />
              <ImageUpload
                label={translateDynamic('Hình ảnh', currentLanguage) + ' Bento 2'}
                value={formData.bento2.imageUrl}
                onChange={(img) => setFormData({ ...formData, bento2: { ...formData.bento2, imageUrl: img as string } })}
              />
            </div>

            {/* Bento 3 */}
            <div className="p-4 border border-slate-200 rounded-xl space-y-3 bg-slate-50/50">
              <span className="text-xs font-bold text-exclusive-red uppercase">Bento Card 3 (Khối Dưới Trái)</span>
              <input
                type="text"
                placeholder="Tiêu đề"
                value={formData.bento3.title}
                onChange={(e) => setFormData({ ...formData, bento3: { ...formData.bento3, title: e.target.value } })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
              />
              <input
                type="text"
                placeholder="Mô tả"
                value={formData.bento3.desc}
                onChange={(e) => setFormData({ ...formData, bento3: { ...formData.bento3, desc: e.target.value } })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
              />
              <input
                type="text"
                placeholder="Đường dẫn link"
                value={formData.bento3.link}
                onChange={(e) => setFormData({ ...formData, bento3: { ...formData.bento3, link: e.target.value } })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-mono bg-white"
              />
              <ImageUpload
                label={translateDynamic('Hình ảnh', currentLanguage) + ' Bento 3'}
                value={formData.bento3.imageUrl}
                onChange={(img) => setFormData({ ...formData, bento3: { ...formData.bento3, imageUrl: img as string } })}
              />
            </div>

            {/* Bento 4 */}
            <div className="p-4 border border-slate-200 rounded-xl space-y-3 bg-slate-50/50">
              <span className="text-xs font-bold text-exclusive-red uppercase">Bento Card 4 (Khối Dưới Phải)</span>
              <input
                type="text"
                placeholder="Tiêu đề"
                value={formData.bento4.title}
                onChange={(e) => setFormData({ ...formData, bento4: { ...formData.bento4, title: e.target.value } })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
              />
              <input
                type="text"
                placeholder="Mô tả"
                value={formData.bento4.desc}
                onChange={(e) => setFormData({ ...formData, bento4: { ...formData.bento4, desc: e.target.value } })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
              />
              <input
                type="text"
                placeholder="Đường dẫn link"
                value={formData.bento4.link}
                onChange={(e) => setFormData({ ...formData, bento4: { ...formData.bento4, link: e.target.value } })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-mono bg-white"
              />
              <ImageUpload
                label={translateDynamic('Hình ảnh', currentLanguage) + ' Bento 4'}
                value={formData.bento4.imageUrl}
                onChange={(img) => setFormData({ ...formData, bento4: { ...formData.bento4, imageUrl: img as string } })}
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
