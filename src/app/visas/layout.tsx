import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تأشيرات سريعة | رحلات النور - عمرة وسياحة",
  description: "استخراج تأشيرة العمرة خلال 24 ساعة وتأشيرات السياحة بأسعار تنافسية. رحلات النور - موثوقون ومعتمدون.",
  keywords: "تأشيرة عمرة, فيزا عمرة, تأشيرة سياحية, رحلات النور",
  openGraph: {
    title: "تأشيرات سريعة وموثوقة | رحلات النور",
    description: "استخراج تأشيرة العمرة خلال 24 ساعة بأسعار تنافسية.",
    type: "website",
  },
};

export default function VisasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
