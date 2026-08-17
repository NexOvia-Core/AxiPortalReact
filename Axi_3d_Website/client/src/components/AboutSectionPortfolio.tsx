import React from "react";
import { motion } from "framer-motion";
import FadeIn from "./FadeIn";
import ContactButton from "./ContactButton";
import AnimatedCounter from "./AnimatedCounter";

interface AboutSectionPortfolioProps {
  onContactClick?: () => void;
}

export const AboutSectionPortfolio: React.FC<AboutSectionPortfolioProps> = ({ onContactClick }) => {
  // 4 Timeline items for Nearly Three Decades section
  const timelineMilestones = [
    {
      year: "27 Yrs Ago",
      title: "Agile Labs Founded",
      desc: "Enterprise software foundation established in 1999.",
      image: "/timeline_founded_1999.png",
      tag: "EST. 1999",
    },
    {
      year: "US Patent",
      title: "Axpert Low-Code Core Patented",
      desc: "Granted United States patent for additive low-code core engine.",
      image: "/timeline_us_patent.png",
      tag: "PATENT GRANTED",
    },
    {
      year: "Empanelled",
      title: "Approved Government Vendor",
      desc: "Empanelled across Indian government departments & public bodies.",
      image: "/timeline_government.png",
      tag: "GOVT APPROVED",
    },
    {
      year: "Today",
      title: "1,000,000+ Active Users",
      desc: "750+ enterprise implementations running daily.",
      image: "/timeline_today_scale.png",
      tag: "ENTERPRISE SCALE",
    },
  ];

  // 6 Compliance & Security Points split into two groups
  const complianceGroupA = [
    {
      title: "SOC 2 Compliant",
      desc: "Independently audited controls for security & confidentiality.",
      image: "/cert_soc2_security.png",
      badge: "SECURITY AUDITED",
    },
    {
      title: "Government Empanelled",
      desc: "Approved vendor across Indian public sector departments.",
      image: "/cert_government_empanelled.png",
      badge: "PUBLIC SECTOR",
    },
    {
      title: "State Data Center Certified",
      desc: "Safe-to-host certified for government data centers.",
      image: "/cert_state_datacenter.png",
      badge: "SDC CERTIFIED",
    },
  ];

  const complianceGroupB = [
    {
      title: "US Patented Technology",
      desc: "Axpert low-code core protected by granted US patent.",
      image: "/cert_us_patent.png",
      badge: "US PATENTED",
    },
    {
      title: "ISO & CMM Aligned",
      desc: "Security and process maturity aligned to global standards.",
      image: "/cert_iso_cmm.png",
      badge: "ISO ALIGNED",
    },
    {
      title: "27 Years of Stability",
      desc: "Nearly three decades of continuous enterprise trust.",
      image: "/cert_27_years_trust.png",
      badge: "27+ YEARS",
    },
  ];

  const statMetrics = [
    { value: 27, suffix: "+ Yrs", label: "Market Stability" },
    { value: 1000000, suffix: "+", label: "Active Users" },
    { value: 1, suffix: " Patent", label: "US Low-Code" },
    { value: 750, suffix: "+", label: "Deployments" },
  ];

  // Quadrupled arrays for smooth 100% infinite marquee loops
  const loopTimeline = [...timelineMilestones, ...timelineMilestones, ...timelineMilestones, ...timelineMilestones];
  const loopGroupA = [...complianceGroupA, ...complianceGroupA, ...complianceGroupA, ...complianceGroupA];
  const loopGroupB = [...complianceGroupB, ...complianceGroupB, ...complianceGroupB, ...complianceGroupB];

  return (
    <section id="about" className="w-full relative bg-[#fff6e5] text-[#1E1B4B] px-5 sm:px-8 md:px-10 py-24 flex flex-col justify-center overflow-hidden border-b border-[#1E1B4B]/10">

      {/* Background Decorative Ambient Glows */}
      <div className="ambient-glow ambient-glow-coral w-[500px] h-[500px] top-[5%] left-[-10%]" />
      <div className="ambient-glow ambient-glow-blue w-[600px] h-[600px] bottom-[10%] right-[-10%]" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10 w-full">

        {/* LEFT HAND SIDE: Main Text & Specs (Frameless, High-Contrast) */}
        <div className="lg:col-span-5 flex flex-col items-start text-left gap-6 pr-0 lg:pr-6">
          <FadeIn delay={0} y={20}>
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#00007f]/25 bg-[#00007f]/10 text-xs uppercase tracking-widest text-[#00007f] font-bold shadow-xs">
              WHY AGILE LABS
            </span>
          </FadeIn>

          <FadeIn delay={0.1} y={20}>
            <h2 className="font-[Space_Grotesk] text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-[#00007f] leading-tight">
              27 Years of Trust. <br />
              <span className="gradient-text">Proven at Government Scale.</span>
            </h2>
          </FadeIn>

          <motion.p initial=
            {{ opacity: 0, y: 20 }} animate=
            {{ opacity: 1, y: 0 }} transition=
            {{ duration: 0.8, delay: 0.8 }}
            className="text-base sm:text-lg md:text-xl text-[#00007f]/75 max-w-3xl mx-auto mb-10 leading-relaxed font-normal" >
            AXI is built by Agile Labs — 27 years of enterprise software behind it,
            a US-patented low-code core, and a track record that includes Indian government departments, state data centers,
            and over 1,00,000+ users running on the platform today.
          </motion.p>

          {/* 4 Stat Metrics Grid (Frameless - sitting directly on cream background with full contrast) */}
          <div className="grid grid-cols-2 gap-4 w-full pt-2">
            {statMetrics.map((m, idx) => (
              <div key={idx} className="flex flex-col gap-0.5 border-l-2 border-[#00007f] pl-3">
                <AnimatedCounter
                  value={m.value}
                  suffix={m.suffix}
                  duration={2.2}
                  className="text-2xl sm:text-3xl font-black hero-heading tracking-tight"
                />
                <span className="text-xs text-[#1E1B4B] uppercase tracking-wider font-bold">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT HAND SIDE: Auto Sliding Loop Animated Slides (Frameless, NO Shadow/Faded Masks) */}
        <div className="lg:col-span-7 w-full flex flex-col gap-6 overflow-hidden relative">

          {/* SECTION 1 TICKER ROW: Nearly Three Decades Timeline Slides (Slides LEFT) */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#fc8151] pl-2">
              HISTORICAL TIMELINE — NEARLY THREE DECADES
            </span>
            <div className="w-full overflow-hidden flex">
              <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  ease: "linear",
                  duration: 25,
                  repeat: Infinity,
                }}
                className="flex gap-5 items-center flex-nowrap w-max"
              >
                {loopTimeline.map((item, idx) => (
                  <div
                    key={`timeline-${item.year}-${idx}`}
                    className="w-[270px] sm:w-[300px] flex-shrink-0 flex items-center gap-3.5 p-3 rounded-2xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-transparent flex-shrink-0 p-1 flex items-center justify-center">
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain filter drop-shadow-md" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-mono font-bold text-[#fc8151] uppercase tracking-wider">{item.tag}</span>
                      <h4 className="text-xs font-black text-[#1E1B4B] uppercase leading-tight">{item.title}</h4>
                      <p className="text-[11px] text-[#373e79] font-normal leading-snug line-clamp-2">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* SECTION 2 TICKER ROW 1: Certified & Compliant Group A (Slides RIGHT) */}
          <div className="flex flex-col gap-2 pt-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00007f] pl-2">
              ENTERPRISE SECURITY & AUDIT COMPLIANCE
            </span>
            <div className="w-full overflow-hidden flex">
              <motion.div
                animate={{ x: ["-50%", "0%"] }}
                transition={{
                  ease: "linear",
                  duration: 28,
                  repeat: Infinity,
                }}
                className="flex gap-5 items-center flex-nowrap w-max"
              >
                {loopGroupA.map((item, idx) => (
                  <div
                    key={`groupA-${item.title}-${idx}`}
                    className="w-[270px] sm:w-[300px] flex-shrink-0 flex items-center gap-3.5 p-3 rounded-2xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-transparent flex-shrink-0 p-1 flex items-center justify-center">
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain filter drop-shadow-md" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-mono font-bold text-[#00007f] uppercase bg-[#00007f]/15 px-2 py-0.5 rounded-full w-max">
                        {item.badge}
                      </span>
                      <h4 className="text-xs font-black text-[#1E1B4B] uppercase leading-tight mt-0.5">{item.title}</h4>
                      <p className="text-[11px] text-[#373e79] font-normal leading-snug line-clamp-2">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* SECTION 2 TICKER ROW 2: Certified & Compliant Group B (Slides LEFT) */}
          <div className="w-full overflow-hidden flex">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                ease: "linear",
                duration: 27,
                repeat: Infinity,
              }}
              className="flex gap-5 items-center flex-nowrap w-max"
            >
              {loopGroupB.map((item, idx) => (
                <div
                  key={`groupB-${item.title}-${idx}`}
                  className="w-[270px] sm:w-[300px] flex-shrink-0 flex items-center gap-3.5 p-3 rounded-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="w-16 h-16 rounded-2xl bg-transparent flex-shrink-0 p-1 flex items-center justify-center">
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain filter drop-shadow-md" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-mono font-bold text-[#fc8151] uppercase bg-[#fc8151]/15 px-2 py-0.5 rounded-full w-max">
                      {item.badge}
                    </span>
                    <h4 className="text-xs font-black text-[#1E1B4B] uppercase leading-tight mt-0.5">{item.title}</h4>
                    <p className="text-[11px] text-[#373e79] font-normal leading-snug line-clamp-2">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutSectionPortfolio;
