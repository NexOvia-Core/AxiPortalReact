import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { ChevronLeft, Sparkles, CheckCircle2, Server, Users, Landmark, Percent } from "lucide-react";
import { Link } from "wouter";

export default function CaseStudyStateInsurance() {
  return (
    <div className="min-h-screen bg-[#fcfcfd] font-body text-[#1e293b] relative overflow-hidden selection:bg-[#fc8151] selection:text-white">
      <ScrollProgress />
      <Navigation />

      {/* 1. HERO BANNER SECTION */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 bg-gradient-to-br from-[#00007f] via-[#000055] to-[#1e156d] text-white overflow-hidden">
        {/* Background Banner Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
          <img
            src="https://agile-labs.com/wp-content/uploads/2023/10/E_government.jpg"
            alt="State Insurance & Provident Fund Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#fc8151]/20 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#00007f]/40 blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="mb-6"
          >
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-white/80 hover:text-[#fc8151] font-semibold text-sm transition-colors px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/15"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Case Studies
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fc8151]/20 border border-[#fc8151]/40 text-[#ffb25d] text-xs font-bold uppercase tracking-widest mb-6 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Government Data Centre &amp; E-Governance
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.15] mb-6"
          >
            State Insurance &amp; Provident Fund
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="text-lg md:text-xl text-white/80 font-medium leading-relaxed max-w-3xl"
          >
            Centralizing 50 location offices and serving 6+ lakh state government subscribers via the State Data Centre using Axpert Low-Code.
          </motion.p>
        </div>
      </section>

      {/* MAIN CONTENT BODY CONTAINER */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-16 space-y-16 relative z-10">

        {/* METRICS STATS BAR */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100/80 flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[#00007f]/10 text-[#00007f]">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Interconnected</p>
              <p className="text-xl font-extrabold text-slate-900">50 Locations</p>
              <p className="text-slate-500 text-xs mt-0.5">Centralised at State Data Centre</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100/80 flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[#fc8151]/10 text-[#fc8151]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Subscribers Served</p>
              <p className="text-xl font-extrabold text-slate-900">6+ Lakh Users</p>
              <p className="text-slate-500 text-xs mt-0.5">State Govt. Employees</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100/80 flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[#046bd2]/10 text-[#046bd2]">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Execution Effort</p>
              <p className="text-xl font-extrabold text-slate-900">90 Man Months</p>
              <p className="text-slate-500 text-xs mt-0.5">Agile &amp; Axpert Execution</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100/80 flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Effort Saved</p>
              <p className="text-xl font-extrabold text-slate-900">45% Saved</p>
              <p className="text-slate-500 text-xs mt-0.5">Across project phases</p>
            </div>
          </div>
        </section>

        {/* SECTION 1: CUSTOMER REQUIREMENT & BUSINESS SITUATION */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3.5 pb-2 border-b border-slate-100">
                <img
                  src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
                  alt="Icon"
                  className="w-8 h-8 object-contain shrink-0"
                />
                <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
                  CUSTOMER REQUIREMENT
                </h2>
              </div>

              <p className="text-slate-700 text-base md:text-lg leading-relaxed">
                The requirement envisages the inter-connection of about 50 locations centralized at the “State Data Centre” maintained by the department of IT, for online operation and updating of data related to provident schemes, pension schemes, life insurance schemes and general insurance schemes, for one of the State Governments of India, ensuring that the “State Data Centre” is made available to more than 6 lakhs users and employees.
              </p>
            </div>

            {/* Right Image Column: Business Situation */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-4 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 w-full flex justify-center">
                <img
                  src="https://agile-labs.com/wp-content/uploads/2023/10/BUSINESS_.png"
                  alt="Business Situation Diagram"
                  className="w-full max-w-sm h-auto object-contain rounded-2xl"
                />
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: SOLUTION */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl space-y-8">
          <div className="flex items-center gap-3.5 pb-2 border-b border-slate-100">
            <img
              src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
              alt="Icon"
              className="w-8 h-8 object-contain shrink-0"
            />
            <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
              SOLUTION
            </h2>
          </div>

          <div className="bg-[#f0f5fa] border-l-4 border-[#046bd2] p-6 rounded-r-2xl">
            <p className="text-slate-800 text-base md:text-lg leading-relaxed font-semibold">
              An online web-based portal application enabled with automatic workflow to cater to the requirements of all the business processes and activities at various levels of all the schemes and support functions of the government.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Capabilities List */}
            <div className="lg:col-span-7 space-y-4">
              {[
                "Capture/upload transaction entries and any data relating to each subscriber at the treasury level after performing necessary tests to ensure that the debit/credit relates to the concerned employee and upload it directly/automatically in the ledger and other records of the department eliminating manual entries completely.",
                "The solution is designed in such a way that it will be in modular form to cater to the needs of the future changes and requirements.",
                "Generate various forms, applications, authority letters/cheques for various claims/payments as per the practice/provisions in the rules.",
                "Transfer accounts related to subscriber and schemes between locations."
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-[#fff6e5]/60 border border-slate-100 hover:border-[#fc8151]/30 transition-all duration-200"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#fc8151] shrink-0 mt-0.5" />
                  <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Images Column */}
            <div className="lg:col-span-5 space-y-6 flex flex-col items-center">
              <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-3 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 w-full">
                <img
                  src="https://agile-labs.com/wp-content/uploads/2023/10/TECHNOLOGY_01.png"
                  alt="Technology Architecture Diagram"
                  className="w-full h-auto object-contain rounded-xl max-h-[350px] mx-auto"
                />
              </div>

              <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-3 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 w-full">
                <img
                  src="https://agile-labs.com/wp-content/uploads/2023/10/Activitics.png"
                  alt="Activities Workflow Diagram"
                  className="w-full h-auto object-contain rounded-xl max-h-[350px] mx-auto"
                />
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: BENEFITS */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl space-y-6">
          <div className="flex items-center gap-3.5 pb-2 border-b border-slate-100">
            <img
              src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
              alt="Icon"
              className="w-8 h-8 object-contain shrink-0"
            />
            <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
              BENEFITS
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#fff6e5] border border-[#fc8151]/30 transition-all duration-200">
              <CheckCircle2 className="w-6 h-6 text-[#fc8151] shrink-0 mt-0.5" />
              <p className="text-slate-800 text-base md:text-lg leading-relaxed">
                <strong className="text-[#00007f] font-bold">Advantage of using Axpert: </strong>
                The project was executed in <span className="font-bold text-slate-900">90 man months</span> with the help of Axpert and Agile methodology which has saved around <span className="font-bold text-[#fc8151]">45% of the project effort</span> distributed over various phases.
              </p>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#f0f5fa] border border-[#046bd2]/20 transition-all duration-200">
              <CheckCircle2 className="w-6 h-6 text-[#046bd2] shrink-0 mt-0.5" />
              <p className="text-slate-800 text-base md:text-lg leading-relaxed">
                <strong className="text-[#00007f] font-bold">Saving on resources and manpower: </strong>
                Automated treasury-level ledger posting completely eliminated manual entries, accelerating claim processing, cheque authority generation, and subscriber account transfers across all 50 state locations.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* CTA FOOTER WRAPPER */}
      <section className="bg-gradient-to-r from-[#00007f] via-[#000055] to-[#1e156d] py-20 px-6 relative z-10 text-center text-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#fc8151]/20 blur-[120px] pointer-events-none" />
        <h2 className="text-3xl md:text-5xl font-bold font-display mb-6 relative z-10">Ready to automate state-level e-governance systems?</h2>
        <p className="text-white/80 mb-10 max-w-2xl mx-auto relative z-10 text-lg">
          Join state data centers and public sector departments that trust Axpert to build secure, scalable, and high-volume public administration portals.
        </p>
        <Link href="/contact-us">
          <button className="bg-gradient-to-r from-[#fc8151] to-[#ffb25d] text-[#00007f] font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(252,129,81,0.5)] transition-all duration-300 hover:-translate-y-1 active:scale-95 mx-auto relative z-10 cursor-pointer">
            Get Started with Axpert <Sparkles className="w-5 h-5" />
          </button>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
