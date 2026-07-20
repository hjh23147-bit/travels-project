"use client";

import { useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
// eslint-disable-next-line @next/next/no-img-element

interface UploadImageProps {
  value: string | null;
  onChange: (url: string) => void;
  label?: string;
}

export default function UploadImage({ value, onChange, label = "صورة" }: UploadImageProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
      } else {
        alert("فشل رفع الصورة");
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-navy-700">{label}</label>
      
      {value ? (
        <div className="relative inline-block border border-navy-200 rounded-xl overflow-hidden group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Uploaded" className="h-32 object-cover bg-navy-50" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-red-500/80 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-navy-200 rounded-xl cursor-pointer hover:border-gold-400 hover:bg-gold-50/50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-gold-500 animate-spin mb-2" />
            ) : (
              <Upload className="w-8 h-8 text-navy-400 mb-2" />
            )}
            <p className="text-xs font-semibold text-navy-600">
              {uploading ? "جاري الرفع..." : "اضغط لرفع الصورة"}
            </p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
        </label>
      )}
    </div>
  );
}
