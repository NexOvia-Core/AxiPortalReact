/**
 * Platform Section - Glassmorphism with smooth sliding Why Axi feature cards
 * Split layout with text, glassy transparent sliding quote card, and clean video container
 */
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ShieldCheck, Layers, Server, DollarSign, Brain, ChevronLeft, ChevronRight } from "lucide-react";

const whyAxiCards = [
  {
    icon: ShieldCheck,
    title: "Cloud & Security",
    badge: "SECURITY",
    description: "Hosting on a secure cloud with compliance to ISO, CMM, and SOC2 standards ensures data safety and privacy. The scalability of the platform is a big plus for businesses looking to grow without worrying about infrastructure limitations."
  },
  {
    icon: Layers,
    title: "Comprehensive Functionality",
    badge: "CORE SUITE",
    description: "Axi offers integrated management across key business functions, like inventory, assets, accounting, sales, and more. It's great that it can handle both standard and complex, non-standard business processes."
  },
  {
    icon: Server,
    title: "On-Premise Option",
    badge: "DEPLOYMENT",
    description: "The option to deploy Axi on-premise caters to businesses that have strict data control requirements, offering flexibility for organizations with specific security or compliance needs."
  },
  {
    icon: DollarSign,
    title: "Cost Efficiency",
    badge: "PAY-AS-YOU-GO",
    description: "The 'pay-for-usage' model is appealing for businesses that want to manage costs based on their actual use of the platform, rather than paying for unused capacity."
  },
  {
    icon: Brain,
    title: "AI Integration",
    badge: "AI / ML",
    description: "The inclusion of AI, with the flexibility to choose which AI to use, is a powerful feature. The ability to automate tasks based on AI responses or simply use AI for enhanced decision-making adds a lot of value."
  }
];

export default function PlatformSection() {
  const { ref, isVisible } = useScrollAnimation(0.15);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = useCallback(() => {
    setSlideIndex((prev) => (prev + 1) % whyAxiCards.length);
  }, []);

  const handlePrev = useCallback(() => {
    setSlideIndex((prev) => (prev - 1 + whyAxiCards.length) % whyAxiCards.length);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [handleNext, isHovered]);

  const activeCard = whyAxiCards[slideIndex];

  return (
    <section id="platform" ref={ref} className="py-16 md:py-24 px-5 sm:px-8 md:px-10 relative overflow-hidden bg-[#fff6e5] text-[#1E1B4B]">
      {/* Ambient decorative glow */}
      <div className="ambient-glow ambient-glow-coral w-[500px] h-[500px] top-1/2 left-0 -translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      <div className="ambient-glow ambient-glow-blue w-[400px] h-[400px] top-1/3 right-0 translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* LEFT 6 COLS: Text & Sliding Solution Quote Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <div>
              <p className="text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase text-[#fc8151] mb-3">
                THE PLATFORM
              </p>
              <h2 className="font-[Space_Grotesk] text-4xl sm:text-5xl font-bold text-[#00007f] mb-4 leading-tight">
                Where AXI <br />
                <span className="gradient-text">Keeps Moving</span>
              </h2>
              <p className="text-sm sm:text-base text-[#00007f] leading-relaxed font-normal mb-6 max-w-xl">
                New forms, fields, and approval rules configured in house, in days One connected system — sales, stock, production, and finance update together Changes are additive: low-code structures don't fight each other Analytics, search, and 360° views are native to every record
              </p>
            </div>

            {/* Why Axi Solution Glassy Transparent Card */}
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="bg-white/10 backdrop-blur-2xl border border-white/60 rounded-3xl p-6 sm:p-7 shadow-xl shadow-[#1E1B4B]/5 hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[220px] group cursor-pointer"
            >
              {/* Glossy Shine Hover Sweep */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none z-30 opacity-0 group-hover:opacity-100" />

              <div className="flex items-center justify-between gap-4 mb-3 relative z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#00007f]/10 backdrop-blur-md flex items-center justify-center text-[#00007f] border border-white/60 shadow-xs">
                    <activeCard.icon size={20} className="text-[#00007f]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#fc8151] block">
                      WHY AXI SOLUTION
                    </span>
                    <h3 className="font-black text-lg text-[#1E1B4B]">
                      {activeCard.title}
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#fc8151] bg-[#fc8151]/10 border border-[#fc8151]/20 px-3 py-1 rounded-full uppercase tracking-wider">
                  {activeCard.badge}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={slideIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="text-xs sm:text-sm text-[#373e79] leading-relaxed font-normal my-2 relative z-20"
                >
                  "{activeCard.description}"
                </motion.p>
              </AnimatePresence>

              {/* Slider Dots & Arrow Controls */}
              <div className="pt-4 mt-2 border-t border-[#1E1B4B]/10 flex items-center justify-between relative z-20">
                <div className="flex items-center gap-2">
                  {whyAxiCards.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSlideIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${idx === slideIndex ? "w-6 bg-[#fc8151]" : "w-2 bg-[#00007f]/20 hover:bg-[#00007f]/40"
                        }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="w-8 h-8 rounded-full border border-white/70 bg-white/70 backdrop-blur-md flex items-center justify-center text-[#00007f] hover:bg-[#00007f] hover:text-white transition-all shadow-xs"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-8 h-8 rounded-full border border-white/70 bg-white/70 backdrop-blur-md flex items-center justify-center text-[#00007f] hover:bg-[#00007f] hover:text-white transition-all shadow-xs"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT 6 COLS: Clean Video Showcase (No badges, clean rounded box with light shadow) */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.96 }}
            animate={isVisible ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-6 relative lg:pl-4"
          >
            {/* Video Container (Clean, no letterboxing, soft shadow) */}
            <div className="relative w-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-white/60 bg-transparent group z-10">
              <video
                src="/videos/TITLE SCREEN_axi.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-cover rounded-3xl block pointer-events-none bg-transparent"
              />

              {/* Glossy Shine Sweep on Video Hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-20 opacity-0 group-hover:opacity-100" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
