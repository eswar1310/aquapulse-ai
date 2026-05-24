"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, AlertTriangle, CloudRain, TrendingUp, Droplets } from "lucide-react";

const REGIONS = [
  { id: "bhimavaram", name: "Bhimavaram", x: 45, y: 55, market: "bull", temp: "32°C", disease: "low" },
  { id: "kaikaluru", name: "Kaikaluru", x: 35, y: 45, market: "stable", temp: "31°C", disease: "medium" },
  { id: "akiveedu", name: "Akiveedu", x: 40, y: 50, market: "bull", temp: "32°C", disease: "low" },
  { id: "palakollu", name: "Palakollu", x: 55, y: 60, market: "bear", temp: "33°C", disease: "high" },
  { id: "narsapur", name: "Narsapur", x: 60, y: 70, market: "stable", temp: "32°C", disease: "low" },
  { id: "amalapuram", name: "Amalapuram", x: 75, y: 50, market: "bull", temp: "31°C", disease: "medium" },
  { id: "kakinada", name: "Kakinada", x: 85, y: 30, market: "bull", temp: "30°C", disease: "low" },
  { id: "nellore", name: "Nellore", x: 15, y: 85, market: "stable", temp: "34°C", disease: "low" },
];

export default function AndhraAquaMap() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  return (
    <div className="relative w-full aspect-square md:aspect-[4/3] max-h-[600px] glass-panel rounded-[2rem] overflow-hidden border border-aqua/30 flex items-center justify-center p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {/* Satellite-Water Abstract Aesthetic */}
      <div className="absolute inset-0 bg-[#021220] overflow-hidden">
        {/* Ocean Depth Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#0B2135_0%,_#021220_100%)]"></div>
        
        {/* Coastline blur shapes to simulate satellite landmass/water boundary */}
        <div className="absolute top-[10%] left-[-20%] w-[140%] h-[120%] bg-[#051828] blur-[80px] rounded-[100%] opacity-80 mix-blend-screen transform rotate-12"></div>
        <div className="absolute top-[40%] right-[-10%] w-[60%] h-[80%] bg-[#00C2B8]/10 blur-[100px] rounded-full mix-blend-screen"></div>
        
        {/* Topographic Lines Overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-radial-gradient(circle at 0 0, transparent 0, #00C2B8 1px, transparent 1px, transparent 40px)' }}></div>
      </div>

      <div className="relative w-full h-full max-w-3xl">
        {/* Animated Connection Lines (Logistics/Data network) */}
        <svg className="absolute inset-0 w-full h-full" style={{ filter: "drop-shadow(0 0 8px rgba(0, 194, 184, 0.8))" }}>
          {/* Main Artery */}
          <motion.path 
            d="M 35% 45% Q 40% 50% 45% 55% T 55% 60% T 60% 70%" 
            stroke="url(#line-grad)" 
            strokeWidth="3" 
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          />
          {/* Godavari Artery */}
          <motion.path 
            d="M 45% 55% Q 60% 45% 75% 50% T 85% 30%" 
            stroke="url(#line-grad-2)" 
            strokeWidth="2.5" 
            fill="none"
            strokeLinecap="round"
            strokeDasharray="6 6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 4, delay: 1, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          />
          {/* South Artery */}
          <motion.path 
            d="M 45% 55% Q 30% 70% 15% 85%" 
            stroke="url(#line-grad)" 
            strokeWidth="2" 
            fill="none"
            strokeDasharray="4 8"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 5, delay: 0.5, ease: "linear", repeat: Infinity }}
          />
          
          <defs>
            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00C2B8" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#35F3FF" stopOpacity="1" />
              <stop offset="100%" stopColor="#00C2B8" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="line-grad-2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00C2B8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#35F3FF" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Nodes */}
        {REGIONS.map((region) => {
          const isHovered = hoveredRegion === region.id;
          
          return (
            <div 
              key={region.id}
              className="absolute z-20"
              style={{ left: `${region.x}%`, top: `${region.y}%`, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
            >
              <motion.div 
                className="relative group cursor-pointer z-20"
                whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
              >
                <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-[#021220] flex items-center justify-center transition-all duration-300 ${
                  isHovered ? 'bg-[#35F3FF] scale-125 shadow-[0_0_25px_rgba(53,243,255,1)]' : 'bg-[#00C2B8] shadow-[0_0_10px_rgba(0,194,184,0.6)]'
                }`}>
                  <div className="w-1.5 h-1.5 bg-[#021220] rounded-full"></div>
                </div>

                {/* Ping animation for active hubs */}
                {region.market === "bull" && (
                  <motion.div 
                    className="absolute inset-[-50%] rounded-full border border-[#35F3FF]"
                    animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                    style={{ pointerEvents: "none" }}
                  />
                )}
              </motion.div>

              {/* Premium Popup */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-52 z-30 pointer-events-none"
                  >
                    <div className="bg-[#021220]/90 backdrop-blur-xl p-4 rounded-2xl border border-aqua/40 shadow-[0_15px_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30"></div>
                      <h4 className="font-sora font-bold text-white text-base mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-aqua" /> {region.name}
                      </h4>
                      <div className="flex flex-col gap-2.5 text-xs font-medium">
                        <div className="flex items-center justify-between text-slate-300 bg-white/5 p-1.5 rounded-lg">
                          <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-cyan-neon" /> Market</span>
                          <span className={region.market === 'bull' ? 'text-green-400 font-bold' : region.market === 'bear' ? 'text-red-400 font-bold' : 'text-slate-400 font-bold'}>
                            {region.market.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300 bg-white/5 p-1.5 rounded-lg">
                          <span className="flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-aqua" /> Water Temp</span>
                          <span className="text-white">{region.temp}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300 bg-white/5 p-1.5 rounded-lg">
                          <span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-sunset" /> Risk Level</span>
                          <span className={region.disease === 'high' ? 'text-red-400 font-bold' : region.disease === 'medium' ? 'text-sunset font-bold' : 'text-green-400 font-bold'}>
                            {region.disease.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Triangle Pointer */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#021220] border-b border-r border-aqua/40 transform rotate-45"></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Region Label - Always visible for context, fade on hover of others */}
              <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 text-xs font-semibold font-sora tracking-wide whitespace-nowrap transition-all duration-300 ${
                hoveredRegion === region.id ? 'text-cyan-neon drop-shadow-[0_0_5px_rgba(53,243,255,0.8)] scale-110' : hoveredRegion ? 'opacity-30 text-slate-400' : 'text-slate-300 drop-shadow-md'
              }`}>
                {region.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
