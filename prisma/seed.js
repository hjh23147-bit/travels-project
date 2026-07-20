/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // 1. تنظيف قاعدة البيانات
  await prisma.inquiry.deleteMany({});
  await prisma.settings.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.package.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Database cleared.");

  // 2. إنشاء حساب المشرف الافتراضي
  const adminPassword = "admin";
  const passwordHash = crypto.createHash("sha256").update(adminPassword).digest("hex");
  
  const admin = await prisma.user.create({
    data: {
      name: "أبو أحمد (مدير النظام)",
      email: "admin@alnoortravel.com",
      passwordHash: passwordHash,
      role: "ADMIN"
    }
  });
  console.log(`Created admin user with email: ${admin.email} (Password: admin)`);

  // 3. إنشاء باقات الحج والعمرة والرحلات
  const packagesData = [
    {
      title: "باقة النور الملكية - عمرة VIP",
      description: "رحلة عمرة إيمانية متكاملة تشمل السكن في فنادق 5 نجوم مطلة على الحرم مباشرة مع الطيران الفاخر والمواصلات الخاصة.",
      price: 4500,
      discount: 500,
      features: JSON.stringify([
        "سكن 5 نجوم (فندق موفنبيك برج هاجر مكة) - إطلالة حرم",
        "سكن 5 نجوم بالمدينة (فندق دار التقوى) - قبالة الروضة الشريفة",
        "تأشيرة العمرة وتأمين طبي شامل لجميع المخاطر",
        "تذاكر الطيران ذهاب وإياب على الخطوط السعودية",
        "تنقلات خاصة بسيارات كاديلاك حديثة ومكيفة",
        "مزارات تاريخية وأثرية في مكة والمدينة بمرافقة مرشد مؤهل",
        "مرشد ديني مرافق للرحلة للإجابة عن الاستفسارات"
      ]),
      type: "UMRAH",
      isActive: true,
      duration: "10 أيام",
      hotelMakkah: "فندق موفنبيك برج هاجر مكة",
      hotelMadinah: "فندق دار التقوى المدينة"
    },
    {
      title: "باقة النور الاقتصادية - عمرة ميسرة",
      description: "رحلة عمرة مميزة بأسعار اقتصادية تناسب الجميع، مع سكن مريح وقريب من الحرم وتوفير باصات ترددية على مدار الساعة.",
      price: 2500,
      discount: 0,
      features: JSON.stringify([
        "سكن 4 نجوم (فندق ميريديان مكة) - مسافة قريبة مع حافلات ترددية",
        "سكن 4 نجوم بالمدينة (فندق روف المدينة)",
        "تأشيرة العمرة والتأمين الطبي الرسمي",
        "حافلات حديثة ومكيفة مخصصة للتنقل بين المدن والمزارات",
        "مرافقة إشرافية كاملة طوال فترة الرحلة",
        "توزيع وجبات جافة يومياً وحقيبة هدايا المعتمر"
      ]),
      type: "UMRAH",
      isActive: true,
      duration: "12 يوم",
      hotelMakkah: "فندق ميريديان مكة",
      hotelMadinah: "فندق روف المدينة"
    },
    {
      title: "باقة النور الفاخرة - حج 1447هـ",
      description: "رحلة العمر الكبرى لموسم الحج، خدمة VIP متميزة في المشاعر المقدسة (منى وعرفات) ومخيمات فاخرة مكيفة مع بوفيه مفتوح على مدار الساعة.",
      price: 28000,
      discount: 2000,
      features: JSON.stringify([
        "تأشيرة الحج الرسمية المعتمدة وتأمين طبي شامل",
        "سكن فاخر بمكة المكرمة قبل التوجه للمشاعر",
        "مخيمات VIP مطورة ومكيفة بالكامل في منى وعرفات",
        "بوفيه مفتوح ووجبات ومشروبات متواصلة في المشاعر",
        "تذاكر قطار المشاعر الفاخر ووسائل نقل VIP خاصة",
        "طاقم طبي وإداري متكامل ودعاة مرافقين طوال الرحلة",
        "توفير هدايا الحاج الفاخرة ومستلزمات الإحرام والنسك"
      ]),
      type: "HAJJ",
      isActive: true,
      duration: "18 يوم",
      hotelMakkah: "فندق برج الساعة مكة",
      hotelMadinah: "فندق أوبروي المدينة"
    }
  ];

  for (const pkg of packagesData) {
    await prisma.package.create({ data: pkg });
  }
  console.log("Created packages sample data.");

  // 4. إنشاء خدمات السفر والتأشيرات
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
    },
    {
      title: "حجز فنادق فاخرة بأسعار تفضيلية",
      description: "حجوزات مؤكدة في أرقى فنادق مكة والمدينة بأقل الأسعار وحسب ميزانيتك الخاصة.",
      price: null,
      isActive: true,
      requirements: JSON.stringify([
        "تحديد التواريخ المطلوبة بدقة",
        "تحديد عدد الأفراد والسرير المطلوب",
        "تحديد القرب المطلوب من ساحات الحرم"
      ])
    },
    {
      title: "تأجير سيارات وسائق خاص VIP",
      description: "توفير سيارات فاخرة وحديثة مع سائقين محترفين وذوي خبرة لتنقلاتكم طوال فترة النسك.",
      price: 300,
      isActive: true,
      requirements: JSON.stringify([
        "تحديد موعد وتفاصيل الوصول (المطار)",
        "تحديد مسار الرحلة (جدة - مكة - المدينة)",
        "تحديد حجم السيارة المناسب لعدد الحقائب والأفراد"
      ])
    }
  ];

  for (const svc of servicesData) {
    await prisma.service.create({ data: svc });
  }
  console.log("Created travel services sample data.");

  // 5. إنشاء الإعدادات العامة للموقع
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
  console.log("Created system settings sample data.");

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
