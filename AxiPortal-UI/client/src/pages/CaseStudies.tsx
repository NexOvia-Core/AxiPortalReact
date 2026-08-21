import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { ArrowRight, Globe2, Sparkles } from "lucide-react";
import { Link } from "wouter";

const caseStudies = [
  {
    title: "Sutures India Pvt Ltd",
    industry: "Healthcare & Manufacturing",
    url: "/case-studies/axpert-healthcare-manufacturing",
    image: "https://agile-labs.com/wp-content/uploads/2023/11/Healthcare_case_stuides.jpg",
    description: "Complete automation required for easier management of global outreach and large scale manufacturing operations."
  },
  {
    title: "Bidhannagar Commissionerate",
    industry: "Public Governance",
    url: "/case-studies/bidhannagar-commissionerate",
    image: "https://agile-labs.com/wp-content/uploads/2023/11/bidhannagar-commissionerate.jpg",
    description: "Digitalized traffic fine collection equipping police personnel with mobile devices powered by Axpert."
  },
  {
    title: "Kauvery Group of Hospitals",
    industry: "Multi-Speciality Healthcare",
    url: "/case-studies/kauvery-group-of-hospitals",
    image: "https://agile-labs.com/wp-content/uploads/2023/11/kauvery_case_studies.jpg",
    description: "Unified hospital management system for a chain of 7 multi-speciality hospitals spread across Tamil Nadu."
  },
  {
    title: "State Insurance & Provident Fund",
    industry: "Government Data Center",
    url: "/case-studies/state-insurance-provident-fund",
    image: "https://agile-labs.com/wp-content/uploads/2023/11/E_gov.jpg",
    description: "Inter-connection of about 50 locations centralized at the State Data Centre for comprehensive fund management."
  },
  {
    title: "Ockham Oncology",
    industry: "Clinical Trials & Oncology",
    url: "/case-studies/axpert_ockham-oncology",
    image: "https://agile-labs.com/wp-content/uploads/2023/11/Ockham-Oncology_case_studies.jpg",
    description: "Rapid scaling and management of numerous new clinical trials in the oncology sector with massive data integration."
  },
  {
    title: "Karnataka State Beverages Corporation Ltd.",
    industry: "Beverage Logistics",
    url: "/case-studies/karnataka-state-beverages",
    image: "https://agile-labs.com/wp-content/uploads/2023/11/Beverages_Case_studies.jpg",
    description: "Synchronization of huge volumes of operational data across limited bandwidth for core beverage logistics."
  },
  {
    title: "Bangalore Metro Rail Corporation Limited",
    industry: "Metro Rail Infrastructure",
    url: "/case-studies/axpert-metro-rail",
    image: "https://agile-labs.com/wp-content/uploads/2023/11/Metro.jpg",
    description: "Managing contracts, controlling station operations, and financial accounting for a massive metro rail infrastructure."
  }
];

export default function CaseStudies() {
  return (
    <div className="min-h-screen bg-[#00007f] text-white selection:bg-[#fc8151] selection:text-white relative overflow-hidden font-body">
      <ScrollProgress />
      <Navigation />

      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] rounded-full bg-gradient-to-b from-[#00007f] via-[#fc8151]/15 to-transparent blur-[160px] pointer-events-none -z-10" />
      
      {/* 1. HERO SECTION */}
      <section className="pt-36 pb-20 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#fc8151] text-xs font-semibold uppercase tracking-widest mb-8"
        >
          <Sparkles className="w-4 h-4 animate-pulse text-[#fc8151]" />
          Enterprise Success Stories
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight text-white leading-[1.1] mb-6 max-w-5xl mx-auto"
        >
          Proven at <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#fc8151] via-[#ffb25d] to-white">Global Scale</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed"
        >
          Discover how industry leaders use the Axpert Low-Code Platform to modernize operations, accelerate development, and drive unprecedented digital transformation.
        </motion.p>
      </section>

      {/* 2. CASE STUDIES GRID */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study, idx) => (
            <Link key={study.title} href={study.url}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.23, 1, 0.32, 1] }}
                className="group cursor-pointer relative h-full rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#fc8151]/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(252,129,81,0.15)] flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden shrink-0 bg-white">
                  <div className="absolute inset-0 bg-[#00007f]/20 z-10 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-500" />
                  <img 
                    src={study.image} 
                    alt={study.title} 
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700 ease-in-out p-4"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 rounded-full bg-[#00007f]/80 backdrop-blur-md border border-white/30 text-[10px] font-semibold text-white shadow-lg flex items-center gap-1.5 uppercase tracking-wider">
                      <Globe2 className="w-3 h-3" />
                      {study.industry}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-1 relative">
                  <h3 className="text-xl font-bold font-display text-white mb-3 group-hover:text-[#fc8151] transition-colors leading-tight">
                    {study.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1">
                    {study.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-[#fc8151] font-bold text-sm group-hover:gap-4 transition-all">
                    Read Full Study <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
