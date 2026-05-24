"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, Globe, Waves, VolumeX, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Live Market", href: "/market" },
  { name: "Aqua AI", href: "/aqua-ai" },
  { name: "Weather Radar", href: "/weather" },
  { name: "Tools", href: "/tools" },
  { name: "News", href: "/#news" },
  { name: "Disease Scan", href: "/tools?tool=disease" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "TE">("EN");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (soundEnabled) {
        audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [soundEnabled]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out py-4 px-4 sm:px-6 lg:px-8",
        isScrolled ? "py-2" : "py-6"
      )}
    >
      <div className="max-w-[1600px] mx-auto">
        <div
          className={cn(
            "glass-nav rounded-full px-4 sm:px-6 py-3 flex items-center justify-between transition-all duration-500",
            isScrolled ? "bg-[#021220]/85 shadow-[0_10px_40px_rgba(0,0,0,0.8)] border-[#00C2B8]/40" : "bg-[#021220]/60 shadow-lg border-[#00C2B8]/20"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-[#00C2B8] to-[#35F3FF] p-[1.5px] shadow-[0_0_20px_rgba(0,194,184,0.5)]">
              <div className="w-full h-full rounded-full bg-[#021220] flex items-center justify-center transition-colors duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#00C2B8]/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <Waves className="w-5 h-5 text-[#35F3FF] relative z-10" />
              </div>
            </div>
            <span className="font-sora font-bold text-2xl tracking-tight hidden sm:block text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              Aqua<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2B8] to-[#35F3FF] drop-shadow-[0_0_10px_rgba(53,243,255,0.6)]">Pulse</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium px-4 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all relative overflow-hidden group"
              >
                <span className="relative z-10">{link.name}</span>
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#00C2B8] to-[#35F3FF] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full shadow-[0_0_10px_rgba(53,243,255,0.8)]"></span>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Nature Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-slate-400 hover:text-[#00C2B8] transition-colors rounded-full hover:bg-white/5 relative group"
              aria-label="Toggle Nature Sounds"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#00C2B8] drop-shadow-[0_0_5px_rgba(0,194,184,0.8)]" /> : <VolumeX className="w-4 h-4" />}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] bg-[#021220] text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none">
                {soundEnabled ? "Mute Nature" : "Play Nature"}
              </span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === "EN" ? "TE" : "EN")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-semibold text-slate-200"
            >
              <Globe className="w-4 h-4 text-[#00C2B8]" />
              <span className="w-5 text-center">{lang}</span>
            </button>

            <Link
              href="/market"
              className="hidden sm:inline-flex items-center justify-center text-sm font-bold bg-gradient-to-r from-[#00C2B8] to-[#35F3FF] text-[#010a12] px-6 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(53,243,255,0.6)] transition-all hover:-translate-y-0.5 font-sora"
            >
              Terminal
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-slate-300 hover:text-white bg-white/5 rounded-full border border-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-full left-4 right-4 mt-2 p-5 bg-[#031B2E]/90 backdrop-blur-2xl rounded-3xl lg:hidden flex flex-col gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-[#00C2B8]/30"
          >
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-2xl hover:bg-white/10 text-slate-200 font-medium transition-colors flex items-center justify-between group"
                >
                  {link.name}
                  <span className="w-2 h-2 rounded-full bg-[#00C2B8] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </Link>
              ))}
              <div className="h-px w-full bg-white/10 my-2"></div>
              <Link
                href="/market"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 w-full text-center text-sm font-bold bg-gradient-to-r from-[#00C2B8] to-[#35F3FF] text-[#010a12] px-5 py-3 rounded-2xl shadow-[0_0_15px_rgba(53,243,255,0.4)]"
              >
                Open Terminal
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hidden Audio Player for Ambient Sounds */}
      <audio ref={audioRef} src="/audio/nature.mp3" loop preload="auto" />
    </header>
  );
}
