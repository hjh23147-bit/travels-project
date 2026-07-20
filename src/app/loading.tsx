import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-navy-100"></div>
          <div className="w-16 h-16 rounded-full border-4 border-gold-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
        </div>
        <div className="text-navy-900 font-bold text-lg animate-pulse">جاري التحميل...</div>
      </div>
    </div>
  );
}
