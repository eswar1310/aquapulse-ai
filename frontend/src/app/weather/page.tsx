"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CloudRain, Wind, Thermometer, Droplets, AlertTriangle, Activity, MapPin, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import { apiClient, WeatherSignalResponse } from "@/lib/api";

interface WeatherSignal {
  severity: string;
  impact: string;
  signal_type: string;
  recommendations?: string[];
}

interface WeatherData {
  main?: { temp: number; humidity: number };
  wind?: { speed: number };
}

export default function WeatherRadarPage() {
  const [mounted, setMounted] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherSignalResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    apiClient.intelligence.getWeatherSignals()
      .then(data => {
        setWeatherData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!mounted) return null;

  const signal = weatherData?.signal;
  const raw = weatherData?.weather_data;

  // Derived metrics
  const severity = signal?.severity || "Nominal";
  const temp = raw?.main?.temp || "--";
  const humidity = raw?.main?.humidity || "--";
  const windSpeed = raw?.wind?.speed || "--";
  
  // Calculate DO risk
  let doRisk = "Nominal";
  let doColor = "text-[#1DBF73]";
  if (typeof temp === "number" && typeof humidity === "number") {
    if (temp > 30 || humidity > 85) {
      doRisk = "Elevated";
      doColor = "text-amber-400";
    }
  }
  if (severity === "High") {
    doRisk = "Critical";
    doColor = "text-red-500";
  }

  const stressColor = severity === "High" ? "border-red-500/50 text-red-500" : severity === "Medium" ? "border-amber-400/50 text-amber-400" : "border-[#00C2B8]/50 text-[#00C2B8]";

  return (
    <div className="min-h-screen bg-[#010a12] font-manrope overflow-hidden text-slate-200 relative selection:bg-[#00C2B8]/30">
      <Navbar />

      {/* Cinematic Environmental Atmosphere */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Soft Humidity Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,194,184,0.03)_0%,_#010a12_100%)]"></div>
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#00C2B8]/5 rounded-full blur-[150px] mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-[#021220] rounded-full blur-[200px] mix-blend-screen opacity-70"></div>
        
        {/* CRT Scanlines Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)" }}
        ></div>
        <div className="absolute inset-0 bg-[#010a12]/20 backdrop-blur-[1px]"></div>

        {/* Floating Particles (Fog/Humidity simulation) */}
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-[#00C2B8]/20 rounded-full blur-[2px]"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -Math.random() * 100 - 50],
              x: [0, Math.sin(i) * 30],
              opacity: [0, Math.random() * 0.4 + 0.1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto flex flex-col gap-6 min-h-screen">
        
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#00C2B8]/20 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <motion.div 
                className="w-2 h-2 rounded-full bg-[#1DBF73]"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-[10px] text-slate-400 font-[family-name:var(--font-orbitron)] uppercase tracking-[0.3em]">
                AP-NODE :: BHIMAVARAM
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-sora font-bold text-white tracking-tight flex items-center gap-3">
              Environmental Radar
            </h1>
          </div>
          
          <div className="flex items-center gap-4 bg-[#021220]/60 border border-[#00C2B8]/30 px-4 py-2 rounded-xl backdrop-blur-md">
            <MapPin className="w-4 h-4 text-[#00C2B8]" />
            <span className="text-sm font-semibold text-slate-300 font-mono">16.5449° N, 81.5212° E</span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 flex-1">
          
          {/* Left Panel: Telemetry Metrics */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            
            {/* Severity Card */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`bg-[#021220]/80 backdrop-blur-xl border ${stressColor} rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(0,194,184,0.15)] relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" /> Climate Severity
              </h3>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-3xl font-sora font-bold">{loading ? "..." : severity.toUpperCase()}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                {signal?.impact || "Monitoring atmospheric conditions..."}
              </p>
            </motion.div>

            {/* Atmosphere Data */}
            <div className="bg-[#021220]/60 backdrop-blur-xl border border-[#00C2B8]/20 rounded-2xl p-5">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <CloudRain className="w-3.5 h-3.5 text-[#00C2B8]" /> Atmospheric Data
              </h3>
              
              <div className="flex flex-col gap-4 font-mono">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Thermometer className="w-3.5 h-3.5" /> <span className="text-xs">Temperature</span>
                  </div>
                  <span className="text-sm font-bold text-white">{temp}°C</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Droplets className="w-3.5 h-3.5" /> <span className="text-xs">Humidity</span>
                  </div>
                  <span className="text-sm font-bold text-[#35F3FF]">{humidity}%</span>
                </div>
                
                <div className="flex justify-between items-center pb-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Wind className="w-3.5 h-3.5" /> <span className="text-xs">Wind Speed</span>
                  </div>
                  <span className="text-sm font-bold text-white">{windSpeed} m/s</span>
                </div>
              </div>
            </div>

            {/* Oxygen Risk */}
            <div className="bg-[#021220]/60 backdrop-blur-xl border border-[#00C2B8]/20 rounded-2xl p-5">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#35F3FF]" /> Dissolved Oxygen Risk
              </h3>
              <div className="flex justify-between items-end">
                <span className={`text-xl font-sora font-bold ${doColor}`}>{loading ? "..." : doRisk}</span>
                <span className="text-[10px] text-slate-500 font-mono">Calculated from Heat/Humidity</span>
              </div>
              {doRisk !== "Nominal" && (
                <div className="mt-3 w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    className={`h-full ${doRisk === "Critical" ? "bg-red-500" : "bg-amber-400"}`}
                    initial={{ width: 0 }}
                    animate={{ width: doRisk === "Critical" ? "85%" : "60%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Center Panel: Large Animated Radar */}
          <div className="lg:col-span-6 flex items-center justify-center relative min-h-[400px] lg:min-h-[500px]">
            {/* Marine Control UI Box */}
            <div className="absolute inset-0 border border-[#00C2B8]/30 rounded-full bg-[#010a12]/40 backdrop-blur-sm max-w-[500px] max-h-[500px] m-auto flex items-center justify-center shadow-[0_0_50px_rgba(0,194,184,0.1)]">
              
              {/* Radar Rings */}
              {[1, 2, 3, 4].map((ring) => (
                <motion.div 
                  key={ring} 
                  className="absolute rounded-full border border-[#00C2B8]/20"
                  style={{ width: `${ring * 25}%`, height: `${ring * 25}%` }}
                  animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, delay: ring * 0.5, ease: "easeInOut" }}
                />
              ))}

              {/* Crosshairs */}
              <div className="absolute w-full h-[1px] bg-[#00C2B8]/20"></div>
              <div className="absolute h-full w-[1px] bg-[#00C2B8]/20"></div>

              {/* Sweeping Radar Line */}
              <motion.div 
                className="absolute w-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#35F3FF]/80 to-[#35F3FF]"
                style={{ right: '50%', transformOrigin: 'right center' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                {/* Radar Trail Glow */}
                <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[conic-gradient(from_180deg_at_100%_0%,_rgba(53,243,255,0.4)_0deg,_transparent_60deg)] origin-top-right transform -translate-y-[1px]"></div>
              </motion.div>

              {/* Center Dot */}
              <div className="absolute w-3 h-3 rounded-full bg-[#35F3FF] shadow-[0_0_15px_#35F3FF]"></div>

              {/* Simulated Weather Anomalies / Pond Zones */}
              {!loading && (
                <>
                  <motion.div 
                    className={`absolute w-8 h-8 rounded-full blur-md ${severity === 'High' ? 'bg-red-500/60' : severity === 'Medium' ? 'bg-amber-400/50' : 'bg-[#1DBF73]/40'}`}
                    style={{ top: '30%', left: '40%' }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div 
                    className="absolute w-12 h-12 rounded-full blur-lg bg-[#35F3FF]/30"
                    style={{ bottom: '25%', right: '30%' }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  />
                  
                  {/* Blip */}
                  <motion.div
                    className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_white]"
                    style={{ top: '32%', left: '42%' }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }} // Sync with radar duration
                  />
                </>
              )}

            </div>
          </div>

          {/* Right Panel: AI Recommendations & Status */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            
            <div className="bg-gradient-to-br from-[#00C2B8]/10 to-[#021220]/80 backdrop-blur-xl border border-[#00C2B8]/30 rounded-2xl p-5 flex-1 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-[#00C2B8]/20 pb-2">
                <Eye className="w-3.5 h-3.5 text-[#35F3FF]" /> Mithrama Directives
              </h3>
              
              <div className="flex flex-col gap-3 font-mono text-xs">
                {loading ? (
                  <span className="text-slate-500 animate-pulse">Computing environmental directives...</span>
                ) : signal?.recommendations && signal.recommendations.length > 0 ? (
                  signal.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="flex gap-2 items-start bg-black/20 p-3 rounded-lg border border-white/5">
                      <span className="text-[#00C2B8] shrink-0 mt-0.5">&gt;</span>
                      <span className="text-slate-300 leading-relaxed">{rec}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-2 items-start bg-black/20 p-3 rounded-lg border border-white/5">
                    <span className="text-[#00C2B8] shrink-0 mt-0.5">&gt;</span>
                    <span className="text-slate-300 leading-relaxed">Conditions optimal. Maintain standard feeding protocols. Monitor DO levels during dusk.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Live Systems Status */}
            <div className="bg-[#021220]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                System Status
              </h3>
              <div className="flex flex-col gap-2 font-mono text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">TELEMETRY LINK</span>
                  <span className="text-[#1DBF73] flex items-center gap-1"><div className="w-1.5 h-1.5 bg-[#1DBF73] rounded-full animate-pulse"></div> ACTIVE</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">SATELLITE SYNC</span>
                  <span className="text-[#35F3FF]">LOCKED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">UPDATE FREQ</span>
                  <span className="text-slate-300">REAL-TIME</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
