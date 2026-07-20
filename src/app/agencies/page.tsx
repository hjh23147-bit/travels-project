import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import prisma from "@/lib/db";
import AgenciesClient from "./AgenciesClient";

// ISR: revalidate every 60 seconds
export const revalidate = 60;

export default async function AgenciesPage() {
  const agencies = await prisma.agency.findMany({
    where: { isActive: true },
    include: { _count: { select: { packages: true, leads: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-navy-50 flex flex-col">
      <Navbar />

      {/* ── Page Header ── */}
      <section className="pt-20 pb-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-extrabold tracking-widest uppercase text-gold-600 bg-gold-50 px-3 py-1 rounded-full border border-gold-200">
                  شركاء النجاح
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-navy-900 leading-tight">
                المكاتب <span className="text-gradient-gold">المعتمدة لدينا</span>
              </h1>
              <p className="text-navy-500 mt-2 text-sm sm:text-base max-w-xl">
                نخبة من وكالات ومكاتب السفر المعتمدة رسمياً، نقدم لك خيارات موثوقة لضمان أداء مناسكك بكل راحة وطمأنينة.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { value: `${agencies.length}+`, label: "مكتب معتمد" },
              { value: "١٠٠٪", label: "موثوقية وأمان" },
              { value: "٢٤/٧", label: "دعم متواصل" },
            ].map((stat, i) => (
              <div key={i} className="bg-navy-50 rounded-2xl p-4 text-center border border-navy-100/50">
                <p className="text-2xl font-black text-navy-900">{stat.value}</p>
                <p className="text-xs text-navy-500 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agencies Grid via Client Component ── */}
      <AgenciesClient initialAgencies={agencies} />

      <Footer />
    </main>
  );
}
