import React, { useState } from 'react';
import { BookOpen, Save } from 'lucide-react';
import { useSiteConfigStore } from '../../../store/useSiteConfigStore';
import { useLanguageStore } from '../../../store/useLanguageStore';
import { ImageUpload } from '../../../components/common/ImageUpload';
import { translateDynamic } from '../../../i18n/translator';
import toast from 'react-hot-toast';

export const AdminCMSAbout: React.FC = () => {
  const { config, updateConfig } = useSiteConfigStore();
  const { currentLanguage } = useLanguageStore();
  const [formData, setFormData] = useState({
    aboutTitle: config.aboutTitle,
    aboutStory1: config.aboutStory1,
    aboutStory2: config.aboutStory2,
    aboutImageUrl: config.aboutImageUrl,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    toast.success('Đã lưu nội dung trang Giới thiệu (About Us)!');
  };

  return (
    <div className="space-y-6 max-w-4xl font-poppins animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-exclusive-red" />
            <span>{translateDynamic('Trang Giới Thiệu (About Us)', currentLanguage)}</span>
          </h1>
          <p className="text-xs text-slate-500">
            {translateDynamic('Chỉnh sửa câu chuyện thương hiệu và ảnh minh họa trên trang /about', currentLanguage) || 'Edit brand story and about page contents'}
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
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            {translateDynamic('Tiêu Đề Trang Giới Thiệu', currentLanguage) || 'About Page Title'}
          </label>
          <input
            type="text"
            required
            value={formData.aboutTitle}
            onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            {translateDynamic('Đoạn Văn Câu Chuyện 1', currentLanguage) || 'Story Paragraph 1'}
          </label>
          <textarea
            rows={3}
            required
            value={formData.aboutStory1}
            onChange={(e) => setFormData({ ...formData, aboutStory1: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            {translateDynamic('Đoạn Văn Câu Chuyện 2', currentLanguage) || 'Story Paragraph 2'}
          </label>
          <textarea
            rows={3}
            required
            value={formData.aboutStory2}
            onChange={(e) => setFormData({ ...formData, aboutStory2: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none"
          />
        </div>

        <ImageUpload
          label={translateDynamic('Hình ảnh', currentLanguage) + ' Minh Họa Trang Giới Thiệu'}
          value={formData.aboutImageUrl}
          onChange={(img) => setFormData({ ...formData, aboutImageUrl: img as string })}
        />

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
