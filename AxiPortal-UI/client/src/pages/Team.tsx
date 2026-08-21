import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import ShowcaseSection from "@/components/ShowcaseSection";
import { Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Team() {
  return (
    <div className="min-h-screen bg-[#fff6e5] font-body relative overflow-hidden">
      <ScrollProgress />
      <Navigation />

      {/* Ambient glows */}
      <div className="ambient-glow ambient-glow-coral w-[600px] h-[600px] top-20 right-1/4 opacity-40" />

      {/* HERO SECTION */}
      <section className="pt-36 pb-10 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-[#00007f]/10 text-[#00007f] text-xs font-bold uppercase tracking-widest mb-8 shadow-sm"
        >
          <Users className="w-4 h-4 text-[#fc8151]" />
          Our Leadership
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="text-4xl md:text-6xl font-extrabold font-display tracking-tight text-[#00007f] leading-[1.1] mb-6 max-w-4xl mx-auto"
        >
          Meet the minds behind <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#fc8151] to-[#ffb25d]">Axpert</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="text-lg md:text-xl text-[#00007f]/70 max-w-2xl mx-auto font-medium"
        >
          An army of trendsetters. Our team comprises talented minds with years of expertise in their respective domains.
        </motion.p>
      </section>

      {/* SHOWCASE SECTION REUSED FROM PLATFORM */}
      <div className="pb-24">
        <ShowcaseSection />
      </div>

      <Footer />
    </div>
  );
}
