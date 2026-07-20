"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles, Mic, MicOff, Info, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "مرحبًا، أنا مساعد رحلات النور، كيف أقدر أساعدك؟",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("chat_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedAt = localStorage.getItem("chat_history_at");
        if (savedAt && Date.now() - parseInt(savedAt) < 86400000) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setMessages(parsed);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (messages.length > 1) { 
      try {
        localStorage.setItem("chat_history", JSON.stringify(messages));
        localStorage.setItem("chat_history_at", String(Date.now()));
      } catch {}
    }
  }, [messages]);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>("");
  const shouldRestartRef = useRef<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowTooltip(true);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false; 
        recognition.interimResults = true;
        recognition.lang = "ar-SA";

        recognition.onstart = () => {
          setIsRecording(true);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          let interimTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscriptRef.current += event.results[i][0].transcript + " ";
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          setInput(finalTranscriptRef.current + interimTranscript);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onerror = (event: any) => {
          if (event.error === "network") {
            setInput((prev) => prev + " [حدث خطأ في شبكة التعرف على الصوت. الرجاء التحدث ببطء أو استخدام الكتابة] ");
          }
          shouldRestartRef.current = false;
          setIsRecording(false);
        };

        recognition.onend = () => {
          if (shouldRestartRef.current) {
            try {
              recognition.start();
            } catch {
              setIsRecording(false);
            }
          } else {
            setIsRecording(false);
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      shouldRestartRef.current = false;
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        setInput(""); 
        finalTranscriptRef.current = ""; 
        shouldRestartRef.current = true; 
        try {
          recognitionRef.current.start();
        } catch {
          recognitionRef.current.stop();
          setTimeout(() => {
            if (shouldRestartRef.current) recognitionRef.current.start();
          }, 100);
        }
      } else {
        alert("عذراً، متصفحك لا يدعم ميزة التسجيل الصوتي.");
      }
    }
  };

  const openChat = () => {
    setIsOpen(true);
    setShowTooltip(false);
  };

  const sendMessage = async (textOverride?: string) => {
    const userMessage = textOverride || input.trim();
    if (!userMessage || isLoading) return;
    
    if (isRecording) {
      shouldRestartRef.current = false;
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    if (!textOverride) setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "عذراً، لم أتمكن من الاتصال. يمكنك التواصل معنا مباشرة عبر الهاتف: 967781668332+",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showTooltip && !isOpen && (
        <div className="fixed bottom-24 left-6 z-50 animate-bounce cursor-pointer" onClick={openChat}>
          <div className="bg-navy-900 border border-gold-500/30 text-white px-4 py-3 rounded-2xl shadow-2xl relative font-bold text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-500 animate-pulse" />
              <span>مساعدك الشخصي لرحلات النور متاح هنا</span>
            </div>
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-navy-900 border-b border-r border-gold-500/30 rotate-45" />
          </div>
        </div>
      )}

      <button
        onClick={isOpen ? () => setIsOpen(false) : openChat}
        className={`chatbot-trigger fixed bottom-6 left-6 z-50 w-16 h-16 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.3)] flex items-center justify-center transition-all duration-500 ${
          isOpen
            ? "bg-navy-800 rotate-0 scale-90 border border-navy-700"
            : "bg-gold-500 hover:bg-gold-600 hover:scale-110"
        }`}
        aria-label="المساعد الذكي"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-7 h-7 text-white" />
        )}
      </button>

      <div
        className={`fixed bottom-24 left-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] transition-all duration-500 origin-bottom-left ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(11,30,45,0.2)] border border-navy-50 overflow-hidden flex flex-col h-[550px]">
          {/* Header */}
          <div className="bg-navy-900 px-6 py-5 flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl" />
            
            <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center shadow-lg relative z-10 border-2 border-gold-400">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-white font-bold text-base">مساعد النور</h3>
              <p className="text-gold-400 text-xs mt-0.5">مستشارك الذكي الفاخر</p>
            </div>
            <div className="mr-auto flex flex-col items-end gap-1 relative z-10">
              <div className="flex items-center gap-1.5 bg-green-500/20 px-2 py-1 rounded-full border border-green-500/30">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-[10px] font-bold">متصل</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-navy-50/50 scrollbar-thin scrollbar-thumb-gold-500/30 scrollbar-track-transparent">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                    msg.role === "assistant"
                      ? "bg-gold-500"
                      : "bg-navy-800"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "assistant"
                      ? "bg-white text-navy-800 shadow-sm border border-navy-100 rounded-2xl rounded-tr-sm"
                      : "bg-navy-900 text-white font-medium rounded-2xl rounded-tl-sm whitespace-pre-line shadow-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0 text-sm leading-relaxed" {...props} />,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        a: ({ node, ...props }) => <a className="text-gold-600 hover:text-gold-500 underline font-bold" {...props} />,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @next/next/no-img-element, jsx-a11y/alt-text
                        img: ({ node, ...props }) => <img className="rounded-xl mt-3 mb-3 w-full h-auto object-cover max-h-48 shadow-lg border border-navy-100" {...props} />,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        ul: ({ node, ...props }) => <ul className="list-disc pr-5 mb-2 space-y-1.5 marker:text-gold-500" {...props} />,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        ol: ({ node, ...props }) => <ol className="list-decimal pr-5 mb-2 space-y-1.5 marker:text-gold-500" {...props} />,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        strong: ({ node, ...props }) => <strong className="font-bold text-navy-900" {...props} />,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        h1: ({ node, ...props }) => <h1 className="font-bold text-lg mb-2 text-navy-900" {...props} />,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        h2: ({ node, ...props }) => <h2 className="font-bold text-base mb-2 text-navy-900" {...props} />,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        h3: ({ node, ...props }) => <h3 className="font-bold text-sm mb-2 text-navy-900" {...props} />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            
            {/* Quick Options - Show only if chat just started and no user message yet */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mt-4 ml-12">
                {["حجز عمرة", "معلومات الحج", "استفسار تأشيرة"].map(option => (
                   <button 
                     key={option}
                     onClick={() => sendMessage(option)}
                     className="text-xs font-bold text-navy-700 bg-white border border-gold-500/30 px-3 py-1.5 rounded-full hover:bg-gold-50 hover:border-gold-500 transition-colors shadow-sm flex items-center gap-1"
                   >
                     {option} <ChevronRight className="w-3 h-3" />
                   </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white px-5 py-4 rounded-2xl rounded-tr-sm shadow-sm border border-navy-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {isRecording && (
            <div className="bg-navy-50 backdrop-blur-sm px-4 py-2 border-t border-gold-500/30 flex items-center justify-center gap-1">
              <span className="text-xs text-navy-800 font-bold ml-2">جاري الاستماع... تفضل بالتحدث</span>
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-1 bg-gold-500 rounded-full animate-pulse" 
                  style={{ 
                    height: `${((i * 7) % 12) + 8}px`,
                    animationDelay: `${i * 100}ms`,
                    animationDuration: '0.5s'
                  }} 
                />
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-navy-100 shadow-[0_-5px_20px_rgba(11,30,45,0.02)]">
            <div className="flex gap-2">
              <button
                onClick={toggleRecording}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                  isRecording 
                    ? "bg-red-50 text-red-500 border border-red-200 animate-pulse" 
                    : "bg-navy-50 text-navy-600 border border-navy-100 hover:bg-navy-100 hover:text-navy-900"
                }`}
                title="تحدث صوتياً"
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={isRecording ? "تحدث الآن..." : "اكتب استفسارك..."}
                disabled={isRecording}
                className="flex-1 px-4 py-3 bg-navy-50 rounded-xl text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-1 focus:ring-gold-500 border border-transparent transition-all"
              />
              
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center disabled:opacity-50 hover:bg-navy-800 transition-all flex-shrink-0 shadow-md"
              >
                <Send className="w-5 h-5 text-gold-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
