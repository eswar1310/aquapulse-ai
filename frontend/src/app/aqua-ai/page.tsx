"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, Image as ImageIcon, Camera, FileText, CloudSun, ShieldAlert, Activity, ArrowRight, TrendingUp, TrendingDown, Volume2, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import MithramaTerminal from "@/components/MithramaTerminal";
import { getApiUrl } from "@/lib/api";
import { useSearchParams } from "next/navigation";

interface ChatMessage {
  id: string;
  sender: 'user' | 'mithrama';
  text: string;
  isAudio?: boolean;
}

function AquaAIChatContent() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'mithrama', text: "Namaskaram! I'm Mithrama 👋\nHow can I help with your farm today?" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [language, setLanguage] = useState<"en" | "te">("en");

  const searchParams = useSearchParams();
  const initialQueryTriggered = useRef(false);

  const [sessionId] = useState(() => {
    if (typeof window === "undefined") return "";

    let id = localStorage.getItem("aquapulse_session_id");

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("aquapulse_session_id", id);
    }

    return id;
  });
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [marketSnapshot, setMarketSnapshot] = useState<any[]>([]);

  // Fetch quick market snapshot
  useEffect(() => {
    async function fetchMarket() {
      try {
        const res = await fetch("/api/market/latest");
        const data = await res.json();
        if (data.prices) {
          const snapshot = data.prices.filter((p: any) => p.size_count === 40 || p.size_count === 60 || p.size_count === 100).slice(0, 3);
          setMarketSnapshot(snapshot);
        }
      } catch (e) { }
    }
    fetchMarket();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle incoming query param
  useEffect(() => {
    if (!initialQueryTriggered.current) {
      const q = searchParams.get("q");
      if (q) {
        initialQueryTriggered.current = true;
        handleSend(q);
      }
    }
  }, [searchParams]);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = language === "te" ? "te-IN" : "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = language === "te" ? "te-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      handleSend(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };
  const handleSend = async (
    overrideText?: string | React.MouseEvent | React.KeyboardEvent
  ) => {
    const textToSend =
      typeof overrideText === "string" ? overrideText : inputText;

    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsThinking(true);

    try {
      let res;
      try {
        res = await fetch(getApiUrl("/chat"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            message: textToSend,
            language,
          }),
        });
        if (!res.ok) {
          throw new Error(`FastAPI backend responded with status ${res.status}`);
        }
      } catch (networkErr: any) {
        console.warn("FastAPI backend error or offline, falling back to Next.js API scaffold:", networkErr);
        res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: textToSend,
            language,
            history: [],
          }),
        });
        if (!res.ok) {
          throw new Error(`Next.js API responded with status ${res.status}`);
        }
      }

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "mithrama",
        text:
          data.reply ||
          data.text ||
          "Sorry, I couldn't understand that properly.",
      };

      setMessages((prev) => [...prev, aiMsg]);
      speak(aiMsg.text);
    } catch (error) {
      console.error(error);

      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "mithrama",
        text: "Sorry, I'm having trouble connecting right now.",
      };

      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#010a12] text-slate-200 font-manrope overflow-hidden fixed inset-0">
      <Navbar />

      {/* Cinematic Deep Ocean Background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex flex-col justify-end">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#051828_0%,_#010a12_100%)]"></div>
        {/* Bioluminescent deep water glow */}
        <div className="absolute bottom-0 left-0 right-0 h-[60vh] bg-gradient-to-t from-[#00C2B8]/10 via-[#0B2135]/20 to-transparent blur-3xl"></div>

        {/* Soft floating light rays */}
        <div className="absolute top-0 left-1/4 w-[20%] h-full bg-gradient-to-b from-[#35F3FF]/5 to-transparent skew-x-[30deg] blur-3xl mix-blend-screen opacity-30"></div>
        <div className="absolute top-0 right-1/4 w-[15%] h-full bg-gradient-to-b from-[#00C2B8]/5 to-transparent -skew-x-[20deg] blur-3xl mix-blend-screen opacity-20"></div>

        {/* Ambient Particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-[#00C2B8]/40"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -Math.random() * 200 - 50],
              opacity: [0, Math.random() * 0.8 + 0.2, 0],
              x: Math.sin(i) * 30
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center pt-20 pb-28 px-4 h-full w-full">

        {/* Left Side Panel - Market Snapshot */}
        <div className="hidden lg:flex flex-col gap-4 absolute left-8 top-1/2 -translate-y-1/2 w-64">
          <div className="bg-[#021220]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00C2B8]" /> Market Pulse
            </h3>
            <div className="flex flex-col gap-3">
              {marketSnapshot.length > 0 ? marketSnapshot.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/5 hover:border-[#00C2B8]/30 transition-colors">
                  <span className="text-xs font-semibold text-slate-300">{item.size_count}C</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">₹{item.price}</span>
                    <span className={`flex items-center text-[10px] font-bold ${item.isUp ? 'text-[#1DBF73]' : item.isDown ? 'text-red-400' : 'text-slate-500'}`}>
                      {item.isUp ? <TrendingUp className="w-3 h-3" /> : item.isDown ? <TrendingDown className="w-3 h-3" /> : ''}
                      {item.isUp ? '+' : item.isDown ? '-' : ''}₹{Math.abs(item.delta)}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-xs text-slate-500 animate-pulse">Syncing...</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Panel - Quick Actions */}
        <div className="hidden lg:flex flex-col gap-4 absolute right-8 top-1/2 -translate-y-1/2 w-64">
          <div className="bg-[#021220]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#35F3FF]" /> Quick Tools
            </h3>
            {[
              { icon: FileText, label: "Analyze PDF Report" },
              { icon: Camera, label: "Upload Pond Photo" },
              { icon: ShieldAlert, label: "Disease Scanner" },
              { icon: CloudSun, label: "Weather Check" }
            ].map((action, i) => (
              <button key={i} className="flex items-center gap-3 p-3 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-transparent hover:border-[#00C2B8]/30 transition-colors text-left group">
                <action.icon className="w-4 h-4 text-[#00C2B8] group-hover:text-[#35F3FF] transition-colors" />
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mithrama Terminal Interface */}
        <div className="w-full h-full flex flex-col items-center justify-center mt-10">
          <MithramaTerminal
            messages={messages}
            onSend={handleSend}
            isThinking={isThinking}
            language={language}
            inputText={inputText}
            setInputText={setInputText}
            handleKeyDown={handleKeyDown}
            startListening={startListening}
            isListening={isListening}
          />
        </div>
      </main>

      {/* Language Toggle (Floating Top Right or somewhere) */}
      <div className="fixed top-24 right-8 z-50 flex gap-2">
        <button
          onClick={() => setLanguage("en")}
          className={cn(
            "px-3 py-1 rounded-full text-xs backdrop-blur-md transition-colors border",
            language === "en"
              ? "bg-[#00C2B8] text-black font-semibold border-[#00C2B8]"
              : "bg-[#021220]/80 text-white hover:bg-white/10 border-[#00C2B8]/30"
          )}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage("te")}
          className={cn(
            "px-3 py-1 rounded-full text-xs backdrop-blur-md transition-colors border",
            language === "te"
              ? "bg-[#00C2B8] text-black font-semibold border-[#00C2B8]"
              : "bg-[#021220]/80 text-white hover:bg-white/10 border-[#00C2B8]/30"
          )}
        >
          TE
        </button>
      </div>
    </div>
  );
}

export default function AquaAIPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-[#010a12] flex flex-col items-center justify-center"><div className="w-12 h-12 border-4 border-[#00C2B8]/20 border-t-[#00C2B8] rounded-full animate-spin"></div></div>}>
      <AquaAIChatContent />
    </Suspense>
  );
}
