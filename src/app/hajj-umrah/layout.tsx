import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "باقات الحج والعمرة | رحلات النور - VIP واقتصادي",
  description: "اكتشف باقات الحج والعمرة المتكاملة لموسم 1447هـ. باقة VIP وباقة اقتصادية بخدمات استثنائية وأسعار شفافة.",
  keywords: "باقات حج, باقات عمرة, حج VIP, عمرة فاخرة, رحلات النور, عمرة يمن",
  openGraph: {
    title: "باقات الحج والعمرة | رحلات النور",
    description: "أفضل باقات الحج والعمرة بخدمات VIP لموسم 1447هـ.",
    type: "website",
  },
};

export default function HajjUmrahLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
