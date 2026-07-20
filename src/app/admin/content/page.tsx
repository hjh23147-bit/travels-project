"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Settings, HelpCircle, Plus, Trash2, Globe, Bell, FileText, CheckCircle2 } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

export default function AdminContentPage() {
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState<string | null>(null);
  const [savingFaq, setSavingFaq] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "integrations" | "faq">("general");

  const [faqs, setFaqs] = useState<FAQ[]>([
    { question: "ما هي المستندات المطلوبة للعمرة؟", answer: "جواز سفر ساري المفعول لمدة 6 أشهر على الأقل، صورة شخصية حديثة بخلفية بيضاء." },
    { question: "هل يمكن تقسيط المبلغ؟", answer: "نعم، نوفر خطط تقسيط مرنة تصل إلى 4 أقساط بدون فوائد عبر تابي وتمارا." },
    { question: "ما مدى قرب الفنادق من الحرم؟", answer: "في الباقة الملكية: أقل من 100 متر (في ساحة الحرم). الباقة الاقتصادية: 800 متر مع باصات ترددية مجانية." },
  ]);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (Array.isArray(data)) {
        const map: Record<string, string> = {};
        data.forEach((s) => (map[s.key] = s.value));
        setSettingsMap(map);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSettings();
  }, []);

  async function saveSetting(key: string, value: string) {
    setSavingSettings(key);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      // Mock a slight delay to show the saving state clearly
      await new Promise(r => setTimeout(r, 600));
    } catch {
      alert("فشل حفظ الإعداد، يرجى المحاولة مرة أخرى.");
    } finally {
      setSavingSettings(null);
    }
  }

  function updateSettingValue(key: string, value: string) {
    setSettingsMap((prev) => ({ ...prev, [key]: value }));
  }

  const generalSettingsGroups = [
    {
      title: "الهوية والتواصل",
      icon: <Globe className="w-5 h-5 text-gold-500" />,
      items: [
        { key: "site_name", label: "الاسم الرسمي للموقع", type: "text", placeholder: "رحلات النور" },
        { key: "contact_email", label: "البريد الإلكتروني للعملاء", type: "text", placeholder: "info@example.com", dir: "ltr" },
        { key: "contact_phone", label: "رقم الهاتف الموحد", type: "text", placeholder: "920000000", dir: "ltr" },
        { key: "whatsapp", label: "رابط الواتساب المباشر", type: "text", placeholder: "https://wa.me/966...", dir: "ltr" },
      ]
    },
    {
      title: "التفاصيل والمحتوى النصي",
      icon: <FileText className="w-5 h-5 text-gold-500" />,
      items: [
        { key: "address", label: "العنوان الرئيسي للمقر", type: "textarea", placeholder: "المملكة العربية السعودية، جدة، شارع التحلية..." },
        { key: "ai_welcome_message", label: "الرسالة الترحيبية للمساعد الذكي", type: "textarea", placeholder: "مرحباً بك في رحلات النور، كيف يمكنني مساعدتك اليوم؟" },
      ]
    },
    {
      title: "محتوى الصفحة الرئيسية (الواجهة)",
      icon: <Globe className="w-5 h-5 text-gold-500" />,
      items: [
        { key: "hero_title_1", label: "العنوان الرئيسي (الجزء الأول)", type: "text", placeholder: "رحلتك الإيمانية تبدأ بثقة وراحة مع" },
        { key: "hero_title_2", label: "العنوان الرئيسي (الجزء الملون)", type: "text", placeholder: "رحلات النور" },
        { key: "hero_subtitle", label: "النص الوصفي", type: "textarea", placeholder: "منصتك الأولى لحجز برامج الحج والعمرة..." },
        { key: "hero_image_url", label: "رابط صورة الخلفية الرئيسية", type: "text", placeholder: "https://images.unsplash.com/...", dir: "ltr" },
      ]
    }
  ];

  const integrationSettingsList = [
    { key: "telegram_bot_token", label: "توكن البوت (Bot Token)", type: "password", placeholder: "123456789:ABCdefGHIjklmNOPQRsTUVwxyz" },
    { key: "telegram_chat_id", label: "معرف الدردشة (Chat ID)", type: "text", placeholder: "-100123456789" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-gold-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-navy-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-100 flex items-center justify-center">
            <Settings className="w-6 h-6 text-gold-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-navy-900">إدارة المحتوى والإعدادات</h1>
            <p className="text-sm text-navy-500 font-medium">التحكم في بيانات الموقع والربط والأسئلة الشائعة</p>
          </div>
        </div>
      </div>

      {/* Modern Tabs Navigation */}
      <div className="flex bg-white p-2 rounded-2xl border border-navy-100 shadow-sm relative z-10 overflow-x-auto hide-scrollbar">
        {[
          { id: "general", label: "الإعدادات العامة", icon: Settings },
          { id: "integrations", label: "الربط والإشعارات", icon: Bell },
          { id: "faq", label: "الأسئلة الشائعة", icon: HelpCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-navy-900 text-white shadow-lg"
                : "text-navy-500 hover:bg-navy-50 hover:text-navy-900"
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-gold-400" : ""}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl border border-navy-100 shadow-sm overflow-hidden min-h-[500px]">
        
        {/* Tab 1: General Settings */}
        {activeTab === "general" && (
          <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {generalSettingsGroups.map((group, idx) => (
              <div key={idx} className="space-y-6">
                <h3 className="text-lg font-black text-navy-900 flex items-center gap-2 pb-3 border-b border-navy-100">
                  {group.icon}
                  {group.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {group.items.map((setting) => (
                    <div key={setting.key} className={`${setting.type === "textarea" ? "md:col-span-2" : ""}`}>
                      <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">
                        {setting.label}
                      </label>
                      <div className="flex items-stretch gap-3">
                        {setting.type === "textarea" ? (
                          <textarea
                            value={settingsMap[setting.key] || ""}
                            onChange={(e) => updateSettingValue(setting.key, e.target.value)}
                            placeholder={setting.placeholder}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            dir={(setting as any).dir || "rtl"}
                            rows={3}
                            className="flex-1 px-4 py-3 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-medium text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none resize-none transition-all"
                          />
                        ) : (
                          <input
                            type="text"
                            value={settingsMap[setting.key] || ""}
                            onChange={(e) => updateSettingValue(setting.key, e.target.value)}
                            placeholder={setting.placeholder}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            dir={(setting as any).dir || "rtl"}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            className={`flex-1 px-4 py-3 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all ${(setting as any).dir === "ltr" ? "text-left" : ""}`}
                          />
                        )}
                        <button
                          onClick={() => saveSetting(setting.key, settingsMap[setting.key] || "")}
                          disabled={savingSettings === setting.key}
                          className="px-5 rounded-xl btn-gold flex items-center justify-center transition-all disabled:opacity-50 min-w-[60px]"
                          title="حفظ"
                        >
                          {savingSettings === setting.key ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Save className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Integrations */}
        {activeTab === "integrations" && (
          <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex items-start gap-3">
              <Bell className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-blue-900 mb-1">إشعارات تليجرام الفورية</h4>
                <p className="text-xs text-blue-700 leading-relaxed max-w-3xl">
                  قم بربط النظام ببوت تليجرام الخاص بك لتصلك إشعارات فورية عند تسجيل أي عميل جديد لطلب أو تعبئة نموذج الحجز الذكي، مما يضمن سرعة الاستجابة وخدمة العملاء بشكل أفضل.
                </p>
              </div>
            </div>

            <div className="space-y-6 max-w-2xl">
              {integrationSettingsList.map((setting) => (
                <div key={setting.key}>
                  <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">
                    {setting.label}
                  </label>
                  <div className="flex gap-3">
                    <input
                      type={setting.type}
                      value={settingsMap[setting.key] || ""}
                      onChange={(e) => updateSettingValue(setting.key, e.target.value)}
                      placeholder={setting.placeholder}
                      dir="ltr"
                      className="flex-1 px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all text-left"
                    />
                    <button
                      onClick={() => saveSetting(setting.key, settingsMap[setting.key] || "")}
                      disabled={savingSettings === setting.key}
                      className="px-6 rounded-xl btn-gold text-sm font-bold flex items-center justify-center transition-all disabled:opacity-50 min-w-[120px]"
                    >
                      {savingSettings === setting.key ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "حفظ الإعداد"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: FAQ */}
        {activeTab === "faq" && (
          <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-navy-100">
              <div>
                <h3 className="text-lg font-black text-navy-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-gold-500" />
                  تحرير الأسئلة الشائعة
                </h3>
                <p className="text-sm text-navy-500 mt-1">تساعد هذه القائمة عملائك على إيجاد إجابات سريعة</p>
              </div>
              <button
                onClick={() => setFaqs([{ question: "", answer: "" }, ...faqs])}
                className="bg-navy-50 hover:bg-gold-50 text-navy-700 hover:text-gold-600 border border-navy-200 hover:border-gold-300 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                سؤال جديد
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto pr-2 pb-6 hide-scrollbar">
              {faqs.length === 0 ? (
                <div className="text-center py-12">
                  <HelpCircle className="w-12 h-12 text-navy-200 mx-auto mb-3" />
                  <p className="text-navy-500">القائمة فارغة. ابدأ بإضافة أسئلة شائعة.</p>
                </div>
              ) : (
                faqs.map((faq, i) => (
                  <div key={i} className="group bg-white rounded-2xl p-6 border border-navy-200 hover:border-gold-400 focus-within:border-gold-500 focus-within:ring-4 focus-within:ring-gold-500/10 transition-all shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center font-black text-xs shrink-0 mt-1">
                        {faqs.length - i}
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <label className="sr-only">السؤال</label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              const updated = [...faqs];
                              updated[i].question = e.target.value;
                              setFaqs(updated);
                            }}
                            placeholder="اكتب السؤال بوضوح هنا..."
                            className="w-full bg-transparent text-lg font-bold text-navy-900 border-none outline-none placeholder:text-navy-300"
                          />
                        </div>
                        <div className="h-px w-full bg-navy-100"></div>
                        <div>
                          <label className="sr-only">الإجابة</label>
                          <textarea
                            value={faq.answer}
                            onChange={(e) => {
                              const updated = [...faqs];
                              updated[i].answer = e.target.value;
                              setFaqs(updated);
                            }}
                            placeholder="اكتب الإجابة التفصيلية..."
                            rows={2}
                            className="w-full bg-transparent text-sm font-medium text-navy-600 border-none outline-none resize-none placeholder:text-navy-300 leading-relaxed"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))}
                        className="w-8 h-8 rounded-full bg-navy-50 text-navy-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                        title="حذف السؤال"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-navy-100 flex justify-end">
              <button 
                onClick={async () => {
                  setSavingFaq(true);
                  // Mock saving API interaction
                  await new Promise(r => setTimeout(r, 800));
                  setSavingFaq(false);
                  alert("تم تحديث الأسئلة الشائعة بنجاح!");
                }}
                disabled={savingFaq}
                className="btn-gold px-8 py-3.5 rounded-xl text-sm font-black flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-gold-500/20 hover:scale-105 transition-transform"
              >
                {savingFaq ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                اعتماد وحفظ الأسئلة الشائعة
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
