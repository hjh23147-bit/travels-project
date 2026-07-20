import prisma from "./db";
import nodemailer from "nodemailer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendTelegramNotification(lead: any) {
  try {
    const settings = await prisma.settings.findMany({
      where: {
        key: { in: ["telegram_bot_token", "telegram_chat_id"] }
      }
    });

    const botToken = settings.find(s => s.key === "telegram_bot_token")?.value;
    const chatId = settings.find(s => s.key === "telegram_chat_id")?.value;

    if (!botToken || !chatId) {
      console.log("Telegram notifications are not configured.");
      return;
    }

    const serviceLabels: Record<string, string> = {
      HAJJ: "حج",
      UMRAH: "عمرة",
      VISA: "تأشيرة",
      TRAVEL: "سفر",
    };

    const serviceName = serviceLabels[lead.serviceType] || lead.serviceType;
    
    const message = `
🌟 <b>طلب جديد عبر الموقع!</b>

👤 <b>الاسم:</b> ${lead.name}
📱 <b>الهاتف:</b> ${lead.phone}
🌍 <b>الدولة:</b> ${lead.country}
🧳 <b>الخدمة المطلوبة:</b> ${serviceName}
👥 <b>عدد الأشخاص:</b> ${lead.travelersCount}
📅 <b>تاريخ السفر المفضل:</b> ${new Date(lead.travelDate).toLocaleDateString("ar-SA")}
💰 <b>الميزانية:</b> ${lead.budget} ريال
📝 <b>ملاحظات:</b> ${lead.notes || "لا يوجد"}

<i>يرجى التواصل مع العميل في أقرب وقت.</i>
    `.trim();

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      console.error("Failed to send Telegram message", await response.text());
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendEmailNotification(lead: any, agencyName?: string) {
  try {
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL || "walnedari@gmail.com";

    if (!smtpEmail || !smtpPassword) {
      console.log("Email notifications are not configured. Missing SMTP credentials.");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });

    const serviceLabels: Record<string, string> = {
      HAJJ: "حج",
      UMRAH: "عمرة",
      VISA: "تأشيرة",
      TRAVEL: "سفر",
    };

    const serviceName = serviceLabels[lead.serviceType] || lead.serviceType;
    const agencyText = agencyName ? `المكتب المختار: ${agencyName}` : "المكتب المختار: الإدارة الرئيسية";

    const mailOptions = {
      from: `"رحلات النور" <${smtpEmail}>`,
      to: adminEmail,
      subject: `طلب حجز جديد 🌟 - ${lead.name}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #0891b2; color: #fff; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">طلب حجز جديد 🌟</h2>
            <p style="margin: 5px 0 0 0;">يوجد طلب جديد عبر منصة رحلات النور</p>
          </div>
          <div style="padding: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>الاسم:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.name}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>الهاتف:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;" dir="ltr">${lead.phone}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>الدولة:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.country}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>الخدمة المطلوبة:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${serviceName}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>عدد الأشخاص:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.travelersCount}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>تاريخ السفر المفضل:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date(lead.travelDate).toLocaleDateString("ar-SA")}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${agencyText}</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;"></td></tr>
            </table>
            <p style="margin-top: 20px; font-size: 14px; color: #666;">يمكنك عرض كافة تفاصيل الطلبات من خلال لوحة تحكم الإدارة.</p>
          </div>
          <div style="background-color: #f9fafb; color: #9ca3af; text-align: center; padding: 10px; font-size: 12px;">
            نظام الإشعارات الآلي - رحلات النور
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to", adminEmail);
  } catch (error) {
    console.error("Error sending email notification:", error);
  }
}
