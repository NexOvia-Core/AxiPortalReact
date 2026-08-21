/**
 * Axi Platform - Modules Page
 * Comprehensive overview of Axi Enterprise Modules with video teasers and descriptions.
 * Theme: Warm Immersive Enterprise (#fff6e5) with glassmorphism and ambient glow.
 */
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { useAuthModal } from "@/contexts/AuthContext";
import {
  Play,
  CheckCircle,
  Sparkles,
  Layers,
  Terminal,
  Bot,
  ShoppingCart,
  DollarSign,
  Package,
  PieChart,
  Cpu,
  ShieldCheck,
  Wrench,
  CreditCard,
} from "lucide-react";

interface ModuleItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: any;
  videoUrl?: string;
  isPlaceholder?: boolean;
  description: string[];
}

const modulesData: ModuleItem[] = [
  {
    id: "axibot",
    title: "AxiBot",
    subtitle: "Conversational Enterprise Intelligence",
    badge: "AI Powered",
    icon: Bot,
    videoUrl: "/videos/AxiBot_Final_teaser_.mp4",
    description: [
      "Connect seamlessly with LLMs integrated directly into live ERP data for real-time business insights.",
      "Search across customer, product, and document history with 360° record recall and conversational querying.",
      "Surface actionable intelligent decisions and automated alerts rather than traditional static dashboards.",
      "Empower teams to interrogate data, flag anomalies, and query stock or finance status in plain language.",
    ],
  },
  {
    id: "cmdline",
    title: "Axi Command Line",
    subtitle: "Natural Language ERP Navigation",
    badge: "High Velocity",
    icon: Terminal,
    videoUrl: "/videos/AXI_CMDLINE_FINAL_TEASER.mp4",
    description: [
      "Instant access to any transaction, report, or wizard in the entire ERP using natural command line inputs.",
      "Execute direct actions like 'View trial balance', 'View Sales data', or 'Create Purchase order' in milliseconds.",
      "In-context popup capabilities allow users to view pending requests without leaving their current workflow.",
      "Eliminate deep menu navigation with a unified search and command interface designed for ultimate efficiency.",
    ],
  },
  {
    id: "p2p",
    title: "Procure to Pay (P2P)",
    subtitle: "Complete Vendor & Procurement Workflow",
    badge: "Core Suite",
    icon: ShoppingCart,
    isPlaceholder: true,
    description: [
      "End-to-end automation from RFQ and Purchase Order creation to Goods Received Note (GRN) and vendor bill matching.",
      "Apportion additional logistic, clearing, and freight expenses directly to GRN items based on item value.",
      "Support pre-billing returns against GRNs and post-billing returns against supplier invoices with auto GL posting.",
      "Comprehensive purchase summary reports provide instant visibility across suppliers, sub-locations, and items.",
    ],
  },
  {
    id: "o2c",
    title: "Order to Cash (O2C)",
    subtitle: "Sales, Invoicing & Receivables Management",
    badge: "Core Suite",
    icon: DollarSign,
    isPlaceholder: true,
    description: [
      "Unified sequence for customer management, sales order booking, delivery, and sales invoice generation.",
      "Multi-currency handling locks transaction currency at setup to ensure strict international accounting compliance.",
      "Flexible pricing matrices allow customer-wise, location-wise, and future-dated price lists with automated discount schemes.",
      "Deep profitability tracking offers customer-wise and sales person-wise margins grouped by product categories.",
    ],
  },
  {
    id: "finance",
    title: "Financial Accounting",
    subtitle: "GL, Balance Sheet & Financial Statements",
    badge: "Core Suite",
    icon: Layers,
    isPlaceholder: true,
    description: [
      "Hierarchical Chart of Accounts with tree-structure sub-groups and direct Excel opening balance imports.",
      "Automatic financial voucher posting from sales, purchases, receipts, payments, and stock returns.",
      "Real-time drill-down statements for Trial Balance, Profit & Loss, Balance Sheet, and auto-revaluation of stock.",
      "Automated financial year-end closing journal creates new financial years and posts opening balances seamlessly.",
    ],
  },
  {
    id: "inventory",
    title: "Inventory Management",
    subtitle: "Multi-Store & Stock Valuation Engine",
    badge: "Core Suite",
    icon: Package,
    isPlaceholder: true,
    description: [
      "Multi-location and sub-location store management with default Main and Rejections store isolation.",
      "Material receipts, issues, and inter-store transfers with automatic tax handling for multi-state transfers.",
      "Stock ledgers and statements available both with quantity-only and full inventory valuation options.",
      "Integrated auto-revaluation routine updates stock valuation prior to generating financial and balance reports.",
    ],
  },
  {
    id: "costcenters",
    title: "Cost Centers & Expense Analysis",
    subtitle: "SBU & Departmental Overhead Allocation",
    badge: "Analytics",
    icon: PieChart,
    isPlaceholder: true,
    description: [
      "Hierarchical cost groups (such as Strategic Business Units or Departments) and cost center allocation.",
      "Automate expense apportioning across cost centers using predefined percentage matrices during journal entry.",
      "Detailed expense analysis commands allow managers to track overheads and operational spend per cost center.",
      "Full visibility into department-wise cost distribution without requiring manual spreadsheet allocations.",
    ],
  },
  {
    id: "mrp",
    title: "Material Requirement Planning (MRP)",
    subtitle: "Demand-Aware Predictive Procurement",
    badge: "Smart MRP",
    icon: Cpu,
    isPlaceholder: true,
    description: [
      "Evaluates every live sales order in real-time to determine reserve, produce, buy, or transfer decisions.",
      "Dynamically factors lead times, existing stock levels, and active purchase orders to eliminate stockouts.",
      "Prevents over-procurement while ensuring manufacturing lines have guaranteed material availability.",
      "Fully integrated into the low-code core for custom replenishment rules and lead time calculations.",
    ],
  },
  {
    id: "production",
    title: "Production & Manufacturing",
    subtitle: "Multi-Level BOM & Work Order Routing",
    badge: "Manufacturing",
    icon: Sparkles,
    isPlaceholder: true,
    description: [
      "Multi-level Bill of Materials (BOM), production routing, work order generation, and batch-wise costing.",
      "Real-time tracking of raw material consumption and finished goods generation at each sub-location stage.",
      "Full integration with Quality Control ensures sub-standard items are automatically routed to rejection stores.",
      "Provides accurate unit costing by incorporating overhead apportionments and batch material costs.",
    ],
  },
  {
    id: "qc",
    title: "Quality Control (QC)",
    subtitle: "Automated Lot Inspection & Quarantine",
    badge: "Quality",
    icon: ShieldCheck,
    isPlaceholder: true,
    description: [
      "Automated quality check triggers upon material receipt before items enter usable stock inventory.",
      "Automatic blocking and transfer of rejected lots into designated rejection sub-locations.",
      "Vendor rejection pattern analysis flags rate deviations and quality risks the moment they occur.",
      "Prevents defective materials from entering production lines or being shipped to end customers.",
    ],
  },
  {
    id: "assets",
    title: "Fixed Assets & Maintenance",
    subtitle: "Asset Capitalisation & Service Schedules",
    badge: "Asset Ops",
    icon: Wrench,
    isPlaceholder: true,
    description: [
      "Comprehensive asset register tracking capitalisation, warranty schedules, and location assignments.",
      "Automated depreciation calculations supporting straight-line and written-down value methods.",
      "Preventive maintenance schedules for plant machinery with complete service history logs.",
      "Minimizes unplanned downtime by alerting maintenance teams prior to scheduled service dates.",
    ],
  },
  {
    id: "arap",
    title: "AR & AP Management",
    subtitle: "Receivables, Payables & Advance Settlement",
    badge: "Finance",
    icon: CreditCard,
    isPlaceholder: true,
    description: [
      "Open customer and supplier invoice management with bulk upload capabilities from Excel files.",
      "Multi-currency payment recording with settlement of advance payments against subsequent invoices.",
      "Automated tracking of payment dues, credit limits, and collection follow-up reminders in the inbox.",
      "Seamless posting into GL sub-ledgers for instant cash flow and working capital analysis.",
    ],
  },
];

function ModuleVideoCard({ module }: { module: ModuleItem }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState(false);

  // Lazy-load video when card enters extended viewport
  useEffect(() => {
    const card = cardRef.current;
    if (!card || !module.videoUrl) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [module.videoUrl]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-3xl overflow-hidden glass-card border border-white/80 p-3 shadow-xl transition-all duration-500 hover:shadow-2xl group cursor-pointer"
    >
      <div className="relative rounded-2xl overflow-hidden aspect-video bg-[#00007f]/5 flex items-center justify-center">
        {module.videoUrl ? (
          <video
            ref={videoRef}
            src={isNearViewport ? module.videoUrl : undefined}
            loop
            muted
            playsInline
            preload="none"
            className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#00007f]/10 via-[#fff6e5]/40 to-[#fc8151]/10 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-[#fc8151] mb-4 shadow-sm group-hover:scale-110 transition-transform duration-500">
              <module.icon size={32} />
            </div>
            <h4 className="font-[Space_Grotesk] font-bold text-[#00007f] text-lg mb-1">
              {module.title}
            </h4>
            <p className="text-xs text-[#00007f]/50">
              PACKAGES INTERACTIVE TEASER WILL BE RELEASED SOON!
            </p>
          </div>
        )}

        {/* Glass transparent overlay when NOT hovered */}
        <div
          className={`absolute inset-0 transition-all duration-500 flex flex-col items-center justify-center p-6 text-center pointer-events-none ${
            isHovered
              ? "opacity-0 backdrop-blur-none bg-transparent"
              : "opacity-100 backdrop-blur-md bg-[#fff6e5]/45"
          }`}
        >
          <div className="w-14 h-14 rounded-full glass border border-white/80 flex items-center justify-center text-[#00007f] shadow-lg mb-3 animate-pulse">
            <Play size={24} className="ml-1 text-[#fc8151]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleContentCard({ module }: { module: ModuleItem }) {
  const { openSignUp, selectPackage } = useAuthModal();

  return (
    <div className="glass-card rounded-3xl p-8 md:p-10 flex flex-col justify-between border border-white/80 shadow-lg hover:shadow-xl transition-all duration-500 h-full bg-white/60">
      <div>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center glass bg-gradient-to-br from-[#00007f]/10 to-[#fc8151]/10 text-[#00007f] shadow-sm">
              <module.icon
                size={22}
                className="gradient-text"
                strokeWidth={1.8}
              />
            </div>
            <div>
              <h3 className="font-[Space_Grotesk] text-2xl md:text-3xl font-bold text-[#00007f]">
                {module.title}
              </h3>
              <p className="text-xs font-medium text-[#00007f]/50">
                {module.subtitle}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#fc8151] bg-[#fc8151]/10 border border-[#fc8151]/20 px-3.5 py-1.5 rounded-full uppercase tracking-wider shrink-0">
            {module.badge}
          </span>
        </div>

        <ul className="space-y-4">
          {module.description.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-3.5">
              <div className="w-5 h-5 rounded-full bg-[#fc8151]/10 text-[#fc8151] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle size={14} className="text-[#fc8151]" />
              </div>
              <p className="text-sm md:text-[15px] text-[#00007f]/75 leading-relaxed font-normal">
                {bullet}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-8 mt-8 border-t border-[#00007f]/8 flex items-center justify-between">
        <span className="text-xs font-mono font-medium text-[#00007f]/40 uppercase tracking-widest">
          AXPERT LOW-CODE CORE
        </span>
        <button
          type="button"
          onClick={() => {
            selectPackage(module.title, "1.0");
            openSignUp();
          }}
          className="text-xs font-semibold text-[#00007f] hover:text-[#fc8151] transition-colors flex items-center gap-1 group cursor-pointer"
        >
          Install Package{" "}
          <span className="group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>
      </div>
    </div>
  );
}

export default function Modules() {
  useEffect(() => {
    const scrollToModule = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 300);
      }
    };

    scrollToModule();
    window.addEventListener("hashchange", scrollToModule);
    return () => window.removeEventListener("hashchange", scrollToModule);
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#fff6e5" }}
    >
      <ScrollProgress />
      <div className="noise-overlay" />
      <Navigation />

      {/* Hero Section of Modules Page */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="ambient-glow ambient-glow-coral w-[600px] h-[600px] top-10 left-1/2 -translate-x-1/2" />
        <div className="ambient-glow ambient-glow-blue w-[400px] h-[400px] top-40 right-10" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-[Space_Grotesk] text-5xl md:text-7xl font-bold text-[#00007f] mb-6 leading-tight">
              AXI Platform <span className="gradient-text">Packages</span>
            </h1>
            <p className="text-lg md:text-xl text-[#00007f]/60 max-w-3xl mx-auto leading-relaxed">
              Explore AXI&apos;s modular architecture powered by Axpert low-code
              core. Point mouse over any video teaser to play automatically, and
              discover how each workflow adapts to your enterprise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Alternating Horizontal Modules Showcase */}
      <section className="pb-36 px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-24">
          {modulesData.map((module, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={module.id}
                id={module.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center rounded-3xl transition-all duration-700 p-2 sm:p-4"
              >
                {isEven ? (
                  <>
                    <div className="lg:col-span-6">
                      <ModuleVideoCard module={module} />
                    </div>
                    <div className="lg:col-span-6">
                      <ModuleContentCard module={module} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="lg:col-span-6 order-2 lg:order-1">
                      <ModuleContentCard module={module} />
                    </div>
                    <div className="lg:col-span-6 order-1 lg:order-2">
                      <ModuleVideoCard module={module} />
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
