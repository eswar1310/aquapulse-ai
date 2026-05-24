"use client";

import { useState } from "react";
import { 
  Calculator, ArrowRight, Save, DollarSign, Activity, Scale, 
  Droplet, ChevronLeft, RefreshCw, AlertCircle, Info, Percent
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CALCULATORS = [
  {
    id: "feed",
    title: "Feed Calculator",
    icon: <Calculator className="w-6 h-6 text-[#00C2B8]" />,
    desc: "Calculate optimal daily feed requirements based on ABW and survival.",
    color: "from-[#00C2B8]/20 to-transparent",
    border: "border-[#00C2B8]/30",
    glow: "shadow-[0_0_15px_rgba(0,194,184,0.15)]"
  },
  {
    id: "biomass",
    title: "Biomass Estimator",
    icon: <Scale className="w-6 h-6 text-indigo-400" />,
    desc: "Estimate total pond biomass for accurate harvest planning.",
    color: "from-indigo-500/20 to-transparent",
    border: "border-indigo-500/30",
    glow: "shadow-[0_0_15px_rgba(99,102,241,0.15)]"
  },
  {
    id: "fcr",
    title: "FCR Tracker",
    icon: <Activity className="w-6 h-6 text-emerald-400" />,
    desc: "Monitor Feed Conversion Ratio to optimize profitability.",
    color: "from-emerald-500/20 to-transparent",
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]"
  },
  {
    id: "dosage",
    title: "Mineral Dosage",
    icon: <Droplet className="w-6 h-6 text-cyan-400" />,
    desc: "Calculate precise mineral and probiotic requirements per acre.",
    color: "from-cyan-500/20 to-transparent",
    border: "border-cyan-500/30",
    glow: "shadow-[0_0_15px_rgba(34,211,238,0.15)]"
  },
  {
    id: "profit",
    title: "Profit Predictor",
    icon: <DollarSign className="w-6 h-6 text-amber-400" />,
    desc: "Forecast potential returns based on current live market rates.",
    color: "from-amber-500/20 to-transparent",
    border: "border-amber-500/30",
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]"
  }
];

export default function SmartCalculators() {
  const [activeCalc, setActiveCalc] = useState<string | null>(null);

  // Feed Calculator State
  const [feedAbw, setFeedAbw] = useState("12");
  const [feedSurvival, setFeedSurvival] = useState("80");
  const [feedStocked, setFeedStocked] = useState("100000");
  const [feedResult, setFeedResult] = useState<any>(null);

  // Biomass Calculator State
  const [bioArea, setBioArea] = useState("1"); // acres
  const [bioDensity, setBioDensity] = useState("60"); // per sqm
  const [bioAbw, setBioAbw] = useState("15");
  const [bioSurvival, setBioSurvival] = useState("85");
  const [bioResult, setBioResult] = useState<any>(null);

  // FCR Calculator State
  const [fcrFeed, setFcrFeed] = useState("2400");
  const [fcrBiomass, setFcrBiomass] = useState("2000");
  const [fcrInitial, setFcrInitial] = useState("50");
  const [fcrResult, setFcrResult] = useState<any>(null);

  // Mineral Dosage State
  const [doseArea, setDoseArea] = useState("1");
  const [doseDepth, setDoseDepth] = useState("4");
  const [doseMineral, setDoseMineral] = useState("mg");
  const [doseCurrent, setDoseCurrent] = useState("950");
  const [doseTarget, setDoseTarget] = useState("1200");
  const [doseResult, setDoseResult] = useState<any>(null);

  // Profit Predictor State
  const [profBiomass, setProfBiomass] = useState("2500");
  const [profPrice, setProfPrice] = useState("365"); // 40 count price
  const [profFeedCost, setProfFeedCost] = useState("95");
  const [profFcr, setProfFcr] = useState("1.3");
  const [profOtherCosts, setProfOtherCosts] = useState("150000");
  const [profResult, setProfResult] = useState<any>(null);

  // Calculations
  const calculateFeed = () => {
    const abw = parseFloat(feedAbw);
    const survival = parseFloat(feedSurvival) / 100;
    const stocked = parseFloat(feedStocked);
    
    if (isNaN(abw) || isNaN(survival) || isNaN(stocked)) return;

    const estimatedSurvivalCount = stocked * survival;
    const estimatedBiomassKg = (estimatedSurvivalCount * abw) / 1000;

    // Standard feeding rate percentage based on ABW
    let feedRatePct = 3.0;
    if (abw < 3) feedRatePct = 6.0;
    else if (abw >= 3 && abw < 6) feedRatePct = 4.5;
    else if (abw >= 6 && abw < 10) feedRatePct = 3.5;
    else if (abw >= 10 && abw < 15) feedRatePct = 2.8;
    else if (abw >= 15 && abw < 20) feedRatePct = 2.2;
    else if (abw >= 20) feedRatePct = 1.6;

    const dailyFeedKg = estimatedBiomassKg * (feedRatePct / 100);

    setFeedResult({
      biomass: estimatedBiomassKg.toFixed(1),
      dailyFeed: dailyFeedKg.toFixed(1),
      ratePct: feedRatePct,
      meals: {
        meal1: (dailyFeedKg * 0.2).toFixed(1), // 20% morning
        meal2: (dailyFeedKg * 0.35).toFixed(1), // 35% afternoon
        meal3: (dailyFeedKg * 0.3).toFixed(1), // 30% evening
        meal4: (dailyFeedKg * 0.15).toFixed(1), // 15% night
      }
    });
  };

  const calculateBiomass = () => {
    const areaAcres = parseFloat(bioArea);
    const density = parseFloat(bioDensity);
    const abw = parseFloat(bioAbw);
    const survival = parseFloat(bioSurvival) / 100;

    if (isNaN(areaAcres) || isNaN(density) || isNaN(abw) || isNaN(survival)) return;

    // 1 Acre = 4046.86 sqm
    const totalAreaSqm = areaAcres * 4046.86;
    const totalStocked = totalAreaSqm * density;
    const currentSurvivalCount = totalStocked * survival;
    const totalBiomassKg = (currentSurvivalCount * abw) / 1000;

    setBioResult({
      totalStocked: Math.round(totalStocked).toLocaleString(),
      survivalCount: Math.round(currentSurvivalCount).toLocaleString(),
      biomass: totalBiomassKg.toFixed(0),
      avgDensity: (currentSurvivalCount / totalAreaSqm).toFixed(1)
    });
  };

  const calculateFcr = () => {
    const feed = parseFloat(fcrFeed);
    const biomass = parseFloat(fcrBiomass);
    const initial = parseFloat(fcrInitial);

    if (isNaN(feed) || isNaN(biomass) || isNaN(initial)) return;

    const gained = biomass - initial;
    if (gained <= 0) {
      setFcrResult({ error: "Biomass gain must be greater than zero." });
      return;
    }

    const fcr = feed / gained;
    let status = "Excellent";
    let statusColor = "text-emerald-400";
    let desc = "Optimal feed efficiency. Keep doing what you're doing!";

    if (fcr > 1.25 && fcr <= 1.5) {
      status = "Good";
      statusColor = "text-teal-400";
      desc = "Standard feed conversion. Check feeding trays to optimize further.";
    } else if (fcr > 1.5 && fcr <= 1.8) {
      status = "Sub-optimal";
      statusColor = "text-amber-400";
      desc = "Overfeeding suspected. Reduce daily feed amount slightly and verify tray waste.";
    } else if (fcr > 1.8) {
      status = "Critical Risk";
      statusColor = "text-rose-400";
      desc = "Heavy feed wastage or survival drop. Immediate cutback recommended to prevent water pollution.";
    }

    setFcrResult({
      fcr: fcr.toFixed(2),
      gained: gained.toFixed(0),
      status,
      statusColor,
      desc
    });
  };

  const calculateDosage = () => {
    const area = parseFloat(doseArea);
    const depth = parseFloat(doseDepth);
    const current = parseFloat(doseCurrent);
    const target = parseFloat(doseTarget);

    if (isNaN(area) || isNaN(depth) || isNaN(current) || isNaN(target)) return;

    // Volume in Liters: Area in acres * 4047 sqm * depth in meters (feet / 3.28)
    const depthMeters = depth / 3.28084;
    const volumeM3 = area * 4046.86 * depthMeters;
    const volumeLiters = volumeM3 * 1000;

    const deficitPpm = Math.max(0, target - current);
    // Deficit in grams: volume in Liters * deficit mg/L (ppm) / 1000
    const deficitGrams = (volumeLiters * deficitPpm) / 1000;
    const deficitKg = deficitGrams / 1000;

    // Commercial product factors (approximate mineral content of salts)
    // MgCl2.6H2O ~ 12% Mg
    // CaCl2 ~ 36% Ca
    // KCl ~ 52% K
    // Lime ~ 40% Ca
    let productNeedKg = 0;
    let productName = "";

    if (doseMineral === "mg") {
      productNeedKg = deficitKg / 0.12;
      productName = "Magnesium Chloride (MgCl₂·6H₂O)";
    } else if (doseMineral === "ca") {
      productNeedKg = deficitKg / 0.36;
      productName = "Calcium Chloride (CaCl₂)";
    } else if (doseMineral === "k") {
      productNeedKg = deficitKg / 0.52;
      productName = "Muriate of Potash (KCl)";
    } else {
      productNeedKg = deficitKg / 0.40;
      productName = "Agricultural Lime / Dolomite";
    }

    setDoseResult({
      volume: volumeM3.toFixed(0),
      deficit: deficitPpm,
      productNeed: productNeedKg.toFixed(1),
      productName
    });
  };

  const calculateProfit = () => {
    const biomass = parseFloat(profBiomass);
    const price = parseFloat(profPrice);
    const feedCost = parseFloat(profFeedCost);
    const fcr = parseFloat(profFcr);
    const other = parseFloat(profOtherCosts);

    if (isNaN(biomass) || isNaN(price) || isNaN(feedCost) || isNaN(fcr) || isNaN(other)) return;

    const totalFeedKg = biomass * fcr;
    const totalFeedCost = totalFeedKg * feedCost;
    const totalRevenue = biomass * price;
    const totalExpenses = totalFeedCost + other;
    const netProfit = totalRevenue - totalExpenses;
    const roi = (netProfit / totalExpenses) * 100;
    const costPerKg = totalExpenses / biomass;

    setProfResult({
      revenue: Math.round(totalRevenue).toLocaleString(),
      expenses: Math.round(totalExpenses).toLocaleString(),
      profit: Math.round(netProfit).toLocaleString(),
      roi: roi.toFixed(1),
      costPerKg: costPerKg.toFixed(1),
      isProfitable: netProfit > 0
    });
  };

  const resetCalculator = (id: string) => {
    if (id === "feed") setFeedResult(null);
    else if (id === "biomass") setBioResult(null);
    else if (id === "fcr") setFcrResult(null);
    else if (id === "dosage") setDoseResult(null);
    else if (id === "profit") setProfResult(null);
  };

  return (
    <div className="flex flex-col h-full">
      
      {/* Header Area */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-sora font-bold text-white flex items-center gap-2">
            <Calculator className="text-[#35F3FF] w-6 h-6" />
            Smart Calculators
          </h2>
          <p className="text-slate-400 mt-1 text-sm">Precise, industry-standard aquaculture mathematics at your fingertips.</p>
        </div>
        {activeCalc && (
          <button 
            onClick={() => setActiveCalc(null)} 
            className="text-sm text-slate-400 hover:text-white flex items-center gap-1 transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20"
          >
            <ChevronLeft className="w-4 h-4" /> Back to List
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-8">
        <AnimatePresence mode="wait">
          {!activeCalc ? (
            // Calculator list view
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {CALCULATORS.map((calc, i) => (
                <motion.div
                  key={calc.id}
                  onClick={() => {
                    setActiveCalc(calc.id);
                    resetCalculator(calc.id);
                  }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className={`glass-panel p-5 rounded-3xl border ${calc.border} bg-gradient-to-b ${calc.color} bg-[#031B2E]/60 hover:bg-[#031B2E]/80 transition-all cursor-pointer group relative overflow-hidden ${calc.glow}`}
                >
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors pointer-events-none"></div>
                  
                  <div className="bg-[#021220] w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                    {calc.icon}
                  </div>
                  
                  <h3 className="text-base font-bold text-white mb-2">{calc.title}</h3>
                  <p className="text-xs text-slate-400 mb-6 line-clamp-2 leading-relaxed">{calc.desc}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[11px] font-semibold text-slate-400 group-hover:text-white/80 transition-colors uppercase tracking-wider">Launch Tool</span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00C2B8] group-hover:text-black transition-all group-hover:translate-x-1">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // Calculator detailed views
            <motion.div
              key={activeCalc}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-3xl mx-auto"
            >
              {/* FEED CALCULATOR */}
              {activeCalc === "feed" && (
                <div className="glass-panel p-6 rounded-3xl border border-[#00C2B8]/20 bg-[#021220]/80 space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#00C2B8]/10 flex items-center justify-center border border-[#00C2B8]/20">
                      <Calculator className="w-5 h-5 text-[#00C2B8]" />
                    </div>
                    <div>
                      <h3 className="font-sora font-bold text-white text-base">Daily Feed Calculator</h3>
                      <p className="text-xs text-slate-400">Compute biomass and feed meals matching shrimp age/weight</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Stocked Post-Larvae (pcs)</label>
                      <input 
                        type="number" 
                        value={feedStocked} 
                        onChange={(e) => setFeedStocked(e.target.value)} 
                        className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00C2B8]" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Survival Estimate (%)</label>
                      <input 
                        type="number" 
                        value={feedSurvival} 
                        onChange={(e) => setFeedSurvival(e.target.value)} 
                        className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00C2B8]" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Average Body Weight (g)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        value={feedAbw} 
                        onChange={(e) => setFeedAbw(e.target.value)} 
                        className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00C2B8]" 
                      />
                    </div>
                  </div>

                  <button 
                    onClick={calculateFeed}
                    className="w-full bg-[#00C2B8] text-black font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(0,194,184,0.3)] hover:shadow-[0_0_20px_rgba(0,194,184,0.5)] transition"
                  >
                    Calculate Feed Allocation
                  </button>

                  {feedResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 pt-4 border-t border-white/5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-[#010a12] p-4 rounded-xl border border-white/5">
                          <div className="text-[10px] text-slate-400 mb-1 font-mono uppercase">Est. Biomass</div>
                          <div className="text-xl font-bold text-white">{feedResult.biomass} kg</div>
                        </div>
                        <div className="bg-[#010a12] p-4 rounded-xl border border-white/5">
                          <div className="text-[10px] text-slate-400 mb-1 font-mono uppercase">Daily Feed Rate</div>
                          <div className="text-xl font-bold text-[#00C2B8]">{feedResult.ratePct}% <span className="text-xs text-slate-500 font-normal">of biomass</span></div>
                        </div>
                        <div className="bg-[#010a12] p-4 rounded-xl border border-white/5">
                          <div className="text-[10px] text-slate-400 mb-1 font-mono uppercase">Daily Total Feed</div>
                          <div className="text-xl font-bold text-[#35F3FF]">{feedResult.dailyFeed} kg</div>
                        </div>
                      </div>

                      <div className="bg-[#010a12]/50 border border-white/5 p-4 rounded-2xl">
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 font-mono">Recommended Meal Distribution (4 Meals)</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="bg-white/5 p-3 rounded-lg text-center">
                            <div className="text-[10px] text-slate-500 font-mono mb-1">Morning (6AM - 20%)</div>
                            <div className="text-sm font-bold text-white">{feedResult.meals.meal1} kg</div>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg text-center">
                            <div className="text-[10px] text-slate-500 font-mono mb-1">Noon (11AM - 35%)</div>
                            <div className="text-sm font-bold text-white">{feedResult.meals.meal2} kg</div>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg text-center">
                            <div className="text-[10px] text-slate-500 font-mono mb-1">Evening (4PM - 30%)</div>
                            <div className="text-sm font-bold text-white">{feedResult.meals.meal3} kg</div>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg text-center">
                            <div className="text-[10px] text-slate-500 font-mono mb-1">Night (10PM - 15%)</div>
                            <div className="text-sm font-bold text-white">{feedResult.meals.meal4} kg</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* BIOMASS ESTIMATOR */}
              {activeCalc === "biomass" && (
                <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 bg-[#021220]/80 space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                      <Scale className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-sora font-bold text-white text-base">Pond Biomass Estimator</h3>
                      <p className="text-xs text-slate-400">Project biomass based on stocking density, size & area</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Pond Area (Acres)</label>
                      <input 
                        type="number" 
                        value={bioArea} 
                        onChange={(e) => setBioArea(e.target.value)} 
                        className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" 
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Stocking Density (pcs/m²)</label>
                      <input 
                        type="number" 
                        value={bioDensity} 
                        onChange={(e) => setBioDensity(e.target.value)} 
                        className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" 
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Estimated Survival Rate (%)</label>
                      <input 
                        type="number" 
                        value={bioSurvival} 
                        onChange={(e) => setBioSurvival(e.target.value)} 
                        className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" 
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Current Weight (ABW - g)</label>
                      <input 
                        type="number" 
                        value={bioAbw} 
                        onChange={(e) => setBioAbw(e.target.value)} 
                        className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" 
                      />
                    </div>
                  </div>

                  <button 
                    onClick={calculateBiomass}
                    className="w-full bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition"
                  >
                    Estimate Total Biomass
                  </button>

                  {bioResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5"
                    >
                      <div className="bg-[#010a12] p-4 rounded-xl border border-white/5">
                        <div className="text-[10px] text-slate-400 mb-1 font-mono uppercase">Total Stocked</div>
                        <div className="text-base font-bold text-white">{bioResult.totalStocked} pcs</div>
                      </div>
                      <div className="bg-[#010a12] p-4 rounded-xl border border-white/5">
                        <div className="text-[10px] text-slate-400 mb-1 font-mono uppercase">Est. Active count</div>
                        <div className="text-base font-bold text-white">{bioResult.survivalCount} pcs</div>
                      </div>
                      <div className="bg-[#010a12] p-4 rounded-xl border border-white/5">
                        <div className="text-[10px] text-slate-400 mb-1 font-mono uppercase">Total Biomass</div>
                        <div className="text-lg font-bold text-[#35F3FF]">{bioResult.biomass} kg</div>
                      </div>
                      <div className="bg-[#010a12] p-4 rounded-xl border border-white/5">
                        <div className="text-[10px] text-slate-400 mb-1 font-mono uppercase">Effective Density</div>
                        <div className="text-base font-bold text-white">{bioResult.avgDensity} / m²</div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* FCR TRACKER */}
              {activeCalc === "fcr" && (
                <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 bg-[#021220]/80 space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <Activity className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-sora font-bold text-white text-base">FCR Efficiency Tracker</h3>
                      <p className="text-xs text-slate-400">Assess Feed Conversion Ratio against industry benchmarks</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Total Feed Distributed (kg)</label>
                      <input 
                        type="number" 
                        value={fcrFeed} 
                        onChange={(e) => setFcrFeed(e.target.value)} 
                        className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Current Biomass (kg)</label>
                      <input 
                        type="number" 
                        value={fcrBiomass} 
                        onChange={(e) => setFcrBiomass(e.target.value)} 
                        className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Initial Stocked Biomass (kg)</label>
                      <input 
                        type="number" 
                        value={fcrInitial} 
                        onChange={(e) => setFcrInitial(e.target.value)} 
                        className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" 
                      />
                    </div>
                  </div>

                  <button 
                    onClick={calculateFcr}
                    className="w-full bg-emerald-500 text-black font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition"
                  >
                    Evaluate Feed Conversion Ratio
                  </button>

                  {fcrResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 pt-4 border-t border-white/5"
                    >
                      {fcrResult.error ? (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" /> {fcrResult.error}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-[#010a12] p-4 rounded-xl border border-white/5 flex flex-col justify-center items-center text-center">
                            <span className="text-[10px] text-slate-400 mb-1 font-mono uppercase">Calculated FCR</span>
                            <span className="text-4xl font-extrabold text-white tracking-tight mb-2">{fcrResult.fcr}</span>
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${fcrResult.statusColor} bg-white/5 border border-current/10`}>
                              {fcrResult.status}
                            </span>
                          </div>

                          <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                            <div>
                              <div className="text-[10px] text-slate-400 mb-1 font-mono uppercase">Net Biomass Gained</div>
                              <div className="text-xl font-bold text-white mb-2">{fcrResult.gained} kg</div>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-sans">{fcrResult.desc}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* MINERAL DOSAGE */}
              {activeCalc === "dosage" && (
                <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 bg-[#021220]/80 space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                      <Droplet className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-sora font-bold text-white text-base">Mineral Treatment Dosage</h3>
                      <p className="text-xs text-slate-400">Calculate corrections for pond water parameter deficiencies</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Pond Area (Acres)</label>
                      <input 
                        type="number" 
                        value={doseArea} 
                        onChange={(e) => setDoseArea(e.target.value)} 
                        className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Average Depth (Feet)</label>
                      <input 
                        type="number" 
                        value={doseDepth} 
                        onChange={(e) => setDoseDepth(e.target.value)} 
                        className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Target Mineral</label>
                      <select 
                        value={doseMineral}
                        onChange={(e) => setDoseMineral(e.target.value)}
                        className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                      >
                        <option value="mg">Magnesium (Mg)</option>
                        <option value="ca">Calcium (Ca)</option>
                        <option value="k">Potassium (K)</option>
                        <option value="lime">Lime Correction (CaCO3)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Current Level (ppm)</label>
                      <input 
                        type="number" 
                        value={doseCurrent} 
                        onChange={(e) => setDoseCurrent(e.target.value)} 
                        className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Target Level (ppm)</label>
                      <input 
                        type="number" 
                        value={doseTarget} 
                        onChange={(e) => setDoseTarget(e.target.value)} 
                        className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500" 
                      />
                    </div>
                  </div>

                  <button 
                    onClick={calculateDosage}
                    className="w-full bg-cyan-400 text-black font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition"
                  >
                    Calculate Dosage Needed
                  </button>

                  {doseResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 pt-4 border-t border-white/5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#010a12] p-4 rounded-xl border border-white/5">
                          <div className="text-[10px] text-slate-400 mb-1 font-mono uppercase">Calculated Pond Water Volume</div>
                          <div className="text-lg font-bold text-white">{parseInt(doseResult.volume).toLocaleString()} m³</div>
                        </div>
                        <div className="bg-[#010a12] p-4 rounded-xl border border-white/5">
                          <div className="text-[10px] text-slate-400 mb-1 font-mono uppercase">Parameter Deficit</div>
                          <div className="text-lg font-bold text-amber-400">{doseResult.deficit} ppm (mg/L)</div>
                        </div>
                      </div>

                      <div className="bg-[#00C2B8]/5 border border-[#00C2B8]/20 p-5 rounded-2xl">
                        <div className="text-xs text-[#00C2B8] uppercase font-bold tracking-widest font-mono mb-2">Recommended Mineral Treatment</div>
                        <div className="text-3xl font-extrabold text-white mb-2">{doseResult.productNeed} <span className="text-lg font-normal text-slate-300">kg</span></div>
                        <div className="text-xs text-slate-400">Total required commercial grade <span className="font-bold text-white">{doseResult.productName}</span> to raise levels to target. Do not apply more than 100 kg/acre in a single dose to avoid salinity shock.</div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* PROFIT PREDICTOR */}
              {activeCalc === "profit" && (
                <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 bg-[#021220]/80 space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                      <DollarSign className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-sora font-bold text-white text-base">Harvest Profit Predictor</h3>
                      <p className="text-xs text-slate-400">Forecast net profits and ROI against benchmark market prices</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="col-span-2 md:col-span-2">
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Exp. Harvest Biomass (kg)</label>
                      <input 
                        type="number" 
                        value={profBiomass} 
                        onChange={(e) => setProfBiomass(e.target.value)} 
                        className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500" 
                      />
                    </div>
                    <div className="col-span-2 md:col-span-2">
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Market gate Price (₹/kg)</label>
                      <input 
                        type="number" 
                        value={profPrice} 
                        onChange={(e) => setProfPrice(e.target.value)} 
                        className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500" 
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Feed FCR</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        value={profFcr} 
                        onChange={(e) => setProfFcr(e.target.value)} 
                        className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500" 
                      />
                    </div>
                    <div className="col-span-2 md:col-span-2">
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Feed Cost (₹/kg)</label>
                      <input 
                        type="number" 
                        value={profFeedCost} 
                        onChange={(e) => setProfFeedCost(e.target.value)} 
                        className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500" 
                      />
                    </div>
                    <div className="col-span-3 md:col-span-3">
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Larvae Seed & Fixed Costs (₹)</label>
                      <input 
                        type="number" 
                        value={profOtherCosts} 
                        onChange={(e) => setProfOtherCosts(e.target.value)} 
                        className="w-full bg-[#010a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500" 
                      />
                    </div>
                  </div>

                  <button 
                    onClick={calculateProfit}
                    className="w-full bg-amber-500 text-black font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition"
                  >
                    Generate Financial Outlook
                  </button>

                  {profResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 pt-4 border-t border-white/5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[#010a12] p-4 rounded-xl border border-white/5">
                          <div className="text-[10px] text-slate-400 mb-1 font-mono uppercase">Gross Revenue</div>
                          <div className="text-xl font-bold text-white">₹{profResult.revenue}</div>
                        </div>
                        <div className="bg-[#010a12] p-4 rounded-xl border border-white/5">
                          <div className="text-[10px] text-slate-400 mb-1 font-mono uppercase">Estimated Expenses</div>
                          <div className="text-xl font-bold text-slate-300">₹{profResult.expenses}</div>
                        </div>
                        <div className={`p-4 rounded-xl border ${profResult.isProfitable ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                          <div className="text-[10px] text-slate-400 mb-1 font-mono uppercase">Projected Net Profit</div>
                          <div className={`text-xl font-bold ${profResult.isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>₹{profResult.profit}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center py-1">
                          <span className="text-xs text-slate-400 font-mono">EST. RETURN ON INVESTMENT (ROI)</span>
                          <span className={`text-sm font-bold ${profResult.isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>{profResult.roi}%</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-t sm:border-t-0 sm:border-l border-white/10 sm:pl-4">
                          <span className="text-xs text-slate-400 font-mono">EST. PRODUCTION COST PER KG</span>
                          <span className="text-sm font-bold text-white">₹{profResult.costPerKg} / kg</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
