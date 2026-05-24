"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, MapPin, CloudSun, Droplets, ShieldAlert, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FeaturedMarketCard() {
  const [data, setData] = useState<{ price: number; delta: number; isUp: boolean; pct: string; date: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch40C() {
      try {
        // Fetch top 2 most recent dates for 40C
        const { data: prices, error } = await supabase
          .from("shrimp_prices")
          .select("*")
          .eq("size_count", 40)
          .order("market_date", { ascending: false })
          .limit(2);

        if (!error && prices && prices.length > 0) {
          const latest = prices[0];
          const previous = prices.length > 1 ? prices[1] : null;
          
          const latestPrice = latest.price;
          // If we have a real previous row, use it. Otherwise fallback to the previous_price column. Otherwise 0 delta.
          const prevPrice = previous ? previous.price : (latest.previous_price || latest.price);
          
          const delta = Math.abs(latestPrice - prevPrice);
          const isUp = latestPrice >= prevPrice;
          const pct = prevPrice > 0 ? ((delta / prevPrice) * 100).toFixed(2) : "0.00";
          
          // Format date like "Today, 6:30 AM" or "Apr 10"
          const dateObj = new Date(latest.market_date);
          const isToday = new Date().toDateString() === dateObj.toDateString();
          const dateStr = isToday ? "Today" : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          setData({ price: latestPrice, delta, isUp, pct, date: dateStr });
        } else {
          setData(null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetch40C();
  }, []);

  return (
    <div className="flex gap-4 items-stretch h-[320px]">
      {/* Main Spotlight Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        className="w-[400px] bg-[#031B2E]/60 backdrop-blur-2xl p-6 rounded-3xl relative overflow-hidden group hover:shadow-[0_20px_60px_rgba(0,194,184,0.15)] transition-all duration-700 border border-white/10 flex flex-col"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#00C2B8]/15 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:from-[#00C2B8]/25 transition-colors duration-700"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00C2B8]" />
              <span className="text-[11px] text-slate-300 font-bold tracking-widest uppercase">Live Market Spotlight</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium bg-white/5 px-2 py-1 rounded-full border border-white/5">
              <MapPin className="w-3 h-3 text-[#00C2B8]" /> Bhimavaram <ArrowRightIcon className="w-3 h-3 ml-0.5" />
            </div>
          </div>

          <h3 className="text-slate-200 text-sm mb-0.5 font-medium">40C Vannamei</h3>
          
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-[#00C2B8] animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div className="flex items-end gap-1.5">
                  <h2 className="text-5xl font-sora font-extrabold text-white tracking-tighter drop-shadow-md">
                    ₹{data?.price || 365}
                  </h2>
                  <span className="text-slate-400 text-sm mb-1.5 font-medium">/ kg</span>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border shadow-inner ${data?.isUp ? 'text-[#1DBF73] bg-[#1DBF73]/10 border-[#1DBF73]/20' : 'text-red-400 bg-red-400/10 border-red-400/20'}`}>
                    {data?.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    ₹{data?.delta || 0} ({data?.pct || "0.00"}%)
                  </span>
                  <span className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">vs Yesterday</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="w-3.5 h-3.5 text-[#00C2B8]" />
                <span className="text-xs text-slate-300">Market Trend: <span className="text-[#00C2B8] font-bold">Strong ↗</span></span>
              </div>

              <div className="text-[10px] text-slate-500 mt-2 mb-2 font-medium">Updated: {data?.date || "Recently"}</div>

              {/* Line Chart Graphic */}
              <div className="flex-1 w-full relative mt-1 opacity-90 group-hover:opacity-100 transition-opacity">
                <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00C2B8" stopOpacity="0.25"/>
                    <stop offset="100%" stopColor="#00C2B8" stopOpacity="0"/>
                  </linearGradient>
                  <path d="M0,25 Q10,25 20,20 T40,25 T60,15 T80,10 T100,15 L100,30 L0,30 Z" fill="url(#chartGrad)"/>
                  <path d="M0,25 Q10,25 20,20 T40,25 T60,15 T80,10 T100,15" fill="none" stroke="#00C2B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  {[
                    { cx: 20, cy: 20 }, { cx: 40, cy: 25 }, { cx: 60, cy: 15 }, { cx: 80, cy: 10 }, { cx: 100, cy: 15 }
                  ].map((pt, i) => (
                    <circle key={i} cx={pt.cx} cy={pt.cy} r="1.5" fill="#fff" stroke="#00C2B8" strokeWidth="1" className="drop-shadow-[0_0_3px_#00C2B8]" />
                  ))}
                </svg>
                <div className="absolute bottom-[-15px] left-0 right-0 flex justify-between text-[9px] text-slate-500 font-medium">
                  <span>Apr 10</span>
                  <span>Apr 17</span>
                  <span>Apr 24</span>
                  <span>May 01</span>
                  <span>May 08</span>
                </div>
              </div>

              {/* Footer Metrics */}
              <div className="flex justify-between items-end mt-7 pt-4 border-t border-white/10">
                <div>
                  <div className="text-[9px] text-slate-400 mb-0.5 uppercase tracking-wider font-semibold">30-Day Range</div>
                  <div className="text-xs font-bold text-white">₹310 - ₹380</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[9px] text-slate-400 mb-0.5 uppercase tracking-wider font-semibold">Confidence</div>
                    <div className="text-[11px] font-bold text-[#1DBF73]">High</div>
                  </div>
                  <div className="w-9 h-9 rounded-full border-2 border-[#021220] bg-[#021220]/50 relative flex items-center justify-center shadow-inner">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1DBF73" strokeWidth="2.5" strokeDasharray="82, 100" strokeLinecap="round" className="drop-shadow-[0_0_3px_#1DBF73]" />
                    </svg>
                    <span className="text-[9px] font-bold text-white">82%</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Slim Vertical Insights Widget */}
      <motion.div
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        className="w-[90px] bg-[#031B2E]/50 backdrop-blur-2xl rounded-3xl border border-white/10 flex flex-col justify-between py-6 items-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

        <div className="flex flex-col items-center gap-1.5 group cursor-pointer relative z-10">
          <CloudSun className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          <div className="text-[8px] text-slate-400 uppercase tracking-widest font-semibold">Weather</div>
          <div className="text-[11px] font-bold text-white">29°C</div>
        </div>
        
        <div className="w-6 h-[1px] bg-white/10 relative z-10"></div>
        
        <div className="flex flex-col items-center gap-1.5 group cursor-pointer relative z-10">
          <Droplets className="w-5 h-5 text-[#00C2B8] group-hover:text-[#35F3FF] transition-colors drop-shadow-[0_0_5px_rgba(0,194,184,0.5)]" />
          <div className="text-[8px] text-slate-400 uppercase tracking-widest text-center font-semibold">Water<br/>Quality</div>
          <div className="text-[11px] font-bold text-[#00C2B8]">Good</div>
        </div>

        <div className="w-6 h-[1px] bg-white/10 relative z-10"></div>

        <div className="flex flex-col items-center gap-1.5 group cursor-pointer relative z-10">
          <ShieldAlert className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          <div className="text-[8px] text-slate-400 uppercase tracking-widest text-center font-semibold">Disease<br/>Alert</div>
          <div className="text-[11px] font-bold text-[#1DBF73]">Low</div>
        </div>

        <div className="w-6 h-[1px] bg-white/10 relative z-10"></div>

        <div className="flex flex-col items-center gap-1.5 group cursor-pointer relative z-10">
          <TrendingUp className="w-5 h-5 text-[#1DBF73] drop-shadow-[0_0_5px_rgba(29,191,115,0.5)]" />
          <div className="text-[8px] text-slate-400 uppercase tracking-widest text-center font-semibold">Feed<br/>Trend</div>
          <div className="text-[11px] font-bold text-[#1DBF73]">Stable</div>
        </div>
      </motion.div>
    </div>
  );
}

function ArrowRightIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="13 17 18 12 13 7" />
      <line x1="6" y1="12" x2="18" y2="12" />
    </svg>
  );
}
