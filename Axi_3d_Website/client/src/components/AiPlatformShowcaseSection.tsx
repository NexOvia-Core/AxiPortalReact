import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  Sparkles,
  ArrowRight,
  Play,
  Database,
  Brain,
  Rocket,
  Shield,
  TrendingUp,
  Coins,
  BarChart3,
  Settings,
  Users,
  Package,
  Headphones,
  Bell,
  User,
  ChevronDown,
  ArrowUpRight,
  Boxes,
  Crosshair
} from "lucide-react";

interface AiPlatformShowcaseSectionProps {
  onContactClick?: () => void;
}

export default function AiPlatformShowcaseSection({ onContactClick }: AiPlatformShowcaseSectionProps) {
  const { ref, isVisible } = useScrollAnimation(0.15);
  const [activeArea, setActiveArea] = useState<string>("Sales");
  const [isHovered, setIsHovered] = useState(false);

  // 3D Motion Tilt & Translation Values for the Dashboard Card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 250, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 250, damping: 25 });
  const moveX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-30, 30]), { stiffness: 250, damping: 25 });
  const moveY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-30, 30]), { stiffness: 250, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <section
      id="platform"
      ref={ref}
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 relative overflow-hidden bg-gradient-to-br from-[#fff8ee] via-[#fff3e2] to-[#ffebda] text-[#1e293b] border-t border-[#1E1B4B]/10"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="ambient-glow ambient-glow-coral w-[700px] h-[700px] top-1/4 left-[-15%] pointer-events-none opacity-80" />
      <div className="ambient-glow ambient-glow-blue w-[800px] h-[800px] bottom-[-15%] right-[-10%] pointer-events-none opacity-70" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* LEFT 5 COLS: Content, 4 Feature Cards & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-5 space-y-6 relative z-20"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fc8151]/15 border border-[#fc8151]/30 text-[#fc8151] text-xs font-extrabold uppercase tracking-[0.2em] shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              AI ASSISTED. BUSINESS EMPOWERED.
            </div>

            {/* Main Display Heading */}
            <h2 className="font-[Space_Grotesk] text-4xl sm:text-5xl lg:text-6xl font-black text-[#00007f] leading-[1.08] tracking-tight">
              Axi – <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fc8151] via-[#ff8e63] to-[#ff9f7f]">AI Assisted</span> <br />
              Business Platform
            </h2>

            {/* Description Subtext */}
            <p className="text-base sm:text-lg text-[#373e79] font-normal leading-relaxed">
              Your organization needs an AI-assisted business platform to stay ahead of competition. Axi makes your organization fast and accurate.
            </p>

            {/* Proactive Callout Sentence */}
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-snug">
              Move from being a <span className="text-slate-400 font-medium">reactive organization</span> to a <strong className="text-[#fc8151] font-bold">proactive organization.</strong>
            </p>

            {/* 2 COLUMNS FEATURE ITEMS (Compact width & transparent background so AI Orb has generous breathing room) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 max-w-[430px]">
              {/* COLUMN 1 */}
              <div className="flex flex-col gap-3.5">
                {/* Item 1 */}
                <div className="flex items-start gap-2.5 p-1 rounded-xl bg-transparent transition-all hover:translate-x-1">
                  <div className="w-8 h-8 rounded-xl bg-[#fc8151]/15 text-[#fc8151] flex items-center justify-center shrink-0 mt-0.5 shadow-xs border border-[#fc8151]/20">
                    <Database className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800 leading-snug max-w-[165px]">
                    Make decisions based on data & AI insights
                  </p>
                </div>

                {/* Item 2 */}
                <div className="flex items-start gap-2.5 p-1 rounded-xl bg-transparent transition-all hover:translate-x-1">
                  <div className="w-8 h-8 rounded-xl bg-[#fc8151]/15 text-[#fc8151] flex items-center justify-center shrink-0 mt-0.5 shadow-xs border border-[#fc8151]/20">
                    <Brain className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800 leading-snug max-w-[165px]">
                    AI-powered insights and predictions
                  </p>
                </div>
              </div>

              {/* COLUMN 2 */}
              <div className="flex flex-col gap-3.5">
                {/* Item 3 */}
                <div className="flex items-start gap-2.5 p-1 rounded-xl bg-transparent transition-all hover:translate-x-1">
                  <div className="w-8 h-8 rounded-xl bg-[#fc8151]/15 text-[#fc8151] flex items-center justify-center shrink-0 mt-0.5 shadow-xs border border-[#fc8151]/20">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800 leading-snug max-w-[165px]">
                    Automate workflows & boost efficiency
                  </p>
                </div>

                {/* Item 4 */}
                <div className="flex items-start gap-2.5 p-1 rounded-xl bg-transparent transition-all hover:translate-x-1">
                  <div className="w-8 h-8 rounded-xl bg-[#fc8151]/15 text-[#fc8151] flex items-center justify-center shrink-0 mt-0.5 shadow-xs border border-[#fc8151]/20">
                    <Shield className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800 leading-snug max-w-[165px]">
                    Secure, scalable for enterprises
                  </p>
                </div>
              </div>
            </div>

            {/* CTA BUTTONS ROW */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
            </div>
          </motion.div>

          {/* RIGHT 7 COLS: 3D Interactive Dashboard Showcase + Floating 3D Animated AI Orb */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.98 }}
            animate={isVisible ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-7 relative perspective-[1200px]"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
          >
            {/* FLOATING 3D ANIMATED AI SPHERE / ORB & PEDESTAL */}
            <motion.div
              animate={{
                y: [0, -14, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -left-4 lg:-left-8 bottom-6 sm:bottom-10 z-40 pointer-events-none hidden sm:flex flex-col items-center"
            >
              {/* Glowing Orb */}
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full relative flex items-center justify-center border-2 border-white/90 shadow-[0_0_60px_rgba(252,129,81,0.5),inset_0_0_40px_rgba(255,255,255,0.9)] backdrop-blur-xl bg-gradient-to-br from-orange-400/40 via-amber-200/30 to-white/70 overflow-hidden">
                {/* Specular Glint */}
                <div className="absolute top-3 left-6 w-12 h-6 bg-white/70 rounded-full blur-[2px] rotate-[-25deg]" />

                {/* Rotating Orbital Rings */}
                <div className="absolute inset-2 border border-white/60 rounded-full animate-[spin_12s_linear_infinite] [transform:rotateX(65deg)]" />
                <div className="absolute inset-4 border border-orange-300/80 rounded-full animate-[spin_16s_linear_infinite_reverse] [transform:rotateY(65deg)]" />

                {/* Inner Glowing Core */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#fc8151] via-[#ff9f7f] to-amber-200 shadow-[0_0_40px_#fc8151] animate-pulse flex items-center justify-center">
                  {/* Glowing Bold AI Text */}
                  <span className="text-3xl md:text-4xl font-black text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] tracking-widest font-[Space_Grotesk]">
                    AI
                  </span>
                </div>
              </div>

              {/* 3D Multi-Layered Pedestal Stand */}
              <div className="w-48 h-8 -mt-3 rounded-full bg-gradient-to-r from-orange-200/70 via-white to-orange-200/70 border border-orange-300/80 shadow-[0_12px_30px_rgba(252,129,81,0.3)] flex items-center justify-center relative z-10">
                <div className="w-36 h-4 rounded-full bg-gradient-to-r from-orange-300/50 via-white to-orange-300/50 border border-orange-400/40" />
              </div>
            </motion.div>

            {/* DASHBOARD CARD CONTAINER */}
            <motion.div
              style={{
                x: moveX,
                y: moveY,
                rotateX: rotateX,
                rotateY: rotateY,
                transformStyle: "preserve-3d"
              }}
              className="bg-white/95 rounded-3xl p-5 md:p-7 border border-white shadow-[0_30px_70px_rgba(0,0,0,0.09)] backdrop-blur-2xl relative overflow-hidden z-10"
            >
              {/* Specular Shimmer Sweep */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none rounded-3xl z-30" />

              {/* DASHBOARD TOP BAR */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                  {/* Orange App Launcher Icon */}
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#fc8151] to-[#ff9f7f] p-2 flex items-center justify-center text-white shadow-md shadow-[#fc8151]/30">
                    <div className="grid grid-cols-2 gap-1 w-full h-full">
                      <div className="bg-white rounded-xs" />
                      <div className="bg-white/80 rounded-xs" />
                      <div className="bg-white/80 rounded-xs" />
                      <div className="bg-white/60 rounded-xs" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base md:text-lg">Welcome back, Team!</h3>
                    <p className="text-slate-500 text-xs font-medium">Here's what's happening with your business today.</p>
                  </div>
                </div>

                {/* Right Header Controls */}
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors">
                    This Quarter <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  <div className="relative p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#fc8151] flex items-center justify-center text-[8px] font-black text-white">
                      3
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-700 font-bold text-xs shadow-xs relative">
                    <User className="w-4 h-4" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                </div>
              </div>

              {/* DASHBOARD BODY LAYOUT */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT MAIN AREA (8 Cols) */}
                <div className="lg:col-span-8 space-y-6">

                  {/* 3 STAT METRICS ROW */}
                  <div className="grid grid-cols-3 gap-3.5">

                    {/* Stat 1: Revenue */}
                    <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 hover:border-[#fc8151]/30 transition-all duration-300 group">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Revenue</p>
                      <p className="text-xl md:text-2xl font-black text-slate-900 my-0.5">$32.8M</p>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <TrendingUp className="w-3 h-3" />
                        <span>↑ 18.6% vs last quarter</span>
                      </div>
                      {/* Mini Sparkline Graph */}
                      <div className="mt-2 h-5 w-full">
                        <svg className="w-full h-full" viewBox="0 0 100 20">
                          <path
                            d="M 0 15 Q 25 5 50 12 T 100 2"
                            fill="none"
                            stroke="#fc8151"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Stat 2: Profit */}
                    <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 hover:border-[#fc8151]/30 transition-all duration-300 group">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Profit</p>
                      <p className="text-xl md:text-2xl font-black text-slate-900 my-0.5">$7.6M</p>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <TrendingUp className="w-3 h-3" />
                        <span>↑ 14.2% vs last quarter</span>
                      </div>
                      {/* Mini Sparkline Graph */}
                      <div className="mt-2 h-5 w-full">
                        <svg className="w-full h-full" viewBox="0 0 100 20">
                          <path
                            d="M 0 18 Q 30 10 60 14 T 100 4"
                            fill="none"
                            stroke="#fc8151"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Stat 3: Growth */}
                    <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 hover:border-[#fc8151]/30 transition-all duration-300 group">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Growth</p>
                      <p className="text-xl md:text-2xl font-black text-slate-900 my-0.5">24.5%</p>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <TrendingUp className="w-3 h-3" />
                        <span>↑ 8.7% vs last quarter</span>
                      </div>
                      {/* Mini Sparkline Graph */}
                      <div className="mt-2 h-5 w-full">
                        <svg className="w-full h-full" viewBox="0 0 100 20">
                          <path
                            d="M 0 16 Q 20 8 50 14 T 100 3"
                            fill="none"
                            stroke="#fc8151"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>

                  </div>

                  {/* REVENUE TREND 3D ANIMATED LINE GRAPH AREA */}
                  <div className="bg-slate-50/90 p-5 rounded-2xl border border-slate-100 relative">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-slate-900 text-sm">Revenue Trend</h4>
                      <span className="text-[10px] font-bold text-[#fc8151] bg-[#fc8151]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Live Forecast
                      </span>
                    </div>

                    {/* SVG GRAPH CANVAS WITH ANIMATED CURVE & GRADIENT FILL */}
                    <div className="relative h-44 w-full">
                      {/* Y-Axis Labels */}
                      <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[9px] font-bold text-slate-400">
                        <span>40M</span>
                        <span>30M</span>
                        <span>20M</span>
                        <span>10M</span>
                        <span>0</span>
                      </div>

                      {/* SVG Line & Area Fill */}
                      <div className="pl-8 h-full flex flex-col justify-between relative">
                        <svg className="w-full h-36 overflow-visible" viewBox="0 0 400 130">
                          <defs>
                            <linearGradient id="revenueGradAi2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#fc8151" stopOpacity="0.35" />
                              <stop offset="100%" stopColor="#fc8151" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Horizontal Grid lines */}
                          <line x1="0" y1="10" x2="400" y2="10" stroke="#e2e8f0" strokeDasharray="3 3" />
                          <line x1="0" y1="40" x2="400" y2="40" stroke="#e2e8f0" strokeDasharray="3 3" />
                          <line x1="0" y1="70" x2="400" y2="70" stroke="#e2e8f0" strokeDasharray="3 3" />
                          <line x1="0" y1="100" x2="400" y2="100" stroke="#e2e8f0" strokeDasharray="3 3" />

                          {/* Gradient Area Fill Under Curve */}
                          <motion.path
                            d="M 10 95 Q 80 75 150 65 T 290 35 L 390 10 L 390 120 L 10 120 Z"
                            fill="url(#revenueGradAi2)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />

                          {/* Animated Curve Line */}
                          <motion.path
                            d="M 10 95 Q 80 75 150 65 T 290 35 L 390 10"
                            fill="none"
                            stroke="#fc8151"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                          />

                          {/* Data Points / Pulsating Circles */}
                          {[
                            { x: 10, y: 95 },
                            { x: 86, y: 76 },
                            { x: 162, y: 65 },
                            { x: 238, y: 55 },
                            { x: 314, y: 32 },
                            { x: 390, y: 10 }
                          ].map((pt, idx) => (
                            <g key={idx}>
                              <circle cx={pt.x} cy={pt.y} r="5" fill="#ffffff" stroke="#fc8151" strokeWidth="3" />
                              <circle cx={pt.x} cy={pt.y} r="8" fill="#fc8151" opacity="0.2" className="animate-ping" />
                            </g>
                          ))}
                        </svg>

                        {/* Floating Peak Tooltip Card on Jun */}
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 1 }}
                          className="absolute right-0 top-1 bg-gradient-to-r from-[#fc8151] to-[#ff9f7f] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-lg shadow-[#fc8151]/40 flex items-center gap-1.5 z-20 pointer-events-none"
                        >
                          <span>Jun</span>
                          <span className="bg-white/20 px-1.5 py-0.5 rounded-md">$32.8M</span>
                        </motion.div>

                        {/* X-Axis Month Labels */}
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 pt-2 pr-1">
                          <span>Jan</span>
                          <span>Feb</span>
                          <span>Mar</span>
                          <span>Apr</span>
                          <span>May</span>
                          <span>Jun</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT WIDGETS COLUMN (4 Cols) */}
                <div className="lg:col-span-4 space-y-5">

                  {/* AI Insight Card */}
                  <div className="bg-gradient-to-br from-[#fff6e5] to-[#fff0d9] p-4.5 rounded-2xl border border-[#fc8151]/30 shadow-xs space-y-2.5">
                    <div className="flex items-center gap-2 text-[#fc8151] font-bold text-xs">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Insight</span>
                    </div>

                    <p className="text-slate-800 text-xs font-semibold leading-relaxed">
                      Strong revenue growth predicted for next quarter driven by enterprise demand and new product adoption.
                    </p>
                  </div>

                  {/* Top Opportunities Card */}
                  <div className="bg-slate-50/90 p-4.5 rounded-2xl border border-slate-100 space-y-3">
                    <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Top Opportunities</h5>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100 text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                            ↑
                          </span>
                          <span className="text-slate-800 text-[11px]">Expand in APAC</span>
                        </div>
                        <span className="font-bold text-slate-900 text-[11px]">$4.8M ↑</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100 text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[10px]">
                            <Boxes className="w-3 h-3" />
                          </span>
                          <span className="text-slate-800 text-[11px]">Optimize Supply Chain</span>
                        </div>
                        <span className="font-bold text-slate-900 text-[11px]">$2.6M ↑</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100 text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                            <Crosshair className="w-3 h-3" />
                          </span>
                          <span className="text-slate-800 text-[11px]">Cross-sell Products</span>
                        </div>
                        <span className="font-bold text-slate-900 text-[11px]">$1.9M ↑</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* BOTTOM BUSINESS AREAS FOOTER */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Business Areas</p>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {[
                    { name: "Finance", icon: Coins },
                    { name: "Sales", icon: BarChart3 },
                    { name: "Operations", icon: Settings },
                    { name: "HR", icon: Users },
                    { name: "Supply Chain", icon: Package },
                    { name: "Customer Service", icon: Headphones }
                  ].map((area, idx) => {
                    const IconComponent = area.icon;
                    const isActive = activeArea === area.name;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveArea(area.name)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all duration-200 cursor-pointer ${isActive
                          ? "bg-[#fc8151]/15 border-[#fc8151] text-[#00007f] shadow-xs"
                          : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                      >
                        <IconComponent className={`w-4 h-4 ${isActive ? "text-[#fc8151]" : "text-slate-500"}`} />
                        <span className="text-[10px] font-bold leading-tight">{area.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
