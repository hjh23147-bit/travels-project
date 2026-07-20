import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "احجز رحلتك | رحلات النور - حجز حج وعمرة وتأشيرات",
  description: "احجز رحلتك الإيمانية بكل سهولة وأمان مع رحلات النور. باقات حج وعمرة بأسعار تنافسية مع خدمة VIP.",
  keywords: "حجز حج, حجز عمرة, تأشيرة عمرة, رحلات النور, حجز رحلات يمن",
  openGraph: {
    title: "احجز رحلتك الإيمانية | رحلات النور",
    description: "احجز رحلتك الإيمانية بكل سهولة مع رحلات النور.",
    type: "website",
  },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
