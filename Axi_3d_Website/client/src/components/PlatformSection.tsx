/**
 * Platform Section - Glassmorphism with smooth sliding Why Axi feature cards
 * Split layout with text, glassy transparent sliding quote card, and clean video container
 */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ShieldCheck, Layers, Server, DollarSign, Brain, ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";

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

interface WhyAxi3DCardProps {
  activeCard: typeof whyAxiCards[0];
  slideIndex: number;
  totalSlides: number;
  onSelectSlide: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onHoverChange: (isHovered: boolean) => void;
}

function WhyAxi3DCard({
  activeCard,
  slideIndex,
  totalSlides,
  onSelectSlide,
  onNext,
  onPrev,
  onHoverChange,
}: WhyAxi3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Motion values for realistic 3D mouse parallax tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 240, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 240, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  // Glare position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    onHoverChange(true);
  };

  const handleMouseLeave = () => {
    onHoverChange(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div className="w-full relative" style={{ perspective: 1000 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className="bg-white/10 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 sm:p-7 shadow-xl shadow-[#1E1B4B]/5 hover:shadow-[0_30px_60px_-12px_rgba(0,0,127,0.22)] transition-shadow duration-500 relative overflow-hidden flex flex-col justify-between min-h-[230px] group cursor-pointer"
      >
        {/* Dynamic 3D Glare effect on mouse move */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
          style={{
            background: `radial-gradient(550px circle at ${glareX} ${glareY}, rgba(255, 255, 255, 0.55), transparent 55%)`,
          }}
        />

        {/* Glossy Edge Rim Highlight */}
        <div className="absolute inset-0 rounded-3xl border-t border-l border-white/90 pointer-events-none z-20" />

        {/* Ambient subtle glow background inside card */}
        <div className="absolute -inset-10 rounded-full blur-3xl bg-gradient-to-r from-[#fc8151]/10 via-[#00007f]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* TOP 3D LAYER: Content floating with 3D Depth */}
        <div
          className="relative z-30 flex flex-col justify-between h-full space-y-4"
          style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
        >
          {/* Header Row */}
          <div className="flex items-center justify-between gap-4" style={{ transform: "translateZ(10px)" }}>
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl bg-[#00007f]/10 backdrop-blur-md flex items-center justify-center text-[#00007f] border border-white/60 shadow-xs group-hover:scale-105 transition-transform duration-300"
                style={{ transform: "translateZ(15px)" }}
              >
                <activeCard.icon size={22} className="text-[#00007f]" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#fc8151] block">
                  WHY AXI SOLUTION
                </span>
                <h3 className="font-black text-lg sm:text-xl text-[#1E1B4B]">
                  {activeCard.title}
                </h3>
              </div>
            </div>
            <span
              className="text-[10px] font-mono font-bold text-[#fc8151] bg-[#fc8151]/10 border border-[#fc8151]/20 px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs"
              style={{ transform: "translateZ(15px)" }}
            >
              {activeCard.badge}
            </span>
          </div>

          {/* Description Quote */}
          <AnimatePresence mode="wait">
            <motion.p
              key={slideIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="text-xs sm:text-sm text-[#373e79] leading-relaxed font-normal my-2"
              style={{ transform: "translateZ(20px)" }}
            >
              "{activeCard.description}"
            </motion.p>
          </AnimatePresence>

          {/* Slider Dots & Arrow Controls */}
          <div
            className="pt-4 border-t border-[#1E1B4B]/10 flex items-center justify-between"
            style={{ transform: "translateZ(15px)" }}
          >
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSlide(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === slideIndex ? "w-6 bg-[#fc8151]" : "w-2 bg-[#00007f]/20 hover:bg-[#00007f]/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
                className="w-8 h-8 rounded-full border border-white/80 bg-white/80 backdrop-blur-md flex items-center justify-center text-[#00007f] hover:bg-[#00007f] hover:text-white transition-all shadow-xs"
                aria-label="Previous slide"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                className="w-8 h-8 rounded-full border border-white/80 bg-white/80 backdrop-blur-md flex items-center justify-center text-[#00007f] hover:bg-[#00007f] hover:text-white transition-all shadow-xs"
                aria-label="Next slide"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Video3DCard({
  videoLoaded,
  videoContainerRef,
}: {
  videoLoaded: boolean;
  videoContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Motion values for realistic 3D mouse parallax tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 240, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 240, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  // Glare position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="w-full relative" style={{ perspective: 1000 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.14)] hover:shadow-[0_30px_60px_-10px_rgba(0,0,127,0.25)] transition-shadow duration-500 border border-white/70 bg-transparent group z-10 cursor-pointer"
      >
        <div
          ref={videoContainerRef}
          className="w-full h-full relative"
          style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
        >
          <video
            src={videoLoaded ? "/videos/TITLE SCREEN_axi.mp4" : undefined}
            autoPlay
            loop
            muted
            playsInline
            preload={videoLoaded ? "auto" : "none"}
            className="w-full h-auto object-cover rounded-3xl block pointer-events-none bg-transparent"
          />

          {/* Dynamic 3D Glare effect on mouse move */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
            style={{
              background: `radial-gradient(600px circle at ${glareX} ${glareY}, rgba(255, 255, 255, 0.45), transparent 60%)`,
            }}
          />

          {/* Glossy Edge Rim Highlight */}
          <div className="absolute inset-0 rounded-3xl border-t border-l border-white/90 pointer-events-none z-30" />

          {/* Glossy Shine Sweep on Hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none z-30 opacity-0 group-hover:opacity-100" />
        </div>
      </motion.div>
    </div>
  );
}

export default function PlatformSection() {
  const { ref, isVisible } = useScrollAnimation(0.15);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

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

  // Lazy-load the video when section enters viewport
  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !videoLoaded) {
          setVideoLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [videoLoaded]);

  const activeCard = whyAxiCards[slideIndex];

  return (
    <section id="platform" ref={ref} className="py-10 md:py-14 px-5 sm:px-8 md:px-10 relative overflow-hidden bg-[#fff6e5] text-[#1E1B4B]">
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

            {/* Why Axi Solution Glassy 3D Realistic Interactive Card */}
            <WhyAxi3DCard
              activeCard={activeCard}
              slideIndex={slideIndex}
              totalSlides={whyAxiCards.length}
              onSelectSlide={setSlideIndex}
              onNext={handleNext}
              onPrev={handlePrev}
              onHoverChange={setIsHovered}
            />
          </motion.div>

          {/* RIGHT 6 COLS: Clean 3D Video Showcase Card */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.96 }}
            animate={isVisible ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-6 relative lg:pl-4"
          >
            <Video3DCard
              videoLoaded={videoLoaded}
              videoContainerRef={videoContainerRef}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
