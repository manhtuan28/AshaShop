import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Plus } from 'lucide-react';

interface ImageUploadProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  label?: string;
  maxFiles?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  multiple = false,
  label = 'Hình ảnh',
  maxFiles = 5,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Normalize images array
  const images: string[] = Array.isArray(value)
    ? value.filter(Boolean)
    : value
    ? [value]
    : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const readers = fileList.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          }
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((newBase64Images) => {
      if (multiple) {
        const combined = [...images, ...newBase64Images].slice(0, maxFiles);
        onChange(combined);
      } else {
        onChange(newBase64Images[0] || '');
      }
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (multiple) {
      const combined = [...images, urlInput.trim()].slice(0, maxFiles);
      onChange(combined);
    } else {
      onChange(urlInput.trim());
    }
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleRemove = (indexToRemove: number) => {
    if (multiple) {
      const updated = images.filter((_, idx) => idx !== indexToRemove);
      onChange(updated);
    } else {
      onChange('');
    }
  };

  return (
    <div className="space-y-3 font-poppins">
      {label && <label className="block text-xs font-bold text-slate-700">{label}</label>}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm"
            >
              <img
                src={img}
                alt={`Preview ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-exclusive-red text-white flex items-center justify-center transition-colors shadow-md"
                title="Xóa ảnh"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-1 left-2 text-[10px] font-bold text-white/90 bg-black/60 px-1.5 py-0.5 rounded">
                #{idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload & Add Controls */}
      {(!multiple && images.length === 0) || (multiple && images.length < maxFiles) ? (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Upload File Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Tải ảnh từ máy tính</span>
            </button>

            {/* Input URL Toggle Button */}
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              <LinkIcon className="w-4 h-4" />
              <span>Nhập đường dẫn URL</span>
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple={multiple}
            className="hidden"
          />

          {/* URL Input Bar */}
          {showUrlInput && (
            <div className="flex items-center gap-2 pt-1 animate-fade-in">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-4 py-2 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-xs font-bold rounded-lg transition-colors"
              >
                Thêm URL
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
