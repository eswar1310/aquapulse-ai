"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Activity, Calculator, History, CheckCircle, 
  ChevronRight, Sparkles, Sprout, TrendingUp, Syringe
} from "lucide-react";
import { cn } from "@/lib/utils";

import PDFAnalyzer from "@/components/tools/PDFAnalyzer";
import DiseaseScan from "@/components/tools/DiseaseScan";
import SmartCalculators from "@/components/tools/SmartCalculators";

const MENU_ITEMS = [
  { id: "pdf", label: "PDF Analyzer", icon: FileText, color: "text-[#00C2B8]" },
  { id: "disease", label: "Disease Scan", icon: Activity, color: "text-rose-400" },
  { id: "calc", label: "Smart Calculators", icon: Calculator, color: "text-[#35F3FF]" },
];

const FUTURE_ITEMS = [
  { id: "feed", label: "Feed Planner", icon: Sprout },
  { id: "harvest", label: "Harvest Optimizer", icon: TrendingUp },
  { id: "med", label: "Medicine Guide", icon: Syringe },
];

const RECENT_ACTIVITY = [
  { title: "Water Report Analyzed", time: "2 hours ago", status: "Optimal", type: "pdf" },
  { title: "WSSV Scan Completed", time: "Yesterday", status: "High Risk", type: "disease" },
  { title: "FCR Calculated (1.2)", time: "3 days ago", status: "Saved", type: "calc" },
];

function ToolsWorkspaceContent() {
  const searchParams = useSearchParams();
  const [activeTool, setActiveTool] = useState("pdf");

  useEffect(() => {
    const tool = searchParams.get("tool");
    if (tool && ["pdf", "disease", "calc"].includes(tool)) {
      setActiveTool(tool);
    }
  }, [searchParams]);

  return (
    <div className="flex-1 flex flex-col pt-[88px] lg:h-screen lg:overflow-hidden min-h-screen overflow-y-auto bg-[#010a12]">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#00C2B8]/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#35F3FF]/5 blur-[150px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 lg:p-6 w-full max-w-[1800px] mx-auto z-10 lg:h-full lg:overflow-hidden">
        
        {/* LEFT NAV PANEL */}
        <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-6">
          <div className="glass-panel p-5 rounded-3xl border border-[#00C2B8]/20 bg-[#021220]/80 h-full overflow-y-auto custom-scrollbar flex flex-col">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 px-2">Active Tools</h2>
            <nav className="flex flex-col gap-2">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTool === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTool(item.id)}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all duration-300 relative group overflow-hidden text-left",
                      isActive 
                        ? "bg-[#031B2E] border border-[#00C2B8]/30 shadow-[0_0_15px_rgba(0,194,184,0.1)]" 
                        : "hover:bg-white/5 border border-transparent"
                    )}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeNav" 
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00C2B8] to-[#35F3FF] shadow-[0_0_10px_rgba(53,243,255,0.8)]"
                      />
                    )}
                    <Icon className={cn("w-5 h-5 transition-colors", isActive ? item.color : "text-slate-400 group-hover:text-slate-300")} />
                    <span className={cn("font-medium text-sm transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200")}>
                      {item.label}
                    </span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto text-slate-500" />}
                  </button>
                );
              })}
            </nav>

            <div className="mt-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4 px-2 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Coming Soon
              </h2>
              <nav className="flex flex-col gap-1">
                {FUTURE_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl opacity-50 grayscale cursor-not-allowed"
                    >
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span className="font-medium text-sm text-slate-500">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </nav>
            </div>
            
            {/* Branding badge */}
            <div className="mt-auto pt-6 px-2">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#00C2B8]/10 to-transparent border border-[#00C2B8]/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#021220] flex items-center justify-center shadow-inner">
                  <span className="text-[#35F3FF] font-bold font-sora text-xs">AP</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">AquaPulse Premium</div>
                  <div className="text-[10px] text-slate-400">Workspace Active</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER WORKSPACE */}
        <main className="flex-1 h-full flex flex-col min-w-0">
          <div className="glass-panel rounded-3xl border border-white/10 bg-[#021220]/60 p-6 lg:p-8 min-h-[500px] lg:h-full shadow-2xl relative overflow-y-auto lg:overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTool}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {activeTool === "pdf" && <PDFAnalyzer />}
                {activeTool === "disease" && <DiseaseScan />}
                {activeTool === "calc" && <SmartCalculators />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* RIGHT PANEL - HISTORY */}
        <aside className="w-full lg:w-80 flex-shrink-0 hidden xl:flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-[#021220]/80 h-full overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-2 mb-6">
              <History className="w-5 h-5 text-slate-400" />
              <h2 className="text-sm font-bold text-white">Recent Activity</h2>
            </div>

            <div className="relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              <div className="space-y-6 relative">
                {RECENT_ACTIVITY.map((activity, i) => (
                  <div key={i} className="relative flex items-center justify-between group cursor-pointer">
                    {/* Timeline Dot */}
                    <div className="absolute left-0 w-[24px] h-[24px] bg-[#021220] rounded-full border-2 border-[#00C2B8]/50 flex items-center justify-center z-10 group-hover:border-[#35F3FF] group-hover:scale-110 transition-all shadow-[0_0_10px_rgba(0,194,184,0.3)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00C2B8] group-hover:bg-[#35F3FF]"></div>
                    </div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.03, x: -2 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="ml-10 glass-panel p-3 rounded-2xl bg-white/5 border border-white/5 w-full group-hover:bg-white/10 group-hover:border-[#00C2B8]/30 group-hover:shadow-[0_5px_15px_rgba(0,194,184,0.15)] transition-all"
                    >
                      <div className="text-xs text-slate-400 mb-1">{activity.time}</div>
                      <div className="text-sm font-medium text-slate-200">{activity.title}</div>
                      <div className="flex items-center gap-1.5 mt-2">
                        {activity.status === "Optimal" && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                        {activity.status === "High Risk" && <Activity className="w-3 h-3 text-rose-400" />}
                        {activity.status === "Saved" && <FileText className="w-3 h-3 text-[#35F3FF]" />}
                        <span className={cn(
                          "text-[10px] font-medium uppercase tracking-wider",
                          activity.status === "Optimal" ? "text-emerald-400" :
                          activity.status === "High Risk" ? "text-rose-400" :
                          "text-[#35F3FF]"
                        )}>{activity.status}</span>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 glass-panel p-5 rounded-2xl bg-[#00C2B8]/5 border border-[#00C2B8]/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00C2B8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-sm font-bold text-[#00C2B8] mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Pro Tip
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect your farm sensors in the dashboard to automatically pipe real-time water data into the PDF Analyzer for immediate cross-referencing.
              </p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

export default function ToolsWorkspace() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-[#010a12] flex flex-col items-center justify-center"><div className="w-12 h-12 border-4 border-[#00C2B8]/20 border-t-[#00C2B8] rounded-full animate-spin"></div></div>}>
      <ToolsWorkspaceContent />
    </Suspense>
  );
}
