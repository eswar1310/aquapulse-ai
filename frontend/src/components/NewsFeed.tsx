"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, ExternalLink, TrendingUp, TrendingDown, Clock, ShieldAlert, RefreshCw } from "lucide-react";
import { apiClient, NewsItem } from "@/lib/api";

function formatRelativeTime(dateStr?: string) {
  if (!dateStr) return "Recently";
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch (e) {
    return "Recently";
  }
}

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Bullish" | "Bearish" | "Neutral">("All");

  async function fetchNews() {
    setLoading(true);
    try {
      const data = await apiClient.intelligence.getNewsSignals();
      setNews(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error loading news feed", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = news.filter((item) => {
    if (filter === "All") return true;
    return item.signal?.impact === filter;
  });

  return (
    <section id="news" className="w-full pt-16 pb-20 border-t border-white/5 bg-[#010a12] scroll-mt-24">
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C2B8] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C2B8]"></span>
              </span>
              <span className="text-[10px] text-[#00C2B8] uppercase tracking-[0.25em] font-bold">Mithrama Intelligence Hub</span>
            </div>
            <h2 className="text-3xl font-sora font-bold text-white tracking-tight flex items-center gap-3">
              <Newspaper className="w-7 h-7 text-[#00C2B8]" />
              Real-time Market & Industry Feed
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
              Live aquaculture news scraped from primary global channels and analyzed by Mithrama AI for short-term local price and export impacts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchNews}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
              title="Refresh News Feed"
              aria-label="Refresh news"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#00C2B8]' : ''}`} />
            </button>
            <div className="flex bg-[#021220]/80 rounded-xl p-1 border border-white/5 text-xs font-semibold">
              {(["All", "Bullish", "Bearish", "Neutral"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    filter === tab 
                      ? tab === "Bullish" ? "bg-[#1DBF73]/20 text-[#1DBF73] shadow-sm"
                        : tab === "Bearish" ? "bg-red-500/20 text-red-400 shadow-sm"
                        : tab === "Neutral" ? "bg-[#00C2B8]/20 text-[#35F3FF] shadow-sm"
                        : "bg-white/5 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feed Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[#021220]/45 border border-white/5 rounded-3xl p-6 h-[260px] animate-pulse flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-24 h-4 bg-white/10 rounded"></div>
                    <div className="w-16 h-4 bg-white/10 rounded"></div>
                  </div>
                  <div className="w-full h-6 bg-white/10 rounded mb-2"></div>
                  <div className="w-4/5 h-6 bg-white/10 rounded mb-4"></div>
                  <div className="w-full h-12 bg-white/5 rounded"></div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <div className="w-20 h-4 bg-white/10 rounded"></div>
                  <div className="w-24 h-6 bg-white/10 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="w-full bg-[#021220]/30 border border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
            <ShieldAlert className="w-12 h-12 text-slate-500 mb-4" />
            <h3 className="text-white font-sora font-semibold text-lg">No signals match the filter</h3>
            <p className="text-slate-400 text-sm mt-1">Try switching to the 'All' tab to check all active signals.</p>
          </div>
        ) : (
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
          >
            <AnimatePresence mode="popLayout">
              {filteredNews.map((item, idx) => {
                const impact = item.signal?.impact || "Neutral";
                const dateStr = item.published || item.published_at;
                
                let impactStyle = "text-[#35F3FF] bg-[#35F3FF]/10 border-[#35F3FF]/20";
                if (impact === "Bullish") {
                  impactStyle = "text-[#1DBF73] bg-[#1DBF73]/10 border-[#1DBF73]/20";
                } else if (impact === "Bearish") {
                  impactStyle = "text-red-400 bg-red-400/10 border-red-400/20";
                }

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    key={`${item.title}-${idx}`}
                    className="bg-[#021220]/50 backdrop-blur-xl border border-white/10 hover:border-[#00C2B8]/30 p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,194,184,0.08)] flex flex-col justify-between group min-h-[280px]"
                  >
                    <div>
                      {/* Meta information */}
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
                          {item.source || "Feed Source"}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {formatRelativeTime(dateStr)}
                        </div>
                      </div>

                      {/* Article Title */}
                      <h3 className="text-white font-sora font-semibold text-sm leading-relaxed mb-3 group-hover:text-[#35F3FF] transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      {/* AI Reasoning summary */}
                      {item.signal?.reason && (
                        <div className="bg-[#010a12]/80 border border-white/5 p-3 rounded-xl text-slate-400 text-xs leading-relaxed">
                          <div className="text-[9px] uppercase tracking-widest text-[#00C2B8] font-bold mb-1">Mithrama Impact Note</div>
                          {item.signal.reason}
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                        {item.signal?.confidence && (
                          <span>Confidence: <span className="text-white font-bold">{Math.round(item.signal.confidence * 100)}%</span></span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${impactStyle}`}>
                          {impact}
                        </span>
                        
                        {(item.url || item.link) && (
                          <a 
                            href={item.url || item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                            title="Read Original Article"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
