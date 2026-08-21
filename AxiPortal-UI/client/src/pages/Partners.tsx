/**
 * Axi Platform - Partners Page
 * Comprehensive Partner Ecosystem page for Agile Labs & Axpert Platform
 * Theme: Signature Warm Cream Immersive Enterprise (#fff6e5) matching the exact theme in the AXI design system.
 * Highlights US Patent, Brand Equity, Partner Value Pillars, Global Partner Network, and Onboarding Program.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import PartnerModal from "@/components/PartnerModal";
import {
  ShieldCheck,
  Zap,
  Rocket,
  Globe,
  Award,
  Users,
  Building2,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Target,
  Layers,
  Sparkles,
  ExternalLink,
  Mail,
  Phone,
  Send,
  Check
} from "lucide-react";

const partnerAsset = (fileName: string) => `/partners/${fileName}`;

const raLogo = partnerAsset("ra-innovative.jpg");
const littleFoxLogo = partnerAsset("little-fox.jpg");
const pentagonLogo = partnerAsset("pentagon.jpg");
const iihtLogo = partnerAsset("iiht.jpg");
const spectaLogo = partnerAsset("specta.jpg");
const enstrappLogo = partnerAsset("enstrapp.png");
const tecwinkLogo = partnerAsset("tecwink.png");
const infolifeLogo = partnerAsset("infolife.png");
const mayuraLogo = partnerAsset("mayura.jpg");
const itechLogo = partnerAsset("itech.jpg");
const suffixtreeLogo = partnerAsset("suffixtree.jpg");
const kritLogo = partnerAsset("krit.jpg");
const transworldLogo = partnerAsset("transworld.jpg");

interface PartnerLogo {
  name: string;
  category: string;
  region: string;
  desc: string;
  logo: string;
}

const partnersList: PartnerLogo[] = [
  { name: "RA Innovative Solutions", category: "Enterprise ERP & Low-Code", region: "India & APAC", desc: "Specializing in manufacturing ERP and rapid low-code custom workflow builds.", logo: raLogo },
  { name: "Little Fox Technologies", category: "Cloud Transformation", region: "North America", desc: "Delivering cloud-native enterprise web and mobile solutions powered by Axpert.", logo: littleFoxLogo },
  { name: "Pentagon Systems", category: "Supply Chain & Logistics", region: "Middle East", desc: "End-to-end P2P, warehouse management, and distribution technology.", logo: pentagonLogo },
  { name: "IIHT", category: "Skill Development & Training", region: "Global", desc: "Empowering state rural skill tracking and workforce education programs.", logo: iihtLogo },
  { name: "SpectaSL", category: "Healthcare & Hospital IT", region: "South Asia", desc: "Hospital information systems, EHR, and multi-center clinical management.", logo: spectaLogo },
  { name: "Enstrapp IT", category: "Enterprise Mobility", region: "India", desc: "SAP integrations, mobile workforce management, and plant maintenance.", logo: enstrappLogo },
  { name: "Tecwink Solutions", category: "Fintech & Banking", region: "Middle East", desc: "Banking core transaction extensions and automated audit compliance.", logo: tecwinkLogo },
  { name: "Infolife Tech", category: "Public Sector E-Gov", region: "India", desc: "State governance, public safety administration, and citizen services.", logo: infolifeLogo },
  { name: "Mayura Consulting", category: "Process Manufacturing", region: "APAC", desc: "Tea estate ERP, batch manufacturing, and quality assurance systems.", logo: mayuraLogo },
  { name: "iTech India", category: "Custom Enterprise Solutions", region: "India", desc: "Tailored low-code application development for mid-market enterprises.", logo: itechLogo },
  { name: "Suffix Tree", category: "Retail & POS Systems", region: "Middle East", desc: "Multi-store inventory valuation, point-of-sale, and retail analytics.", logo: suffixtreeLogo },
  { name: "KR IT Solution", category: "Infrastructure & IT Services", region: "India & Global", desc: "Top-notch IT development, ERP implementation, and digital consulting services.", logo: kritLogo },
  { name: "Transworld IT", category: "Infrastructure & Telecom", region: "Global", desc: "Mission-critical infrastructure management and automated workflow engines.", logo: transworldLogo }
];

const valuePillars = [
  {
    title: "Leverage Brand 'Agile'",
    desc: "20+ years of proven industry equity, US-Patented technology, and 100+ successful enterprise projects across 3 continents.",
    icon: Award,
    badge: "20+ Yrs Equity"
  },
  {
    title: "Design — Build — Sell",
    desc: "Build complex enterprise applications effortlessly. All your team needs is domain expertise and standard SQL knowledge.",
    icon: Rocket,
    badge: "Low-Code Velocity"
  },
  {
    title: "Be Market-Ready Day 1",
    desc: "Accelerate sales cycles with pre-built enterprise modules, turn-key customer demo environments, and instant 1-click cloud deployment.",
    icon: CheckCircle2,
    badge: "Turnkey Demos"
  },
  {
    title: "Expert Technical Guidance",
    desc: "Comprehensive domain training, 24/7 technical handholding, and dedicated architect support for complex RFP procurements.",
    icon: Users,
    badge: "Dedicated Mentorship"
  },
  {
    title: "Highly Scalable Revenues",
    desc: "Venture into untapped industry domains with custom solutions and establish high-margin recurring SaaS revenue streams.",
    icon: TrendingUp,
    badge: "High-Margin SaaS"
  },
  {
    title: "Co-Marketing & Lead Support",
    desc: "Agile Labs actively invests in digital marketing, customer education, and industry expos that convert directly into qualified leads for you.",
    icon: Target,
    badge: "Direct Leads"
  }
];

export default function Partners() {
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    domain: "Enterprise ERP",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] text-[#00007f] selection:bg-[#fc8151] selection:text-white relative overflow-hidden font-body">
      <ScrollProgress />
      <Navigation />

      {/* Ambient background orbital concentric rings */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full border border-[#fc8151]/15 pointer-events-none -z-10" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full border border-[#00007f]/10 pointer-events-none -z-10" />
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-[#fc8151]/20 pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#fc8151]/10 via-[#ffb25d]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* 1. STATS BANNER */}
      <section className="pt-28 pb-12 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Industry Expertise", value: "20+ Yrs", sub: "Proven Tech Brand" },
            { label: "Global Projects", value: "100+", sub: "Across 3 Continents" },
            { label: "Enterprise Clients", value: "500+", sub: "Global Organizations" },
            { label: "Active Users", value: "40,000+", sub: "Daily Operations" },
            { label: "Deployment Speed", value: "1-Click", sub: "Modular Cloud Engine" }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-[#00007f]/10 shadow-sm text-center hover:border-[#fc8151] transition-all duration-300"
            >
              <div className="text-3xl font-extrabold font-display text-[#00007f]">{stat.value}</div>
              <div className="text-xs font-bold text-[#fc8151] mt-1">{stat.label}</div>
              <div className="text-[11px] text-[#00007f]/50 mt-0.5">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. VALUE PILLARS (WHY PARTNER WITH AGILE LABS) */}
      <section id="pillars" className="py-20 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fc8151]/15 text-[#fc8151] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Growth & Enablement
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-[#00007f] mb-4">
            Why Partner With Agile Labs?
          </h2>
          <p className="text-[#00007f]/70 max-w-2xl mx-auto font-medium">
            Unlike traditional software programs, Agile Labs equips partners with total operational autonomy, domain training, and enterprise credibility.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {valuePillars.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#00007f]/10 shadow-md hover:shadow-xl hover:border-[#fc8151] transition-all duration-500 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00007f] to-[#fc8151] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <pillar.icon className="w-7 h-7" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#fc8151]/10 text-[#fc8151] text-xs font-bold border border-[#fc8151]/20">
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="text-2xl font-bold font-display text-[#00007f] mb-3 group-hover:text-[#fc8151] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[#00007f]/70 leading-relaxed font-medium">
                  {pillar.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#00007f]/10 flex items-center gap-2 text-xs font-bold text-[#00007f] group-hover:text-[#fc8151] transition-colors">
                Explore Advantage <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. GLOBAL PARTNER NETWORK SHOWCASE */}
      <section className="py-20 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-10 md:p-14 rounded-3xl bg-white/80 backdrop-blur-2xl border border-[#00007f]/10 shadow-xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold font-display text-[#00007f] mb-3">
              Our Partners Across The Globe
            </h2>
            <p className="text-[#00007f]/70 max-w-xl mx-auto text-sm font-medium">
              Empowering a thriving network of system integrators, ISVs, and technology consultants across Asia, Middle East, Africa, and North America.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnersList.map((partner) => (
              <div
                key={partner.name}
                className="p-6 rounded-2xl bg-white border border-[#00007f]/10 hover:border-[#fc8151] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#fc8151] px-2.5 py-0.5 rounded-full bg-[#fc8151]/10">
                      {partner.category}
                    </span>
                    <span className="text-[11px] text-[#00007f]/50 font-medium">
                      {partner.region}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5 mb-4 min-h-[48px]">
                    <div className="h-12 w-28 shrink-0 bg-white border border-slate-200/80 rounded-xl p-1.5 flex items-center justify-center shadow-xs overflow-hidden group-hover:border-[#fc8151]/50 transition-all">
                      <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform"
                        loading="eager"
                      />
                    </div>
                    <h3 className="text-base font-bold text-[#00007f] group-hover:text-[#fc8151] transition-colors leading-tight">
                      {partner.name}
                    </h3>
                  </div>

                  <p className="text-xs text-[#00007f]/70 leading-relaxed font-medium">
                    {partner.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#00007f]/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#00007f]/60 group-hover:text-[#fc8151] transition-colors flex items-center gap-1">
                    Authorized Partner
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#fc8151] text-white text-[11px] font-bold shadow-sm group-hover:bg-[#e06b3c] transition-colors">
                    KNOW MORE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW THE PROGRAM WORKS */}
      <section className="py-20 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-[#00007f] mb-4">
            4-Step Partner Journey
          </h2>
          <p className="text-[#00007f]/70 max-w-2xl mx-auto font-medium">
            Designed for rapid onboarding so you can demo, build, and close client deals right away.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Apply & Onboard", desc: "Submit partner application, complete domain orientation, and receive demo credentials." },
            { step: "02", title: "Domain Enablement", desc: "Access Axpert low-code developer toolkits, pre-built ERP modules, and SQL frameworks." },
            { step: "03", title: "Co-Design & Demo", desc: "Build tailored applications for clients with direct architectural handholding from Agile Labs." },
            { step: "04", title: "Deploy & Scale", desc: "Execute 1-click cloud deployments with high recurring margins and ongoing customer support." }
          ].map((item, idx) => (
            <div
              key={item.step}
              className="p-6 rounded-2xl bg-white/80 border border-[#00007f]/10 shadow-sm relative group hover:border-[#fc8151] transition-all"
            >
              <div className="text-4xl font-extrabold font-display text-[#fc8151] mb-3">
                {item.step}
              </div>
              <h3 className="text-lg font-bold text-[#00007f] mb-2">{item.title}</h3>
              <p className="text-xs text-[#00007f]/70 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PARTNER INQUIRY FORM */}
      <section id="join" className="py-20 relative z-10 px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-10 md:p-14 rounded-3xl bg-white shadow-2xl border border-[#00007f]/15 relative overflow-hidden">
          <div className="text-center mb-10">
            <span className="px-4 py-1.5 rounded-full bg-[#fc8151]/15 text-[#fc8151] text-xs font-bold uppercase tracking-wider">
              Start Your Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-[#00007f] mt-3 mb-2">
              Become an Authorized Agile Labs Partner
            </h2>
            <p className="text-sm text-[#00007f]/70 max-w-lg mx-auto font-medium">
              Fill out the form below to connect with our Partner Alliances team and explore revenue growth.
            </p>
          </div>

          {formSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-[#00007f] text-white text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#fc8151] flex items-center justify-center mx-auto mb-4 text-[#00007f]">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-2xl font-bold font-display mb-2">Application Received!</h3>
              <p className="text-sm text-white/80 max-w-md mx-auto mb-6">
                Thank you for applying to the Agile Labs Partner Program. Our alliance team will contact you within 24 hours.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="px-6 py-2.5 rounded-full bg-white text-[#00007f] text-xs font-bold hover:bg-[#fc8151] hover:text-white transition-colors"
              >
                Submit Another Inquiry
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#00007f]/80 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-[#00007f]/20 bg-[#fff6e5]/40 text-[#00007f] text-sm focus:outline-none focus:border-[#fc8151]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#00007f]/80 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Acme Technologies"
                    className="w-full px-4 py-3 rounded-xl border border-[#00007f]/20 bg-[#fff6e5]/40 text-[#00007f] text-sm focus:outline-none focus:border-[#fc8151]"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#00007f]/80 mb-2">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@company.com"
                    className="w-full px-4 py-3 rounded-xl border border-[#00007f]/20 bg-[#fff6e5]/40 text-[#00007f] text-sm focus:outline-none focus:border-[#fc8151]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#00007f]/80 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 rounded-xl border border-[#00007f]/20 bg-[#fff6e5]/40 text-[#00007f] text-sm focus:outline-none focus:border-[#fc8151]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#00007f]/80 mb-2">
                  Primary Focus Vertical / Domain
                </label>
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#00007f]/20 bg-[#fff6e5]/40 text-[#00007f] text-sm focus:outline-none focus:border-[#fc8151]"
                >
                  <option value="Enterprise ERP">Enterprise ERP & Supply Chain</option>
                  <option value="Healthcare & HMS">Healthcare & HMS</option>
                  <option value="E-Government">E-Government & Public Sector</option>
                  <option value="Banking & Financials">Banking & Financial Services</option>
                  <option value="Manufacturing & Retail">Manufacturing & Retail POS</option>
                  <option value="Other Custom Solutions">Other Custom Solutions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#00007f]/80 mb-2">
                  Tell Us About Your Business & Goals
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details regarding your team size, current technical stack, and target market..."
                  className="w-full px-4 py-3 rounded-xl border border-[#00007f]/20 bg-[#fff6e5]/40 text-[#00007f] text-sm focus:outline-none focus:border-[#fc8151]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl text-base font-bold text-white shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #00007f 0%, #fc8151 100%)",
                }}
              >
                <Send className="w-5 h-5" />
                Submit Partner Application
              </button>
            </form>
          )}
        </div>
      </section>

      <PartnerModal isOpen={isPartnerModalOpen} onClose={() => setIsPartnerModalOpen(false)} />
      <Footer />
    </div>
  );
}
