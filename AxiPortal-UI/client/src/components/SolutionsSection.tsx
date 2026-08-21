/**
 * Solutions Section - Enhanced glassmorphism with smoother transitions
 * Industry solutions with orbital visual language
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Building2, Stethoscope, Landmark, ShoppingCart, Factory, Plane } from "lucide-react";

const industries = [
  {
    id: "finance",
    icon: Landmark,
    name: "Financial Services",
    title: "Risk Intelligence at Scale",
    description: "Real-time risk assessment across global portfolios. Axi processes market data, regulatory filings, and alternative signals to provide comprehensive risk intelligence that keeps you ahead of volatility.",
    metrics: [
      { label: "Risk Detection", value: "94% faster" },
      { label: "Compliance Coverage", value: "100%" },
      { label: "Processing Volume", value: "1B+ txns/day" },
    ],
  },
  {
    id: "healthcare",
    icon: Stethoscope,
    name: "Healthcare",
    title: "Patient Data Intelligence",
    description: "Transform patient records, clinical trials, and operational data into actionable insights. HIPAA-compliant analytics that accelerate research and improve patient outcomes.",
    metrics: [
      { label: "Patient Records", value: "50M+ processed" },
      { label: "Clinical Trials", value: "3x faster" },
      { label: "Compliance", value: "HIPAA/SOC2" },
    ],
  },
  {
    id: "retail",
    icon: ShoppingCart,
    name: "Retail & Commerce",
    title: "Demand Prediction Engine",
    description: "Predict consumer behavior, optimize inventory, and personalize experiences at scale. Our ML models analyze purchase patterns, social signals, and market trends to drive revenue growth.",
    metrics: [
      { label: "Revenue Impact", value: "+23% avg" },
      { label: "Inventory Optimization", value: "40% reduction" },
      { label: "Personalization", value: "8M+ profiles" },
    ],
  },
  {
    id: "manufacturing",
    icon: Factory,
    name: "Manufacturing",
    title: "Smart Factory Analytics",
    description: "IoT-powered predictive maintenance and supply chain optimization. Monitor equipment health, predict failures, and optimize production schedules with real-time sensor data.",
    metrics: [
      { label: "Downtime Reduction", value: "67%" },
      { label: "Sensor Nodes", value: "100K+" },
      { label: "Cost Savings", value: "$12M avg" },
    ],
  },
  {
    id: "energy",
    icon: Building2,
    name: "Energy & Utilities",
    title: "Grid Intelligence Platform",
    description: "Smart grid management with predictive load balancing and renewable energy optimization. Real-time monitoring across distributed energy networks.",
    metrics: [
      { label: "Grid Efficiency", value: "+18%" },
      { label: "Outage Prediction", value: "97% accuracy" },
      { label: "Renewable Integration", value: "40% more" },
    ],
  },
  {
    id: "logistics",
    icon: Plane,
    name: "Logistics & Supply Chain",
    title: "Global Route Intelligence",
    description: "End-to-end supply chain visibility with predictive disruption management. Optimize routes, reduce costs, and maintain real-time visibility across your global logistics network.",
    metrics: [
      { label: "Cost Reduction", value: "31%" },
      { label: "On-Time Delivery", value: "99.4%" },
      { label: "Network Coverage", value: "180+ countries" },
    ],
  },
];

export default function SolutionsSection() {
  const [activeIndustry, setActiveIndustry] = useState(industries[0]);
  const { ref, isVisible } = useScrollAnimation(0.05);

  return (
    <section id="solutions" ref={ref} className="py-36 px-6 relative overflow-hidden" style={{ background: "#fff6e5" }}>
      {/* Ambient glow */}
      <div className="ambient-glow ambient-glow-blue w-[500px] h-[500px] top-0 right-0 -translate-x-1/3 -translate-y-1/2" />

      {/* Decorative orbital ring */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full border border-[#00007f]/3 translate-x-1/3 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="mb-16"
        >
          <p className="text-sm font-semibold tracking-[0.35em] uppercase text-[#fc8151] mb-5">
            Industry Solutions
          </p>
          <h2 className="font-[Space_Grotesk] text-4xl md:text-6xl font-bold text-[#00007f] mb-6 leading-tight">
            Built for <span className="gradient-text">Every Sector</span>
          </h2>
          <p className="text-lg text-[#00007f]/45 max-w-xl">
            Purpose-built intelligence solutions tailored to the unique challenges 
            of each industry vertical.
          </p>
        </motion.div>

        {/* Industry Tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {industries.map((industry) => (
            <motion.button
              key={industry.id}
              onClick={() => setActiveIndustry(industry)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-500 ${
                activeIndustry.id === industry.id
                  ? "text-white shadow-lg shadow-[#00007f]/15 scale-105"
                  : "bg-white/60 backdrop-blur-sm text-[#00007f]/50 hover:bg-white/80 hover:text-[#00007f] border border-[#00007f]/5"
              }`}
              style={
                activeIndustry.id === industry.id
                  ? { background: "linear-gradient(135deg, #00007f 0%, #5c1380 50%, #d6573c 100%)" }
                  : undefined
              }
            >
              <industry.icon size={14} />
              {industry.name}
            </motion.button>
          ))}
        </div>

        {/* Active Industry Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndustry.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="relative glass-strong rounded-3xl p-8 md:p-12 overflow-hidden"
          >
            {/* Orbital decoration corner */}
            <div className="absolute top-6 right-6 w-20 h-20 rounded-full border border-[#fc8151]/8 pointer-events-none" />
            <div className="absolute bottom-6 left-6 w-12 h-12 rounded-full border border-[#00007f]/5 pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <h3 className="font-[Space_Grotesk] text-3xl font-bold text-[#00007f] mb-4">
                  {activeIndustry.title}
                </h3>
                <p className="text-[#00007f]/50 text-base leading-relaxed mb-8">
                  {activeIndustry.description}
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-[#fc8151] font-semibold hover:gap-4 transition-all duration-500"
                >
                  Explore {activeIndustry.name} solutions
                  <span className="text-lg">→</span>
                </a>
              </div>

              <div className="space-y-4">
                {activeIndustry.metrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
                    className="glass rounded-xl p-5 border border-[#00007f]/3"
                  >
                    <p className="font-[JetBrains_Mono] text-xl font-bold gradient-text">
                      {metric.value}
                    </p>
                    <p className="text-xs text-[#00007f]/40 mt-1">{metric.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
