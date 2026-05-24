import type { Metadata } from "next";
import { Inter, Manrope, Sora, Noto_Sans_Telugu, Orbitron, Rajdhani, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MithramaAI from "@/components/MithramaAI";
import AmbientSound from "@/components/AmbientSound";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const noto = Noto_Sans_Telugu({ subsets: ["telugu", "latin"], variable: "--font-noto-telugu" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });
const rajdhani = Rajdhani({ weight: ["300", "400", "500", "600", "700"], subsets: ["latin"], variable: "--font-rajdhani" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "AquaPulse | Where Aquaculture Meets Intelligence",
  description: "Live shrimp prices, AI advisory, smart reports, disease insights, calculators, and market intelligence for modern aquaculture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${manrope.variable} ${sora.variable} ${noto.variable} ${orbitron.variable} ${rajdhani.variable} ${spaceGrotesk.variable} antialiased bg-[#021220] text-slate-50 min-h-screen flex flex-col relative overflow-x-hidden`}
      >
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-navy/40 via-background to-background"></div>
        <AmbientSound />
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <MithramaAI />
      </body>
    </html>
  );
}
