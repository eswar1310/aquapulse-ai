"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface PriceData {
  id: string;
  size_count: number;
  price: number;
  previous_price: number | null;
  market_date: string;
}

export default function LiveMarketTicker() {
  const [prices, setPrices] = useState<{size_count: number, price: number, delta: number, isUp: boolean, isDown: boolean}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const { data, error } = await supabase
          .from("shrimp_prices")
          .select("*")
          .order("market_date", { ascending: false });

        if (!error && data && data.length > 0) {
          // Map database field count_size to size_count (e.g. "40 C" to 40)
          const processedData = data.map((item: any) => ({
            ...item,
            size_count: parseInt(item.count_size) || 0
          }));

          // Find the 2 most recent distinct dates
          const distinctDates = Array.from(new Set(processedData.map(d => d.market_date)));
          const mostRecentDate = distinctDates[0];
          const previousDate = distinctDates.length > 1 ? distinctDates[1] : null;

          const latestPrices = processedData.filter(d => d.market_date === mostRecentDate);
          const previousPrices = previousDate ? processedData.filter(d => d.market_date === previousDate) : [];

          const computed = latestPrices.map(latest => {
            const prevRecord = previousPrices.find(p => p.size_count === latest.size_count);
            const prevPrice = prevRecord ? prevRecord.price : (latest.previous_price || latest.price);
            const isUp = latest.price > prevPrice;
            const isDown = latest.price < prevPrice;
            const delta = Math.abs(latest.price - prevPrice);
            return {
              size_count: latest.size_count,
              price: latest.price,
              delta,
              isUp,
              isDown
            };
          });

          const sorted = computed.sort((a, b) => b.size_count - a.size_count);
          setPrices(sorted);
        } else {
          // Fallback
          setPrices([
            { size_count: 100, price: 210, delta: 5, isUp: true, isDown: false },
            { size_count: 90, price: 230, delta: 5, isUp: true, isDown: false },
            { size_count: 80, price: 260, delta: 5, isUp: true, isDown: false },
            { size_count: 70, price: 290, delta: 5, isUp: true, isDown: false },
            { size_count: 60, price: 320, delta: 5, isUp: true, isDown: false },
            { size_count: 50, price: 360, delta: 5, isUp: true, isDown: false },
            { size_count: 40, price: 365, delta: 15, isUp: true, isDown: false },
            { size_count: 30, price: 310, delta: 5, isUp: false, isDown: true },
            { size_count: 25, price: 270, delta: 5, isUp: false, isDown: true },
          ]);
        }
      } catch (err) {
        console.error("Error fetching prices:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
  }, []);

  if (loading) {
    return (
      <div className="h-[60px] w-full lg:w-[85%] bg-[#021220]/70 backdrop-blur-xl rounded-2xl border border-white/5 flex items-center px-6 animate-shimmer relative z-20">
        <span className="text-[#00C2B8] text-xs font-semibold tracking-wide">Syncing live market data...</span>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[85%] bg-[#021220]/75 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.4)] flex items-center p-2 relative z-20">
      
      {/* Label Box */}
      <div className="flex flex-col px-4 py-1 shrink-0">
        <div className="flex items-center gap-1.5 text-[9px] text-[#00C2B8] uppercase tracking-widest font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#35F3FF] shadow-[0_0_5px_rgba(53,243,255,0.8)] animate-pulse"></span>
          Live Prices
        </div>
        <div className="text-[11px] text-slate-300 font-medium">Bhimavaram Market</div>
      </div>

      <div className="h-8 w-px bg-white/10 mx-1 shrink-0"></div>

      {/* Scrolling Container */}
      <div className="flex-1 overflow-hidden relative flex items-center h-full">
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[#021220] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#021220] to-transparent z-10 pointer-events-none"></div>
        
        <motion.div 
          className="flex items-center gap-1 px-4 transform-gpu will-change-transform"
          style={{ transform: "translate3d(0,0,0)", backfaceVisibility: "hidden" }}
          animate={{ x: [0, -110 * prices.length] }}
          transition={{
            x: { repeat: Infinity, repeatType: "loop", duration: prices.length * 3.5, ease: "linear" },
          }}
        >
          {[...prices, ...prices].map((item, idx) => {
            const is40C = item.size_count === 40;

            return (
              <div 
                key={`ticker-${idx}`} 
                className={`flex flex-col items-center justify-center px-5 py-2 rounded-xl shrink-0 transition-colors ${
                  is40C ? 'bg-gradient-to-b from-[#00C2B8]/20 to-[#021220]/80 border border-[#00C2B8]/40 shadow-[0_0_15px_rgba(0,194,184,0.2)]' : 'hover:bg-white/5'
                }`}
              >
                <span className="text-[10px] text-slate-400 font-medium mb-0.5">{item.size_count}C</span>
                <div className="flex items-center gap-1">
                  <span className={`font-sora font-bold ${is40C ? 'text-white text-lg drop-shadow-sm' : 'text-slate-200 text-sm'}`}>₹{item.price}</span>
                  {item.isUp && <TrendingUp className="w-3 h-3 text-[#1DBF73] ml-0.5" />}
                  {item.isDown && <TrendingDown className="w-3 h-3 text-red-400 ml-0.5" />}
                  {!item.isUp && !item.isDown && <Minus className="w-3 h-3 text-slate-500 ml-0.5" />}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <div className="h-8 w-px bg-white/10 mx-1 shrink-0"></div>

      {/* Action */}
      <Link href="/market" className="shrink-0 px-4 py-2 text-[11px] font-semibold text-slate-300 hover:text-white flex items-center gap-1 transition-colors">
        View All Prices <ArrowRightIcon className="w-3 h-3" />
      </Link>
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
