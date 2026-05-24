"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronRight, Activity, CloudRain, TrendingUp, AlertTriangle, Thermometer, Wind } from "lucide-react";

// ─── Tiny sub-components ────────────────────────────────────────────────────

/** Slow pulsing ambient glow blob */
function GlowBlob({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[120px] pointer-events-none ${className}`}
      animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.28, 0.18] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/** Retro corner bracket */
function CornerBracket({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const border =
    pos === "tl" ? "border-t border-l" :
    pos === "tr" ? "border-t border-r" :
    pos === "bl" ? "border-b border-l" : "border-b border-r";
  const corner =
    pos === "tl" ? "top-6 left-6" :
    pos === "tr" ? "top-6 right-6" :
    pos === "bl" ? "bottom-6 left-6" : "bottom-6 right-6";
  return (
    <div className={`absolute w-10 h-10 ${border} border-[#19B7A5]/30 ${corner} hidden md:block`} />
  );
}

/** Radar sweep ring */
function RadarRing({ size, duration, reverse = false }: { size: number; duration: number; reverse?: boolean }) {
  return (
    <motion.div
      className="absolute rounded-full border border-[#19B7A5]/10"
      style={{ width: size, height: size }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    />
  );
}

/** Single animated radar sweep sector */
function RadarSweep() {
  return (
    <motion.div
      className="absolute w-[220px] h-[220px]"
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "center" }}
    >
      <div
        className="absolute top-1/2 left-1/2 w-[110px] h-[2px] origin-left"
        style={{
          background: "linear-gradient(to right, rgba(107,231,255,0.5), transparent)",
          transform: "translateY(-50%)",
        }}
      />
    </motion.div>
  );
}

/** HUD intelligence panel card */
function IntelCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  delay,
  position,
  bar,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  accent: string;
  delay: number;
  position: string;
  bar?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: [0, -6, 0] }}
      whileHover={{ y: -10, scale: 1.03, zIndex: 50 }}
      transition={{
        opacity: { duration: 0.7, delay },
        y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: delay * 0.5 },
        scale: { duration: 0.4, ease: "easeOut" }
      }}
      className={`absolute ${position} z-40 w-[170px] backdrop-blur-xl rounded-sm shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(25,183,165,0.15)] group cursor-pointer`}
      style={{
        background: "rgba(7,19,29,0.82)",
        border: "1px solid rgba(47,58,68,0.8)",
        borderTop: `1px solid ${accent}40`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {/* Top accent line */}
      <div className="h-[1px] w-full mb-3" style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />
      <div className="px-3 pb-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Icon className="w-3 h-3" style={{ color: accent }} />
          <span className="font-[family-name:var(--font-space-grotesk)] text-[9px] uppercase tracking-[0.18em] text-slate-400">{label}</span>
        </div>
        <div className="font-[family-name:var(--font-rajdhani)] text-lg font-bold leading-none" style={{ color: accent }}>
          {value}
        </div>
        {bar !== undefined && (
          <div className="mt-2 w-full h-[2px] bg-[#0E2230] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${bar}%`, background: accent }} />
          </div>
        )}
        <div className="text-[9px] text-slate-500 mt-1.5 font-[family-name:var(--font-inter)]">{sub}</div>
      </div>
    </motion.div>
  );
}

import { apiClient, MarketPulseResponse, WeatherSignalResponse, NewsItem } from "@/lib/api";

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AquaPulseHero() {
  const [mounted, setMounted] = useState(false);
  const [pulseData, setPulseData] = useState<MarketPulseResponse["pulse"] | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherSignalResponse | null>(null);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);

  useEffect(() => { 
    setMounted(true); 
    
    // Fetch live APIs using centralized client
    Promise.all([
      apiClient.intelligence.getMarketPulse().catch(() => null),
      apiClient.intelligence.getWeatherSignals().catch(() => null),
      apiClient.intelligence.getNewsSignals().catch(() => [])
    ]).then(([pulse, weather, news]) => {
      setPulseData(pulse?.pulse || null);
      setWeatherData(weather || null);
      setNewsData(Array.isArray(news) ? news : []);
    });
  }, []);
  
  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden bg-[#07131D]">

      {/* ── ENVIRONMENT LAYER ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        {/* Pond image */}
        <div className="absolute inset-0">
          <Image
            src="/images/bhimavaram_pond_cinematic_v2.png"
            alt="Bhimavaram Shrimp Ponds at Dusk"
            fill priority quality={95}
            className="object-cover object-center"
            style={{ opacity: 0.72 }}
            sizes="100vw"
          />
        </div>

        {/* Cinematic color grading overlays */}
        {/* Deep shadow at bottom — pond meets UI */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07131D] via-[#07131D]/70 to-transparent z-[1]" />
        {/* Left-side content mask */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07131D]/95 via-[#07131D]/60 to-transparent z-[1]" />
        {/* Amber dusk tint at horizon — cinematic warmth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7A4A0A]/10 to-transparent z-[1]" />
        {/* Top sky darkening */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#07131D]/50 to-transparent z-[1]" />

        {/* Humid mist layer — slow lateral drift */}
        <motion.div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 120% 40% at 50% 60%, rgba(200,220,255,0.04) 0%, transparent 70%)",
          }}
          animate={{ x: ["-3%", "3%", "-3%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Water reflection shimmer */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[40vh] z-[2] pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(25,183,165,0.06) 0%, transparent 100%)",
          }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating environmental particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-[#19B7A5]/30 pointer-events-none z-[3]"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 40}%`
            }}
            animate={{
              y: [0, -Math.random() * 100 - 50],
              opacity: [0, Math.random() * 0.5 + 0.1, 0],
              x: Math.sin(i) * 20
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

      {/* ── AMBIENT GLOW BLOBS (muted, not neon) ─────────────────────────── */}
      <GlowBlob className="w-[500px] h-[300px] bg-[#19B7A5] opacity-20 top-1/3 right-[20%]" />
      <GlowBlob className="w-[400px] h-[400px] bg-[#5A3A0A] opacity-15 top-[20%] right-[30%]" />

      {/* ── CRT SCANLINES ─────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)",
          mixBlendMode: "multiply",
        }}
      />

      {/* ── HUD CORNER BRACKETS ───────────────────────────────────────────── */}
      <div className="absolute inset-0 z-[6] pointer-events-none">
        <CornerBracket pos="tl" />
        <CornerBracket pos="tr" />
        <CornerBracket pos="bl" />
        <CornerBracket pos="br" />

        {/* HUD status line — top */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#19B7A5]/30" />
          <span className="font-[family-name:var(--font-orbitron)] text-[8px] text-[#19B7A5]/50 tracking-[0.3em] uppercase">
            AP-BHIMAVARAM-NODE-01
          </span>
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#19B7A5]/30" />
        </div>

        {/* HUD timestamp — bottom right */}
        <div className="absolute bottom-6 right-20 hidden md:flex items-center gap-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#6EEB83]"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span className="font-[family-name:var(--font-orbitron)] text-[8px] text-slate-500 tracking-widest">
            TELEMETRY LIVE
          </span>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ─────────────────────────────────────────────── */}
      <div className="relative z-20 w-full max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-24 pb-16 min-h-screen">

        {/* LEFT — Brand + Copy + CTAs */}
        <div className="lg:col-span-6 flex flex-col items-start gap-7">

          {/* System badge */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="flex items-center gap-2.5 px-3 py-1.5"
            style={{
              background: "rgba(7,19,29,0.7)",
              border: "1px solid rgba(25,183,165,0.2)",
              backdropFilter: "blur(12px)",
            }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#6EEB83]"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ boxShadow: "0 0 8px #6EEB83" }}
            />
            <span className="font-[family-name:var(--font-space-grotesk)] text-[10px] text-[#19B7A5] uppercase tracking-[0.22em]">
              Mithrama Intelligence · Bhimavaram, AP
            </span>
          </motion.div>

          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
          >
            <h1
              className="font-[family-name:var(--font-orbitron)] font-bold leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(3.2rem, 7vw, 5.5rem)" }}
            >
              <span className="text-white">Aqua</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#19B7A5] via-[#6BE7FF] to-[#A8F4E0]">
                Pulse
              </span>
            </h1>
            <p className="font-[family-name:var(--font-rajdhani)] text-[1.35rem] font-medium text-slate-300 mt-3 tracking-[0.05em]">
              AI Intelligence for Modern Aquaculture
            </p>
          </motion.div>

          {/* Divider rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="origin-left h-[1px] w-40"
            style={{ background: "linear-gradient(to right, rgba(25,183,165,0.5), transparent)" }}
          />

          {/* Body copy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="font-[family-name:var(--font-inter)] text-[1rem] text-slate-400 max-w-md leading-[1.75]"
          >
            AI-powered aquaculture intelligence born from the real shrimp farming ecosystems of Bhimavaram — live market signals, pond telemetry and climate risk, unified.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap gap-4 mt-1"
          >
            {/* Primary CTA */}
            <button
              className="group relative px-7 py-3.5 font-[family-name:var(--font-space-grotesk)] font-semibold text-sm uppercase tracking-[0.12em] overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #19B7A5, #0E8F80)",
                color: "#07131D",
                border: "1px solid rgba(107,231,255,0.2)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Launch Intelligence
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(135deg, #6BE7FF22, #19B7A533)" }}
              />
            </button>

            {/* Secondary CTA */}
            <button
              className="group px-7 py-3.5 font-[family-name:var(--font-space-grotesk)] font-semibold text-sm uppercase tracking-[0.12em] text-slate-300 hover:text-white transition-colors duration-300 flex items-center gap-2"
              style={{
                background: "rgba(14,34,48,0.6)",
                border: "1px solid rgba(47,58,68,0.8)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Activity className="w-4 h-4 text-[#19B7A5] group-hover:text-[#6BE7FF] transition-colors" />
              Explore Signals
            </button>
          </motion.div>

          {/* Micro stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex items-center gap-6 pt-2"
          >
            {[
              { v: "50K+", l: "Farmers" },
              { v: "12", l: "Districts" },
              { v: "99.4%", l: "Uptime" },
            ].map(({ v, l }) => (
              <div key={l} className="flex flex-col">
                <span className="font-[family-name:var(--font-rajdhani)] text-xl font-bold text-white">{v}</span>
                <span className="font-[family-name:var(--font-inter)] text-[10px] text-slate-500 uppercase tracking-wider">{l}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — Anti-Gravity Core + Floating Intel Panels */}
        <div className="lg:col-span-6 relative h-[540px] flex items-center justify-center mt-[-40px]">

          {/* Radar rings — muted */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <RadarRing size={280} duration={28} />
            <RadarRing size={380} duration={40} reverse />
            <RadarRing size={460} duration={55} />
          </div>

          {/* Radar sweep */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <RadarSweep />
          </div>

          {/* Sonar ping circles */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-[#19B7A5]/10"
              style={{ width: 100, height: 100 }}
              animate={{ scale: [1, 2.6], opacity: [0.35, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: i * 1.1, ease: "easeOut" }}
            />
          ))}

          {/* Core orb — centered, floats vertically */}
          <motion.div
            animate={{ y: [-15, 15, -15], rotateZ: [-2, 2, -2] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-30 cursor-pointer group"
          >
            <div className="relative w-36 h-36 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-1000"
                animate={{ scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ background: "radial-gradient(circle, rgba(25,183,165,0.3) 0%, rgba(107,231,255,0.1) 60%, transparent 80%)" }}
              />
              <div
                className="relative w-28 h-28 rounded-full flex items-center justify-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  background: "radial-gradient(circle at 35% 35%, rgba(25,183,165,0.2) 0%, rgba(7,19,29,0.95) 70%)",
                  border: "1px solid rgba(107,231,255,0.3)",
                  boxShadow: "inset 0 0 30px rgba(25,183,165,0.15), 0 0 50px rgba(25,183,165,0.1)",
                }}
              >
                <motion.div
                  className="absolute inset-3 rounded-full"
                  style={{ border: "1px solid rgba(107,231,255,0.2)", borderTopColor: "rgba(107,231,255,0.5)" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-6 rounded-full"
                  style={{ border: "1px solid rgba(25,183,165,0.15)", borderBottomColor: "rgba(25,183,165,0.4)" }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                />
                <div className="flex flex-col items-center gap-0.5 z-10 text-center mt-1">
                  <Activity className={`w-5 h-5 ${!pulseData ? 'text-slate-500' : pulseData.market_bias === 'Bullish' ? 'text-[#6EEB83]' : pulseData.market_bias === 'Bearish' ? 'text-red-400' : 'text-[#6BE7FF]'}`} />
                  <span className="font-[family-name:var(--font-orbitron)] text-[8px] text-[#6BE7FF] tracking-widest mt-1">
                    {pulseData ? pulseData.market_bias?.toUpperCase() : "MITHRAMA"}
                  </span>
                  <span className="font-[family-name:var(--font-rajdhani)] text-[7px] text-[#6EEB83] tracking-[0.2em]">
                    {pulseData ? `CONF: ${Math.round(pulseData.confidence * 100)}%` : "ACTIVE"}
                  </span>
                  {pulseData && (
                    <span className="font-[family-name:var(--font-inter)] text-[6px] text-slate-400 tracking-widest uppercase mt-0.5">
                      {pulseData.price_pressure} PRESSURE
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Intel Panels — clustered around orb, avoid bottom-right ── */}

          {/* Export Signal — top right of orb */}
          <IntelCard
            icon={TrendingUp}
            label="Export Signal"
            value={pulseData?.market_bias === 'Bullish' ? "STRONG BUY" : pulseData?.market_bias === 'Bearish' ? "WEAK" : "STABLE"}
            sub={newsData.length > 0 ? (newsData[0].title.length > 25 ? newsData[0].title.substring(0, 25) + '...' : newsData[0].title) : "Fetching signals..."}
            accent={pulseData?.market_bias === 'Bullish' ? '#6EEB83' : pulseData?.market_bias === 'Bearish' ? '#FF4A4A' : '#6BE7FF'}
            delay={0.8}
            position="top-[8%] right-[5%]"
          />

          {/* Weather Risk — top left of orb */}
          <IntelCard
            icon={CloudRain}
            label="Weather Risk"
            value={weatherData?.signal?.severity?.toUpperCase() || "LOADING..."}
            sub={weatherData?.signal?.impact ? (weatherData.signal.impact.length > 25 ? weatherData.signal.impact.substring(0, 25) + '...' : weatherData.signal.impact) : "Awaiting telemetry"}
            accent={weatherData?.signal?.severity === 'High' ? '#FF4A4A' : weatherData?.signal?.severity === 'Medium' ? '#FFB347' : '#19B7A5'}
            delay={1.0}
            position="top-[8%] left-[0%]"
          />

          {/* Pond Stress — bottom left of orb */}
          <IntelCard
            icon={AlertTriangle}
            label="Pond Stress"
            value={weatherData?.signal?.severity === 'High' ? "CRITICAL" : weatherData?.signal?.severity === 'Medium' ? "ELEVATED" : "NOMINAL"}
            sub="Based on climate telemetry"
            accent={weatherData?.signal?.severity === 'High' ? '#FF4A4A' : weatherData?.signal?.severity === 'Medium' ? '#FFB347' : '#19B7A5'}
            delay={1.2}
            position="bottom-[22%] left-[0%]"
            bar={weatherData?.signal?.severity === 'High' ? 85 : weatherData?.signal?.severity === 'Medium' ? 50 : 24}
          />

          {/* Pond Temp — bottom right of orb (above Mithrama widget zone) */}
          <IntelCard
            icon={Thermometer}
            label="Pond Temp"
            value={weatherData?.weather_data?.main?.temp ? `${weatherData.weather_data.main.temp}°C` : "28.4°C"}
            sub={weatherData?.weather_data?.main?.humidity ? `Humidity: ${weatherData.weather_data.main.humidity}%` : "±0.2° last 6h"}
            accent="#6BE7FF"
            delay={1.4}
            position="bottom-[22%] right-[5%]"
          />

          {/* Live Intelligence Ticker — below orb center, above bottom edge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -4, 0] }}
            transition={{ opacity: { delay: 1.6, duration: 0.6 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 } }}
            className="absolute bottom-[5%] left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2 w-[500px] max-w-[90vw]"
            style={{
              background: "rgba(7,19,29,0.88)",
              border: "1px solid rgba(47,58,68,0.8)",
              borderBottom: "2px solid rgba(107,231,255,0.35)",
              backdropFilter: "blur(12px)",
            }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-[#6BE7FF] shrink-0"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="font-[family-name:var(--font-orbitron)] text-[10px] text-slate-400 uppercase tracking-wider shrink-0">
              INTEL FEED
            </span>
            
            <div className="flex-1 overflow-hidden relative h-5 flex items-center" style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}>
              <motion.div
                className="absolute flex items-center whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: newsData.length ? newsData.length * 6 : 10, repeat: Infinity, ease: "linear" }}
              >
                {[...newsData, ...newsData].map((newsItem, idx) => (
                  <div key={idx} className="flex items-center gap-3 mr-8">
                    <span className="font-[family-name:var(--font-rajdhani)] text-sm font-bold text-white">
                      {newsItem.title}
                    </span>
                    {newsItem.signal?.impact && (
                      <span className={`font-[family-name:var(--font-inter)] text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${
                        newsItem.signal.impact === 'Bullish' ? 'bg-[#6EEB83]/20 text-[#6EEB83]' :
                        newsItem.signal.impact === 'Bearish' ? 'bg-red-500/20 text-red-400' :
                        'bg-[#6BE7FF]/20 text-[#6BE7FF]'
                      }`}>
                        {newsItem.signal.impact}
                      </span>
                    )}
                  </div>
                ))}
                {newsData.length === 0 && (
                  <span className="font-[family-name:var(--font-rajdhani)] text-sm font-bold text-slate-400">
                    AWAITING BACKEND INTELLIGENCE SIGNALS...
                  </span>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Wind / ambient telemetry — mid-left */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="absolute top-[46%] left-[2%] z-40 flex items-center gap-2 px-3 py-1.5"
            style={{
              background: "rgba(7,19,29,0.65)",
              border: "1px solid rgba(47,58,68,0.5)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Wind className="w-3 h-3 text-slate-500" />
            <span className="font-[family-name:var(--font-inter)] text-[9px] text-slate-500 uppercase tracking-wider">
              {weatherData?.weather_data?.wind?.speed ? `WIND ${weatherData.weather_data.wind.speed} m/s` : "SW 14 km/h"}
              {' · '}
              {weatherData?.weather_data?.main?.humidity ? `HUMIDITY ${weatherData.weather_data.main.humidity}%` : "HUMIDITY 88%"}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade to page */}
      <div className="absolute bottom-0 left-0 right-0 h-24 z-20 pointer-events-none"
        style={{ background: "linear-gradient(to top, #07131D, transparent)" }}
      />
    </div>
  );
}
