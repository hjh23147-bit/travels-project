"use client";

import Link from "next/link";
import { Star } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 h-24 bg-transparent text-white px-8 md:px-12 flex items-center justify-between pointer-events-auto">
      {/* 1. RIGHT SIDE: Arabic Typography "رحلات النور" */}
      <div className="flex flex-col text-right select-none">
        <h1 className="text-2xl font-black tracking-wide text-white leading-tight font-serif">
          رحلات <span className="text-gradient-gold">النور</span>
        </h1>
        <p className="text-[10px] tracking-widest text-gray-400 font-sans uppercase font-bold">
          Umrah Packages
        </p>
      </div>

      {/* 2. CENTER: Glassmorphism Nav Pill */}
      <div className="hidden md:flex items-center gap-1.5 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.02)]">
        <Link
          href="/"
          className="px-4 py-1.5 text-xs font-bold transition-all duration-300 rounded-full text-gold-400 bg-white/10 shadow-sm"
        >
          الرئيسية
        </Link>
        <Link
          href="/#packages"
          className="px-4 py-1.5 text-xs font-bold transition-all duration-300 rounded-full text-gray-300 hover:text-white hover:bg-white/5"
        >
          الباقات
        </Link>
        <Link
          href="/#footer"
          className="px-4 py-1.5 text-xs font-bold transition-all duration-300 rounded-full text-gray-300 hover:text-white hover:bg-white/5"
        >
          اتصل بنا
        </Link>
        <Link
          href="/jobs"
          className="px-4 py-1.5 text-xs font-bold transition-all duration-300 rounded-full text-gray-300 hover:text-white hover:bg-white/5"
        >
          فرص العمل
        </Link>
        <Link
          href="/admin"
          className="px-4 py-1.5 text-xs font-bold transition-all duration-300 rounded-full text-gray-300 hover:text-white hover:bg-white/5 border border-white/5 bg-white/5"
        >
          بوابة الإدارة
        </Link>
      </div>

      {/* 3. LEFT SIDE: Neon Teal Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="flex flex-col text-left">
          <p className="text-lg font-black tracking-wide text-white leading-none font-sans uppercase">
            Alnoor
          </p>
          <p className="text-[10px] tracking-wider text-cyan-400 font-sans uppercase font-extrabold">
            Travels
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300">
          <Star className="w-5 h-5 text-cyan-400 fill-cyan-400" />
        </div>
      </Link>
    </nav>
  );
}
