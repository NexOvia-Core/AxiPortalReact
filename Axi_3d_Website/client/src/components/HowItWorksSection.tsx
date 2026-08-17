/**
 * How It Works Section - Core Operational Backbone
 * Left Side: Heading, Subheading & Description Text
 * Right Side: Auto-Sliding Smooth 9 KPI Capability Cards
 */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ChevronLeft, ChevronRight, Package, Cpu, ShoppingCart, Wrench, Layers, ShieldCheck, PieChart, DollarSign, Globe } from "lucide-react";

const capabilities = [
  {
    icon: Package,
    number: "01",
    title: "Integrated Inventory & MRP",
    description: "Live, location-wise stock with batch tracking, FIFO / weighted-average valuation, and real-time reserve / buy / produce / transfer decisions on every sales order."
  },
  {
    icon: Cpu,
    number: "02",
    title: "Production & Manufacturing",
    description: "Multi-level BOM, routing, work orders, sub-contracting, and batch-wise costing for discrete or process plants."
  },
  {
    icon: ShoppingCart,
    number: "03",
    title: "Procure-to-Pay / Order-to-Cash",
    description: "RFQ to PO to payment, and sales order to invoice to receivables — every document matched and tracked as one sequence."
  },
  {
    icon: Wrench,
    number: "04",
    title: "Machinery Maintenance",
    description: "Preventive schedules, work orders, and full service history to cut downtime on critical equipment."
  },
  {
    icon: Layers,
    number: "05",
    title: "Fixed Assets & AMC / Warranty",
    description: "Register, depreciation, capitalisation, and AMC / warranty tracking across the full asset lifecycle, contract by contract."
  },
  {
    icon: ShieldCheck,
    number: "06",
    title: "Quality Control",
    description: "Raw-material, in-process, and final QC gates with automatic blocking of rejected lots before they reach stock."
  },
  {
    icon: PieChart,
    number: "07",
    title: "Financial Accounting",
    description: "Chart of accounts to GL to P&L and balance sheet, with drill-down, budgeting, and cost-centre profitability."
  },
  {
    icon: DollarSign,
    number: "08",
    title: "Contract & Revenue Management",
    description: "Contract terms, billing schedules, and revenue recognition tracked against delivery and service milestones."
  },
  {
    icon: Globe,
    number: "09",
    title: "Multi-entity, native",
    description: "Multi-company, multi-branch, multi-currency, multi-UOM — with one search and a 360° view across every record."
  }
];

export default function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation(0.05);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % capabilities.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + capabilities.length) % capabilities.length);
  }, []);

  // Smooth auto-sliding every 3.8 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3800);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "20%" : "-20%",
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: "0%",
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-20%" : "20%",
      opacity: 0,
      scale: 0.96,
    }),
  };

  const currentItem = capabilities[currentIndex];
  const IconComponent = currentItem.icon;

  return (
    <section ref={ref} className="py-12 md:py-16 px-6 relative overflow-hidden" style={{ background: "#fff6e5" }}>
      {/* Ambient glow */}
      <div className="ambient-glow ambient-glow-coral w-[500px] h-[500px] top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="ambient-glow ambient-glow-blue w-[400px] h-[400px] bottom-0 left-0 translate-y-1/3" />

      {/* Decorative orbital rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-[#00007f]/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Side Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-5"
          >
            <span className="inline-block text-xs font-mono font-bold tracking-[0.25em] uppercase text-[#fc8151] bg-[#fc8151]/10 border border-[#fc8151]/20 px-4 py-1.5 rounded-full mb-6">
              CORE OPERATIONAL BACKBONE
            </span>
            <h2 className="font-[Space_Grotesk] text-4xl md:text-5xl lg:text-6xl font-bold text-[#00007f] mb-6 leading-tight">
              A complete platform.
              <br />
              <span className="gradient-text">Deepest where it matters most.</span>
            </h2>
            <p className="text-base md:text-lg text-[#00007f]/65 leading-relaxed">
              AXI&apos;s core strength is the operational backbone that trading and manufacturing businesses live in every day — pre-built, pre-tested, and wired together, so finance, stock, and operations read from the same truth from the moment you log in.
            </p>
          </motion.div>

          {/* Right Side: Auto-Sliding 9 KPI Cards Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-7"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative glass-card rounded-3xl p-8 md:p-12 border border-white/80 shadow-2xl bg-white/70 min-h-[380px] flex flex-col justify-between overflow-hidden group">
              {/* Shimmer effect */}
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="grid grid-cols-1 grid-rows-1 items-center justify-items-center w-full">
                <AnimatePresence custom={direction} initial={false} mode="wait">
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1], // Smooth cubic-bezier
                    }}
                    className="col-start-1 row-start-1 w-full"
                  >
                    <div className="flex items-center justify-between mb-8">
                      {/* Icon */}
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center glass shadow-md transition-all duration-500 hover:scale-110"
                        style={{ background: "linear-gradient(135deg, rgba(0,0,127,0.1), rgba(252,129,81,0.12))" }}
                      >
                        <IconComponent size={30} className="gradient-text" strokeWidth={1.8} />
                      </div>
                    </div>

                    <h3 className="font-[Space_Grotesk] text-2xl md:text-3xl font-bold text-[#00007f] mb-4">
                      {currentItem.title}
                    </h3>
                    <p className="text-base md:text-lg text-[#00007f]/70 leading-relaxed font-normal mb-8">
                      {currentItem.description}
                    </p>

                    <div className="pt-6 border-t border-[#00007f]/10 flex items-center justify-between text-xs font-mono text-[#00007f]/50 tracking-wider uppercase">
                      <span>AXPERT OPERATIONAL ENGINE</span>
                      <span>100% PRE-BUILT &amp; WIRED</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Controls & Dot Indicators */}
              <div className="mt-8 pt-4 flex items-center justify-between border-t border-[#00007f]/8">
                {/* 9 Indicator Dots */}
                <div className="flex items-center space-x-2">
                  {capabilities.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDirection(idx > currentIndex ? 1 : -1);
                        setCurrentIndex(idx);
                      }}
                      aria-label={`Go to card ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${idx === currentIndex
                          ? "w-7 bg-[#fc8151]"
                          : "w-2 bg-[#00007f]/20 hover:bg-[#00007f]/40"
                        }`}
                    />
                  ))}
                </div>

                {/* Left/Right Buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous card"
                    className="w-10 h-10 rounded-full glass border border-[#00007f]/15 text-[#00007f] hover:bg-[#00007f] hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105 cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next card"
                    className="w-10 h-10 rounded-full glass border border-[#00007f]/15 text-[#00007f] hover:bg-[#00007f] hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105 cursor-pointer"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
