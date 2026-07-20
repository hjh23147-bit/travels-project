import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Wipe existing data
  await prisma.inquiry.deleteMany({});
  await prisma.settings.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.package.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.agency.deleteMany({});
  console.log("🧹 Database cleared.");

  // 2. Create high-end travel agencies
  const agencies = [
    {
      name: "وكالة الصفوة للحج والعمرة",
      description: "الوكالة الرائدة في تقديم أرقى خدمات الحج والعمرة وتأشيرات السفر بتميز وخبرة تمتد لأكثر من ١٥ عاماً في رعاية ضيوف الرحمن.",
      logo: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=300&h=300&fit=crop&q=80",
      contactPhone: "+966500000001",
      isActive: true,
    },
    {
      name: "وكالة الهدى الدولية",
      description: "نسعى لتيسير رحلات ضيوف الرحمن وتقديم برامج عمرة متكاملة وخدمات تأشيرات سريعة وموثوقة بأفضل الأسعار.",
      logo: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300&h=300&fit=crop&q=80",
      contactPhone: "+966500000002",
      isActive: true,
    },
    {
      name: "مكتب زمزم للسياحة والسفر",
      description: "نوفر لعملائنا الكرام أفضل حجوزات الفنادق المطلة على الحرمين الشريفين وخدمات المواصلات VIP وباقات العمرة الاقتصادية المميزة.",
      logo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=300&fit=crop&q=80",
      contactPhone: "+966500000003",
      isActive: true,
    },
    {
      name: "وكالة ركائز الإيمان",
      description: "نهتم بأدق تفاصيل رحلتكم الإيمانية، من السكن الفاخر والمواصلات الحديثة إلى الإرشاد الديني والخدمات الميدانية المتواصلة.",
      logo: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&h=300&fit=crop&q=80",
      contactPhone: "+966500000004",
      isActive: true,
    },
    {
      name: "أجنحة الحرمين للسفر",
      description: "خدمات سفر راقية وحجوزات فندقية فاخرة تضمن لكم الطمأنينة والراحة التامة خلال تأدية المناسك.",
      logo: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=300&fit=crop&q=80",
      contactPhone: "+966500000005",
      isActive: true,
    }
  ];

  const seededAgencies = [];
  for (const agency of agencies) {
    const created = await prisma.agency.create({ data: agency });
    seededAgencies.push(created);
  }
  console.log(`🏢 Created ${seededAgencies.length} registered agencies.`);

  // 3. Create realistic packages linked to these agencies
  const packages = [
    {
      title: "عمرة براً - اقتصادي",
      description: "رحلة عمرة برية مريحة في حافلات VIP حديثة ومكيفة، مع سكن 3 نجوم بالقرب من الحرمين الشريفين.",
      price: 1800,
      discount: 150,
      features: JSON.stringify([
        "النقل بحافلات نقل جماعي VIP مكيفة",
        "سكن 3 نجوم في مكة (5 أيام) والمدينة (3 أيام)",
        "تأشيرة العمرة مشمولة",
        "مزارات المدينة المنورة",
        "مرشد ديني مرافق للرحلة"
      ]),
      type: "UMRAH",
      duration: "14 يوم",
      hotelMakkah: "فندق برج الساعاتي (محبس الجن)",
      hotelMadinah: "فندق ديار طابة",
      agencyId: seededAgencies[2].id, // زمزم
    },
    {
      title: "عمرة جواً - مريحة",
      description: "عمرة بطيران مباشر مع إقامة فاخرة 4 نجوم ووجبة إفطار، لتوفير أقصى درجات الراحة لضيوف الرحمن.",
      price: 3500,
      discount: 300,
      features: JSON.stringify([
        "تذاكر الطيران ذهاب وعودة",
        "إقامة 4 نجوم مع الإفطار",
        "استقبال وتوديع في المطار",
        "تأشيرة العمرة",
        "حافلات خاصة للتنقل الداخلي",
        "شنطة وهدايا للمعتمرين"
      ]),
      type: "UMRAH",
      duration: "10 أيام",
      hotelMakkah: "فندق سويس أوتيل المقام",
      hotelMadinah: "فندق أنوار المدينة موڤنبيك",
      agencyId: seededAgencies[1].id, // الهدى
    },
    {
      title: "حج VIP - خيام (أ)",
      description: "باقة الحج المتكاملة لأداء الفريضة بطمأنينة تامة. تشمل سكن 5 نجوم مقابل الحرم ومخيمات VIP مطورة في المشاعر.",
      price: 18000,
      discount: 500,
      features: JSON.stringify([
        "طيران مباشر (صنعاء/عدن - جدة)",
        "سكن 5 نجوم (أبراج البيت) مع إعاشة كاملة",
        "مخيمات فئة (أ) مطورة في منى وعرفات",
        "قطار المشاعر",
        "حقيبة الحاج المتكاملة ورعاية طبية"
      ]),
      type: "HAJJ",
      duration: "18 يوم",
      hotelMakkah: "فندق ساعة مكة فيرمونت",
      hotelMadinah: "فندق دار التقوى",
      agencyId: seededAgencies[0].id, // الصفوة
    },
    {
      title: "تأشيرة سياحية",
      description: "تأشيرة زيارة سياحية للمملكة العربية السعودية (صلاحية سنة، متعددة السفرات) تستخرج بسرعة وسهولة وبأقل المتطلبات.",
      price: 600,
      discount: 0,
      features: JSON.stringify([
        "إصدار خلال 24 ساعة",
        "تأمين طبي مشمول",
        "متعددة السفرات",
        "صلاحية لمدة سنة كاملة",
        "بدون تعقيدات أو أوراق إضافية"
      ]),
      type: "VISA",
      duration: "سنة واحدة",
      hotelMakkah: null,
      hotelMadinah: null,
      agencyId: seededAgencies[3].id, // ركائز الإيمان
    }
  ];

  for (const pkg of packages) {
    await prisma.package.create({ data: pkg });
  }
  console.log("📦 Created 4 realistic packages associated with agencies.");

  // 4. Create Travel Services
  const servicesData = [
    {
      title: "إصدار تأشيرة عمرة سريعة",
      description: "استخراج تأشيرة العمرة الإلكترونية المعتمدة من وزارة الحج والعمرة السعودية خلال 24 ساعة فقط.",
      price: 750,
      isActive: true,
      requirements: JSON.stringify([
        "جواز سفر ساري المفعول لمدة لا تقل عن 6 أشهر",
        "صورة شخصية حديثة بخلفية بيضاء",
        "شهادة تطعيم ضد الحمى الشوكية (اختياري حسب الدولة)"
      ])
    },
    {
      title: "تأشيرة سياحية متعددة الدخول للمملكة",
      description: "إصدار تأشيرة سياحية رسمية صالحة لمدة عام كامل تتيح دخولاً متعدداً للمملكة وأداء العمرة.",
      price: 900,
      isActive: true,
      requirements: JSON.stringify([
        "جواز سفر ساري المفعول لمدة لا تقل عن 6 أشهر",
        "تأشيرة سارية أو إقامة في دول الخليج أو شنغن/أمريكا (في بعض الحالات)",
        "صورة شخصية وتأمين طبي سياحي داخل المملكة"
      ])
    }
  ];

  for (const svc of servicesData) {
    await prisma.service.create({ data: svc });
  }
  console.log("🛠️ Created services.");

  // 5. Create System Settings
  const settingsData = [
    { key: "site_name", value: "رحلات النور" },
    { key: "contact_email", value: "info@alnoortravel.com" },
    { key: "contact_phone", value: "+966501234567" },
    { key: "address", value: "المملكة العربية السعودية، مكة المكرمة، طريق إبراهيم الخليل، برج النور" },
    { key: "whatsapp", value: "+966501234567" },
    { key: "telegram", value: "@alnoor_travel_bot" },
    { 
      key: "ai_welcome_message", 
      value: "أهلاً بك في رحلات النور 🌟، أنا مستشارك الإيماني الرقمي. كيف يمكنني مساعدتك اليوم في التخطيط لرحلة العمرة أو الحج، أو التحقق من أهليتك للتأشيرة؟" 
    }
  ];

  for (const setting of settingsData) {
    await prisma.settings.create({ data: setting });
  }
  console.log("⚙️ Created system settings.");

  // 6. Create Admin User
  const adminPassword = "225211.10";
  const passwordHash = crypto.createHash("sha256").update(adminPassword).digest("hex");
  
  await prisma.user.create({
    data: {
      name: "أبو أحمد (مدير النظام)",
      email: "admin@alnoortravel.com",
      passwordHash: passwordHash,
      role: "ADMIN"
    }
  });
  console.log("👤 Created admin user.");

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
