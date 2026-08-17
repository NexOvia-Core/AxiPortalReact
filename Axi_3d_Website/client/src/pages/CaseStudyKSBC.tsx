import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { ChevronLeft, Sparkles, CheckCircle2, Cpu, Building2, Radio, Clock, Database, Layers, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export default function CaseStudyKSBC() {
  return (
    <div className="min-h-screen bg-[#fcfcfd] font-body text-[#1e293b] relative overflow-hidden selection:bg-[#fc8151] selection:text-white">
      <ScrollProgress />
      <Navigation />

      {/* 1. HERO BANNER SECTION */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 bg-gradient-to-br from-[#00007f] via-[#000055] to-[#1e156d] text-white overflow-hidden">
        {/* Background Banner Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
          <img
            src="https://agile-labs.com/wp-content/uploads/2023/10/Beverages.jpg"
            alt="Karnataka State Beverages Banner"
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
            Beverage Logistics &amp; State Distribution Network
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.15] mb-6"
          >
            Karnataka State Beverages
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="text-lg md:text-xl text-white/80 font-medium leading-relaxed max-w-3xl"
          >
            Karnataka State Beverages Corporation Ltd. (KSBCL) — Synchronizing huge volumes of data from 53+ depots across weak bandwidth infrastructure with 3-month rapid deployment.
          </motion.p>
        </div>
      </section>

      {/* MAIN CONTENT BODY CONTAINER */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-16 space-y-16 relative z-10">

        {/* METRICS HIGHLIGHT BAR */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100/80 flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[#00007f]/10 text-[#00007f]">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">State Network</p>
              <p className="text-xl font-extrabold text-slate-900">53+ Depots &amp; HO</p>
              <p className="text-slate-500 text-xs mt-0.5">Centralized data sync</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100/80 flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[#fc8151]/10 text-[#fc8151]">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Daily Volume</p>
              <p className="text-xl font-extrabold text-slate-900">1000+ Tx / Branch</p>
              <p className="text-slate-500 text-xs mt-0.5">Low-bandwidth sync</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100/80 flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[#046bd2]/10 text-[#046bd2]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Deployment Time</p>
              <p className="text-xl font-extrabold text-slate-900">&lt; 3 Months</p>
              <p className="text-slate-500 text-xs mt-0.5">Full state-wide rollout</p>
            </div>
          </div>
        </section>

        {/* SECTION 1: BUSINESS SITUATION & CHALLENGES */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3.5 pb-2 border-b border-slate-100">
                <img
                  src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
                  alt="Icon"
                  className="w-8 h-8 object-contain shrink-0"
                />
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
                    BUSINESS SITUATION
                  </h2>
                  <p className="text-[#fc8151] font-semibold text-sm mt-0.5">
                    Huge volume of Data to synchronize, limited bandwidth.
                  </p>
                </div>
              </div>

              <p className="text-slate-700 text-base md:text-lg leading-relaxed">
                The core activities of the <span className="font-bold text-[#00007f]">Karnataka State Beverages Corporation Ltd. (KSBCL)</span> are to procure liquor and spirit from manufacturers/suppliers and sell the same to wholesalers/licensees. Thus data consolidation from the 53+ branches at the Head Office (HO) was an important and required task. Also daily corporate MIS / DSS had to be generated. Thus a system to manage their business processes covering these tasks apart from Finance, Sales &amp; Distribution, Purchasing &amp; Inventory modules was the need of the hour.
              </p>

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
                    alt="Icon"
                    className="w-6 h-6 object-contain shrink-0"
                  />
                  <h3 className="text-xl font-bold text-[#00007f] uppercase tracking-wide">
                    CHALLENGES
                  </h3>
                </div>

                <div className="space-y-3">
                  {[
                    "Key challenge was to provide a system which is easy to use due to the nonavailability of skilled operators & lack of tech skill at the branches.",
                    "No broadband connectivity at many of the branches, even the dial-up connections present were weak. Huge volume of data from all the branches had to be synchronized at the HO, with this infrastructure, on a daily basis. (1000+ transactions from each branch daily)",
                    "To deploy the complete solution in less than 3 months elapsed time."
                  ].map((challenge, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#fff6e5] border border-[#fc8151]/30"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#fc8151] shrink-0 mt-0.5" />
                      <p className="text-slate-800 text-sm md:text-base leading-relaxed font-medium">
                        {challenge}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Image Column: Beverages KB */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-4 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 w-full flex justify-center">
                <img
                  src="https://agile-labs.com/wp-content/uploads/2023/10/Beverages-_KB.png"
                  alt="Beverages Data Architecture"
                  className="w-full max-w-sm h-auto object-contain rounded-2xl"
                />
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: TECHNOLOGY AND TOOLS */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Cpu className="w-7 h-7 text-[#00007f]" />
            <h3 className="text-xl md:text-2xl font-extrabold font-display text-[#00007f] uppercase tracking-wide">
              TECHNOLOGY AND TOOLS
            </h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              "PROFIT 5RM 6.2",
              "P5 Sync Server/Client",
              "Microsoft .Net Framework",
              "ASP .Net",
              "VB .Net",
              "C#",
              "Oracle 10g",
              "Delphi",
              "Microsoft Windows Server 2008",
              "Linux"
            ].map((tech, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-[#00007f]/10 text-[#00007f] font-bold text-sm border border-slate-200/80 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* SECTION 3: SOLUTION & MODULES */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl space-y-8">
          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
            <img
              src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
              alt="Icon"
              className="w-8 h-8 object-contain shrink-0"
            />
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
                SOLUTION
              </h2>
              <p className="text-[#fc8151] font-semibold text-sm mt-0.5">
                Implemented the following core enterprise modules:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Image Column: Solution Diagram */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-4 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 w-full flex justify-center">
                <img
                  src="https://agile-labs.com/wp-content/uploads/2023/10/Solution_KB.png"
                  alt="KSBCL Solution Modules Architecture"
                  className="w-full max-w-sm h-auto object-contain rounded-2xl"
                />
              </div>
            </div>

            {/* Right Modules Grid */}
            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  name: "Financial Accounting",
                  desc: "Apart from Depot updating the central server this module at HO is also been used for making regular financial accounting entries like – Payment / Journals / Contra / Debit – Credit Note etc …"
                },
                {
                  name: "Vendor Payment",
                  desc: "Calculates Brand wise, Supplier Wise, Item Wise Sales Quantity. Picks the Purchase Rate based on Sales Date and Calculates the Purchase value supplier wise. Adjustment towards excise duties and other recoveries. Generates suppliers / Bank Wise Advice for transfer of Funds."
                },
                {
                  name: "Demurrage Calculation",
                  desc: "Calculates Age of Stock more than 90 days. Applies Demurrage rate per case item wise, supplier wise where ever applicable."
                },
                {
                  name: "Pricing",
                  desc: "Basic Declared Price – Excise + Additional Excise Duty is calculated. Margin is added and KSBCL Purchase and selling Price is derived. MRP of Retailer Per Bottle is Calculated on Purchase. Based on weekly payment module a detailed report of Purchase value is generated. Interface for entering Purchase Voucher."
                },
                {
                  name: "OFS / TON",
                  desc: "3rd party generates the Order for Supply [ OFS ] and provides it to our database which is converted into actual data and sent through synchronization to respective depot. TON Interface is provided between depots. On approval the document is populated to both Send / Receive depots."
                },
                {
                  name: "Sales",
                  desc: "Generation of Sales Indent after confirming the availability of Items. Checklist for Loading [Materials]. Generation of Invoice – After validating the availability of Funds in Party Accounts and calculation of TCS [Tax Collected at Source]."
                }
              ].map((mod, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 hover:bg-[#f0f5fa] border border-slate-100 hover:border-[#046bd2]/30 transition-all duration-200 space-y-1.5"
                >
                  <div className="flex items-center gap-2 text-[#00007f] font-bold text-base md:text-lg">
                    <Layers className="w-5 h-5 text-[#fc8151] shrink-0" />
                    {mod.name}
                  </div>
                  <p className="text-slate-700 text-xs md:text-sm leading-relaxed pl-7">
                    {mod.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* SECTION 4: BENEFITS & STAKEHOLDER HIGHWAY */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl space-y-8">
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Benefit Highlights Text Cards */}
            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  bold: "Online information available to stakeholder: ",
                  detail: "Excise, retailers, manufacturers, and government. Information highway opened to manufacturers."
                },
                {
                  bold: "Basic & Consolidated view at HO of all depots: ",
                  detail: "Real-time tracking of Sales, Inventory, Purchase, Receipts, Payments, and Financial Accounting across all 53+ depots."
                },
                {
                  bold: "Accurate & Online inventory information: ",
                  detail: "Decision-support MIS on Supplies, stock movement and fund management."
                },
                {
                  bold: "Issue OFS (order for supply): ",
                  detail: "Web-based Order for Supply generation secured with digital signatures."
                }
              ].map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4.5 rounded-2xl bg-[#f0f5fa] hover:bg-[#e6f0fa] border border-[#046bd2]/20 transition-all duration-200"
                >
                  <ShieldCheck className="w-5 h-5 text-[#046bd2] shrink-0 mt-0.5" />
                  <p className="text-slate-800 text-sm md:text-base leading-relaxed">
                    <strong className="text-[#00007f] font-bold">{b.bold}</strong>
                    {b.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Benefit Showcase Images */}
            <div className="lg:col-span-5 space-y-6 flex flex-col items-center">
              <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-3 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 w-full">
                <img
                  src="https://agile-labs.com/wp-content/uploads/2023/10/BENEFITS_01.png"
                  alt="KSBCL Business Benefits"
                  className="w-full h-auto object-contain rounded-xl max-h-[350px] mx-auto"
                />
              </div>

              <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-3 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 w-full">
                <img
                  src="https://agile-labs.com/wp-content/uploads/2023/10/CUSTOMER-_01.png"
                  alt="Customer & Stakeholder Highway"
                  className="w-full h-auto object-contain rounded-xl max-h-[220px] mx-auto"
                />
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* CTA FOOTER WRAPPER */}
      <section className="bg-gradient-to-r from-[#00007f] via-[#000055] to-[#1e156d] py-20 px-6 relative z-10 text-center text-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#fc8151]/20 blur-[120px] pointer-events-none" />
        <h2 className="text-3xl md:text-5xl font-bold font-display mb-6 relative z-10">Ready to automate large-scale state distribution networks?</h2>
        <p className="text-white/80 mb-10 max-w-2xl mx-auto relative z-10 text-lg">
          Discover how Axpert enables state corporations and logistics enterprises to synchronize high-volume branch data seamlessly over limited connectivity.
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
