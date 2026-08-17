import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { ChevronLeft, Sparkles, CheckCircle2, Cpu, BarChart3, Clock, Users, Globe } from "lucide-react";
import { Link } from "wouter";

export default function CaseStudySutures() {
  return (
    <div className="min-h-screen bg-[#fcfcfd] font-body text-[#1e293b] relative overflow-hidden selection:bg-[#fc8151] selection:text-white">
      <ScrollProgress />
      <Navigation />

      {/* 1. HERO BANNER SECTION */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 bg-gradient-to-br from-[#00007f] via-[#000055] to-[#1e156d] text-white overflow-hidden">
        {/* Background Banner Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
          <img
            src="https://agile-labs.com/wp-content/uploads/2023/10/Healthcare.jpg"
            alt="Healthcare & Manufacturing Banner"
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
            Healthcare &amp; Manufacturing
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.15] mb-6"
          >
            Axpert - Healthcare &amp; Manufacturing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="text-lg md:text-xl text-white/80 font-medium leading-relaxed max-w-3xl"
          >
            Sutures India Pvt. Ltd. — Complete Automation Required for Easier Management with Global Outreach &amp; Distributor Network Control.
          </motion.p>
        </div>
      </section>

      {/* MAIN CONTENT BODY CONTAINER */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-16 space-y-16 relative z-10">

        {/* SECTION 1: BUSINESS SITUATION */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
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
                    Complete Automation Required : For easier Management
                  </p>
                </div>
              </div>

              <p className="text-slate-700 text-base md:text-lg leading-relaxed">
                With its global outreach, <span className="font-bold text-[#00007f]">Sutures India Pvt. Ltd.</span> had felt the importance and need for a comprehensive ERP solution for effectively managing their entire business processes, maintaining huge amounts of data and information and having a better control on Distributor Sales.
              </p>

              <p className="text-slate-700 text-base md:text-lg leading-relaxed">
                Sutures India Pvt. Ltd. have many distributors across the country who maintain the product stock at their locations. Distributors sell these products to the stockists in their respective regions. A system that managed the complete process at the distributor site and provided info for the day-to-day operations, to Area managers and the Sales Reps easily was an obvious need of the hour.
              </p>
            </div>

            {/* Right Diagram Image Column */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-4 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 w-full flex justify-center">
                <img
                  src="https://agile-labs.com/wp-content/uploads/2023/10/Medical-_-Healthcare.png"
                  alt="Medical & Healthcare Business Architecture"
                  className="w-full max-w-sm h-auto object-contain rounded-2xl"
                />
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: CHALLENGES */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl space-y-6">
          <div className="flex items-center gap-3.5 pb-2 border-b border-slate-100">
            <img
              src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
              alt="Icon"
              className="w-8 h-8 object-contain shrink-0"
            />
            <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
              CHALLENGES
            </h2>
          </div>

          <div className="bg-[#fff6e5] border-l-4 border-[#fc8151] p-6 rounded-r-2xl">
            <p className="text-slate-800 text-base md:text-lg leading-relaxed font-medium">
              Key challenge was to provide a system which is easy to use as well as easily accessible by all distributors to place orders and view information. Map / Customize their unique process requirements in the product. To deploy the complete solution in less than 9 months elapsed time and also to rollout the solution to all Distributors within the same time frame.
            </p>
          </div>
        </section>

        {/* SECTION 3: PROJECT STATISTICS & TECH STACK */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Project Statistics Card */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-8 shadow-xl border border-slate-100/80 flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
            <div>
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
                <BarChart3 className="w-7 h-7 text-[#fc8151]" />
                <h3 className="text-xl font-extrabold font-display text-[#00007f] uppercase tracking-wide">
                  PROJECT STATISTICS
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                    <Clock className="w-4 h-4 text-[#fc8151]" /> Total Effort
                  </div>
                  <p className="text-slate-900 font-extrabold text-base">40 man months</p>
                  <p className="text-slate-500 text-xs mt-0.5">Agile Methodologies &amp; Axpert</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                    <BarChart3 className="w-4 h-4 text-[#00007f]" /> Duration
                  </div>
                  <p className="text-slate-900 font-extrabold text-base">9 months</p>
                  <p className="text-slate-500 text-xs mt-0.5">Elapsed time to deployment</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                    <Globe className="w-4 h-4 text-[#046bd2]" /> Delivery Model
                  </div>
                  <p className="text-slate-900 font-extrabold text-base">50% Onsite / 50% Offshore</p>
                  <p className="text-slate-500 text-xs mt-0.5">Hybrid implementation</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                    <Users className="w-4 h-4 text-emerald-600" /> Concurrent Users
                  </div>
                  <p className="text-slate-900 font-extrabold text-base">50+ Concurrent Users</p>
                  <p className="text-slate-500 text-xs mt-0.5">High volume transactions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technology and Tools Card */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-8 shadow-xl border border-slate-100/80 flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
            <div>
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
                <Cpu className="w-7 h-7 text-[#00007f]" />
                <h3 className="text-xl font-extrabold font-display text-[#00007f] uppercase tracking-wide">
                  TECHNOLOGY AND TOOLS
                </h3>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {[
                  "AXPERT 7.7.6.7",
                  "Microsoft .Net Framework",
                  "ASP .Net",
                  "VB .Net",
                  "C#",
                  "Oracle 10g",
                  "XML",
                  "Delphi",
                  "Microsoft Windows Server 2008",
                  "Linux",
                  "Microsoft Office 2007",
                  "Microsoft Projects 2007"
                ].map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#00007f]/10 text-[#00007f] font-semibold text-xs md:text-sm border border-slate-200/80 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </section>

        {/* SECTION 4: SOLUTION */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl space-y-8">
          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
            <img
              src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
              alt="Icon"
              className="w-8 h-8 object-contain shrink-0"
            />
            <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
              SOLUTION
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Diagram Column */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-4 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 w-full flex justify-center">
                <img
                  src="https://agile-labs.com/wp-content/uploads/2023/10/COMPLETE-ERP-SOLUTION.png"
                  alt="Complete ERP Solution Architecture"
                  className="w-full max-w-sm h-auto object-contain rounded-2xl"
                />
              </div>
            </div>

            {/* Right Capabilities List */}
            <div className="lg:col-span-7 space-y-4">
              {[
                "Axpert with standard process repositories was used for development and Implementation.",
                "Complete process of Finance (covering General Ledger, Accounts Payable, Accounts Receivable, Bank Reconciliation) , Procurement, Sales (including Distributor management) , Manufacturing and Payroll was provided to address all their existing pain points.",
                "Web based solution was provided to enable the Distributors for transacting with Axpert.",
                "Web based solution for Sales person (located across many cities in India) to track their performance against budget.",
                "Employee Portal – for the employees to view / edit their personnel information and to view notice board information."
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

          </div>
        </section>

        {/* SECTION 5: BENEFITS */}
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
            {[
              {
                bold: "Change management: ",
                text: "The Internal IT team of Sutures is able to maintain the application and make the required changes as and when required and requested by business users. The technology provides complete flexibility and scalability."
              },
              {
                bold: "Very low Hardware investments. ",
                text: "Works on average configuration servers and machines."
              },
              {
                bold: "Simple to maintain and extend. ",
                text: "The cost of maintenance is very low. And thus better Return Of Investment."
              }
            ].map((b, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-[#f0f5fa] hover:bg-[#e6f0fa] border border-[#046bd2]/20 transition-all duration-200"
              >
                <CheckCircle2 className="w-5 h-5 text-[#046bd2] shrink-0 mt-0.5" />
                <p className="text-slate-800 text-sm md:text-base leading-relaxed">
                  <strong className="text-[#00007f] font-bold">{b.bold}</strong>
                  {b.text}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* CTA FOOTER WRAPPER */}
      <section className="bg-gradient-to-r from-[#00007f] via-[#000055] to-[#1e156d] py-20 px-6 relative z-10 text-center text-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#fc8151]/20 blur-[120px] pointer-events-none" />
        <h2 className="text-3xl md:text-5xl font-bold font-display mb-6 relative z-10">Ready to transform your healthcare &amp; manufacturing operations?</h2>
        <p className="text-white/80 mb-10 max-w-2xl mx-auto relative z-10 text-lg">
          Join global manufacturers and healthcare enterprises that trust Axpert to automate complex distributor networks and enterprise workflows.
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
