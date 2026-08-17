import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useAuthModal } from "@/contexts/AuthContext";
import {
  ShoppingCart,
  CircleDollarSign,
  PackageCheck,
  PieChart,
  Wallet,
  HandCoins,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useIsMobile } from "@/hooks/useMobile";

interface PackageItem {
  id: string;
  targetModuleId: string;
  title: string;
  description: string;
  actionText: string;
  isPrimaryAction?: boolean;
  accentColor: string;
  lightBg: string;
  badgeGlow: string;
  icon: LucideIcon;
}

const packagesList: PackageItem[] = [
  {
    id: "procure-to-pay",
    targetModuleId: "p2p",
    title: "Procure to Pay",
    description:
      "Procure-to-Pay purchases goods and services required for business operations.",
    actionText: "Explore",
    accentColor: "#FF6B00",
    lightBg: "from-amber-500/12 via-orange-500/8 to-amber-500/4",
    badgeGlow: "rgba(255, 107, 0, 0.25)",
    icon: ShoppingCart,
  },
  {
    id: "order-to-cash",
    targetModuleId: "o2c",
    title: "Order to Cash",
    description:
      "Order-to-Cash covers sales from customer orders to payment collection.",
    actionText: "Explore",
    isPrimaryAction: true,
    accentColor: "#10B981",
    lightBg: "from-emerald-500/12 via-teal-500/8 to-emerald-500/4",
    badgeGlow: "rgba(16, 185, 129, 0.25)",
    icon: CircleDollarSign,
  },
  {
    id: "inventory-control",
    targetModuleId: "inventory",
    title: "Inventory Control",
    description:
      "Inventory Control manages and tracks stock for optimal inventory efficiency.",
    actionText: "Explore",
    accentColor: "#8B5CF6",
    lightBg: "from-purple-500/12 via-indigo-500/8 to-purple-500/4",
    badgeGlow: "rgba(139, 92, 246, 0.25)",
    icon: PackageCheck,
  },
  {
    id: "financial-accounting",
    targetModuleId: "finance",
    title: "Financial Accounting",
    description:
      "Finance manages and controls organizational finances for sustainable business growth.",
    actionText: "Explore",
    accentColor: "#3B82F6",
    lightBg: "from-blue-500/12 via-sky-500/8 to-blue-500/4",
    badgeGlow: "rgba(59, 130, 246, 0.25)",
    icon: PieChart,
  },
  {
    id: "account-payable",
    targetModuleId: "arap",
    title: "Account Payable",
    description:
      "Customer Receipts records payments, advances, and settles invoices in multiple currencies.",
    actionText: "Explore",
    accentColor: "#EC4899",
    lightBg: "from-pink-500/12 via-rose-500/8 to-pink-500/4",
    badgeGlow: "rgba(236, 72, 153, 0.25)",
    icon: Wallet,
  },
  {
    id: "account-receivable",
    targetModuleId: "arap",
    title: "Account Receivable",
    description:
      "Supplier Payments manages invoice payments, advances, and settlement against supplier invoices.",
    actionText: "Explore",
    accentColor: "#06B6D4",
    lightBg: "from-cyan-500/12 via-teal-500/8 to-cyan-500/4",
    badgeGlow: "rgba(6, 182, 212, 0.25)",
    icon: HandCoins,
  },
];

function GlassKpiCard({ pkg, index }: { pkg: PackageItem; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { openSignUp, selectPackage } = useAuthModal();
  const isMobile = useIsMobile();

  const handleSelectPackage = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectPackage(pkg.title, "1.0");
    openSignUp();
  };

  // Motion values for smooth 3D mouse parallax tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 220, damping: 18 });
  const mouseYSpring = useSpring(y, { stiffness: 220, damping: 18 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["9deg", "-9deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-9deg", "9deg"]);

  // Glare position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const IconComponent = pkg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.07,
        ease: [0.215, 0.61, 0.355, 1],
      }}
      style={{ perspective: 1000 }}
      className="h-full flex p-1"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`relative w-full rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 ease-out group select-none ${
          pkg.isPrimaryAction
            ? "bg-white/80 backdrop-blur-xl border border-white/90 border-t-white ring-1 ring-[#0077ff]/20 shadow-[0_16px_36px_-10px_rgba(0,119,255,0.18)] hover:shadow-[0_26px_50px_-12px_rgba(0,119,255,0.25)]"
            : "bg-white/75 backdrop-blur-xl border border-white/80 border-t-white/95 border-l-white/90 shadow-[0_14px_30px_-8px_rgba(0,0,127,0.08),0_4px_10px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_48px_-10px_rgba(0,0,127,0.15),0_8px_18px_-4px_rgba(0,0,0,0.05)] hover:bg-white/90"
        }`}
      >
        {/* Inner Glass Clip Layer for shine and ambient background */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0">
          {/* Ambient colored glow behind card */}
          <div
            className="absolute -inset-10 rounded-full blur-3xl opacity-0 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
            style={{ background: pkg.badgeGlow }}
          />

          {/* 3D Glass Layer 1: Smooth uniform card background gradient covering full width */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${pkg.lightBg} opacity-60 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none`}
          />

          {/* 3D Glossy Edge Rim Highlight */}
          <div className="absolute inset-0 rounded-2xl border-t border-l border-white/90 pointer-events-none z-10" />

          {/* Dynamic 3D Glare effect on mouse move */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(500px circle at ${glareX} ${glareY}, rgba(255, 255, 255, 0.55), transparent 45%)`,
            }}
          />
        </div>

        {/* TOP LAYER: Content floating with 3D Depth */}
        <div
          className="relative z-20 space-y-4"
          style={{ transform: "translateZ(25px)" }}
        >
          {/* 3D Floating Icon Box */}
          <div className="flex items-center justify-between">
            <div
              className="relative w-11 h-11 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:translate-z-[15px]"
              style={{
                background: `linear-gradient(135deg, ${pkg.accentColor}18 0%, ${pkg.accentColor}35 100%)`,
                boxShadow: `0 6px 16px -3px ${pkg.accentColor}35`,
                border: `1.5px solid ${pkg.accentColor}45`,
              }}
            >
              {/* Internal glossy icon shine */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/40 via-transparent to-transparent pointer-events-none" />
              <IconComponent
                size={22}
                style={{ color: pkg.accentColor }}
                className="transition-transform duration-300 group-hover:rotate-6 drop-shadow-xs"
              />
            </div>

            {/* Quick Status / Enterprise Tag */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/80 backdrop-blur-md border border-white text-[10px] font-bold text-[#1e1b4b]/75 tracking-wider uppercase shadow-2xs">
              <Sparkles size={10} style={{ color: pkg.accentColor }} />
              <span>Ready</span>
            </div>
          </div>

          {/* Title & Description with 3D elevation */}
          <div style={{ transform: "translateZ(18px)" }}>
            <h3 className="font-[Space_Grotesk] text-lg sm:text-xl font-bold text-[#1e1b4b] mb-1.5 leading-tight tracking-tight group-hover:text-[#00007f] transition-colors">
              {pkg.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-medium opacity-90 line-clamp-2">
              {pkg.description}
            </p>
          </div>
        </div>

        {/* BOTTOM LAYER: 3D Action Button (Only this button triggers navigation) */}
        <div
          className="relative z-20 pt-3 mt-2 flex items-center justify-start"
          style={{ transform: "translateZ(22px)" }}
        >
          <motion.button
            onClick={handleSelectPackage}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="px-4 py-1.5 rounded-lg font-bold text-xs text-[#00007f] bg-white/70 hover:bg-white backdrop-blur-md border border-white shadow-2xs transition-all flex items-center gap-1 group/btn cursor-pointer z-30"
          >
            <span>Select package</span>
            <ArrowUpRight
              size={14}
              className="text-[#00007f] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
            />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PackagesSection() {
  const { ref, isVisible } = useScrollAnimation(0.15);

  return (
    <section
      id="packages"
      ref={ref}
      className="pt-10 md:pt-14 pb-16 md:pb-20 px-5 sm:px-8 md:px-10 relative overflow-hidden bg-[#fff6e5] text-[#1E1B4B]"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="ambient-glow ambient-glow-blue w-[600px] h-[600px] top-10 left-1/2 -translate-x-1/2 opacity-30 pointer-events-none" />
      <div className="ambient-glow ambient-glow-coral w-[450px] h-[450px] bottom-10 right-0 translate-x-1/3 opacity-25 pointer-events-none" />

      {/* Decorative Grid Lines overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-3"
        >
          <p className="text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase text-[#fc8151] mb-3">
            LOW CODE BUSINESS APPLICATION
          </p>

          <h2 className="font-[Space_Grotesk] text-4xl sm:text-5xl font-bold text-[#00007f] leading-tight">
            <span className="gradient-text">Our Packages</span>
          </h2>

          <p className="text-base sm:text-lg text-[#00007f] leading-relaxed max-w-2xl mx-auto font-normal">
            Built on{" "}
            <span className="font-semibold text-[#00007f]">Axpert</span> –
            Patented, Proven & secure low code platform that is used by{" "}
            <span className="font-semibold text-[#00007f]">100,000+ users</span>{" "}
            in{" "}
            <span className="font-semibold text-[#00007f]">
              750+ enterprises
            </span>{" "}
            across{" "}
            <span className="font-semibold text-[#00007f]">10+ countries</span>.
          </p>
        </motion.div>

        {/* 3D REALISTIC RECTANGULAR KPI CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 items-stretch">
          {packagesList.map((pkg, index) => (
            <GlassKpiCard key={pkg.id} pkg={pkg} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
