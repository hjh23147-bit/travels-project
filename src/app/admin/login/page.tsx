"use client";

import { useState } from "react";

import { Star, Lock, Mail, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // important for cookies
      });

      const data = await res.json();

      if (data.success) {
        // Store just the name for display — token is now in HttpOnly cookie
        sessionStorage.setItem("admin_name", data.name);
        sessionStorage.setItem("admin_role", data.role);
        if (data.agencyId) sessionStorage.setItem("admin_agency_id", data.agencyId);
        
        // Use replace() so the login page is removed from history
        // Pressing back from admin won't return to the login page
        const destination = data.role === "AGENCY_ADMIN" ? "/admin/ads" : "/admin";
        window.location.replace(destination);
      } else {
        setError(data.error || "بيانات الدخول غير صحيحة");
      }
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center pattern-overlay p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-xl">
            <Star className="w-8 h-8 text-navy-900" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">
              رحلات <span className="text-gradient-gold">النور</span>
            </h1>
            <p className="text-xs text-gold-400/60">لوحة التحكم الآمنة</p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-gold-400" />
            <h2 className="text-xl font-bold text-white">تسجيل الدخول</h2>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5">
              <p className="text-sm text-red-400 text-center">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-300 mb-2 text-center">البريد الإلكتروني أو اسم المستخدم</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل البريد الإلكتروني أو اسم المستخدم"
                  required
                  className="w-full pr-11 pl-4 py-3 rounded-xl bg-white border border-navy-100 text-navy-900 placeholder:text-navy-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none text-sm font-bold text-center"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-300 mb-2 text-center">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pr-11 pl-11 py-3 rounded-xl bg-white border border-navy-100 text-navy-900 placeholder:text-navy-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none text-sm font-bold text-center"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-500 hover:text-navy-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 btn-gold py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري التحقق...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                دخول آمن
              </>
            )}
          </button>


        </form>
      </div>
    </div>
  );
}
