import type { Metadata } from "next";
import "./globals.css";
import AirplaneAnimation from "@/components/AirplaneAnimation";
import ScrollAirplane from "@/components/ScrollAirplane";
import SmartNotifications from "@/components/SmartNotifications";
import SmartGreeter from "@/components/SmartGreeter";
import AIChat from "@/components/AIChat";

export const metadata: Metadata = {
  title: "رحلات النور | خدمات الحج والعمرة والتأشيرات",
  description: "منصة رحلات النور الرائدة لخدمات الحج والعمرة والتأشيرات وحجوزات السفر. احجز رحلتك بثقة مع فريق متخصص وخبرة تمتد لسنوات.",
  keywords: "حج, عمرة, تأشيرات, سفر, رحلات النور, حجز رحلات, باقات حج, باقات عمرة",
  openGraph: {
    title: "رحلات النور | خدمات الحج والعمرة والتأشيرات",
    description: "احجز رحلتك بثقة مع رحلات النور. باقات فاخرة للحج والعمرة بأسعار تنافسية.",
    type: "website",
    locale: "ar_SA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-cairo antialiased bg-navy-950 text-white relative">
        <AirplaneAnimation />
        <ScrollAirplane />
        <div className="relative z-10">
          <SmartNotifications />
          <SmartGreeter />
          {children}
          <AIChat />
        </div>
      </body>
    </html>
  );
}
