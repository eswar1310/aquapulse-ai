"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function MithramaAI() {
  const [isHovered, setIsHovered] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [ambientSound, setAmbientSound] = useState(true);

  return (
    <>
      {/* Ambient Sound Toggle (Bottom right reference) */}
      <div className="fixed bottom-4 right-8 z-40 flex items-center gap-3">
        <div className="flex items-center gap-1">
          <div className="w-0.5 h-3 bg-aqua rounded-full animate-pulse"></div>
          <div className="w-0.5 h-4 bg-aqua rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-0.5 h-2 bg-aqua rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          <div className="w-0.5 h-5 bg-aqua rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
        </div>
        <span className="text-xs text-slate-300 font-medium">Ambient Sound</span>
        <button 
          onClick={() => setAmbientSound(!ambientSound)}
          className={cn("w-8 h-4 rounded-full transition-colors relative flex items-center", ambientSound ? "bg-aqua/30" : "bg-white/10")}
        >
          <motion.div 
            className="w-3 h-3 rounded-full bg-white mx-0.5"
            animate={{ x: ambientSound ? 16 : 0, backgroundColor: ambientSound ? "#35F3FF" : "#94a3b8" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          ></motion.div>
        </button>
      </div>

      {/* Floating UI Container */}
      <div className="fixed bottom-20 right-8 z-50 flex flex-col items-end gap-6 pointer-events-none">
        
        {/* Suggestion Pills and Greeting */}
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-end gap-3 pointer-events-auto mr-10"
          >
            <div className="bg-[#021220]/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl rounded-br-sm shadow-xl flex flex-col items-start gap-1">
              <h4 className="text-aqua font-sora font-bold text-base flex items-center gap-2">Hi, I'm Mithrama 👋</h4>
              <p className="text-xs text-slate-300">Your Aquaculture Companion</p>
            </div>
            <div className="flex gap-2 justify-end flex-wrap max-w-md">
              <Link href="/aqua-ai" className="text-[10px] bg-transparent border border-white/20 text-slate-300 hover:border-aqua hover:text-aqua px-3 py-1.5 rounded-full backdrop-blur-md transition-colors pointer-events-auto">
                Open Chat
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Main Orb Area */}
        <div className="relative flex items-end gap-4 pointer-events-auto">
          {/* External Mic Button */}
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isRecording ? 'bg-red-500 text-white animate-pulse shadow-red-500/50' : 'bg-[#021220]/80 backdrop-blur-md border border-white/10 text-aqua hover:border-aqua/50'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Large Luminous Orb linking to /aqua-ai */}
          <Link
            href="/aqua-ai"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full group block"
          >
            {/* Glowing halos */}
            <div className="absolute inset-[-10%] rounded-full bg-gradient-to-tr from-aqua/20 to-cyan-neon/20 blur-2xl group-hover:blur-3xl transition-all"></div>
            <div className="absolute inset-0 rounded-full border-[1.5px] border-aqua/40 shadow-[0_0_30px_rgba(0,194,184,0.6)] group-hover:shadow-[0_0_50px_rgba(0,194,184,0.8)] transition-shadow"></div>
            
            {/* Core Orb */}
            <div className="absolute inset-2 rounded-full bg-[radial-gradient(ellipse_at_center,_#051828_0%,_#021220_100%)] flex items-center justify-center overflow-hidden border border-cyan-neon/30">
              
              {/* Animated Neural Net Grid / Rings */}
              <div className="absolute inset-0 opacity-40">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-aqua/20 rounded-full animate-[spin_8s_linear_infinite]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-cyan-neon/20 rounded-full animate-[spin_12s_linear_infinite_reverse]"></div>
                
                {/* Connecting dots */}
                <div className="absolute top-[20%] left-[30%] w-1 h-1 bg-cyan-neon rounded-full shadow-[0_0_5px_#35F3FF]"></div>
                <div className="absolute bottom-[30%] right-[20%] w-1.5 h-1.5 bg-aqua rounded-full shadow-[0_0_5px_#00C2B8]"></div>
                <div className="absolute top-[40%] right-[10%] w-1 h-1 bg-white rounded-full"></div>
                
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
                  <path d="M 30,20 L 70,40 L 80,70 L 40,80 Z" fill="none" stroke="#00C2B8" strokeWidth="0.5" />
                  <path d="M 30,20 L 40,80" fill="none" stroke="#00C2B8" strokeWidth="0.5" />
                </svg>
              </div>

              {/* Glowing Shrimp Emblem */}
              <div className="relative z-10 w-[70%] h-[70%] drop-shadow-[0_0_20px_rgba(53,243,255,0.9)] mix-blend-screen transition-transform duration-500 group-hover:scale-110">
                <img src="/mithrama-shrimp.png" className="w-full h-full object-contain brightness-125" alt="Mithrama AI Shrimp" />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-[#021220]/80 to-transparent pointer-events-none"></div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
