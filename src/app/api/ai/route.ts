import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

const SYSTEM_PROMPT = `أنت "مُعاون النور"، مستشار إيماني ذكي، متحدث شديد اللباقة، عالي التعاطف، وذو خبرة واسعة في خدمات الحج والعمرة والتأشيرات لدى "رحلات النور" في الجمهورية اليمنية.

شخصيتك وقدراتك (الذكاء العاطفي):
- أنت لست مجرد روبوت يجيب بالمعلومات، بل إنسان مستشار يشعر بالعميل.
- إذا كان العميل كبيراً في السن أو يسأل عن شخص مقعد، أظهر اهتماماً خاصاً، وادعُ له بالصحة، وأخبره أننا نوفر "كراسي متحركة، مسارات ميسرة، ومرافقة خاصة" لخدمة ضيوف الرحمن براحة تامة.
- إذا اشتكى العميل من السعر أو أن الميزانية لا تسمح، تعاطف معه جداً، واطرح الحلول: "نعلم أن الشوق للحرم كبير، لذا وفرنا خطط تقسيط مرنة تصل لـ 4 أقساط ميسرة بدون فوائد لنسهل عليك هذه الرحلة العظيمة".
- تتقن اللغة العربية الفصحى البسيطة وتفهم اللهجات ببراعة.
- أجب بحماس ودفء واستخدم الإيموجي المناسبة 🌟 🕋 ✨.
- تنسيق إجاباتك يجب أن يكون بـ Markdown (عناوين، قوائم، خط عريض) لتسهيل القراءة.

التعامل المرئي والروابط (مهم جداً):
- ارفق دائماً صوراً توضيحية لزيادة الإقناع باستخدام Markdown:
  - صورة مكة: ![مكة المكرمة](https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80)
  - صورة المدينة: ![المدينة المنورة](https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&q=80)
  - صورة الكعبة: ![الكعبة](https://images.unsplash.com/photo-1565552645632-d725e8bfc19a?w=800&q=80)
- لتسهيل الحجز، ضع رابط: [احجز رحلتك الآن](/book) أو [تصفح باقاتنا](/hajj-umrah) أو [تأشيراتنا](/visas)

القاعدة المعرفية (بيانات رحلات النور):
- المقر الرئيسي: صنعاء، الجمهورية اليمنية.
- التراخيص: مرخصون من وزارة الأوقاف والإرشاد اليمنية واتحاد وكالات السفر اليمنية.
- باقة النور الملكية (عمرة VIP): 4500 ريال - فنادق 5 نجوم (مثل فيرمونت برج الساعة) مطلة على الحرم.
- باقة النور الاقتصادية (عمرة ميسرة): 2500 ريال - فنادق 4 نجوم مع باصات ترددية.
- باقة النور الفاخرة (حج): 28000 ريال - خدمة VIP في المشاعر، خيام مكيفة بمنى وعرفات، بوفيه مفتوح.
- التأشيرات: تأشيرة عمرة بـ 750 ريال خلال 24 ساعة. تأشيرة سياحية بـ 900 ريال.
- الضمانات: استرداد 100% عند الإلغاء قبل 30 يوم، ومطابقة لأدنى الأسعار بالسوق.

استراتيجية جمع البيانات (Lead Generation):
- عندما تشعر أن العميل مهتم ويريد الحجز، اطلب منه: "الاسم ورقم الجوال" ليتواصل معه الفريق فوراً.
- إذا أعطاك العميل اسمه ورقمه، أجب حصراً بـ:
"✅ تم استلام بياناتك بنجاح! سيتواصل معك أحد خبرائنا خلال لحظات. شكراً لاختيارك رحلات النور 🌟"
- ثم أضف في نهاية الرد في سطر منفصل: [LEAD:الاسم:رقم_الهاتف]`;

function getSmartReply(message: string): string {
  const msg = message.toLowerCase();

  // Handle Empathy (Price)
  if (msg.includes("غالي") || msg.includes("ما عندي") || msg.includes("ميزانية") || msg.includes("ظروفي")) {
    return "أشعر بك تماماً يا غالي، والشوق لبيت الله الحرام لا يقدر بثمن 🕋\n\nلأننا في رحلات النور نهتم بتيسير هذه العبادة العظيمة لك، وفرنا **خطط تقسيط مرنة جداً** (حتى 4 أشهر) وبدون أي فوائد إضافية!\nيمكنك الحجز بدفعة أولى بسيطة جداً.\n\nهل تحب أن أربطك بأحد مستشارينا هاتفياً ليشرح لك كيف نرتبها لك؟ فقط اترك رقمك هنا.";
  }

  // Handle Empathy (Elderly / Wheelchair)
  if (msg.includes("كبير") || msg.includes("عجوز") || msg.includes("مقعد") || msg.includes("كرسي") || msg.includes("مريض") || msg.includes("أمي") || msg.includes("ابي") || msg.includes("أبي")) {
    return "حفظهم الله لك وأطال في أعمارهم على طاعته 🤲\n\nلا تقلق أبداً، هذه أمانة في أعناقنا. باقاتنا توفر رعاية خاصة لكبار السن وذوي الاحتياجات الخاصة وتشمل:\n• توفير كراسي متحركة حديثة.\n• غرف قريبة جداً من المصاعد والحرم.\n• مسارات ميسرة خالية من المتاعب.\n\n![رعاية فائقة](https://images.unsplash.com/photo-1542314831-c6a4d14d8373?w=800&q=80)\n\nلنرتب لهم رحلة مريحة، تواصل معنا عبر [صفحة الحجز](/book).";
  }

  if (msg.includes("سعر") || msg.includes("بكام") || msg.includes("كم")) {
    return "أسعارنا شفافة وتناسب الجميع 💰\n\n• **باقة العمرة الاقتصادية**: 2,500 ريال\n• **باقة العمرة الملكية VIP**: 4,500 ريال\n• **باقة الحج الفاخرة**: 28,000 ريال\n\n![باقاتنا](https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80)\n\nتتوفر خيارات تقسيط مريحة. ما هي ميزانيتك التقريبية؟ [احجز الآن](/book)";
  }

  if (msg.includes("حج")) {
    return "الحج المبرور ليس له جزاء إلا الجنة 🕋\n\nباقة الحج الفاخرة لموسم 1447هـ متوفرة بسعر 28,000 ريال وتشمل كل ما تحتاجه للراحة التامة:\nتأشيرة، سكن فاخر، خيام VIP بمنى، مرشد ديني خاص.\n\n[احجز مقعدك في الحج](/book)";
  }

  const phoneMatch = msg.match(/(\d{8,})/);
  if (phoneMatch) {
    return "✅ تم استلام بياناتك بنجاح!\n\nسيتواصل معك أحد مستشارينا خلال دقائق. شكراً لثقتك بـ رحلات النور 🌟";
  }

  return "أهلاً بك يا غالي في رحلات النور، مرخصون من وزارة الأوقاف والإرشاد اليمنية! 🌟\n\nأنا هنا لمساعدتك والتخفيف عنك. يمكنني:\n• شرح [باقاتنا](/hajj-umrah) (وتقسيطها)\n• تجهيز [التأشيرات](/visas)\n• تذليل أي صعوبات تواجهك.\n\nكيف أخدمك اليوم؟";
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    // Check for lead capture pattern
    const phoneMatch = message.match(/(\d{8,})/);
    const hasName = message.length > 3 && !message.match(/^\d+$/);

    if (phoneMatch && hasName) {
      try {
        await prisma.inquiry.create({
          data: {
            name: message.replace(/\d+/g, "").trim() || "عميل يمني جديد",
            phone: phoneMatch[0],
            message: `تحويل صوتي/كتابي من المساعد الذكي`,
            isLead: true,
          },
        });
      } catch {
        // silently continue
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.length > 10) {
      try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const chatHistory = (history || []).map((msg: { role: string; content: string }) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
          history: [
            { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
            { role: "model", parts: [{ text: "فهمت. أنا مُعاون النور، مستعد لخدمة ضيوف الرحمن بكل تعاطف وحب." }] },
            ...chatHistory,
          ],
        });

        const result = await chat.sendMessage(message);
        let reply = result.response.text();

        // Lead capture processing
        const leadMatch = reply.match(/\[LEAD:(.+?):(.+?)\]/);
        if (leadMatch) {
          reply = reply.replace(/\[LEAD:.+?\]/, "").trim();
          try {
            await prisma.inquiry.create({
              data: {
                name: leadMatch[1],
                phone: leadMatch[2],
                message: `تسجيل عبر الشات الذكي المتعاطف`,
                isLead: true,
              },
            });
          } catch {
            // silently continue
          }
        }

        return NextResponse.json({ reply });
      } catch {
        // Fallback
      }
    }

    const reply = getSmartReply(message);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { reply: "عذراً، حدث خطأ. يمكنك الاتصال بنا فوراً: 967781668332+" },
      { status: 500 }
    );
  }
}
