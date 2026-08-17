/**
 * Showcase Section - Grand Masters Infinite Logo Ticker (Platform Page)
 * Features frosted glass transparent overlay directly ON the person's card when hovered,
 * automatic disappearance on cursor leave, manual left/right slider controls,
 * and continuous infinite auto-scrolling loop covering all 11 Agile Labs leaders.
 * Theme: Signature Warm Cream (#fff6e5) matching AXI platform design system.
 */
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Info,
  Award,
  ShieldCheck,
  UserCheck
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  tag: string;
  category: string;
  image: string;
  experience: string;
  highlight: string;
  shortBio: string;
  details: string[];
}

const teamMembers: TeamMember[] = [
  {
    id: "sabarish",
    name: "Sabarish Santhanam",
    title: "CTO & Founder, Agile Labs",
    tag: "The Whizz Kid",
    category: "Leadership",
    image: "/team/sabarish.png",
    experience: "25+ Years Experience",
    highlight: "Architected US Patent #8539460",
    shortBio: "Envisaged and developed the core US-Patented Axpert™ platform from desktop to high-scale cloud environments.",
    details: [
      "Architected US Patent RAD Platform",
      "25+ Years Enterprise Low-Code Innovation",
      "Spearheaded Axpert Cloud Engine"
    ]
  },
  {
    id: "jayavanth",
    name: "Jayavanth Vajram",
    title: "Co-Founder, Agile Labs",
    tag: "The Curious Learner",
    category: "Leadership",
    image: "/team/jayavanth.png",
    experience: "25+ Years Experience",
    highlight: "Strategic Executive Pillar & Growth",
    shortBio: "Key strategic pillar driving enterprise business expansion, brand equity, and commercial growth.",
    details: [
      "Co-Founder of Agile Labs",
      "Director at Kwality Confectionery Group",
      "EdTech & Software Business Pioneer"
    ]
  },
  {
    id: "chandrashekar",
    name: "Chandrashekar Gopalan",
    title: "Director & Board Member",
    tag: "The Insightful Samaritan",
    category: "Leadership",
    image: "/team/chandrashekar.png",
    experience: "30+ Years Experience",
    highlight: "Governance & Social Education",
    shortBio: "Majority shareholder driving corporate governance, strategic expansion, and educational philanthropy.",
    details: [
      "Majority Shareholder & Director",
      "Enterprise Strategy & Governance",
      "Philanthropist & Social Educator"
    ]
  },
  {
    id: "vishwanatha",
    name: "Vishwanatha HV",
    title: "Business Head – ERP Solutions",
    tag: "The ERP Dazzler",
    category: "Business",
    image: "/team/vishwanatha.png",
    experience: "20+ Years Experience",
    highlight: "Heads Enterprise ERP Delivery",
    shortBio: "Techno-commercial leader who established Axpert as dominant ERP software across African & international markets.",
    details: [
      "Heads Enterprise ERP Delivery",
      "Established Axpert across African Markets",
      "Expert in Trading, Mfg & Supply Chain"
    ]
  },
  {
    id: "bijaya",
    name: "Bijaya Singh",
    title: "Business Head – E-Government",
    tag: "The E-Gov Specialist",
    category: "Business",
    image: "/team/bijaya.png",
    experience: "15+ Years Experience",
    highlight: "SKOCH Smart Governance Winner",
    shortBio: "Instituted Agile's public sector division managing government procurements and state skill tracking.",
    details: [
      "Instituted E-Gov Practice at Agile",
      "SKOCH Award Winner for Smart Governance",
      "Public Sector Procurement Specialist"
    ]
  },
  {
    id: "vaidhees",
    name: "Vaidheeswaran Bharathy",
    title: "Business Head – Defence Vertical",
    tag: "The Defence Maestro",
    category: "Business",
    image: "/team/vaidhees.png",
    experience: "25+ Years Experience",
    highlight: "Strategic Defence Systems Architect",
    shortBio: "25+ years engineering mission-critical software for high-security defence, manufacturing, and inventory systems.",
    details: [
      "Heads Strategic Defence Vertical",
      "Mission-Critical Software Expert",
      "High-Security Systems Architect"
    ]
  },
  {
    id: "unni",
    name: "Ganga K Unni",
    title: "Technical Head – Product Dev",
    tag: "The Tech Phenomenon",
    category: "Product",
    image: "/team/unni.png",
    experience: "25+ Years Experience",
    highlight: "Axpert Kernel & Mobile Teams Lead",
    shortBio: "Leads Web and Mobile engineering teams delivering Axpert standard presentation layer, REST services & microservices.",
    details: [
      "Manages Axpert Kernel & Presentation",
      "Leads Web & Mobile Engineering Teams",
      "Microservices Architecture Lead"
    ]
  },
  {
    id: "dhurga",
    name: "Dhurgavathi N",
    title: "Product Manager – Core Engine",
    tag: "The Core Wizard",
    category: "Product",
    image: "/team/dhurga.png",
    experience: "18+ Years Experience",
    highlight: "Axpert Core Engine Chief Developer",
    shortBio: "Chief full-stack developer responsible for Axpert core engine, Object-Oriented Design, and developer toolkits.",
    details: [
      "Chief Developer for Axpert Core",
      "18+ Yrs Full-Stack Engineering Mastery",
      "Architect of Axpert Developer Tools"
    ]
  },
  {
    id: "jeyram",
    name: "Jeyram S R",
    title: "Product Manager – Applications",
    tag: "The Solution Guru",
    category: "Product",
    image: "/team/jeyram.png",
    experience: "20+ Years Experience",
    highlight: "Architected Solutions for 50+ MNCs",
    shortBio: "Applications Solution Architect with 20+ years experience architecting ERP, supply chain, and HR solutions globally.",
    details: [
      "Architected Solutions for 50+ MNCs",
      "Expert in Supply Chain & Enterprise Systems",
      "20+ Years Domain & Database Mastery"
    ]
  },
  {
    id: "senthil",
    name: "Senthil Nathan S",
    title: "Product Lead – Applications",
    tag: "The Alpha Geek",
    category: "Product",
    image: "/team/senthil.png",
    experience: "12+ Years Experience",
    highlight: "Cloud & Mobile Solution Architect",
    shortBio: "12+ years experience delivering cloud and on-premise solutions across manufacturing, banking, and e-governance.",
    details: [
      "12+ Years Application Architecture",
      "Cloud & Mobile Deployment Lead",
      "Cross-Industry Database Architect"
    ]
  },
  {
    id: "pandi",
    name: "Pandi Marckandan",
    title: "Product Lead – Applications",
    tag: "The Master Builder",
    category: "Product",
    image: "/team/pandi.png",
    experience: "10+ Years Experience",
    highlight: "Process Mfg, POS & Inventory Lead",
    shortBio: "Builds domain-specific solutions in process manufacturing, retail POS, inventory management, and sales distribution.",
    details: [
      "Specialist in Process Mfg & POS",
      "10+ Years Solution Engineering",
      "Inventory & Distribution Architect"
    ]
  }
];

export default function ShowcaseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [hoveredCardKey, setHoveredCardKey] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const scaleProgress = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.99]);
  const { ref, isVisible } = useScrollAnimation(0.1);

  // Triple array for infinite ticker loop
  const tickerItems = [...teamMembers, ...teamMembers, ...teamMembers];

  // Manual sliding handler
  const handleManualScroll = (direction: "left" | "right") => {
    setIsPaused(true);
    if (scrollTrackRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollTrackRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section
      ref={containerRef}
      className="-mt-8 sm:-mt-12 md:-mt-16 pt-4 sm:pt-6 md:pt-8 pb-16 md:pb-24 px-4 md:px-8 relative overflow-hidden font-body z-20"
      style={{ background: "#fff6e5" }}
    >
      {/* Ambient background orbital glow */}
      <div className="ambient-glow ambient-glow-blue w-[800px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={ref}>
        {/* Section Pill Badge & Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-8 md:mb-10"
        >

          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-[#00007f] tracking-tight mb-3">
            The Visionaries Behind Agile Labs
          </h2>
          <p className="text-sm md:text-base text-[#00007f]/70 max-w-2xl mx-auto font-medium">
            20+ years of US-Patented engineering mastery, domain leadership, and enterprise low-code innovation. Hover over any person to inspect bio overlay.
          </p>
        </motion.div>

        {/* Polished Glass Theatre Container with Manual & Auto Controls */}
        <motion.div
          style={{ y: parallaxY, scale: scaleProgress }}
          className="relative rounded-3xl overflow-hidden max-w-6xl mx-auto shadow-[0_20px_60px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.7)] border border-white/60 bg-white/40 backdrop-blur-2xl p-4 md:p-6 transition-all duration-500 group/container"
        >
          {/* Specular Light Reflection Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none rounded-3xl z-10" />

          {/* Manual Slider Navigation Buttons */}
          <button
            onClick={() => handleManualScroll("left")}
            aria-label="Slide Left"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-[#fc8151] text-[#00007f] hover:text-white border border-[#00007f]/20 flex items-center justify-center backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer z-30 opacity-90 hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => handleManualScroll("right")}
            aria-label="Slide Right"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-[#fc8151] text-[#00007f] hover:text-white border border-[#00007f]/20 flex items-center justify-center backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer z-30 opacity-90 hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Infinite Scroll Marquee & Manual Scroll Track */}
          <div
            ref={scrollTrackRef}
            className="overflow-x-auto no-scrollbar py-4 scroll-smooth [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false);
              setHoveredCardKey(null);
            }}
          >
            <motion.div
              animate={isPaused ? {} : { x: ["0%", "-33.333%"] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear"
                }
              }}
              className="flex items-center gap-6 whitespace-nowrap"
              style={{ willChange: "transform" }}
            >
              {tickerItems.map((member, index) => {
                const cardKey = `${member.id}-${index}`;
                const isHovered = hoveredCardKey === cardKey;

                return (
                  <div
                    key={cardKey}
                    className="shrink-0 w-72 md:w-80 group/card cursor-pointer relative"
                    onMouseEnter={() => {
                      setIsPaused(true);
                      setHoveredCardKey(cardKey);
                    }}
                    onMouseLeave={() => {
                      setHoveredCardKey(null);
                    }}
                  >
                    {/* BASE CARD CONTENT */}
                    <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#00007f]/10 shadow-md hover:shadow-2xl hover:border-[#fc8151] hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between h-[375px] relative overflow-hidden">
                      {/* Corner Accent Glow */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#fc8151]/15 to-transparent rounded-bl-full pointer-events-none" />

                      <div>
                        {/* Card Header: Tag & Experience */}
                        <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
                          <span className="px-2.5 py-1 rounded-full bg-[#fc8151] text-[#00007f] text-[10px] font-extrabold uppercase tracking-wider shadow-sm truncate max-w-[170px]">
                            "{member.tag}"
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#00007f]/5 border border-[#00007f]/10 text-[#00007f]/70 text-[10px] font-bold">
                            {member.experience}
                          </span>
                        </div>

                        {/* Headshot Image Avatar */}
                        <div className="relative w-24 h-24 mx-auto mb-4 rounded-full p-1 bg-gradient-to-tr from-[#00007f] via-[#5c1380] to-[#d6573c] shadow-lg group-hover/card:rotate-3 transition-transform duration-500">
                          <div className="w-full h-full rounded-full overflow-hidden bg-white">
                            <img
                              src={member.image}
                              alt={member.name}
                              loading="lazy"
                              className="w-full h-full object-cover object-top group-hover/card:scale-110 transition-transform duration-700"
                            />
                          </div>
                        </div>

                        {/* Info Block */}
                        <div className="text-center relative z-10">
                          <h3 className="text-base font-bold font-display text-[#00007f] group-hover/card:text-[#fc8151] transition-colors truncate">
                            {member.name}
                          </h3>
                          <p className="text-xs font-semibold text-[#fc8151] mt-0.5 truncate">
                            {member.title}
                          </p>
                        </div>
                      </div>

                      {/* Highlight Footer */}
                      <div className="pt-3 border-t border-[#00007f]/10 mt-3 relative z-10">
                        <div className="flex items-center justify-between text-[10px] font-bold text-[#fc8151]">
                          <span className="px-2 py-0.5 rounded bg-[#fc8151]/10 border border-[#fc8151]/20">
                            {member.category}
                          </span>
                        </div>
                      </div>

                      {/* DYNAMIC FROSTED GLASS OVERLAY — DIRECTLY ON THE PERSON */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                            className="absolute inset-0 z-30 p-5 rounded-2xl bg-gradient-to-b from-[#00007f]/95 via-[#00007f]/95 to-[#00007f]/98 backdrop-blur-2xl text-white border border-[#fc8151]/50 shadow-2xl flex flex-col justify-between whitespace-normal"
                          >
                            {/* Glass Overlay Top Header */}
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full p-0.5 bg-[#fc8151] shrink-0 overflow-hidden">
                                    <img
                                      src={member.image}
                                      alt={member.name}
                                      className="w-full h-full object-cover object-top rounded-full"
                                    />
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-white leading-tight truncate max-w-[140px]">
                                      {member.name}
                                    </h4>
                                    <p className="text-[10px] text-[#fc8151] font-semibold truncate max-w-[140px]">
                                      {member.title}
                                    </p>
                                  </div>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-[#fc8151] text-[#00007f] text-[9px] font-extrabold uppercase">
                                  "{member.tag}"
                                </span>
                              </div>

                              <p className="text-[11px] text-white/90 leading-relaxed font-medium mb-3 border-b border-white/10 pb-2">
                                {member.shortBio}
                              </p>

                              {/* Key Highlights List */}
                              <div className="space-y-1.5">
                                {member.details.map((detail, idx) => (
                                  <div key={idx} className="flex items-start gap-1.5 text-[10px] text-white/90">
                                    <CheckCircle2 className="w-3 h-3 text-[#fc8151] shrink-0 mt-0.5" />
                                    <span className="leading-tight">{detail}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Glass Overlay Bottom Footer */}
                            <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[10px]">
                              <span className="text-white/60 font-medium">Experience</span>
                              <span className="font-bold text-[#fc8151]">{member.experience}</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
