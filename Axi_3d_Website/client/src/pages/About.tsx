/**
 * Axi Platform - About Us Page
 * Comprehensive overview of Agile Labs & Axpert Low-Code Platform
 * Covers Company History, Vision/Mission/Values, Awards, Verticals, Case Studies, Contact Info, and Team Members.
 * Style: Signature Axi Glassmorphism with dark blue gradient & coral accents (#00007f, #fc8151)
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import ShowcaseSection from "@/components/ShowcaseSection";
import {
  Award,
  ShieldCheck,
  Users,
  Target,
  Rocket,
  Globe,
  Zap,
  Cpu,
  Sparkles,
  Building2,
  ChevronRight,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Briefcase,
  Heart,
  Lightbulb,
  X,
  FileText,
  Clock,
  Layers,
  ArrowRight,
  Star
} from "lucide-react";

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  tag: string;
  category: "Leadership" | "Business" | "Product";
  image: string;
  experience: string;
  bio: string;
  highlights: string[];
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
    bio: "A connoisseur in creating, implementing, and selling enterprise software products. Entrepreneur with 25+ years of experience and the visionary founder of Agile Labs. He envisaged and developed the core US-patented Axpert™ platform from the ground up, administering its evolution from desktop to web and high-scale cloud environments.",
    highlights: [
      "Architected US Patent #8539460 RAD Platform",
      "25+ Years Enterprise Low-Code Innovation",
      "Spearheaded Axpert Cloud Architecture"
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
    bio: "Co-Founder of Agile Labs and key strategic pillar driving business expansion. Also serves as Director of India's premier confectionery brand 'Kwality' and operates Onlineguru Education Service Pvt Ltd. He brings multifaceted executive leadership and market acquisition strategy to the company.",
    highlights: [
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
    bio: "Director and majority shareholder of Agile Labs. A passionate advocate for sustainable corporate development and social responsibility, he actively runs two non-profit educational institutions providing tuition-free schooling to underprivileged children.",
    highlights: [
      "Majority Shareholder & Director",
      "Enterprise Strategy & Corporate Governance",
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
    bio: "Computer Science Engineering graduate and seasoned techno-commercial leader with over two decades of expertise architecting, building, and deploying mission-critical enterprise programs. He established Axpert as a dominant ERP software across the African continent and oversees international ERP delivery.",
    highlights: [
      "Heads Enterprise ERP Delivery",
      "Established Axpert across African Markets",
      "Expert in Trading, Mfg & Supply Chain"
    ]
  },
  {
    id: "bijaya",
    name: "Bijaya Singh",
    title: "Business Head – E-Government",
    tag: "The E-Government Specialist",
    category: "Business",
    image: "/team/bijaya.png",
    experience: "15+ Years Experience",
    bio: "Master's degree holder in Sales & Marketing leading the E-Government practice at Agile Labs. She instituted Agile's public sector division and manages complex government procurements, stakeholder expectations, and large-scale state skill development deployments.",
    highlights: [
      "Instituted E-Gov Practice at Agile",
      "SKOCH Award Winner for Smart Governance",
      "End-to-End Public Sector Procurement Expert"
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
    bio: "Oversees end-to-end Defence and strategic sector solutions. Over 25 years of experience engineering software for mission-critical and high-security environments, combining deep database architecture with manufacturing, inventory, and finance systems.",
    highlights: [
      "Heads Strategic Defence Vertical",
      "25+ Years Mission-Critical Software Experience",
      "Database & High-Security Systems Specialist"
    ]
  },
  {
    id: "unni",
    name: "Ganga K Unni",
    title: "Technical Head – Product Development",
    tag: "The Tech Phenomenon",
    category: "Product",
    image: "/team/unni.png",
    experience: "25+ Years Experience",
    bio: "Post Graduate in Mathematics and Computer Applications serving as Senior Technical Product Manager. Leads the Web and Mobile engineering teams delivering Axpert's standard presentation layer, REST services, web servers, microservices architecture, and kernel performance.",
    highlights: [
      "Manages Axpert Kernel & Presentation Layer",
      "Leads Web & Mobile Engineering Teams",
      "Microservices & Design Patterns Specialist"
    ]
  },
  {
    id: "dhurga",
    name: "Dhurgavathi N",
    title: "Product Manager – Axpert Core & Kernel",
    tag: "The Core Wizard",
    category: "Product",
    image: "/team/dhurga.png",
    experience: "18+ Years Experience",
    bio: "Master's degree in Computer Science and chief full-stack developer responsible for the Axpert core engine and developer tools. She possesses nearly two decades of programming mastery in Object-Oriented Design, Microservices, and Axpert Kernel mechanics.",
    highlights: [
      "Chief Developer for Axpert Core Engine",
      "18+ Years Full-Stack Engineering Mastery",
      "Architect of Axpert Developer Tools"
    ]
  },
  {
    id: "jeyram",
    name: "Jeyram S R",
    title: "Product Manager – Applications & Solutions",
    tag: "The Solution Guru",
    category: "Product",
    image: "/team/jeyram.png",
    experience: "20+ Years Experience",
    bio: "Master's degree in Physics and Applications Solution Architect with over 20 years of experience architecting ERP, supply chain, e-government, and HR solutions for over 50 Multinational Corporations globally.",
    highlights: [
      "Architected Solutions for 50+ MNCs",
      "Expert in Supply Chain & Enterprise Systems",
      "20+ Years Domain & Database Mastery"
    ]
  },
  {
    id: "senthil",
    name: "Senthil Nathan S",
    title: "Product Lead – Application Solutions",
    tag: "The Alpha Geek",
    category: "Product",
    image: "/team/senthil.png",
    experience: "12+ Years Experience",
    bio: "Master's in Software Engineering and Application Solution Architect with 12+ years of experience delivering cloud and on-premise solutions across manufacturing, banking, e-governance, and mobile platforms.",
    highlights: [
      "12+ Years Application Architecture",
      "Cloud & Mobile Solution Deployment Lead",
      "Cross-Industry Database Architect"
    ]
  },
  {
    id: "pandi",
    name: "Pandi Marckandan",
    title: "Product Lead – Application Solutions",
    tag: "The Master Builder",
    category: "Product",
    image: "/team/pandi.png",
    experience: "10+ Years Experience",
    bio: "Engineering graduate and Agile Application Architect with over a decade of technical expertise. He builds domain-specific solutions in process manufacturing, retail POS, inventory management, and sales distribution.",
    highlights: [
      "Specialist in Process Mfg & POS",
      "10+ Years Solution Engineering",
      "Inventory & Distribution Architect"
    ]
  }
];

const timelineEvents = [
  {
    year: "2011",
    title: "Enterprise Deployment Milestone",
    desc: "Deployed Axpert across major large-scale industrial and commercial enterprises across Asia.",
    badge: "Scale Era"
  },
  {
    year: "2012",
    title: "Global Market Expansion",
    desc: "Penetrated international markets across Middle East, Africa, and APAC regions with enterprise ERP suites.",
    badge: "Global Growth"
  },
  {
    year: "2013",
    title: "US Patent #8539460 Granted",
    desc: "Awarded US Patent for Rapid Application Development (RAD) platform architecture, validating Axpert core innovation.",
    badge: "Patent Recognized"
  },
  {
    year: "2014",
    title: "North America Footprint",
    desc: "Acquired marquee corporate customers in USA & Canada, establishing cross-continental operational support.",
    badge: "Transatlantic"
  },
  {
    year: "2017",
    title: "Axpert Cloud Initiated",
    desc: "Conceived and engineered Axpert on Cloud architecture to support cloud-native low-code deployments.",
    badge: "Cloud Genesis"
  },
  {
    year: "2019",
    title: "Axpert 10 Cloud Release",
    desc: "Launched Axpert 10 on Cloud with multi-tenant microservices, automated APIs, and real-time scalability.",
    badge: "Next Gen"
  },
  {
    year: "2021+",
    title: "Agile Cloud Ecosystem",
    desc: "Rolled out full-suite Agile Cloud platform empowering businesses to create complex solutions faster than ever.",
    badge: "Full Ecosystem"
  }
];

const awardsList = [
  {
    title: "Best Health Information Platform",
    year: "2018",
    location: "New Delhi",
    org: "E-health magazine at Health & Wellness Summit",
    desc: "Recognized for innovative healthcare information processing and hospital management systems.",
    icon: Award
  },
  {
    title: "SKOCH Award for Smart Governance",
    year: "2017",
    location: "India",
    org: "SKOCH Group",
    desc: "Awarded for the State Rural Skill Development project empowering government skill tracking.",
    icon: ShieldCheck
  },
  {
    title: "Medicall Expo Showcase",
    year: "2017",
    location: "Chennai",
    org: "India's Largest Medical Equipment Exhibition",
    desc: "Demonstrated cutting-edge health informatics and hospital operation platforms.",
    icon: Star
  },
  {
    title: "Arab Health Expo Participation",
    year: "2017",
    location: "Dubai",
    org: "Arab Health Congress",
    desc: "Showcased innovative medical & pharmaceutical application suites to international delegates.",
    icon: Globe
  },
  {
    title: "US Patent #8539460 Granted",
    year: "2013",
    location: "USA",
    org: "US Patent Office",
    desc: "Patented the foundational concept behind Axpert Rapid Application Development platform.",
    icon: Zap
  }
];

const verticalsList = [
  { name: "Healthcare & HMS", desc: "Patient management, clinical workflows & EHR platforms", icon: "🏥" },
  { name: "Banking & Financials", desc: "Core transaction engines, audit trails & reporting", icon: "🏦" },
  { name: "Supply Chain", desc: "End-to-end procurement, vendor management & P2P", icon: "📦" },
  { name: "Government & Defence", desc: "High-security governance, skill tracking & defence IT", icon: "🛡️" },
  { name: "People Services", desc: "HR, payroll, skill development & workforce planning", icon: "👥" },
  { name: "Logistics & Freight", desc: "Shipment tracking, fleet management & clearing", icon: "🚚" },
  { name: "Manufacturing & Tea", desc: "Process manufacturing, tea estate ERP & POS systems", icon: "🏭" },
];

const caseStudiesList = [
  {
    name: "Dilmah Tea",
    category: "Global Supply Chain & Plantations",
    desc: "Unified tea plantation ERP, inventory tracking, and international export logistics.",
    url: "https://agile-labs.com/case-studies/duplicated-bidhannagar-commissionerate-1116/"
  },
  {
    name: "Bangalore Metro Rail Corporation (BMRCL)",
    category: "Infrastructure & Operations",
    desc: "Streamlined metro infrastructure assets, operations, and maintenance workflows.",
    url: "https://agile-labs.com/case-studies/bangalore-metro-rail-corporation-limited/"
  },
  {
    name: "Kauvery Group of Hospitals",
    category: "Multi-Center Healthcare",
    desc: "Integrated hospital management system across multiple multi-specialty care centers.",
    url: "https://agile-labs.com/case-studies/kauvery-group-of-hospitals/"
  },
  {
    name: "Bidhannagar Commissionerate",
    category: "Public Governance & Safety",
    desc: "Automated e-governance solutions for law enforcement and municipal administration.",
    url: "https://agile-labs.com/case-studies/bidhannagar-commissionerate/"
  }
];

export default function About() {
  const [activeTab, setActiveTab] = useState<"All" | "Leadership" | "Business" | "Product">("All");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const filteredMembers = teamMembers.filter((m) =>
    activeTab === "All" ? true : m.category === activeTab
  );

  return (
    <div className="min-h-screen bg-[#00007f] text-white selection:bg-[#fc8151] selection:text-white relative overflow-hidden font-body">
      <ScrollProgress />
      <Navigation />

      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] rounded-full bg-gradient-to-b from-[#00007f] via-[#fc8151]/15 to-transparent blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#00007f]/40 blur-[180px] pointer-events-none -z-10" />

      {/* 1. HERO SECTION */}
      <section className="pt-36 pb-20 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#fc8151] text-xs font-semibold uppercase tracking-widest mb-8"
        >
          <Sparkles className="w-4 h-4 animate-pulse text-[#fc8151]" />
          Pioneering Low-Code Innovation Since 2003
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight text-white leading-[1.1] mb-6 max-w-5xl mx-auto"
        >
          Architecting the Future of{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#fc8151] via-[#ffb25d] to-white">
            Enterprise Agility
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-12"
        >
          Agile Labs powers global enterprises with <strong className="text-white">Axpert™</strong>, 
          the US-Patented low-code application development platform designed to build, scale, and transform mission-critical business applications at unprecedented speed.
        </motion.p>

        {/* Hero Quick CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#team"
            className="px-8 py-3.5 rounded-full text-sm font-semibold bg-gradient-to-r from-[#fc8151] to-[#ffb25d] text-[#00007f] hover:scale-105 transition-all duration-300 shadow-lg shadow-[#fc8151]/20 flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Meet the Team
          </a>
          <a
            href="#vision"
            className="px-8 py-3.5 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all duration-300 flex items-center gap-2"
          >
            <Target className="w-4 h-4 text-[#fc8151]" />
            Vision & Values
          </a>
          <a
            href="#timeline"
            className="px-8 py-3.5 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all duration-300 flex items-center gap-2"
          >
            <Clock className="w-4 h-4 text-[#fc8151]" />
            Milestones
          </a>
        </motion.div>
      </section>

      {/* 2. STATS BAR */}
      <section className="py-12 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Years Experience", value: "20+", sub: "Continuous Tech Mastery" },
            { label: "Global Clients", value: "500+", sub: "Enterprise Companies" },
            { label: "Active Users", value: "40K+", sub: "Daily Power Users" },
            { label: "Global Presence", value: "10+", sub: "Countries Deployed" },
            { label: "Apps Created", value: "1,000+", sub: "Custom Solutions" },
            { label: "US Patent RAD", value: "#8539460", sub: "Proprietary Architecture" }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#fc8151]/40 transition-all duration-300 text-center group"
            >
              <div className="text-2xl lg:text-3xl font-bold font-display text-[#fc8151] group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-white/90 mt-1">{stat.label}</div>
              <div className="text-[10px] text-white/40 mt-0.5">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. CORPORATE IDENTITY: VISION, MISSION, VALUES */}
      <section id="vision" className="py-20 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-4">
            Driven by Purpose & Excellence
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Our core mission and principles shape every line of code in Axpert and every partnership we build.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/15 relative overflow-hidden group hover:border-[#fc8151]/50 transition-all duration-500"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#fc8151]/20 flex items-center justify-center text-[#fc8151] mb-6 group-hover:scale-110 transition-transform">
              <Rocket className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-3">Our Vision</h3>
            <p className="text-white/70 leading-relaxed text-sm">
              To transform into a global leader in low code technology, redefining how enterprises worldwide construct software with agility, resilience, and speed.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/15 relative overflow-hidden group hover:border-[#fc8151]/50 transition-all duration-500"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#fc8151]/20 flex items-center justify-center text-[#fc8151] mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-3">Our Mission</h3>
            <p className="text-white/70 leading-relaxed text-sm">
              To empower our customers to take on new challenges in highly competitive landscapes by delivering responsive tech armors that accelerate business growth.
            </p>
          </motion.div>

          {/* Core Ethos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/15 relative overflow-hidden group hover:border-[#fc8151]/50 transition-all duration-500"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#fc8151]/20 flex items-center justify-center text-[#fc8151] mb-6 group-hover:scale-110 transition-transform">
              <Lightbulb className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-3">Agility & Innovation</h3>
            <p className="text-white/70 leading-relaxed text-sm">
              In a world of constant technological shifts, Agile Labs remains adaptable, turning complex business workflows into simple, elegant cloud solutions.
            </p>
          </motion.div>
        </div>

        {/* Core Values Pill Grid */}
        <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 text-center">
          <h4 className="text-lg font-semibold text-[#fc8151] uppercase tracking-wider mb-6">
            The Core Values of Agile Labs
          </h4>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { title: "Integrity", desc: "Uncompromising honesty & transparency in every line of code and relationship", icon: ShieldCheck },
              { title: "Passion", desc: "Relentless obsession with engineering low-code breakthroughs", icon: Heart },
              { title: "Team-Work", desc: "Collaborative synergy between engineering, product & vertical domain experts", icon: Users },
              { title: "Accountability", desc: "Total ownership of client success and system reliability", icon: CheckCircle2 },
              { title: "Commitment", desc: "Long-term dedication to long-standing enterprise partnerships", icon: Award }
            ].map((value) => (
              <div
                key={value.title}
                className="px-6 py-3.5 rounded-2xl bg-white/10 border border-white/15 hover:border-[#fc8151] transition-all flex items-center gap-3 text-left max-w-xs"
              >
                <value.icon className="w-5 h-5 text-[#fc8151] shrink-0" />
                <div>
                  <div className="text-sm font-bold text-white">{value.title}</div>
                  <div className="text-[11px] text-white/50">{value.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HISTORICAL JOURNEY & TIMELINE */}
      <section id="timeline" className="py-20 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fc8151]/20 text-[#fc8151] text-xs font-semibold mb-3">
            <Clock className="w-3.5 h-3.5" />
            Our Journey
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-4">
            Two Decades of Breakthroughs
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            From desktop platforms to enterprise cloud microservices, see how Axpert has evolved.
          </p>
        </div>

        <div className="relative border-l border-white/15 ml-4 md:ml-32 pl-6 md:pl-10 space-y-12">
          {timelineEvents.map((evt, idx) => (
            <motion.div
              key={evt.year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Year badge indicator */}
              <div className="absolute -left-[31px] md:-left-[53px] top-1.5 w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#00007f] border-2 border-[#fc8151] flex items-center justify-center text-[#fc8151] font-bold text-xs group-hover:scale-125 transition-transform" />

              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#fc8151]/50 transition-all duration-300 max-w-3xl">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-2xl font-bold font-display text-[#fc8151]">{evt.year}</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium">
                    {evt.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{evt.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{evt.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. AWARDS & INDUSTRY RECOGNITIONS */}
      <section className="py-20 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fc8151]/20 text-[#fc8151] text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5" />
            Accolades & Patents
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-4">
            Recognized Excellence
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Honored by international bodies and governments for smart governance and low-code patent innovation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awardsList.map((award, i) => (
            <motion.div
              key={award.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/15 hover:border-[#fc8151] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#fc8151]/20 flex items-center justify-center text-[#fc8151]">
                  <award.icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#fc8151] px-2.5 py-1 rounded-full bg-white/10">
                    {award.year}
                  </span>
                  <div className="text-[11px] text-white/50 mt-1">{award.location}</div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{award.title}</h3>
              <p className="text-xs font-semibold text-[#ffb25d] mb-2">{award.org}</p>
              <p className="text-xs text-white/70 leading-relaxed">{award.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. INDUSTRY VERTICALS */}
      <section className="py-20 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-4">
            Engineered Across Diverse Sectors
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Axpert's versatile low-code engine seamlessly powers complex workflows across critical global industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {verticalsList.map((vert, idx) => (
            <motion.div
              key={vert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#fc8151]/60 hover:bg-white/10 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{vert.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{vert.name}</h3>
              <p className="text-xs text-white/60 leading-relaxed">{vert.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. CASE STUDIES & CLIENTELE */}
      <section className="py-20 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-[#00007f] via-white/10 to-[#00007f] backdrop-blur-2xl border border-white/15">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-white mb-3">
              Proven Impact in Enterprise Success
            </h2>
            <p className="text-white/60 max-w-xl mx-auto text-sm">
              Real-world transformations powered by Agile Labs and Axpert platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {caseStudiesList.map((cs) => (
              <a
                key={cs.name}
                href={cs.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#fc8151] hover:bg-white/10 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#fc8151]">
                    {cs.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1 mb-2 group-hover:text-[#ffb25d] transition-colors">
                    {cs.name}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed mb-4">{cs.desc}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#fc8151] font-semibold group-hover:translate-x-1 transition-transform">
                  Read Case Study <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 8. MEET THE TEAM — THE VISIONARIES BEHIND AGILE LABS SHOWCASE SLIDER */}
      <div id="team" className="w-full relative z-10 my-8">
        <ShowcaseSection />
      </div>

      {/* TEAM MEMBER BIO MODAL */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-3xl bg-[#00007f] border border-white/20 p-8 shadow-2xl text-white overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="w-28 h-28 rounded-2xl object-cover object-top border-2 border-[#fc8151] shrink-0"
                />
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#fc8151] text-[#00007f] text-xs font-bold">
                    "{selectedMember.tag}"
                  </span>
                  <h3 className="text-2xl font-bold font-display text-white mt-2">
                    {selectedMember.name}
                  </h3>
                  <p className="text-sm font-semibold text-[#fc8151]">
                    {selectedMember.title}
                  </p>
                  <p className="text-xs text-white/50 mt-1">{selectedMember.experience}</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-white/80 leading-relaxed mb-6">
                <h4 className="text-xs uppercase font-bold text-[#ffb25d] tracking-wider">Biography & Accomplishments</h4>
                <p>{selectedMember.bio}</p>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/10">
                <h4 className="text-xs uppercase font-bold text-[#fc8151] tracking-wider mb-2">Key Core Contributions</h4>
                {selectedMember.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#fc8151] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 9. HEADQUARTERS & CONTACT SECTION */}
      <section className="py-20 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center p-10 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/15">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fc8151]/20 text-[#fc8151] text-xs font-semibold mb-4">
              <MapPin className="w-3.5 h-3.5" />
              Global Headquarters
            </div>
            <h2 className="text-3xl font-bold font-display text-white mb-4">
              Agile Labs Private Limited
            </h2>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              Axpert House is our global innovation hub located in the tech capital of Bengaluru, India.
            </p>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 text-white/80">
                <MapPin className="w-5 h-5 text-[#fc8151] shrink-0 mt-0.5" />
                <span>
                  Axpert House, 627, 1st A Main Rd, 8th Block, Jayanagar, Bengaluru, Karnataka 560070, India
                </span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Phone className="w-5 h-5 text-[#fc8151] shrink-0" />
                <span>+91 9620996796 / +91 8882178785</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Mail className="w-5 h-5 text-[#fc8151] shrink-0" />
                <span>marketing@agile-labs.com</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-center">
            <Building2 className="w-12 h-12 text-[#fc8151] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Connect With Agile Labs</h3>
            <p className="text-xs text-white/60 mb-6">
              Follow our official channels for platform updates, low-code insights, and event announcements.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              {[
                { name: "LinkedIn", href: "https://in.linkedin.com/company/agile-labs_2" },
                { name: "YouTube", href: "https://www.youtube.com/channel/UCUvC7Z8wm8RmfjmC-RTa1cg" },
                { name: "Facebook", href: "https://www.facebook.com/AgileLabsAxpert" },
                { name: "Instagram", href: "https://www.instagram.com/agileaxpert/" }
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-[#fc8151] hover:text-[#00007f] text-xs font-semibold transition-all duration-300"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. CALL TO ACTION */}
      <section className="py-20 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="p-12 rounded-3xl bg-gradient-to-r from-[#fc8151] via-[#ffb25d] to-[#fc8151] text-[#00007f] shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Ready to Build Powerful Apps Faster?
          </h2>
          <p className="text-base text-[#00007f]/80 max-w-2xl mx-auto font-medium mb-8">
            Experience how Axpert and Agile Labs can bring unprecedented speed, flexibility, and cloud scalability to your enterprise.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://agile-labs.com/schedule-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-[#00007f] text-white text-sm font-bold shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Schedule Live Demo
              <ArrowRight className="w-4 h-4 text-[#fc8151]" />
            </a>
            <a
              href="https://agile.axi-global.com/aspx/signin.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-white text-[#00007f] text-sm font-bold shadow-xl hover:scale-105 transition-all duration-300"
            >
              Access Axpert Platform
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
