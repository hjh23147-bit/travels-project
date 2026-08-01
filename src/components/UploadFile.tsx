"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, FileText, AlertCircle, RefreshCw } from "lucide-react";

interface UploadFileProps {
  value: string | null;
  onChange: (url: string) => void;
  label?: string;
  accept?: "image" | "document" | "all";
  maxSizeMB?: number;
}

export default function UploadFile({
  value,
  onChange,
  label = "رفع ملف",
  accept = "image",
  maxSizeMB = 5
}: UploadFileProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingFileRef = useRef<File | null>(null);

  // Compress image client side using canvas
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Limit maximum dimension to 1600px
          const MAX_DIM = 1600;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(file); // fallback to original file
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                resolve(file);
              }
            },
            "image/jpeg",
            0.8 // 80% compression quality
          );
        };
        img.onerror = () => reject(new Error("فشل تحميل الصورة للضغط"));
      };
      reader.onerror = () => reject(new Error("فشل قراءة ملف الصورة"));
    });
  };

  const uploadProcess = async (file: File) => {
    setError(null);
    setUploading(true);
    setProgress(0);
    pendingFileRef.current = file;

    try {
      // 1. File Type and Size Validation
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";

      if (accept === "image" && !isImage) {
        throw new Error("يجب رفع صور فقط (PNG, JPG, WEBP)");
      }
      if (accept === "document" && !isPdf) {
        throw new Error("يجب رفع مستندات بصيغة PDF فقط");
      }
      if (accept === "all" && !isImage && !isPdf) {
        throw new Error("الملف المرفوع غير مدعوم. يرجى رفع صورة أو ملف PDF");
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`حجم الملف كبير جداً. الحد الأقصى المسموح به هو ${maxSizeMB} ميجابايت`);
      }

      // 2. Client-side Compression for Images
      let fileToUpload: Blob | File = file;
      if (isImage) {
        try {
          fileToUpload = await compressImage(file);
        } catch (e) {
          console.warn("Image compression failed, uploading original:", e);
        }
      }

      // 3. XHR request to track progress
      const formData = new FormData();
      formData.append("file", fileToUpload, file.name);

      const xhr = new XMLHttpRequest();

      const uploadPromise = new Promise<string>((resolve, reject) => {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              resolve(res.url);
            } catch {
              reject(new Error("فشل قراءة رد الخادم"));
            }
          } else {
            try {
              const res = JSON.parse(xhr.responseText);
              reject(new Error(res.error || "فشل رفع الملف"));
            } catch {
              reject(new Error(`خطأ في الرفع (${xhr.status})`));
            }
          }
        };

        xhr.onerror = () => {
          reject(new Error("حدث خطأ في الاتصال بالخادم"));
        };

        xhr.open("POST", "/api/upload");
        xhr.send(formData);
      });

      const fileUrl = await uploadPromise;
      onChange(fileUrl);
      pendingFileRef.current = null;
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadProcess(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadProcess(file);
  };

  const handleRetry = () => {
    if (pendingFileRef.current) {
      uploadProcess(pendingFileRef.current);
    }
  };

  const handleRemove = () => {
    onChange("");
    setError(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isValImage = value && (
    value.endsWith(".jpg") || 
    value.endsWith(".jpeg") || 
    value.endsWith(".png") || 
    value.endsWith(".webp") || 
    value.startsWith("data:image/") ||
    (value.includes("/uploads/") && !value.endsWith(".pdf"))
  );

  return (
    <div className="space-y-2 text-right">
      <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">{label}</label>

      {value ? (
        <div className="relative inline-flex items-center justify-between gap-4 p-4 border border-navy-100 bg-white rounded-2xl w-full group overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            {isValImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={value} 
                alt="File preview" 
                className="h-16 w-16 object-cover rounded-xl border border-navy-100 bg-navy-50" 
              />
            ) : (
              <div className="h-16 w-16 bg-navy-50 text-navy-600 rounded-xl flex items-center justify-center border border-navy-100 flex-shrink-0">
                <FileText className="w-8 h-8 text-navy-500" />
              </div>
            )}
            
            <div className="min-w-0">
              <p className="text-[10px] text-emerald-600 font-extrabold tracking-wider uppercase mb-1">تم الرفع بنجاح</p>
              <p className="text-sm font-bold text-navy-900 truncate" dir="ltr">
                {value.split("/").pop()}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-100 transition-colors border border-red-100 cursor-pointer"
            title="حذف الملف"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            isDragOver 
              ? "border-gold-500 bg-gold-50/50 shadow-inner" 
              : "border-navy-200 hover:border-gold-500 hover:bg-navy-50/20"
          } ${uploading ? "pointer-events-none" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={
              accept === "image" 
                ? "image/*" 
                : accept === "document" 
                ? "application/pdf" 
                : "image/*,application/pdf"
            }
            onChange={handleFileChange}
            disabled={uploading}
          />

          <div className="flex flex-col items-center justify-center p-6 text-center">
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-9 h-9 text-gold-500 animate-spin" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-navy-900">جاري الرفع...</p>
                  {/* Progress bar */}
                  <div className="w-48 bg-navy-100 h-2 rounded-full overflow-hidden border border-navy-50">
                    <div 
                      className="bg-gradient-to-r from-gold-400 to-gold-600 h-full transition-all duration-200" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                  <p className="text-[10px] text-navy-400 font-bold">{progress}%</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-2 p-2">
                <AlertCircle className="w-9 h-9 text-red-500" />
                <p className="text-xs font-bold text-red-600 max-w-xs">{error}</p>
                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleRetry(); }}
                    className="flex items-center gap-1 text-xs text-navy-600 hover:text-navy-900 border border-navy-200 px-3 py-1.5 rounded-lg bg-white cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    إعادة المحاولة
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                    className="text-xs text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-9 h-9 text-navy-400 mb-3" />
                <p className="text-sm font-bold text-navy-700 mb-1">
                  اسحب الملف وأفلته هنا، أو اضغط للتصفح
                </p>
                <p className="text-[10px] text-navy-400 font-medium">
                  {accept === "image" 
                    ? "PNG, JPG, JPEG, WEBP (الحد الأقصى ٥ ميجابايت)" 
                    : accept === "document" 
                    ? "PDF فقط (الحد الأقصى ٥ ميجابايت)" 
                    : "صور ومستندات PDF (الحد الأقصى ٥ ميجابايت)"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
