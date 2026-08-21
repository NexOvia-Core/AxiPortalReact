/**
 * Analytics Section - Enhanced glassmorphism with smoother animations
 * Dark gradient section for contrast and visual break
 */
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { assetUrl } from "@/lib/paths";

const metrics = [
  {
    value: "100,000+",
    label: "Active Users Across Axpert",
    description: "Proven enterprise deployment scale",
  },
  {
    value: "750+",
    label: "Enterprises Running on Axi",
    description: "Global enterprise client base",
  },
  {
    value: "10+",
    label: "Countries Live Today",
    description: "Multi-national operations",
  },
  {
    value: "4.9/5",
    label: "Average Customer Rating",
    description: "Based on 30+ customer reviews",
  },
];

export default function AnalyticsSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section
      id="analytics"
      ref={ref}
      className="py-36 px-6 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #00007f 0%, #1a1a5e 50%, #2d1040 100%)",
      }}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#fc8151]/5 blur-[100px] pointer-events-none" />

      {/* Particle overlay */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-20 left-20 w-2 h-2 rounded-full bg-[#fc8151] animate-pulse" />
        <div
          className="absolute top-40 right-32 w-1.5 h-1.5 rounded-full bg-[#fc8151] animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute bottom-32 left-1/3 w-1 h-1 rounded-full bg-white animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 right-1/4 w-2 h-2 rounded-full bg-[#fc8151] animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-16 w-1 h-1 rounded-full bg-white animate-pulse"
          style={{ animationDelay: "0.8s" }}
        />
        <div
          className="absolute top-1/3 right-16 w-1.5 h-1.5 rounded-full bg-white animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Orbital rings */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full border border-white/3 translate-x-1/3 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[350px] h-[350px] rounded-full border border-[#fc8151]/5 translate-x-1/3 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: -60, scale: 0.95 }}
            animate={isVisible ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            className="relative"
          >
            <div className="glass-dark rounded-3xl p-4">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={assetUrl("orbital-network_03a94a6d.webp")}
                  alt="Orbital Analytics Network"
                  className="w-full h-auto object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
            {/* Decorative orbital ring around image */}
            <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full border border-[#fc8151]/10 pointer-events-none" />
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <h2 className="font-[Space_Grotesk] text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
              Priority{" "}
              <span className="bg-gradient-to-r from-[#fc8151] to-[#ff6b9d] bg-clip-text text-transparent">
                geographies
              </span>
            </h2>

            {/* Geography Pills */}
            <div className="flex flex-wrap gap-2.5 mb-6">
              <span className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#00007f] bg-white/90 shadow-sm">
                India
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#fc8151] bg-[#fc8151]/20 border border-[#fc8151]/30">
                Africa
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#ffaa7f] bg-[#ffaa7f]/20 border border-[#ffaa7f]/30">
                UAE / GCC
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-white/10 border border-white/20">
                Other developing markets
              </span>
            </div>

            <p className="text-base text-white/60 mb-10 leading-relaxed">
              Built for businesses where operations are complex, assets are
              critical, and every decision impacts the bottom line — meet AXI
            </p>

            <div className="grid grid-cols-2 gap-5">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + index * 0.1,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  className="glass-dark rounded-xl p-6 hover:bg-white/10 transition-all duration-500 group border border-white/10"
                >
                  <p className="font-[JetBrains_Mono] text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#fc8151] to-white bg-clip-text text-transparent">
                    {metric.value}
                  </p>
                  <p className="text-xs md:text-sm font-semibold uppercase tracking-wider text-white/80 mt-2">
                    {metric.label}
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    {metric.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
