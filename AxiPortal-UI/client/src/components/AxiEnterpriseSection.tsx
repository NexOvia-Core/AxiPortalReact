import React, { useState } from "react";
import FadeIn from "./FadeIn";
import ContactButton from "./ContactButton";

interface AxiEnterpriseSectionProps {
  onContactClick?: () => void;
}

export const AxiEnterpriseSection: React.FC<AxiEnterpriseSectionProps> = ({ onContactClick }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const capabilities = [
    {
      id: "01",
      title: "Integrated Inventory & MRP",
      subtitle: "Every item accounted for, every order fulfilled right",
      desc: "Live, location-wise stock with batch tracking, FIFO / weighted-average valuation, and real-time reserve / buy / produce / transfer decisions.",
      features: [
        "Live, Multi-Location Stock across RM, SFG, FG & Consumables",
        "Smart Auto-Allocation (First Come, First Served + Reallocation)",
        "Flexible Fulfilment: Produce, Procure, Subcontract, or Transfer",
        "Multi-Level BOM (Master or Order-wise effective dates)",
        "Supplier Intelligence & Command-Line Lookup",
      ],
    },
    {
      id: "02",
      title: "Production & Manufacturing",
      subtitle: "Discrete & Process Plant Execution",
      desc: "Multi-level BOM, routing, work orders, sub-contracting, and batch-wise costing for discrete or process plants.",
      features: [
        "Work Orders & Subcontractor Auto-Generation",
        "Stock Reservation & Release Tracking",
        "Batch-wise & Lot-level Cost Accounting",
        "Routing & Machine Work Centre Capacity",
        "Quality Control Gates (Raw Material to Final FG)",
      ],
    },
    {
      id: "03",
      title: "Built-In AI Engine",
      subtitle: "Decisions, Not Dashboards You Have to Interpret",
      desc: "AXI is AI-assisted from the ground up. Reads live POs, stock ledgers, and approvals to drive automated insights.",
      features: [
        "Conversational Search & 360° Recall across all records",
        "Predictive Demand Planning & Stockout Prevention",
        "Intelligent Workflow Routing based on live conditions",
        "Anomaly & Risk Detection (Vendor rejection, price spikes)",
        "Multi-LLM Support: Choice of GPT-4, Claude, Gemini, or On-Prem",
      ],
    },
    {
      id: "04",
      title: "Patented Low-Code Core",
      subtitle: "Powered by Axpert (US Patent Granted)",
      desc: "Every form, rule, and workflow is a configurable structure -- AXI bends instead of breaking when your business scales.",
      features: [
        "Configure fields & validation rules in-house in days",
        "Additive low-code structures that never break existing logic",
        "~50% less development effort than traditional coding",
        "Built-in audit trail and version control as standard",
        "Sovereign On-Premise or Cloud Hosting options",
      ],
    },
  ];

  const statMetrics = [
    { value: "27+", label: "Years of Trust & Stability" },
    { value: "1,000,000+", label: "Active Users on Platform" },
    { value: "750+", label: "Enterprise Implementations" },
    { value: "US Patent", label: "Granted Low-Code Core" },
  ];

  return (
    <section className="w-full bg-[#fff6e5] text-[#1E1B4B] py-24 px-5 sm:px-8 md:px-10 border-t border-[#1E1B4B]/10 relative z-20">
      <div className="max-w-6xl mx-auto flex flex-col gap-20">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-6">
          <FadeIn delay={0} y={30}>
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#1E1B4B]/20 text-xs sm:text-sm uppercase tracking-widest text-[#1E1B4B]/80 font-medium">
              AXI Enterprise Platform -- Powered by Axpert
            </span>
          </FadeIn>

          <FadeIn delay={0.1} y={30}>
            <h2 className="font-[Space_Grotesk] text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-[#00007f] max-w-4xl leading-tight">
              Enterprise Depth. <br />
              <span className="gradient-text">Low-Code Speed.</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.2} y={30}>
            <p className="text-base sm:text-lg md:text-xl font-light text-[#1E1B4B]/80 max-w-2xl">
              The one platform that goes as deep as enterprise-grade systems -- without the cost, the wait, or the cage.
            </p>
          </FadeIn>
        </div>

        {/* Interactive Capability Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tab Selection */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {capabilities.map((cap, idx) => (
              <button
                key={cap.id}
                onClick={() => setActiveTab(idx)}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-start gap-5 cursor-pointer ${
                  activeTab === idx
                    ? "bg-[#1E1B4B]/10 border-[#1E1B4B] shadow-xl"
                    : "bg-white/80 border-[#1E1B4B]/10 hover:border-[#1E1B4B]/30 text-[#1E1B4B]/70 shadow-sm"
                }`}
              >
                <span className="font-black text-2xl text-[#1E1B4B]">{cap.id}</span>
                <div className="flex flex-col gap-1">
                  <h4 className="font-bold text-lg text-[#1E1B4B] uppercase">{cap.title}</h4>
                  <p className="text-xs text-[#1E1B4B]/70">{cap.subtitle}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Tab Display Panel */}
          <div className="lg:col-span-7 bg-white border-2 border-[#1E1B4B]/20 rounded-3xl p-6 sm:p-10 flex flex-col justify-between min-h-[420px] shadow-2xl">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-[#1E1B4B]/10 pb-4">
                <span className="text-xs uppercase tracking-widest text-[#1E1B4B]/60 font-mono font-semibold">
                  Module Capability Spec
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 uppercase font-semibold">
                  Live Enterprise Ready
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[#1E1B4B] uppercase">
                {capabilities[activeTab].title}
              </h3>

              <p className="text-base sm:text-lg text-[#1E1B4B]/80 font-light leading-relaxed">
                {capabilities[activeTab].desc}
              </p>

              <div className="flex flex-col gap-3 mt-2">
                <h5 className="text-xs uppercase tracking-wider text-[#1E1B4B] font-semibold opacity-70">
                  Key Capabilities Included:
                </h5>
                {capabilities[activeTab].features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-[#1E1B4B]">
                    <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-[#1E1B4B]/10 flex items-center justify-between">
              <span className="text-xs text-[#1E1B4B]/60 uppercase tracking-widest font-semibold">
                Agile Labs Low-Code Core
              </span>
              <ContactButton label="Schedule Demo" onClick={onContactClick} />
            </div>
          </div>
        </div>

        {/* 4 Stat Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10">
          {statMetrics.map((m, idx) => (
            <FadeIn key={idx} delay={idx * 0.1} y={20} className="bg-white border border-[#1E1B4B]/15 rounded-2xl p-6 flex flex-col items-center text-center gap-2 hover:border-[#1E1B4B]/40 transition-colors shadow-md">
              <span className="text-3xl sm:text-4xl font-black hero-heading uppercase tracking-tight">
                {m.value}
              </span>
              <span className="text-xs sm:text-sm text-[#1E1B4B]/70 uppercase tracking-wider font-light">
                {m.label}
              </span>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AxiEnterpriseSection;
