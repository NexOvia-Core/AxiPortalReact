/**
 * Deployment Section - Built for operators. Ready for emerging markets.
 * Features AXI Cloud vs AXI On-Premise deployment options and Ideal Customer Profile tags.
 * Proportionally calibrated for 100% default zoom viewports.
 * Theme: Warm Immersive Enterprise (#fff6e5)
 */
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const customerProfiles = [
  "Manufacturing",
  "Trading & Retail",
  "Services (Staffing / People Services)",
  "Banking & Finance",
  "Government & Defence",
  "Logistics & Supply Chain",
  "Agribusiness",
  "Healthcare",
];

export default function DeploymentSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section ref={ref} className="py-14 md:py-20 px-6 relative overflow-hidden" style={{ background: "#fff6e5" }}>
      {/* Ambient glow orbs */}
      <div className="ambient-glow ambient-glow-blue w-[500px] h-[500px] top-1/2 left-0 -translate-y-1/2" />
      <div className="ambient-glow ambient-glow-coral w-[400px] h-[400px] bottom-0 right-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="mb-8 md:mb-10 max-w-4xl"
        >
          <h2 className="font-[Space_Grotesk] text-3xl sm:text-4xl md:text-5xl font-bold text-[#00007f] mb-3 md:mb-4 leading-tight">
            Built for operators.
            <br />
            <span className="gradient-text">Ready for emerging markets.</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#00007f]/65 leading-relaxed max-w-3xl">
            AXI is purpose-fit for manufacturing, trading/retail, and services businesses — the companies that live in inventory, production, and contracts, not just ledgers.
          </p>
        </motion.div>

        {/* Deployment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10">
          {/* Card 1: AXI CLOUD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="rounded-2xl p-6 md:p-8 bg-[#1b3152] border border-white/20 text-white shadow-xl transition-all duration-500 hover:scale-[1.015] flex flex-col justify-between group"
          >
            <div>
              <span className="inline-block text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-[#fc8151] mb-3">
                AXI CLOUD
              </span>
              <h3 className="font-[Space_Grotesk] text-xl md:text-2xl font-bold text-white mb-2.5">
                SaaS, live in days
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-white/80 leading-relaxed">
                A mobile-first, pay-for-usage platform for start-ups and SMEs — full functionality, zero infrastructure to manage, automatic upgrades.
              </p>
            </div>
          </motion.div>

          {/* Card 2: AXI ON-PREMISE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="rounded-2xl p-6 md:p-8 bg-[#fdecdb] border border-[#00007f]/10 text-[#00007f] shadow-xl transition-all duration-500 hover:scale-[1.015] flex flex-col justify-between group"
          >
            <div>
              <span className="inline-block text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-[#fc8151] mb-3">
                AXI ON-PREMISE
              </span>
              <h3 className="font-[Space_Grotesk] text-xl md:text-2xl font-bold text-[#00007f] mb-2.5">
                Private cloud or sovereign hosting
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-[#00007f]/75 leading-relaxed">
                ISO, CMM, and SOC2-aligned security for government, defence, and regulated enterprises that need complete control of data and hosting.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Ideal Customer Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
        >
          <h3 className="font-[Space_Grotesk] text-base md:text-lg font-bold text-[#00007f] mb-3 md:mb-4">
            Ideal customer profile
          </h3>
          <div className="flex flex-wrap gap-2.5 md:gap-3">
            {customerProfiles.map((profile, index) => (
              <motion.span
                key={profile}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.35 + index * 0.04 }}
                className="px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold text-[#00007f] bg-[#f8e7d2] border border-[#00007f]/10 shadow-2xs hover:bg-[#00007f] hover:text-white transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                {profile}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
