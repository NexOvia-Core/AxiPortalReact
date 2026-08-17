/**
 * CTA Section - 3D Gyroscopic Motion Graphics & Continuous Looping Animation Canvas
 * Preserves 100% exact original background gradient (#00007f → #210062 → #3d1060 → #5c1380).
 * Ensures text readability is completely sharp and crisp while layering active looping 3D orbital animations behind.
 */
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useIsMobile } from "@/hooks/useMobile";
import { ArrowRight, Orbit, Sparkles } from "lucide-react";
import { useAuthModal } from "@/contexts/AuthContext";

export default function CTASection() {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const { openLogin } = useAuthModal();
  const isMobile = useIsMobile();

  // 3D Motion Values for Mouse Parallax Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 180, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 180, damping: 22 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  const moveX = useTransform(mouseXSpring, [-0.5, 0.5], ["-15px", "15px"]);
  const moveY = useTransform(mouseYSpring, [-0.5, 0.5], ["-15px", "15px"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section
      id="contact"
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="py-20 md:py-32 px-6 relative overflow-hidden select-none [perspective:1200px]"
      style={{
        background: "linear-gradient(135deg, #00007f 0%, #210062 30%, #3d1060 60%, #5c1380 100%)",
      }}
    >
      {/* ===== BACKGROUND LAYER 1: CYBERNETIC DOT-MATRIX GRID SHEEN ===== */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px] opacity-35 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fc8151]/5 to-transparent animate-shimmer pointer-events-none z-0" />

      {/* ===== BACKGROUND LAYER 2: MORPHING AURORA GLOW ORBS BEHIND TEXT ===== */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#fc8151]/12 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#5c1380]/40 blur-[90px] pointer-events-none" />

      {/* ===== BACKGROUND LAYER 3: CONTINUOUS METEOR LIGHT BEAMS (CORNER LOOPS) ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-8 -left-36 w-80 h-[2px] bg-gradient-to-r from-transparent via-[#fc8151] to-transparent rotate-[25deg] opacity-70 meteor-beam-animate" />
        <div className="absolute top-1/4 -right-16 w-[450px] h-[2px] bg-gradient-to-r from-transparent via-purple-300 to-transparent -rotate-[15deg] opacity-50 meteor-beam-animate" style={{ animationDelay: "3.5s" }} />
      </div>

      {/* ===== BACKGROUND LAYER 4: SEAMLESS CONTINUOUS 3D ORBITAL LOOPING GRAPHICS ===== */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] sm:w-[850px] sm:h-[850px] pointer-events-none z-0 flex items-center justify-center [transform-style:preserve-3d]">

        {/* 3D Ring 1: Outer Coral Gyroscopic Ring with Continuous Spin */}
        <div className="absolute w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] [transform:rotateX(68deg)_rotateY(10deg)] flex items-center justify-center">
          <div className="w-full h-full rounded-full border-2 border-dashed border-[#fc8151]/30 spin-slow-loop shadow-[0_0_30px_rgba(252,129,81,0.15)] flex items-center justify-center relative">
            <div className="w-4 h-4 rounded-full bg-[#fc8151] shadow-[0_0_16px_#fc8151] absolute top-0 left-1/2 -translate-x-1/2 animate-pulse" />
          </div>
        </div>

        {/* 3D Ring 2: Middle Purple Gyroscopic Ring with Counter-Spin */}
        <div className="absolute w-[450px] h-[450px] sm:w-[620px] sm:h-[620px] [transform:rotateY(62deg)_rotateZ(45deg)] flex items-center justify-center">
          <div className="w-full h-full rounded-full border border-dashed border-purple-400/40 spin-slow-reverse-loop shadow-[0_0_25px_rgba(168,85,247,0.2)] flex items-center justify-center relative">
            <div className="w-3.5 h-3.5 rounded-full bg-purple-300 shadow-[0_0_12px_#a855f7] absolute bottom-0 left-1/2 -translate-x-1/2" />
          </div>
        </div>

        {/* 3D Ring 3: Inner Cyan Gyroscopic Ring with Fast Spin */}
        <div className="absolute w-[350px] h-[350px] sm:w-[480px] sm:h-[480px] [transform:rotateX(-48deg)_rotateY(32deg)] flex items-center justify-center">
          <div className="w-full h-full rounded-full border border-sky-400/30 spin-slow-loop flex items-center justify-center relative" style={{ animationDuration: "16s" }}>
            <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_#ffffff] absolute left-0 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* 3D Floating Glowing Glass Orbs */}
        <div className="absolute -top-12 left-1/4 w-12 h-12 rounded-full bg-gradient-to-br from-[#fc8151]/40 to-white/10 border border-white/30 backdrop-blur-md shadow-[0_0_25px_rgba(252,129,81,0.3)] animate-pulse [transform:translateZ(40px)]" />
        <div className="absolute bottom-6 right-1/4 w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500/30 via-sky-400/20 to-white/10 border border-white/20 backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.3)] [transform:translateZ(-50px)]" />

        {/* Inner Target Core Pulse */}
        <div className="absolute w-[260px] h-[260px] rounded-full border border-[#fc8151]/25 animate-soft-pulse" />
      </div>

      {/* ===== BACKGROUND LAYER 5: CONTINUOUS FLOATING STARLIGHT DRIFT LOOP ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(40)].map((_, i) => {
          const left = `${(i * 2.5 + (i % 7) * 3.5) % 100}%`;
          const top = `${(i * 2.3 + (i % 5) * 5.1) % 100}%`;
          const duration = `${4 + (i % 8) * 0.75}s`;
          const delay = `${(i % 10) * 0.4}s`;
          const isCoral = i % 2 === 0;
          return (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full particle-loop shadow-xs"
              style={{
                left,
                top,
                background: isCoral ? "#fc8151" : "rgba(255,255,255,0.45)",
                animationDuration: duration,
                animationDelay: delay,
              }}
            />
          );
        })}
      </div>

      {/* ===== MAIN FOREGROUND CONTENT CONTAINER (TEXT IS 100% CRISP & READABLE) ===== */}
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          style={{
            rotateX: isMobile ? 0 : rotateX,
            rotateY: isMobile ? 0 : rotateY,
            x: isMobile ? 0 : moveX,
            y: isMobile ? 0 : moveY,
            transformStyle: "preserve-3d",
          }}
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Header Pill Tag */}
          <div
            className="flex items-center justify-center gap-2 mb-6"
            style={{ transform: "translateZ(30px)" }}
          >
            <Orbit size={18} className="text-[#fc8151] animate-spin" style={{ animationDuration: "12s" }} />
            <p className="text-sm font-semibold tracking-[0.35em] uppercase text-[#fc8151]">
              Axi Intelligence Platform
            </p>
          </div>

          {/* Main Title - Clean, Sharp, Crisp Typography */}
          <h2
            className="font-[Space_Grotesk] text-4xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.1] relative drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            style={{ transform: "translateZ(50px)" }}
          >
            Unleash the{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#fc8151] via-[#ff9f7f] to-white bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(252,129,81,0.6)]">
                Power!
              </span>
              {/* Glowing Underline Motion Accent */}
              <motion.span
                initial={{ scaleX: 0 }}
                animate={isVisible ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#fc8151] via-[#ff9f7f] to-transparent rounded-full shadow-[0_0_10px_#fc8151]"
              />
            </span>
          </h2>

          {/* Subtext - 100% Crisp Readability */}
          <p
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed font-normal drop-shadow-md"
            style={{ transform: "translateZ(35px)" }}
          >
            Unleash the power of AI with Axpert. Upgrade your Business with Axpert.
          </p>

          {/* Call to Action Button */}
          <div
            className="flex items-center justify-center"
            style={{ transform: "translateZ(45px)" }}
          >
            <motion.button
              onClick={() => openLogin("https://agile.axi-global.com/aspx/signin.aspx")}
              className="group flex items-center gap-3 px-12 py-5 text-lg font-semibold text-white rounded-full transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#fc8151]/40 relative overflow-hidden cursor-pointer border border-white/20"
              style={{
                background: "linear-gradient(135deg, #210062 0%, #5c1380 50%, #d6573c 100%)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10 font-bold tracking-wide">Get Started</span>
              <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform relative z-10" />
              <div className="absolute inset-0 shimmer" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
