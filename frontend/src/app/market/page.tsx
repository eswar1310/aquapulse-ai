"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, TrendingUp, TrendingDown, Activity, Calendar, Download, 
  MapPin, CloudSun, ShieldAlert, Zap, Mic, Play, ChevronDown, Plus
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, Legend 
} from "recharts";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

// Define Types
interface PriceData {
  size_count: number;
  price: number;
  delta: number;
  pct: number;
  isUp: boolean;
  isDown: boolean;
}

export default function MarketDashboard() {
  const router = useRouter();
  const [chatQuery, setChatQuery] = useState("");
  const [latestDate, setLatestDate] = useState<string>("");
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [timeRange, setTimeRange] = useState("30D");

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch latest
        const latestRes = await fetch("/api/market/latest");
        const latestData = await latestRes.json();
        if (latestData.prices) {
          setPrices(latestData.prices);
          setLatestDate(latestData.latestDate);
        }

        // Fetch history
        const historyRes = await fetch(`/api/market/history?days=30`);
        const historyData = await historyRes.json();
        if (historyData.data) {
          // Format dates for display
          const formattedHistory = historyData.data.map((d: any) => ({
            ...d,
            displayDate: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }));
          setHistory(formattedHistory);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [timeRange]); // would re-fetch on timeRange change in a real app

  const price40C = prices.find(p => p.size_count === 40);

  return (
    <div className="min-h-screen bg-[#010a12] text-slate-200 font-manrope selection:bg-[#00C2B8]/30">
      <Navbar />
      
      {/* Background ambient glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00C2B8]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#35F3FF]/5 rounded-full blur-[150px]"></div>
      </div>

      <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto flex flex-col gap-6">
        
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-sora font-bold text-white tracking-tight flex items-center gap-3">
              Andhra Benchmark Market
              <span className="px-2.5 py-1 rounded-md bg-[#1DBF73]/10 text-[#1DBF73] border border-[#1DBF73]/20 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1DBF73] animate-pulse"></span> LIVE
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#00C2B8]" /> Primary Benchmark Source: Bhimavaram
            </p>
          </div>
          
          <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-semibold transition-colors">
            <Download className="w-3.5 h-3.5 text-[#00C2B8]" /> Download PDF Report
          </button>
        </div>

        {/* Top Summary Strip */}
        <div className="w-full bg-[#021220]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-6 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto flex-1">
            <div className="flex flex-col shrink-0">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Latest Update</span>
              <span className="text-sm font-semibold text-white flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#00C2B8]" />
                {latestDate ? new Date(latestDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' }) : "Loading..."}
              </span>
            </div>
            
            <div className="w-px h-8 bg-white/10 shrink-0"></div>
            
            <div className="flex flex-col shrink-0">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Market Signal</span>
              <span className="text-sm font-bold text-[#1DBF73] flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> Strong Bull
              </span>
            </div>

            <div className="w-px h-8 bg-white/10 shrink-0"></div>
            
            <div className="flex flex-col shrink-0">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Volatility Index</span>
              <span className="text-sm font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                <Activity className="w-3.5 h-3.5" /> Medium (12%)
              </span>
            </div>

            <div className="w-px h-8 bg-white/10 shrink-0"></div>
            
            <div className="flex flex-col shrink-0">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Outlook</span>
              <div className="flex gap-3 mt-0.5">
                <span className="text-xs font-medium text-slate-300">3D: <span className="text-[#1DBF73] font-bold">↗</span></span>
                <span className="text-xs font-medium text-slate-300">7D: <span className="text-slate-400 font-bold">→</span></span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsAlertOpen(true)}
            className="shrink-0 w-10 h-10 rounded-xl bg-[#00C2B8]/10 text-[#00C2B8] hover:bg-[#00C2B8]/20 hover:text-[#35F3FF] border border-[#00C2B8]/30 flex items-center justify-center transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#35F3FF] rounded-full"></span>
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Main Chart Area (Spans 3 cols on large screens) */}
          <div className="xl:col-span-3 flex flex-col gap-6">
            
            {/* Chart Card */}
            <div className="bg-[#021220]/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="font-sora text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#00C2B8]" />
                    Price Trend Analysis
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Vannamei farm-gate prices (₹/kg)</p>
                </div>
                
                <div className="flex bg-[#010a12] rounded-lg p-1 border border-white/5">
                  {['7D', '30D', '90D', '1Y', 'ALL'].map(range => (
                    <button 
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        timeRange === range ? 'bg-[#00C2B8]/20 text-[#35F3FF]' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full h-[400px]">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#00C2B8] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="glow40C" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00C2B8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#00C2B8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis 
                        dataKey="displayDate" 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(val) => `₹${val}`}
                        domain={['dataMin - 20', 'dataMax + 20']}
                      />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'rgba(2, 18, 32, 0.9)', borderColor: 'rgba(0, 194, 184, 0.3)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                        labelStyle={{ color: '#94a3b8', fontSize: '10px', marginBottom: '4px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} iconType="circle" />
                      
                      <Line type="monotone" dataKey="100C" stroke="#475569" strokeWidth={1.5} dot={false} />
                      <Line type="monotone" dataKey="80C" stroke="#64748b" strokeWidth={1.5} dot={false} />
                      <Line type="monotone" dataKey="60C" stroke="#94a3b8" strokeWidth={1.5} dot={false} />
                      <Line type="monotone" dataKey="40C" stroke="#35F3FF" strokeWidth={3} dot={{r: 4, fill: '#010a12', stroke: '#35F3FF', strokeWidth: 2}} activeDot={{r: 6, fill: '#35F3FF', stroke: '#fff'}} style={{ filter: 'drop-shadow(0 0 8px rgba(53,243,255,0.5))' }} />
                      <Line type="monotone" dataKey="30C" stroke="#1DBF73" strokeWidth={1.5} dot={false} />
                      <Line type="monotone" dataKey="25C" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Comparison Grid */}
            <div>
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00C2B8]"></div> All Count Sizes
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {prices.map(item => (
                  <motion.div 
                    key={item.size_count} 
                    whileHover={{ y: -5, scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#021220]/60 backdrop-blur-md border border-white/5 hover:border-[#00C2B8]/30 hover:shadow-[0_10px_30px_rgba(0,194,184,0.15)] rounded-2xl p-4 transition-colors cursor-pointer"
                  >
                    <div className="text-[10px] text-slate-400 font-bold mb-1">{item.size_count} COUNT</div>
                    <div className="text-xl font-sora font-bold text-white mb-2">₹{item.price}</div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500">24H</span>
                      <span className={`font-bold flex items-center ${item.isUp ? 'text-[#1DBF73]' : item.isDown ? 'text-red-400' : 'text-slate-400'}`}>
                        {item.isUp ? '+' : item.isDown ? '-' : ''}₹{Math.abs(item.delta)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-6">
            
            {/* 40C Featured Card */}
            <div className="bg-gradient-to-br from-[#031B2E] to-[#010a12] border border-[#00C2B8]/30 rounded-3xl p-6 relative overflow-hidden shadow-[0_20px_40px_rgba(0,194,184,0.1)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C2B8]/20 blur-3xl rounded-full -mr-10 -mt-10"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-[10px] text-[#00C2B8] uppercase tracking-widest font-bold">Featured Benchmark</div>
                  <h3 className="text-lg font-sora font-bold text-white mt-1">40C Vannamei</h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#00C2B8]/10 flex items-center justify-center border border-[#00C2B8]/20">
                  <Activity className="w-4 h-4 text-[#00C2B8]" />
                </div>
              </div>

              <div className="flex items-end gap-1 mb-2">
                <span className="text-5xl font-sora font-extrabold text-white tracking-tighter">₹{price40C?.price || '--'}</span>
                <span className="text-slate-400 text-sm mb-1.5 font-medium">/ kg</span>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <span className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 ${price40C?.isUp ? 'bg-[#1DBF73]/10 text-[#1DBF73]' : 'bg-red-400/10 text-red-400'}`}>
                  {price40C?.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {price40C?.delta ? `+₹${price40C.delta}` : '₹0'} ({price40C?.pct ? price40C.pct.toFixed(2) : '0.00'}%)
                </span>
                <span className="text-[10px] text-slate-500">vs Yesterday</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Weekly Trend</span>
                  <span className="text-white font-semibold">Strong Bullish</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">30-Day High</span>
                  <span className="text-white font-semibold">₹380</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Buyer Demand</span>
                  <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-[#00C2B8]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Outlook Card */}
            <div className="bg-[#021220]/60 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center p-1">
                  <div className="w-full h-full bg-[#021220] rounded-full flex items-center justify-center">
                    <Zap className="w-3 h-3 text-purple-400" />
                  </div>
                </div>
                <h3 className="font-sora text-sm font-bold text-white">AI Outlook</h3>
              </div>
              
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Current momentum suggests prices may stabilize over the next 48 hours. Export demand remains high for 40C-60C ranges, offsetting local oversupply.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#010a12] p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-slate-500 mb-1">3-Day Forecast</div>
                  <div className="text-[#1DBF73] font-bold text-xs flex items-center gap-1">↗ +2.5%</div>
                </div>
                <div className="bg-[#010a12] p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-slate-500 mb-1">Confidence</div>
                  <div className="text-white font-bold text-xs">84%</div>
                </div>
              </div>
              
              <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 rounded-lg transition-colors border border-white/5">
                Read Full AI Analysis
              </button>
            </div>

            {/* Mithrama Market Panel (Integrated) */}
            <div className="bg-gradient-to-br from-[#00C2B8]/10 to-[#021220] border border-[#00C2B8]/20 rounded-3xl p-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(53,243,255,0.15)_0%,_transparent_70%)]"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#00C2B8]/30 to-navy p-0.5 flex items-center justify-center">
                    <div className="w-full h-full bg-[#021220] rounded-full flex items-center justify-center">
                      <img src="/prawn-silhouette.svg" className="w-5 h-5 opacity-80" alt="Mithrama" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-sora text-sm font-bold text-white">Mithrama</h4>
                    <p className="text-[10px] text-[#00C2B8]">Market Assistant</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-4 font-medium">Need help understanding today's market movements?</p>

                <div className="flex flex-col gap-2 mb-4">
                  {["Explain 40C trend", "Best harvest window?", "Weekly summary"].map(prompt => (
                    <button 
                      key={prompt} 
                      onClick={() => router.push(`/aqua-ai?q=${encodeURIComponent(prompt)}`)}
                      className="text-left text-[11px] text-[#00C2B8] bg-[#00C2B8]/10 hover:bg-[#00C2B8]/20 px-3 py-2 rounded-lg transition-colors border border-[#00C2B8]/20"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Ask anything..." 
                    value={chatQuery}
                    onChange={(e) => setChatQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && chatQuery.trim()) {
                        router.push(`/aqua-ai?q=${encodeURIComponent(chatQuery.trim())}`);
                      }
                    }}
                    className="w-full bg-[#010a12] border border-white/10 rounded-full py-2.5 pl-4 pr-10 text-xs text-white focus:outline-none focus:border-[#00C2B8]" 
                  />
                  <button 
                    onClick={() => {
                      if (chatQuery.trim()) {
                        router.push(`/aqua-ai?q=${encodeURIComponent(chatQuery.trim())}`);
                      }
                    }}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-[#00C2B8]/20 text-[#35F3FF] rounded-full hover:bg-[#00C2B8]/40 transition-colors"
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Alert Modal */}
      <AnimatePresence>
        {isAlertOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAlertOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#021220] border border-[#00C2B8]/30 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,194,184,0.2)]"
            >
              <h3 className="font-sora text-xl font-bold text-white mb-1 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#00C2B8]" /> Set Market Alert
              </h3>
              <p className="text-xs text-slate-400 mb-6">Mithrama will notify you via SMS/WhatsApp.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1.5 block">Count Size</label>
                  <select className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00C2B8]">
                    <option>40C Vannamei</option>
                    <option>60C Vannamei</option>
                    <option>100C Vannamei</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1.5 block">Condition</label>
                    <select className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00C2B8]">
                      <option>Rises Above</option>
                      <option>Drops Below</option>
                      <option>% Change Daily</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1.5 block">Target Price (₹)</label>
                    <input type="number" placeholder="e.g. 400" className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00C2B8]" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setIsAlertOpen(false)}
                  className="flex-1 py-3 text-sm font-semibold text-slate-300 hover:text-white bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsAlertOpen(false)}
                  className="flex-1 py-3 text-sm font-bold text-[#010a12] bg-gradient-to-r from-[#00C2B8] to-[#35F3FF] rounded-xl hover:shadow-[0_0_20px_rgba(0,194,184,0.4)] transition-all"
                >
                  Save Alert
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
