/**
 * Pricing Section - Enhanced glassmorphism with smoother transitions
 * Three-tier pricing with orbital visual language
 */
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "For growing teams building their data foundation",
    price: "$499",
    period: "/month",
    cta: "Begin Your Orbit",
    gradient: false,
    features: [
      "Up to 10 team members",
      "5 data source connectors",
      "Basic predictive models",
      "Standard dashboards",
      "Email support",
      "SOC 2 compliant",
    ],
  },
  {
    name: "Enterprise",
    description: "For organizations demanding full orbital intelligence",
    price: "Custom",
    period: "",
    cta: "Request Access",
    gradient: true,
    popular: true,
    features: [
      "Unlimited team members",
      "Unlimited connectors (200+)",
      "Advanced AI/ML models",
      "3D orbital dashboards",
      "Priority support (24/7)",
      "SOC 2, HIPAA, GDPR",
      "Custom integrations",
      "Dedicated account manager",
      "On-premise deployment option",
    ],
  },
  {
    name: "Platform",
    description: "For enterprises building on Axi's intelligence fabric",
    price: "$2,499",
    period: "/month",
    cta: "Scale Your Orbit",
    gradient: false,
    features: [
      "Up to 50 team members",
      "25 data source connectors",
      "Advanced predictive models",
      "Custom dashboard builder",
      "Priority support",
      "SOC 2, GDPR compliant",
      "API access",
      "Custom workflows",
    ],
  },
];

export default function PricingSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="pricing" ref={ref} className="py-36 px-6 relative overflow-hidden" style={{ background: "#fff6e5" }}>
      {/* Ambient glow */}
      <div className="ambient-glow ambient-glow-blue w-[500px] h-[500px] top-10 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="ambient-glow ambient-glow-coral w-[400px] h-[400px] bottom-0 right-0 translate-x-1/3" />

      {/* Decorative orbital rings */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full border border-[#00007f]/3 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full border border-[#fc8151]/3 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-24"
        >
          <p className="text-sm font-semibold tracking-[0.35em] uppercase text-[#fc8151] mb-5">
            Pricing
          </p>
          <h2 className="font-[Space_Grotesk] text-4xl md:text-6xl font-bold text-[#00007f] mb-6 leading-tight">
            Orbit at Your <span className="gradient-text">Scale</span>
          </h2>
          <p className="text-lg text-[#00007f]/45 max-w-2xl mx-auto">
            Flexible plans designed for teams of every size. 
            Start small and scale to planetary intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: index * 0.12, ease: [0.23, 1, 0.32, 1] }}
              className={`relative rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 group ${
                plan.popular
                  ? "md:-translate-y-4 glow-pulse"
                  : ""
              }`}
            >
              {plan.popular ? (
                /* Popular plan - glass-strong with gradient border */
                <div className="glass-strong rounded-3xl p-8 h-full relative overflow-hidden border-2 border-transparent"
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(32px) saturate(1.8)",
                  }}>
                  <div className="absolute inset-0 rounded-3xl opacity-60"
                    style={{
                      background: "linear-gradient(135deg, #00007f, #5c1380, #d6573c)",
                      padding: "2px",
                      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }} />
                  <div className="relative z-10">
                    {renderPlanContent(plan)}
                  </div>
                </div>
              ) : (
                /* Regular plan - glass card */
                <div className="glass-card rounded-3xl p-8 h-full relative overflow-hidden">
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10">
                    {renderPlanContent(plan)}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderPlanContent(plan: typeof plans[0]) {
  return (
    <>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-5 py-1.5 rounded-full text-xs font-bold text-white tracking-wider uppercase"
          style={{ background: "linear-gradient(135deg, #00007f, #5c1380, #d6573c)" }}>
          <Sparkles size={12} />
          Most Popular
        </div>
      )}

      <div className="mb-8">
        <h3 className="font-[Space_Grotesk] text-2xl font-bold text-[#00007f] mb-2">
          {plan.name}
        </h3>
        <p className="text-sm text-[#00007f]/40">{plan.description}</p>
      </div>

      <div className="mb-8 pb-8 border-b border-[#00007f]/5">
        <span className="font-[Space_Grotesk] text-5xl font-bold text-[#00007f]">
          {plan.price}
        </span>
        <span className="text-[#00007f]/40 text-lg">{plan.period}</span>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: "linear-gradient(135deg, rgba(0,0,127,0.08), rgba(92,19,128,0.08))" }}>
              <Check size={11} className="text-[#fc8151]" strokeWidth={2.5} />
            </div>
            <span className="text-sm text-[#00007f]/55">{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        className={`block w-full py-4 text-center rounded-full font-semibold transition-all duration-500 hover:scale-105 ${
          plan.gradient
            ? "text-white hover:shadow-xl hover:shadow-[#fc8151]/25"
            : "text-[#00007f] border-2 border-[#00007f]/10 hover:border-[#fc8151]/30 hover:bg-[#fc8151]/5"
        }`}
        style={
          plan.gradient
            ? { background: "linear-gradient(135deg, #00007f 0%, #5c1380 50%, #d6573c 100%)" }
            : undefined
        }
      >
        {plan.cta}
      </a>
    </>
  );
}
