import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشروط والأحكام | رحلات النور",
  description: "اطلع على الشروط والأحكام الخاصة بخدمات رحلات النور للحج والعمرة والتأشيرات.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
