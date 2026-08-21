import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { ChevronLeft, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function CaseStudyMetro() {
  return (
    <div className="min-h-screen bg-[#fcfcfd] font-body text-[#1e293b] relative overflow-hidden selection:bg-[#fc8151] selection:text-white">
      <ScrollProgress />
      <Navigation />

      {/* 1. HERO BANNER SECTION */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 bg-gradient-to-br from-[#00007f] via-[#000055] to-[#1e156d] text-white overflow-hidden">
        {/* Background Banner Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
          <img
            src="https://agile-labs.com/wp-content/uploads/2023/11/Metro.jpg"
            alt="Metro Rail Infrastructure Banner"
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
            Metro Rail Infrastructure &amp; Station Operations
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.15] mb-6"
          >
            Axpert – Metro Rail
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="text-lg md:text-xl text-white/80 font-medium leading-relaxed max-w-3xl"
          >
            Managing contractor billing, station operations, financial accounting, and core enterprise architecture for major metro rail systems.
          </motion.p>
        </div>
      </section>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-16 space-y-16 relative z-10">

        {/* SECTION 1: UNIQUE FEATURES */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <img
                src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
                alt="Icon"
                className="w-8 h-8 object-contain shrink-0"
              />
              <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
                Unique features
              </h2>
            </div>

            <div className="bg-gradient-to-b from-slate-50 to-slate-100/80 p-4 md:p-6 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex justify-center">
              <img
                src="https://agile-labs.com/wp-content/uploads/2023/10/Unique-features.png"
                alt="Axpert Metro Rail Unique Features"
                className="w-full max-w-4xl h-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: MANAGE CONTRACTS OF SUPPLIERS AND CONTRACTORS */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <img
                src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
                alt="Icon"
                className="w-8 h-8 object-contain shrink-0"
              />
              <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
                Manage contracts of suppliers and contractors
              </h2>
            </div>

            <div className="bg-gradient-to-b from-slate-50 to-slate-100/80 p-4 md:p-6 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex justify-center">
              <img
                src="https://agile-labs.com/wp-content/uploads/2023/10/suppliers-and-contractors.png"
                alt="Supplier and Contractor Management Workflow"
                className="w-full max-w-4xl h-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* SECTION 3: CONTROL OPERATIONS AT STATIONS */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <img
                src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
                alt="Icon"
                className="w-8 h-8 object-contain shrink-0"
              />
              <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
                Control operations at stations
              </h2>
            </div>

            <div className="bg-gradient-to-b from-slate-50 to-slate-100/80 p-4 md:p-6 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex justify-center">
              <img
                src="https://agile-labs.com/wp-content/uploads/2023/10/Control-and-station.jpg"
                alt="Control Operations at Stations"
                className="w-full max-w-4xl h-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* SECTION 4: FINANCIAL ACCOUNTING */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <img
                src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
                alt="Icon"
                className="w-8 h-8 object-contain shrink-0"
              />
              <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
                Financial accounting
              </h2>
            </div>

            <div className="bg-gradient-to-b from-slate-50 to-slate-100/80 p-4 md:p-6 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex justify-center">
              <img
                src="https://agile-labs.com/wp-content/uploads/2023/10/Financial.jpg"
                alt="Financial Accounting Engine"
                className="w-full max-w-4xl h-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* SECTION 5: MANAGE WITH EASE */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <img
                src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
                alt="Icon"
                className="w-8 h-8 object-contain shrink-0"
              />
              <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
                Manage with ease
              </h2>
            </div>

            <div className="bg-gradient-to-b from-slate-50 to-slate-100/80 p-4 md:p-6 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex justify-center">
              <img
                src="https://agile-labs.com/wp-content/uploads/2023/10/Manage-with-else.png"
                alt="Manage Metro Rail Operations with Ease"
                className="w-full max-w-4xl h-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* SECTION 6: ARCHITECTURE */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <img
                src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
                alt="Icon"
                className="w-8 h-8 object-contain shrink-0"
              />
              <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
                Architecture
              </h2>
            </div>

            <div className="bg-gradient-to-b from-slate-50 to-slate-100/80 p-4 md:p-6 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex justify-center">
              <img
                src="https://agile-labs.com/wp-content/uploads/2023/10/Architecture_axpert.jpg"
                alt="Axpert Low-Code Architecture"
                className="w-full max-w-4xl h-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* SECTION 7: AXPERT CUSTOMER LIST */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl">
          <div className="space-y-8">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <img
                src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
                alt="Icon"
                className="w-8 h-8 object-contain shrink-0"
              />
              <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
                Axpert Customer List…..few
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="bg-gradient-to-b from-slate-50 to-slate-100/80 p-4 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex justify-center">
                <img
                  src="https://agile-labs.com/wp-content/uploads/2023/10/Axpert_india.png"
                  alt="Axpert India Enterprise Customers"
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>

              <div className="bg-gradient-to-b from-slate-50 to-slate-100/80 p-4 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex justify-center">
                <img
                  src="https://agile-labs.com/wp-content/uploads/2023/10/Axpert_Global.png"
                  alt="Axpert Global Enterprise Customers"
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* CTA FOOTER WRAPPER */}
      <section className="bg-gradient-to-r from-[#00007f] via-[#000055] to-[#1e156d] py-20 px-6 relative z-10 text-center text-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#fc8151]/20 blur-[120px] pointer-events-none" />
        <h2 className="text-3xl md:text-5xl font-bold font-display mb-6 relative z-10">Ready to transform your enterprise infrastructure?</h2>
        <p className="text-white/80 mb-10 max-w-2xl mx-auto relative z-10 text-lg">
          Join leading transit authorities and government agencies worldwide that trust Axpert to power large-scale operational systems.
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
