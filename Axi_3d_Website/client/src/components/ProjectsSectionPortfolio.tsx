import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import FadeIn from "./FadeIn";
import AnimatedCounter from "./AnimatedCounter";

// ==========================================
// MOTION GRAPH 1: Live Dashboard Bar & Wave Graph (Slide 02)
// ==========================================
const DashboardMotionGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

  const branchData = [
    { name: "Chennai Plant", value: 85, color: "#00007f", valText: "$18.4M" },
    { name: "Mumbai Hub", value: 65, color: "#fc8151", valText: "$14.2M" },
    { name: "Delhi Warehouse", value: 50, color: "#7621B0", valText: "$11.0M" },
    { name: "GCC Operations", value: 25, color: "#B600A8", valText: "$4.6M" },
  ];

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-white/95 rounded-[32px] p-5 sm:p-6 border-2 border-[#1E1B4B]/15 shadow-[0_20px_50px_rgba(0,0,127,0.12),inset_0_1px_2px_rgba(255,255,255,0.9)] flex flex-col justify-between overflow-hidden relative group transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,127,0.18)]"
      style={{ perspective: "1000px" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none rounded-[32px] z-10" />

      <div className="flex items-center justify-between border-b border-[#1E1B4B]/15 pb-3 relative z-20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-soft-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-[#00007f] font-[Space_Grotesk]">
            Live Inventory Dashboard — All Locations
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase bg-[#00007f]/10 text-[#00007f] px-3 py-1 rounded-full font-bold border border-[#00007f]/20">
          Real-Time Updates
        </span>
      </div>

      {/* 3D Motion Bar Chart */}
      <div className="flex flex-col gap-3.5 my-3 relative z-20">
        {branchData.map((b, idx) => (
          <div key={b.name} className="flex flex-col gap-1 group/bar">
            <div className="flex justify-between text-xs font-bold text-[#1E1B4B]/90">
              <span>{b.name}</span>
              <span className="font-mono text-[#00007f] font-extrabold">{b.valText}</span>
            </div>
            <div className="w-full h-4 bg-neutral-100/90 rounded-full overflow-hidden p-0.5 border border-black/5 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: isInView ? `${b.value}%` : 0 }}
                transition={{ duration: 1.4, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full relative overflow-hidden shadow-sm"
                style={{ background: `linear-gradient(90deg, ${b.color}, #fc8151)` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-shimmer" />
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Order Stream Visual */}
      <div className="bg-[#fff6e5] rounded-2xl p-3 border-2 border-[#1E1B4B]/15 flex items-center justify-between text-xs relative z-20 shadow-sm">
        <div className="flex items-center gap-2 text-[#1E1B4B] font-bold">
          <svg className="w-4 h-4 text-emerald-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>MRP Wizard Active</span>
        </div>
        <span className="font-mono text-[11px] text-[#fc8151] font-black bg-[#fc8151]/10 px-2.5 py-1 rounded-lg border border-[#fc8151]/20">
          12 SKUs Auto-Queued
        </span>
      </div>
    </div>
  );
};

// ==========================================
// MOTION GRAPH 2: BOM Flow & Allocation Node Graph (Slide 11)
// ==========================================
const MrpCapabilitiesMotionGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

  const nodes = [
    { label: "01 DEMAND CAPTURE", sub: "Sales Orders", delay: 0 },
    { label: "02 STOCK MATCH", sub: "100% Allocated", delay: 0.2 },
    { label: "03 BOM EXPLOSION", sub: "Multi-Level SFG", delay: 0.4 },
    { label: "04 WORK ORDERS", sub: "Released to Plant", delay: 0.6 },
  ];

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-white/95 rounded-[32px] p-5 sm:p-6 border-2 border-[#1E1B4B]/15 shadow-[0_20px_50px_rgba(0,0,127,0.12),inset_0_1px_2px_rgba(255,255,255,0.9)] flex flex-col justify-between overflow-hidden relative group transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,127,0.18)]"
      style={{ perspective: "1000px" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none rounded-[32px] z-10" />

      <div className="flex items-center justify-between border-b border-[#1E1B4B]/15 pb-3 relative z-20">
        <span className="text-xs font-black uppercase tracking-wider text-[#00007f] font-[Space_Grotesk]">
          Connected MRP Automated Workflow
        </span>
        <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-700 px-3 py-1 rounded-full font-bold border border-emerald-500/20">
          99.8% Match Rate
        </span>
      </div>

      {/* 3D Motion Nodes Flow */}
      <div className="grid grid-cols-2 gap-3 my-2 relative z-20">
        {nodes.map((node) => (
          <motion.div
            key={node.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
            transition={{ duration: 0.5, delay: node.delay }}
            className="bg-[#fff6e5] border-2 border-[#1E1B4B]/15 rounded-2xl p-3.5 flex flex-col justify-between hover:border-[#00007f] hover:scale-105 transition-all duration-300 shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-black text-[#00007f] tracking-tight font-[Space_Grotesk]">{node.label}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#fc8151] animate-pulse" />
            </div>
            <span className="text-[10px] text-[#1E1B4B]/70 font-semibold mt-1">{node.sub}</span>
          </motion.div>
        ))}
      </div>

      {/* Live Allocation Curve Graph SVG */}
      <div className="w-full h-16 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00007f]/5 via-[#fc8151]/5 to-transparent border-2 border-[#1E1B4B]/15 p-3 flex items-center justify-between relative z-20 shadow-sm">
        <div className="flex flex-col text-xs font-bold text-[#1E1B4B]">
          <span>Fulfilment Speed</span>
          <span className="text-[#00007f] font-mono font-black">&lt; 1 Second Processing</span>
        </div>
        <svg className="w-32 h-12 overflow-visible" viewBox="0 0 100 40">
          <motion.path
            d="M 0,30 Q 25,5 50,20 T 100,10"
            fill="none"
            stroke="#00007f"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isInView ? 1 : 0 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />
          <motion.circle
            cx="100"
            cy="10"
            r="4.5"
            fill="#fc8151"
            initial={{ scale: 0 }}
            animate={{ scale: isInView ? 1 : 0 }}
            transition={{ delay: 1.6 }}
          />
        </svg>
      </div>
    </div>
  );
};

// ==========================================
// MOTION GRAPH 3: SLIDE 05 — THE IMPACT (What changes once AXI goes live.)
// ==========================================
const ImpactMetricsMotionGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

  const impactMetrics = [
    { label: "IT change-request & customisation cost", pct: 40, prefix: "↓" },
    { label: "Stockout / excess-inventory incidents", pct: 40, prefix: "↓" },
    { label: "Manual reporting & reconciliation time", pct: 55, prefix: "↓" },
  ];

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-white/95 rounded-[32px] p-5 sm:p-6 border-2 border-[#1E1B4B]/15 shadow-[0_20px_50px_rgba(0,0,127,0.12),inset_0_1px_2px_rgba(255,255,255,0.9)] flex flex-col justify-between overflow-hidden relative group transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,127,0.18)]"
      style={{ perspective: "1000px" }}
    >
      {/* Specular Light Reflection Sweep */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none rounded-[32px] z-10" />

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#1E1B4B]/15 pb-3 relative z-20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#fc8151] animate-soft-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-[#00007f] font-[Space_Grotesk]">
            TYPICAL REDUCTION AFTER MOVING TO AXI (%)
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase bg-[#fc8151]/10 text-[#fc8151] px-3 py-1 rounded-full font-bold border border-[#fc8151]/20">
          LIVE IMPACT
        </span>
      </div>

      {/* 3D Animated Horizontal Bar Chart */}
      <div className="flex flex-col gap-4 my-3 relative z-20">
        {impactMetrics.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-1.5 group/bar">
            <div className="flex items-center justify-between text-xs font-bold text-[#1E1B4B]/90">
              <span className="truncate max-w-[75%]">{item.label}</span>
              <span className="font-mono text-[#fc8151] text-sm font-black">
                {item.prefix}{item.pct}%
              </span>
            </div>
            <div className="w-full h-7 bg-neutral-100/80 rounded-xl overflow-hidden p-1 border border-black/5 shadow-inner relative">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: isInView ? `${item.pct}%` : "0%" }}
                transition={{ duration: 1.4, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-lg relative overflow-hidden flex items-center justify-end pr-3 shadow-md"
                style={{
                  background: "linear-gradient(90deg, #d6573c 0%, #fc8151 60%, #ff9f7f 100%)",
                }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-shimmer" />
                <span className="text-[11px] font-black font-mono text-white relative z-10 drop-shadow-xs">
                  ↓{item.pct}%
                </span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      {/* Dark Navy Turnaround Box (Slide 05 Format) */}
      <div className="bg-[#0a192f] border-2 border-[#00007f]/30 rounded-2xl p-4 shadow-xl flex items-center justify-between text-white relative z-20 mt-2">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#fc8151] animate-pulse" />
          <span className="text-xs sm:text-sm font-medium text-white/90">
            New workflow / approval-rule turnaround:
          </span>
        </div>
        <span className="text-xs sm:text-sm font-black font-mono text-[#fc8151] bg-[#fc8151]/15 border border-[#fc8151]/30 px-3 py-1 rounded-lg">
          Weeks → Days
        </span>
      </div>
    </div>
  );
};

// ==========================================
// CARDS DATA STRUCT (Slides 2, 11, 05)
// ==========================================
interface SlideCardItem {
  number: string;
  category: string;
  name: string;
  slideTag: string;
  description: string;
  metrics: { label: string; value: number; prefix?: string; suffix?: string; decimals?: number }[];
  bulletPoints?: string[];
  badges?: string[];
  motionGraph: React.ReactNode;
}

const slideCardsData: SlideCardItem[] = [
  // -------------------------------------------------------------
  // CARD 01: SLIDE 02 — PRODUCT SNAPSHOT
  // -------------------------------------------------------------
  {
    number: "01",
    category: "",
    name: "ONE DASHBOARD. LIVE OPERATIONS.",
    slideTag: "Slide 02",
    description:
      "AXI brings stock value, open orders, and reorder alerts for every location onto a single live screen — the same view whether you're on the shop floor or in the boardroom.",
    metrics: [
      { label: "STOCK VALUE ON HAND", value: 48.2, prefix: "$", suffix: "M", decimals: 1 },
      { label: "OPEN SALES ORDERS", value: 1284, prefix: "", suffix: "", decimals: 0 },
      { label: "REORDER ALERTS", value: 37, prefix: "", suffix: "", decimals: 0 },
      { label: "SKUS BELOW REORDER", value: 12, prefix: "", suffix: " SKUs", decimals: 0 },
    ],
    badges: ["100,000+ ACTIVE USERS", "750+ ENTERPRISES", "10+ COUNTRIES LIVE"],
    motionGraph: <DashboardMotionGraph />,
  },

  // -------------------------------------------------------------
  // CARD 02: SLIDE 11 — KEY MRP CAPABILITIES IN AXI
  // -------------------------------------------------------------
  {
    number: "02",
    category: "",
    name: "KEY MRP CAPABILITIES IN AXI",
    slideTag: "Slide 11",
    description:
      "Every item, accounted for. Every order, fulfilled right. Understocking costs delivery & quality; overstocking costs cash. AXI's MRP wizard closes both gaps.",
    metrics: [
      { label: "MRP CORE ENGINES", value: 6, prefix: "", suffix: " Modules", decimals: 0 },
      { label: "STOCK VISIBILITY", value: 100, prefix: "", suffix: "%", decimals: 0 },
      { label: "FULFILLMENT MATCH RATE", value: 99.8, prefix: "", suffix: "%", decimals: 1 },
      { label: "BOM EXPLOSION DEPTH", value: 10, prefix: "", suffix: "+ Levels", decimals: 0 },
    ],
    bulletPoints: [
      "Live, Multi-Location Stock: Full visibility of RM, SFG, FG & tools in real time.",
      "Smart Auto-Allocation: Orders matched first come, first served with re-allocation.",
      "Flexible Fulfilment: Produce, procure, subcontract, or transfer per item/order.",
      "Multi-Level BOM: Master or order-wise BOM versioned by effective date.",
      "Work & Production Orders: Auto-generated for subcontractors & work centres.",
      "Supplier Intelligence: Command-line lookup of past deliveries & item costs.",
    ],
    motionGraph: <MrpCapabilitiesMotionGraph />,
  },

  // -------------------------------------------------------------
  // CARD 03: SLIDE 05 — THE IMPACT (What changes once AXI goes live.)
  // -------------------------------------------------------------
  {
    number: "03",
    category: "",
    name: "WHAT CHANGES ONCE AXI GOES LIVE",
    slideTag: "Slide 05",
    description:
      "Depth and low-code flexibility aren't just architecture points — they show up in how fast a business can close its books, plan its stock, and respond to a customer. Typical ranges customers report after moving core operations onto AXI.",
    metrics: [],
    motionGraph: <ImpactMetricsMotionGraph />,
  },
];

// ==========================================
// INDIVIDUAL STICKY CARD COMPONENT
// ==========================================
interface CardProps {
  card: SlideCardItem;
  index: number;
  totalCards: number;
  onLiveProjectClick?: () => void;
}

const ProjectCard: React.FC<CardProps> = ({ card, index, totalCards, onLiveProjectClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  const isCard3 = card.number === "03";

  return (
    <div
      ref={containerRef}
      className="h-[85vh] sticky top-24 md:top-32 flex items-center justify-center mb-10 md:mb-16"
      style={{ top: `${96 + index * 28}px` }}
    >
      <motion.div
        style={{ scale }}
        className={`w-full max-w-6xl rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 bg-[#fff6e5] p-5 sm:p-7 md:p-8 flex flex-col justify-between overflow-hidden shadow-2xl h-full transition-all duration-500 ${isCard3
          ? "border-[#fc8151]/30 shadow-[0_30px_70px_rgba(252,129,81,0.15)]"
          : "border-[#1E1B4B]/20"
          }`}
      >
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1E1B4B]/15">
          <div className="flex items-center gap-4 sm:gap-6">
            <span
              className="hero-heading leading-none tracking-tighter select-none drop-shadow-[0_10px_18px_rgba(0,0,127,0.25)]"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}
            >
              {card.number}
            </span>
            <div className="flex flex-col">
              {card.category && (
                <span className="text-xs sm:text-sm uppercase tracking-widest text-[#fc8151] font-extrabold font-[Space_Grotesk]">
                  {card.category}
                </span>
              )}
              <h3 className={`text-xl sm:text-2xl md:text-3xl font-black tracking-tight ${isCard3 ? "text-[#00007f] font-[Space_Grotesk]" : "text-[#1E1B4B] font-[Space_Grotesk] uppercase"
                }`}>
                {isCard3 ? (
                  <>
                    WHAT CHANGES <span className="bg-gradient-to-r from-[#fc8151] via-[#d6573c] to-[#ff9f7f] bg-clip-text text-transparent">ONCE AXI GOES LIVE</span>
                  </>
                ) : (
                  card.name
                )}
              </h3>
            </div>
          </div>
        </div>

        {/* Card Body Grid: Left Content + Right Motion Graph */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-4 flex-grow overflow-hidden items-stretch">

          {/* Left Column (55% width -> 7 cols): Metrics & Text */}
          <div className={`md:col-span-7 flex flex-col justify-between gap-4 h-full rounded-[32px] p-5 shadow-sm overflow-y-auto ${isCard3
            ? "bg-white/95 border-2 border-[#00007f]/15 shadow-[0_10px_30px_rgba(0,0,127,0.08)]"
            : "bg-white/90 border-2 border-[#1E1B4B]/15 shadow-sm"
            }`}>
            {/* Description */}
            <p className="text-sm sm:text-base text-[#1E1B4B]/80 font-normal leading-relaxed">
              {card.description}
            </p>

            {isCard3 ? (
              /* SLIDE 05 EXCLUSIVE: 3D TESTIMONIAL QUOTE BOX & 3-COLUMN IMPACT CARDS */
              <div className="flex flex-col gap-4 my-1">
                {/* 3D Glass Quote Box */}
                <div className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#fff6e5] via-white to-white border-2 border-[#fc8151]/30 shadow-md">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl sm:text-4xl leading-none text-[#fc8151] font-serif select-none">“</span>
                    <div className="flex flex-col gap-2">
                      <p className="text-xs sm:text-sm italic font-medium text-[#1E1B4B] leading-relaxed">
                        We stopped exporting stock and finance data into three separate spreadsheets just to close the week. Now it's one system, and the exceptions find us.
                      </p>
                      <span className="text-[10px] sm:text-xs font-bold text-[#00007f] tracking-wider uppercase font-mono">
                        — OPERATIONS HEAD, MID-SIZE MANUFACTURING ENTERPRISE ON AXI
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3 Column Impact Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="bg-[#fff6e5]/80 border border-[#1E1B4B]/10 rounded-xl p-2.5 flex flex-col gap-1 hover:border-[#00007f] transition-colors">
                    <span className="text-[11px] font-black text-[#00007f]">From spreadsheets</span>
                    <p className="text-[10px] text-[#1E1B4B]/80 leading-snug font-medium">
                      Disconnected exports and manual reconciliation replaced by one system of record.
                    </p>
                  </div>
                  <div className="bg-[#fff6e5]/80 border border-[#1E1B4B]/10 rounded-xl p-2.5 flex flex-col gap-1 hover:border-[#00007f] transition-colors">
                    <span className="text-[11px] font-black text-[#00007f]">To live dashboards</span>
                    <p className="text-[10px] text-[#1E1B4B]/80 leading-snug font-medium">
                      Branch, product, and customer performance visible the moment a transaction posts.
                    </p>
                  </div>
                  <div className="bg-[#fff6e5]/80 border border-[#1E1B4B]/10 rounded-xl p-2.5 flex flex-col gap-1 hover:border-[#00007f] transition-colors">
                    <span className="text-[11px] font-black text-[#00007f]">To proactive alerts</span>
                    <p className="text-[10px] text-[#1E1B4B]/80 leading-snug font-medium">
                      Exceptions surface on their own — nobody has to remember to go and check.
                    </p>
                  </div>
                </div>

                {/* Footnote Caption */}
                <p className="text-[10px] italic text-[#1E1B4B]/60 font-light">
                  Illustrative ranges based on typical AXI customer engagements and ERP-modernisation industry benchmarks — actual results vary by process and starting baseline.
                </p>
              </div>
            ) : (
              /* CARD 01 & CARD 02 DATA GRID */
              <>
                <div className="grid grid-cols-2 gap-3 my-1">
                  {card.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-[#fff6e5] to-white border-2 border-[#1E1B4B]/15 rounded-2xl p-3 flex flex-col justify-center shadow-sm hover:scale-[1.03] hover:border-[#fc8151] transition-all duration-300"
                    >
                      <AnimatedCounter
                        value={m.value}
                        prefix={m.prefix}
                        suffix={m.suffix}
                        decimals={m.decimals}
                        duration={1.8}
                        className="text-2xl sm:text-3xl font-black hero-heading tracking-tight drop-shadow-xs"
                      />
                      <span className="text-[11px] sm:text-xs text-[#1E1B4B]/80 uppercase tracking-wider font-extrabold mt-0.5">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>

                {card.bulletPoints ? (
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-[#1E1B4B]/15">
                    <span className="text-xs uppercase tracking-wider font-black text-[#00007f] mb-1 font-[Space_Grotesk]">
                      KEY MRP CAPABILITIES INCLUDED:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#1E1B4B]/90 font-medium">
                      {card.bulletPoints.map((pt, i) => (
                        <div key={i} className="flex items-start gap-2 bg-[#fff6e5]/80 p-2.5 rounded-xl border border-black/10 hover:border-[#00007f] transition-colors">
                          <span className="w-2 h-2 rounded-full bg-[#fc8151] mt-1 flex-shrink-0" />
                          <span className="leading-snug text-[11px] font-medium">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[#1E1B4B]/15">
                    {card.badges?.map((badge, i) => (
                      <span
                        key={i}
                        className="text-xs px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#00007f]/10 to-[#5c1380]/10 text-[#00007f] border border-[#00007f]/25 font-extrabold uppercase tracking-wider shadow-xs hover:scale-105 transition-transform"
                      >
                        ✓ {badge}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column (45% width -> 5 cols): Motion Graph */}
          <div className="md:col-span-5 h-full">
            {card.motionGraph}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ==========================================
// MAIN PROJECTS SECTION CONTAINER
// ==========================================
export const ProjectsSectionPortfolio: React.FC<{ onLiveProjectClick?: () => void }> = ({ onLiveProjectClick }) => {
  return (
    <section
      id="projects"
      className="w-full bg-[#fff6e5] text-[#1E1B4B] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] mt-8 sm:mt-12 md:mt-16 pt-10 sm:pt-14 md:pt-16 pb-6 md:pb-10 px-5 sm:px-8 md:px-10 relative z-10"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Heading */}

        {/* 3 Sticky Stacking Cards (Slides 2, 11, 5) */}
        <div className="w-full flex flex-col relative pb-4">
          {slideCardsData.map((card, index) => (
            <ProjectCard
              key={card.number}
              card={card}
              index={index}
              totalCards={slideCardsData.length}
              onLiveProjectClick={onLiveProjectClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSectionPortfolio;
