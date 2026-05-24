"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, Activity, CloudRain, ShieldAlert, Cpu, Mic } from "lucide-react";
import { apiClient } from "@/lib/api";

interface ChatMessage {
  id: string;
  sender: "user" | "mithrama";
  text: string;
}

interface MarketPulse {
  market_bias?: string;
  confidence: number;
  price_pressure?: string;
}

interface WeatherSignal {
  severity?: string;
  impact?: string;
  signal_type?: string;
  recommendations?: string[];
}

export default function MithramaTerminal({
  messages,
  onSend,
  isThinking,
  inputText,
  setInputText,
  handleKeyDown,
  startListening,
  isListening,
}: {
  messages: ChatMessage[];
  onSend: () => void;
  isThinking: boolean;
  language: string;
  inputText: string;
  setInputText: (val: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  startListening: () => void;
  isListening: boolean;
}) {
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [pulseData, setPulseData] = useState<MarketPulse | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherSignal | null>(null);
  
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  useEffect(() => {
    Promise.all([
      apiClient.intelligence.getMarketPulse().catch(() => null),
      apiClient.intelligence.getWeatherSignals().catch(() => null),
    ]).then(([pulse, weather]) => {
      setPulseData(pulse?.pulse || null);
      setWeatherData(weather?.signal || null);
    });
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto h-[80vh] flex flex-col md:flex-row gap-4 p-4 relative z-20">
      {/* Background CRT and Radar Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none rounded-xl overflow-hidden">
        {/* Scanlines */}
        <motion.div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #00C2B8 2px, #00C2B8 4px)",
            backgroundSize: "100% 4px"
          }}
          animate={{ y: [0, 4] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
        />
        {/* Radar Pulse */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#00C2B8]/10 bg-[radial-gradient(circle,_transparent_40%,_rgba(0,194,184,0.08)_100%)]"
          animate={{ scale: [0.8, 1.3], opacity: [0.4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-[#021220]/50 backdrop-blur-md"></div>
      </div>

      {/* Main Terminal Chat Area */}
      <div className="flex-1 flex flex-col border border-[#00C2B8]/30 bg-[#010a12]/80 backdrop-blur-xl rounded-xl overflow-hidden relative z-10 shadow-[0_0_30px_rgba(0,194,184,0.15)]">
        
        {/* Top Status Bar */}
        <div className="h-10 bg-[#00C2B8]/10 border-b border-[#00C2B8]/30 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 text-[#35F3FF]" />
            <span className="font-[family-name:var(--font-orbitron)] text-[10px] text-[#35F3FF] tracking-widest uppercase">
              AP-NODE :: MITHRAMA_SYS
            </span>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-[#1DBF73]"
              animate={{ opacity: [1, 0.2, 1], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ boxShadow: "0 0 10px #1DBF73" }}
            />
            <span className="font-[family-name:var(--font-rajdhani)] text-[10px] text-[#1DBF73] font-bold tracking-wider uppercase drop-shadow-[0_0_5px_#1DBF73]">
              MITHRAMA ONLINE
            </span>
          </div>
        </div>

        {/* Terminal Output */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 scrollbar-hide font-mono text-sm">
          {messages.map((msg, idx) => (
            <div key={msg.id} className="flex flex-col">
              {msg.sender === "user" ? (
                <div className="flex items-start gap-3">
                  <span className="text-slate-500 shrink-0 mt-0.5">OP_REQ &gt;</span>
                  <div className="text-slate-300 whitespace-pre-wrap">{msg.text}</div>
                </div>
              ) : (
                <div className="flex items-start gap-3 mt-2">
                  <span className="text-[#00C2B8] shrink-0 mt-0.5">MITH_SYS &gt;</span>
                  <div className="text-[#35F3FF] whitespace-pre-wrap shadow-text">
                    <Typewriter text={msg.text} delay={15} isLast={idx === messages.length - 1} />
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isThinking && (
            <div className="flex items-start gap-3 mt-2">
              <span className="text-[#00C2B8] shrink-0 mt-0.5">MITH_SYS &gt;</span>
              <motion.div 
                animate={{ opacity: [0, 1, 0] }} 
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-4 bg-[#35F3FF] mt-0.5"
              />
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-[#00C2B8]/30 bg-black/40 flex items-center gap-3">
          <span className="text-slate-500 font-mono text-sm shrink-0 pl-2">CMD &gt;</span>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Awaiting input sequence..."
            className="flex-1 bg-transparent border-none outline-none text-[#35F3FF] font-mono text-sm placeholder:text-slate-700 placeholder:font-mono"
            spellCheck={false}
          />
          <button 
            onClick={startListening}
            className={`p-2 rounded border transition-colors ${isListening ? 'bg-red-500/20 border-red-500 text-red-500' : 'border-[#00C2B8]/30 text-[#00C2B8] hover:bg-[#00C2B8]/20'}`}
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSend()}
            disabled={!inputText.trim() || isThinking}
            className="px-4 py-2 bg-[#00C2B8]/20 hover:bg-[#00C2B8]/40 border border-[#00C2B8]/50 text-[#35F3FF] font-[family-name:var(--font-rajdhani)] text-xs font-bold tracking-widest uppercase disabled:opacity-50 transition-colors"
          >
            Execute
          </button>
        </div>
      </div>

      {/* Intelligence Side Panel */}
      <div className="w-full md:w-72 flex flex-col gap-4 z-10">
        
        {/* Marine Control Aesthetics */}
        <div className="border border-[#00C2B8]/30 bg-[#010a12]/80 backdrop-blur-xl rounded-xl p-4 flex flex-col shadow-[0_0_20px_rgba(0,194,184,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-20">
            <Cpu className="w-16 h-16 text-[#00C2B8]" />
          </div>
          
          <h3 className="font-[family-name:var(--font-orbitron)] text-[10px] text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-[#00C2B8]/20 pb-2">
            <Activity className="w-3 h-3 text-[#35F3FF]" /> Market Intel
          </h3>
          
          <div className="flex flex-col gap-3 font-mono">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">BIAS</span>
              <span className={`font-bold ${pulseData?.market_bias === 'Bullish' ? 'text-[#1DBF73]' : pulseData?.market_bias === 'Bearish' ? 'text-red-400' : 'text-[#35F3FF]'}`}>
                {pulseData ? (pulseData.market_bias ?? "N/A").toUpperCase() : "SYNCING"}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">CONFIDENCE</span>
              <span className="text-[#35F3FF]">{pulseData ? `${Math.round(pulseData.confidence * 100)}%` : "--"}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">PRESSURE</span>
              <span className="text-[#35F3FF]">{pulseData ? (pulseData.price_pressure ?? "--").toUpperCase() : "--"}</span>
            </div>
          </div>
        </div>

        <div className="border border-[#00C2B8]/30 bg-[#010a12]/80 backdrop-blur-xl rounded-xl p-4 flex flex-col shadow-[0_0_20px_rgba(0,194,184,0.1)]">
          <h3 className="font-[family-name:var(--font-orbitron)] text-[10px] text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-[#00C2B8]/20 pb-2">
            <CloudRain className="w-3 h-3 text-[#35F3FF]" /> Weather Risk
          </h3>
          <div className="flex flex-col gap-3 font-mono">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">SEVERITY</span>
              <span className={`font-bold ${weatherData?.severity === 'High' ? 'text-red-400' : weatherData?.severity === 'Medium' ? 'text-amber-400' : 'text-[#1DBF73]'}`}>
                {weatherData ? (weatherData.severity ?? "N/A").toUpperCase() : "SYNCING"}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              {weatherData?.impact || "Waiting for telemetry..."}
            </div>
          </div>
        </div>

        <div className="border border-[#00C2B8]/30 bg-[#010a12]/80 backdrop-blur-xl rounded-xl p-4 flex flex-col shadow-[0_0_20px_rgba(0,194,184,0.1)]">
          <h3 className="font-[family-name:var(--font-orbitron)] text-[10px] text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-[#00C2B8]/20 pb-2">
            <ShieldAlert className="w-3 h-3 text-[#35F3FF]" /> Disease Intel
          </h3>
          <div className="flex flex-col gap-3 font-mono">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">STATUS</span>
              <span className="text-[#1DBF73] font-bold">NOMINAL</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              No immediate WSSV or EHP outbreaks in active radius.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Typing effect component
function Typewriter({ text, delay, isLast }: { text: string; delay: number; isLast: boolean }) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setIsDone(false);
    
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsDone(true);
      }
    }, delay);
    
    return () => clearInterval(interval);
  }, [text, delay]);

  return (
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {displayed}
      {isLast && isDone && (
        <motion.span 
          animate={{ opacity: [0, 1, 0] }} 
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="inline-block w-2.5 h-4 bg-[#35F3FF] ml-1 align-middle drop-shadow-[0_0_5px_#35F3FF]"
        />
      )}
      {isLast && !isDone && (
        <span className="inline-block w-2.5 h-4 bg-[#35F3FF] ml-1 align-middle drop-shadow-[0_0_5px_#35F3FF]" />
      )}
    </motion.span>
  );
}
