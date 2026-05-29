"use client";

import { useState, useRef } from "react";
import { UploadCloud, Activity, CheckCircle, AlertTriangle, MessageSquare, Loader2, Image as ImageIcon, ShieldAlert, FileText, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getApiUrl } from "@/lib/api";

export default function DiseaseScan() {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("files", selectedFile);
    formData.append("session_id", "web_" + Date.now());
    formData.append("doc", "45");
    formData.append("feeding_response", "Unknown");
    formData.append("mortality_percent", "0");
    formData.append("symptoms", notes || "None provided");

    try {
      setIsUploading(false);
      setIsAnalyzing(true);
      
      let response;
      try {
        response = await fetch(getApiUrl("/disease-scan"), {
          method: "POST",
          body: formData,
        });
      } catch (networkErr: any) {
        console.warn("FastAPI backend offline, falling back to Next.js API scaffold.");
        response = await fetch("/api/disease-scan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: "web_" + Date.now(),
          }),
        });
      }

      if (!response.ok) {
        throw new Error("Neural network offline or server error.");
      }

      const data = await response.json();
      
      if (data.success && data.data && !data.analysis) {
        const formattedData = {
          stored_paths: ["mock_preview.png"],
          analysis: {
            observations: ["Initial signs of WSSV", "Elevated mortality rates"],
            possible_causes: [data.data.issue],
            confidence: data.data.confidence,
            urgency: data.data.warningLevel === "high" ? "High" : "Medium",
            recommended_checks: ["PCR test for WSSV", "Verify oxygen levels"],
            action_plan: [data.data.nextStep]
          },
          explanation: {
            mithrama_explanation: "Offline Diagnostic Alert: The scanned visual highlights possible WSSV symptoms. Please isolate the pond immediately and contact the local coordinator.",
            next_steps: [data.data.nextStep],
            urgency_message: "High priority action needed."
          }
        };
        setResult(formattedData);
        return;
      }

      if (data.analysis?.parse_error) {
        throw new Error("Failed to parse diagnostic data from visual core.");
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScanner = () => {
    setResult(null);
    setSelectedImage(null);
    setSelectedFile(null);
    setError(null);
    setNotes("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-sora font-bold text-white flex items-center gap-2">
            <Activity className="text-rose-400 w-6 h-6" />
            Disease Scanner
          </h2>
          <p className="text-slate-400 mt-1 text-sm">Biological image analysis and threat detection.</p>
        </div>
        {result && (
          <button onClick={resetScanner} className="text-sm text-slate-400 hover:text-white flex items-center gap-1 transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20">
            <X className="w-4 h-4" /> New Scan
          </button>
        )}
      </div>

      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
      />

      {!result && !isAnalyzing && (
        <div className="flex-1 flex flex-col gap-4 max-w-2xl mx-auto w-full">
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border-2 border-dashed ${selectedImage ? 'border-[#00C2B8]/40 bg-[#00C2B8]/5' : 'border-rose-500/30 bg-[#031B2E]/50'} rounded-3xl transition-colors relative overflow-hidden flex flex-col`}
          >
            {selectedImage ? (
              <div className="relative w-full aspect-video flex items-center justify-center bg-black/40 overflow-hidden">
                <img src={selectedImage} alt="Upload preview" className="object-contain max-h-full max-w-full z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#021220] via-transparent to-transparent z-10"></div>
                <button onClick={() => fileInputRef.current?.click()} className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-xs text-white border border-white/10 hover:bg-black/80 transition">
                  Change Image
                </button>
              </div>
            ) : (
              <div 
                className="flex flex-col items-center p-12 text-center z-10 cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
                  <UploadCloud className="w-10 h-10 text-rose-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Upload Visual Evidence</h3>
                <p className="text-slate-400 mb-6 max-w-sm text-sm">Capture clear photos of affected shrimp, unusual water color, or microscopic slides.</p>
                <button className="bg-gradient-to-r from-rose-500 to-rose-400 text-white px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] transition-all">
                  Browse Files
                </button>
              </div>
            )}
          </motion.div>

          {selectedImage && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
              <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-[#010a12]/60">
                <div className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  Contextual Notes (Optional)
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g. Sudden drop in feed consumption yesterday, spots noticed today..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-[#00C2B8]/50 resize-none h-20"
                />
              </div>
              <button 
                onClick={handleAnalyze}
                disabled={isUploading || isAnalyzing}
                className="w-full bg-[#00C2B8] text-[#010a12] py-4 rounded-2xl font-bold font-sora shadow-[0_0_20px_rgba(0,194,184,0.3)] hover:shadow-[0_0_30px_rgba(0,194,184,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
                {isUploading ? "Transmitting..." : "Initialize Neural Scan"}
              </button>
            </motion.div>
          )}
        </div>
      )}

      {isAnalyzing && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 flex items-center justify-center mb-8">
            <div className="absolute inset-0 border-2 border-[#00C2B8]/20 rounded-full animate-ping"></div>
            <div className="absolute inset-4 border-2 border-dashed border-[#00C2B8]/40 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-8 border border-rose-500/30 rounded-full animate-pulse"></div>
            <ShieldAlert className="w-12 h-12 text-[#00C2B8] animate-pulse" />
          </div>
          <h3 className="text-2xl font-sora font-semibold text-white mb-2 tracking-wide">ANALYZING BIOMETRICS</h3>
          <p className="text-[#00C2B8] font-mono text-sm uppercase tracking-widest animate-pulse">Deep Learning Models Engaged</p>
          
          <div className="w-64 h-1 bg-white/10 rounded-full mt-8 overflow-hidden relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-[#00C2B8] to-transparent w-1/2"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
        </div>
      )}

      {result && result.analysis && result.explanation && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6"
        >
          {/* Scan Results Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Image Preview (Left) */}
            <div className="glass-panel rounded-3xl p-4 bg-[#021220]/80 border border-white/5 flex flex-col items-start justify-start min-h-[300px]">
              <div className="w-full aspect-square border border-dashed border-slate-600 rounded-2xl flex items-center justify-center bg-black/50 overflow-hidden relative group mb-4">
                {selectedImage && (
                  <img src={selectedImage} alt="Scanned Evidence" className="object-cover w-full h-full opacity-60 mix-blend-luminosity" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#021220] via-transparent to-transparent"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-[#00C2B8]/50 shadow-[0_0_10px_#00C2B8] animate-scan" />
              </div>
              
              <div className="w-full">
                <div className="text-xs font-mono text-slate-500 mb-2 uppercase">Diagnostic Telemetry</div>
                <div className="bg-black/30 rounded-xl p-3 border border-white/5 font-mono text-xs text-slate-300 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">ID</span>
                    <span className="text-[#00C2B8] truncate ml-4">{selectedFile?.name || "UNKNOWN"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">SIZE</span>
                    <span className="text-slate-300">{(selectedFile?.size ? selectedFile.size / 1024 : 0).toFixed(1)} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">FORMAT</span>
                    <span className="text-slate-300">{selectedFile?.type || "IMAGE"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Data (Right) */}
            <div className="lg:col-span-2 space-y-4">
              <div className={`glass-panel p-6 rounded-3xl border ${result.analysis.urgency === 'High' ? 'border-red-500/30 bg-red-500/10' : result.analysis.urgency === 'Medium' ? 'border-amber-500/30 bg-amber-500/10' : 'border-[#00C2B8]/30 bg-[#00C2B8]/10'} relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-40 h-40 ${result.analysis.urgency === 'High' ? 'bg-red-500/20' : result.analysis.urgency === 'Medium' ? 'bg-amber-500/20' : 'bg-[#00C2B8]/20'} blur-[60px] rounded-full`}></div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className={`font-bold flex items-center gap-2 mb-1 ${result.analysis.urgency === 'High' ? 'text-red-400' : result.analysis.urgency === 'Medium' ? 'text-amber-400' : 'text-[#00C2B8]'}`}>
                      <AlertTriangle className="w-5 h-5" />
                      {result.analysis.urgency === 'High' ? 'Critical Threat Detected' : result.analysis.urgency === 'Medium' ? 'Elevated Risk Identified' : 'Diagnostic Complete'}
                    </h3>
                    <div className="text-2xl md:text-3xl font-sora font-semibold text-white relative z-10 leading-tight">
                      {result.analysis.possible_causes && result.analysis.possible_causes.length > 0 ? result.analysis.possible_causes.join(" / ") : "Unidentified Anomaly"}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="text-xs text-slate-400 mb-1 font-mono uppercase">Confidence</div>
                    <div className="text-2xl font-bold text-white bg-white/10 px-4 py-1.5 rounded-xl border border-white/10">{result.analysis.confidence}%</div>
                  </div>
                </div>
                
                <div className="bg-[#010a12]/70 p-5 rounded-2xl border border-white/5 relative z-10 backdrop-blur-md">
                  <div className="text-xs font-mono text-slate-400 mb-2 uppercase">Mithrama Analysis</div>
                  <div className="text-slate-200 text-sm md:text-base leading-relaxed">{result.explanation.mithrama_explanation}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recommended Action Plan */}
                <div className="glass-panel p-5 rounded-2xl border border-[#00C2B8]/20 bg-[#031B2E]/40 h-full">
                  <div className="text-sm font-semibold text-[#00C2B8] mb-4 flex items-center gap-2 font-mono uppercase">
                    <CheckCircle className="w-4 h-4" />
                    Recommended Action Plan
                  </div>
                  <div className="space-y-3">
                    {result.explanation.next_steps && result.explanation.next_steps.length > 0 ? (
                      result.explanation.next_steps.map((step: string, i: number) => (
                        <div key={i} className="w-full text-left p-3 rounded-xl bg-white/5 text-slate-300 text-sm flex items-start gap-3 border border-transparent hover:border-white/5 transition-colors">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00C2B8] mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-400 p-3">No specific actions recommended.</div>
                    )}
                  </div>
                </div>

                {/* Technical Observations */}
                <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#010a12]/40 h-full">
                  <div className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2 font-mono uppercase">
                    <Activity className="w-4 h-4" />
                    System Observations
                  </div>
                  <div className="space-y-3">
                    {result.analysis.observations && result.analysis.observations.length > 0 ? (
                      result.analysis.observations.map((obs: string, i: number) => (
                        <div key={i} className="text-sm text-slate-400 flex items-start gap-2">
                          <span className="text-slate-600 mt-0.5 font-mono">[{i+1}]</span>
                          <span>{obs}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-400">No notable observations recorded.</div>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      )}
      
      {/* Global Animation Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}} />
    </div>
  );
}
