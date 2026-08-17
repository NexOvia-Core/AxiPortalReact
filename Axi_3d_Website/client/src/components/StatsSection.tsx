/**
 * Stats Section - KPI cards with enhanced glassmorphism and animated counters
 * Ambient glow effects and smooth reveal animations
 */
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { TrendingUp, Users, Zap, Globe } from "lucide-react";
import { useEffect, useState, useRef } from "react";

function AnimatedCounter({ end, duration = 2200, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const isDecimal = Number.isInteger(end) === false;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            if (isDecimal) {
              setCount(parseFloat((eased * end).toFixed(1)));
            } else {
              setCount(Math.floor(eased * end));
            }
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, isDecimal]);

  return (
    <div ref={ref} className="font-[JetBrains_Mono] text-4xl md:text-5xl font-bold gradient-text">
      {isDecimal ? count.toFixed(1) : count.toLocaleString()}{suffix}
    </div>
  );
}

const stats = [
  { icon: Users, label: "Live Deployments", value: 500, suffix: "+", description: "Production enterprise deployments worldwide" },
  { icon: Globe, label: "Global Presence", value: 10, suffix: "+", description: "Countries running on the Axpert low-code core" },
  { icon: TrendingUp, label: "Cost Reduction", value: 40, suffix: "%", description: "Average IT cost reduction reported after modernization" },
  { icon: Zap, label: "Government & Defence", value: 150, suffix: "+", description: "Mission-critical government & defence systems deployed" },
];

export default function StatsSection() {
  const { ref, isVisible } = useScrollAnimation(0.15);

  return (
    <section ref={ref} className="py-12 md:py-16 px-6 relative overflow-hidden" style={{ background: "#fff6e5" }}>
      {/* Ambient glow effects */}
      <div className="ambient-glow ambient-glow-blue w-[500px] h-[500px] top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="ambient-glow ambient-glow-coral w-[400px] h-[400px] bottom-0 right-0 translate-x-1/3" />

      {/* Decorative orbital rings */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full border border-[#00007f]/3 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full border border-[#fc8151]/3 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-20"
        >
          <p className="text-sm font-semibold tracking-[0.35em] uppercase text-[#fc8151] mb-5">
            THE CASE FOR CHANGE
          </p>
          <h2 className="font-[Space_Grotesk] text-4xl md:text-6xl font-bold text-[#00007f] mb-6 leading-tight">
            AXI adapts <span className="gradient-text">to you </span>
          </h2>
          <p className="text-lg text-[#00007f]/55 max-w-3xl mx-auto">
            Powered by Axpert — Agile Labs&apos; patented low-code core with built-in AI woven into every enterprise workflow.
          </p>
        </motion.div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.12, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="glass-card rounded-2xl p-8 h-full relative overflow-hidden group">
                {/* Shimmer on hover */}
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center glass"
                      style={{ background: "linear-gradient(135deg, rgba(0,0,127,0.06), rgba(252,129,81,0.06))" }}>
                      <stat.icon size={18} className="gradient-text" />
                    </div>
                    <span className="text-xs font-medium text-[#00007f]/45 uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>

                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />

                  <p className="mt-3 text-sm text-[#00007f]/55 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gartner & Case for Change Benchmarks */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-[#fc8151]">
            <span className="text-xs font-semibold text-[#fc8151] tracking-widest uppercase mb-2 block">Gartner Benchmark</span>
            <div className="font-[JetBrains_Mono] text-3xl font-bold text-[#00007f] mb-2">55 – 75%</div>
            <p className="text-sm text-[#00007f]/60 leading-relaxed">
              Of traditional ERP projects fail to deliver on their original promises due to rigid customization bottlenecks.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-[#00007f]">
            <span className="text-xs font-semibold text-[#00007f] tracking-widest uppercase mb-2 block">Industry Estimate</span>
            <div className="font-[JetBrains_Mono] text-3xl font-bold text-[#00007f] mb-2">50 – 60%</div>
            <p className="text-sm text-[#00007f]/60 leading-relaxed">
              Is the typical real-world coverage of a company&apos;s operational needs from an off-the-shelf ERP system.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-[#fc8151]">
            <span className="text-xs font-semibold text-[#fc8151] tracking-widest uppercase mb-2 block">AXI ROI Survey</span>
            <div className="font-[JetBrains_Mono] text-3xl font-bold gradient-text mb-2">40% Cost Savings</div>
            <p className="text-sm text-[#00007f]/60 leading-relaxed">
              Average IT cost reduction reported by enterprise customers after adopting AXI&apos;s low-code core platform.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
