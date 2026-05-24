"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroEnvironment() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#010a12]">
      {/* Realistic Aerial Image - Using next/image for performance */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg-sharp.png"
          alt="Coastal Andhra Aquaculture Ponds"
          fill
          priority
          quality={100}
          className="object-cover object-center opacity-95 transition-opacity duration-1000"
          sizes="100vw"
        />
      </div>

      {/* Lighting & Fog Overlays - Thinner to let image breathe */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#021220]/20 via-transparent to-[#021220]/95 z-10"></div>
      
      {/* Subtle Mist */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 0.25, x: 0 }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent mix-blend-screen scale-125 pointer-events-none"
      ></motion.div>

      {/* Underwater Layer at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[45vh] z-10 overflow-hidden pointer-events-none mask-image-gradient flex flex-col justify-end">
        {/* Bioluminescent deep water glow */}
        <div className="absolute bottom-[-10%] left-0 right-0 h-full bg-gradient-to-t from-[#00C2B8]/20 via-[#0B2135]/40 to-transparent blur-2xl"></div>

        {/* Soft Bubbles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`bubble-${i}`}
            className="absolute rounded-full border border-white/20 bg-white/5 backdrop-blur-sm"
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              left: `${Math.random() * 100}%`,
              bottom: `-20px`
            }}
            animate={{
              y: [0, -Math.random() * 300 - 100],
              opacity: [0, 0.6, 0],
              x: Math.sin(i) * 20
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeOut",
              delay: Math.random() * 10
            }}
          />
        ))}

        {/* Gentle Floating Shrimp Silhouettes */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`prawn-${i}`}
            className="absolute bottom-10"
            initial={{ x: -150 - (Math.random() * 400), y: Math.random() * 150 }}
            animate={{ x: typeof window !== 'undefined' ? window.innerWidth + 200 : 2500, y: Math.random() * 100 + Math.sin(i) * 30 }}
            transition={{ duration: 40 + Math.random() * 30, repeat: Infinity, ease: "linear", delay: Math.random() * 15 }}
          >
            <img 
              src="/mithrama-shrimp.png" 
              className="w-20 sm:w-28 h-auto opacity-30 drop-shadow-[0_0_15px_rgba(0,194,184,0.6)] mix-blend-screen blur-[1px] rotate-12" 
              alt="" 
            />
          </motion.div>
        ))}
      </div>

      {/* Edge Vignette */}
      <div className="absolute inset-0 z-20 shadow-[inset_0_0_100px_rgba(0,0,0,0.6)] pointer-events-none"></div>
    </div>
  );
}
