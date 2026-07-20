import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center border border-navy-100 shadow-2xl">
        <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600 mb-6">
          404
        </div>
        <h2 className="text-2xl font-bold text-navy-900 mb-4">
          عذراً، الصفحة غير موجودة
        </h2>
        <p className="text-navy-500 mb-8 leading-relaxed">
          يبدو أن الصفحة التي تبحث عنها غير متوفرة أو تم نقلها إلى رابط آخر.
        </p>
        <Link
          href="/"
          className="btn-gold w-full py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
