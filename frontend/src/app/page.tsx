import AquaPulseHero from "@/components/AquaPulseHero";
import LiveMarketTicker from "@/components/LiveMarketTicker";
import { ArrowRight, MessageSquare, Sun, Droplets, ShieldAlert, BrainCircuit, Users } from "lucide-react";
import Link from "next/link";
import NewsFeed from "@/components/NewsFeed";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#010a12]">
      {/* Cinematic Hero Section */}
      <AquaPulseHero />

      {/* Post-Hero Content */}
      <section className="relative w-full pt-10 pb-10 bg-[#010a12]">
        {/* Bottom Elements */}
        <div className="relative z-20 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-5">
          <LiveMarketTicker />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {[
              { icon: Sun, title: "Morning Brief", desc: "Your daily 60-second farm intelligence briefing", link: "Read Brief", color: "text-amber-400", href: "/weather" },
              { icon: Droplets, title: "Weather Intelligence", desc: "7-day forecast, rain alerts & wind prediction", link: "View Weather", color: "text-blue-400", href: "/weather" },
              { icon: BrainCircuit, title: "AI Advisory", desc: "Personalized recommendations for your farm", link: "Get Advice", color: "text-[#00C2B8]", href: "/aqua-ai" },
              { icon: Droplets, title: "Water Quality", desc: "Real-time DO, pH, ammonia & temperature", link: "Check Now", color: "text-[#35F3FF]", href: "/tools?tool=pdf" }
            ].map((card, i) => (
              <div key={i} className="bg-[#021220]/75 backdrop-blur-2xl border border-white/5 hover:border-[#00C2B8]/30 p-5 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,194,184,0.1)] group flex flex-col justify-between min-h-[130px]">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <card.icon className={`w-4 h-4 ${card.color}`} />
                    <h4 className="text-white font-sora font-semibold text-sm">{card.title}</h4>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed mb-3">{card.desc}</p>
                </div>
                <Link href={card.href} className="text-[#00C2B8] text-[11px] uppercase tracking-wider font-bold flex items-center gap-1 group-hover:text-[#35F3FF] transition-colors w-fit">
                  {card.link} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time News & Signals Feed */}
      <NewsFeed />

      {/* Partners Footer Strip */}
      <section className="relative w-full bg-[#010a12] pb-10">
        <div className="relative z-20 w-full border-t border-white/5 bg-[#021220]/80 backdrop-blur-xl py-4">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest shrink-0">Trusted by Leading Partners</span>
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {['ABIS', 'Growel FEEDS', 'SIS AQUA', 'INVE AQUACULTURE', 'STAR FEEDS', 'Himadri', 'CP AQUA'].map((partner, i) => (
                <div key={i} className="text-white font-sora font-bold text-sm tracking-wide">{partner}</div>
              ))}
              <div className="px-3 py-1 rounded-full bg-white/5 text-[10px] text-white flex flex-col items-center leading-none justify-center">+25<span className="text-[8px] text-slate-400 mt-0.5">Partners</span></div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
