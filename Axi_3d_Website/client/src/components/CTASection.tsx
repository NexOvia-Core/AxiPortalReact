/**
 * CTA Section - Enhanced with glassmorphism CTA card on dark background
 * Smoother animations and immersive orbital particle field
 */
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight, Orbit } from "lucide-react";
import { useAuthModal } from "@/contexts/AuthContext";

export default function CTASection() {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const { openLogin } = useAuthModal();

  return (
    <section
      id="contact"
      ref={ref}
      className="py-36 px-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #00007f 0%, #210062 30%, #3d1060 60%, #5c1380 100%)",
      }}
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#fc8151]/5 blur-[120px] pointer-events-none" />

      {/* Orbital ring decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/3 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#fc8151]/8 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-white/5 pointer-events-none" />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: Math.random() > 0.5 ? "#fc8151" : "rgba(255,255,255,0.3)",
            }}
            animate={{
              opacity: [0.05, 0.6, 0.05],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Orbit size={18} className="text-[#fc8151]" />
            <p className="text-sm font-semibold tracking-[0.35em] uppercase text-[#fc8151]">
              Axi Intelligence Platform
            </p>
          </div>
          <h2 className="font-[Space_Grotesk] text-4xl md:text-7xl font-bold text-white mb-6 leading-[1.1]">
            Unleash the <span className="bg-gradient-to-r from-[#fc8151] via-[#ff9f7f] to-white bg-clip-text text-transparent">Power!</span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
            Unleash the power of AI with Axpert. Upgrade your Business with Axpert.
          </p>

          <div className="flex items-center justify-center">
            <motion.button
              onClick={() => openLogin("https://agile.axi-global.com/aspx/signin.aspx")}
              className="group flex items-center gap-3 px-12 py-5 text-lg font-semibold text-white rounded-full transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#fc8151]/30 relative overflow-hidden cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #210062 0%, #5c1380 50%, #d6573c 100%)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10">Get Started</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform relative z-10" />
              <div className="absolute inset-0 shimmer" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
