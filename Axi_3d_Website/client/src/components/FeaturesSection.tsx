/**
 * Features Section - Glassmorphism cards with orbital motifs and shimmer effects
 * Updated with Image 3 content: "AI isn't a feature you switch on. It's the layer everything runs through."
 */
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Search, TrendingUp, Target, GitMerge, AlertTriangle, Bell, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Conversational Search & 360° Recall",
    description: "Type a customer, product, or document number and AXI returns the record — plus every order, invoice, and return connected to it.",
    tag: "Search"
  },
  {
    icon: TrendingUp,
    title: "Smart Analytics & Auto-Insights",
    description: "Slice any transaction by branch, customer, channel, or salesperson. AXI surfaces outliers and trend breaks before you ask.",
    tag: "Analytics"
  },
  {
    icon: Target,
    title: "Predictive, Demand-Aware Planning",
    description: "MRP reads sales orders, stock, and lead times to recommend reserve, produce, transfer, or buy — cutting stockouts and excess inventory.",
    tag: "Predictive"
  },
  {
    icon: GitMerge,
    title: "Intelligent Workflow Routing",
    description: "The process engine evaluates live conditions — value, branch, department — and routes each approval to the right person automatically.",
    tag: "Automation"
  },
  {
    icon: AlertTriangle,
    title: "Anomaly & Risk Detection",
    description: "Vendor rejection patterns, rate deviations, and rule violations are flagged the moment they appear, not at month-end review.",
    tag: "Risk Detect"
  },
  {
    icon: Bell,
    title: "Always-On, Context-Aware Alerts",
    description: "The right person is notified by email, WhatsApp, SMS, or mobile push the instant a record needs attention.",
    tag: "Alerts"
  }
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: [0.23, 1, 0.32, 1] }}
      className="group"
    >
      <div className="glass-card rounded-3xl p-8 h-full relative overflow-hidden flex flex-col justify-between border border-white/80 shadow-lg hover:shadow-xl transition-all duration-500 bg-white/60">
        {/* Shimmer on hover */}
        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center glass transition-all duration-500 group-hover:scale-110 shadow-xs"
              style={{ background: "linear-gradient(135deg, rgba(0,0,127,0.08), rgba(252,129,81,0.08))" }}
            >
              <feature.icon size={22} className="gradient-text" strokeWidth={1.8} />
            </div>
            <span className="text-[10px] font-mono font-semibold text-[#fc8151] bg-[#fc8151]/10 border border-[#fc8151]/20 px-3.5 py-1 rounded-full uppercase tracking-wider">
              {feature.tag}
            </span>
          </div>

          <h3 className="font-[Space_Grotesk] text-xl font-bold text-[#00007f] mb-3 group-hover:gradient-text transition-all duration-500">
            {feature.title}
          </h3>
          <p className="text-[#00007f]/70 leading-relaxed text-sm font-normal">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const { ref, isVisible } = useScrollAnimation(0.05);

  return (
    <section id="features" ref={ref} className="py-12 md:py-16 px-6 relative overflow-hidden" style={{ background: "#fff6e5" }}>
      {/* Ambient glow */}
      <div className="ambient-glow ambient-glow-blue w-[500px] h-[500px] top-20 right-0 -translate-x-1/3" />
      <div className="ambient-glow ambient-glow-coral w-[350px] h-[350px] bottom-10 left-0 translate-x-1/3" />

      {/* Decorative orbital rings */}
      <div className="absolute top-32 right-0 w-[500px] h-[500px] rounded-full border border-[#00007f]/3 -translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[300px] h-[300px] rounded-full border border-[#fc8151]/3 translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="mb-16 text-center max-w-4xl mx-auto">
          <span className="inline-block text-xs font-mono font-bold tracking-[0.25em] uppercase text-[#fc8151] bg-[#fc8151]/10 border border-[#fc8151]/20 px-4 py-1.5 rounded-full mb-6">
            INTELLIGENCE, BUILT IN
          </span>
          <h2 className="font-[Space_Grotesk] text-4xl md:text-6xl font-bold text-[#00007f] mb-6 leading-tight">
            <span className="gradient-text">AI is the layer that runs through everything</span>
          </h2>
          <p className="text-base md:text-lg text-[#00007f]/65 leading-relaxed">
            AXI is AI-assisted from the ground up. It reads your live purchase orders, stock ledgers, and approvals — the same records your team already works in — and turns them into decisions, not dashboards you have to interpret yourself.
          </p>
        </motion.div>

        {/* AI Workflow Pipeline Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16 glass-card rounded-3xl p-6 md:p-8 border border-white/80 shadow-xl bg-gradient-to-r from-[#00007f]/5 via-white/50 to-[#5c1380]/5"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center relative">
            {/* Step 1 */}
            <div className="glass rounded-2xl p-5 border border-white/60 shadow-sm bg-white/70">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00007f]/50 mb-1 block">
                STEP 01
              </span>
              <h4 className="font-[Space_Grotesk] font-bold text-lg text-[#00007f] mb-1">
                Live Transactions
              </h4>
              <p className="text-xs text-[#00007f]/60 font-medium">
                Orders · Stock · Approvals
              </p>
            </div>

            {/* Step 2 (Highlighted Core Engine) */}
            <div className="glass rounded-2xl p-5 border border-white/60 shadow-sm bg-white/70">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00007f]/50 mb-1 block">
                STEP 02 CORE
              </span>
              <h4 className="font-[Space_Grotesk] font-bold text-lg text-[#00007f] mb-1">
                AXI AI Engine
              </h4>
              <p className="text-xs text-[#00007f]/60 font-medium">
                Reads · Scores · Predicts
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass rounded-2xl p-5 border border-white/60 shadow-sm bg-white/70">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00007f]/50 mb-1 block">
                STEP 03 OUTPUT
              </span>
              <h4 className="font-[Space_Grotesk] font-bold text-lg text-[#00007f] mb-1">
                Decisions & Alerts
              </h4>
              <p className="text-xs text-[#00007f]/60 font-medium">
                Routed to the right person
              </p>
            </div>
          </div>
        </motion.div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
