import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { ChevronLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export default function CaseStudyOckham() {
  return (
    <div className="min-h-screen bg-[#fcfcfd] font-body text-[#1e293b] relative overflow-hidden selection:bg-[#fc8151] selection:text-white">
      <ScrollProgress />
      <Navigation />

      {/* 1. HERO BANNER SECTION */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 bg-gradient-to-br from-[#00007f] via-[#000055] to-[#1e156d] text-white overflow-hidden">
        {/* Background Banner Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
          <img
            src="https://agile-labs.com/wp-content/uploads/2023/10/Ockham-Oncology_Banner.jpg"
            alt="Ockham Oncology Banner Background"
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
            Healthcare &amp; Clinical Research Services
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.15] mb-6"
          >
            Axpert_Ockham Oncology
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="text-lg md:text-xl text-white/80 font-medium leading-relaxed max-w-3xl"
          >
            Scaling clinical trial management, profitability analysis, and multi-continent CRO operations using the Axpert Low-Code Enterprise Platform.
          </motion.p>
        </div>
      </section>

      {/* MAIN CONTENT BODY CONTAINER */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-16 space-y-20 relative z-10">
        
        {/* SECTION 1: BUSINESS CHALLENGE */}
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
                <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
                  BUSINESS CHALLENGE
                </h2>
              </div>

              <p className="text-slate-700 text-base md:text-lg leading-relaxed">
                It was a good problem to have. Expecting only about a dozen or so new clinical trials in the next few months, Ockham, a leader in the field of oncology services, suddenly saw its new contracts jump more than five-fold. Having recently acquired a contract research organization (CRO) in Scotland, and, before that, a US-based CRO, Ockham’s business was growing quickly—but not without some growing pains.
              </p>

              <p className="text-slate-700 text-base md:text-lg leading-relaxed">
                Even before the acquisitions and growth spurt, Ockham, which provides a full range of services to pharmaceutical companies— from providing top-notch research staff, to managing and conducting end-to-end cancer therapy clinical trials—Ockham faced a big challenge in finding the right software tools to manage the lifecycle of its Clinical Studies.. The company, based in Cary, North Carolina, chose Toronto-based Mindprint Inc. for a company-wide professional services automation (PSA) system that promised to make the entire company more productive and profitable.
              </p>

              <div className="bg-[#f0f5fa] border-l-4 border-[#046bd2] p-6 rounded-r-2xl space-y-3">
                <p className="text-slate-800 text-base md:text-lg italic leading-relaxed font-medium">
                  “We have completed more than 250 clinical trials for new cancer therapies,” <span className="not-italic text-slate-700">explains Jim Baker, founder and CEO of Ockham.</span> “But one of our biggest challenges was measuring the profitability of each study, simple as that may sound. We just didn’t have the right tools in place to do that consistently and accurately.”
                </p>
                <p className="text-slate-600 text-sm">
                  Baker added that integrating the data systems of the new acquisitions was also a challenge that required a new set of tools.
                </p>
              </div>
            </div>

            {/* Right Image Column: Profitability Analysis */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-4 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 max-w-sm w-full">
                <img
                  src="https://agile-labs.com/wp-content/uploads/2023/10/Profitability-Analysis.png"
                  alt="Profitability Analysis"
                  className="w-full h-auto object-contain rounded-2xl"
                />
                <p className="text-center text-xs font-semibold text-slate-500 mt-3 uppercase tracking-wider">
                  Profitability Analysis Dashboard
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: SCALABILITY & GROWING PAINS RESOLUTION */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Image Column: Oncology Research Image */}
            <div className="lg:col-span-5 flex flex-col items-center order-2 lg:order-1">
              <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-4 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 w-full">
                <img
                  src="https://agile-labs.com/wp-content/uploads/2023/10/oncology_1.jpg"
                  alt="Oncology Clinical Trials"
                  className="w-full h-auto object-cover rounded-2xl max-h-[380px]"
                />
              </div>
            </div>

            {/* Right Text Column */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <p className="text-slate-700 text-base md:text-lg leading-relaxed">
                Mindprint, which specializes in enterprise software for CROs, was nearing deployment of Ockham’s new custom system—when news of the sudden spurt in business came in. <span className="font-semibold text-slate-900">“We had to move quickly to import a large number of studies into the system,”</span> explains Prasad A. Sristi, founder and CEO of Mindprint. <span className="font-semibold text-slate-900">“But we were able to quickly redesign a core part of the system to allow for the importation of a large number of new projects, and make the system much more scalable. We turned a challenge into an opportunity.”</span>
              </p>

              <div className="bg-[#fff6e5] border-l-4 border-[#fc8151] p-6 rounded-r-2xl">
                <p className="text-slate-800 text-base md:text-lg leading-relaxed">
                  For Ockham, the business challenges caused by the outdated software, quickly turned into formidable new tools for business growth and profitability. <span className="font-bold text-[#00007f]">“We work seamlessly across four continents now,”</span> notes Baker. <span className="italic">“Our staff is more effective, our clients are happier, and we are on a sound growth path.”</span>
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: TECHNOLOGY */}
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
                <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
                  TECHNOLOGY
                </h2>
              </div>

              <p className="text-slate-700 text-base md:text-lg leading-relaxed">
                The technology that made all this possible is an innovative platform called <span className="font-bold text-[#00007f]">Axpert</span>, developed by Bangalore, India-based <span className="font-bold text-[#fc8151]">Agile Labs</span>. The patented Axpert system is based on a method of rapidly creating custom enterprise software – without expensive and time-consuming programming.
              </p>

              <p className="text-slate-700 text-base md:text-lg leading-relaxed">
                <span className="font-semibold text-slate-900">“Axpert makes application development and maintenance easy, by substantially reducing the effort required,”</span> explains Prasad Sristi, founder and CEO of Mindprint, which developed a large library of Axpert modules specifically for CROs. Application development using Axpert requires only domain experts. No expensive coding is required.
              </p>
            </div>

            {/* Right Image Column: Technology */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-4 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 w-full">
                <img
                  src="https://agile-labs.com/wp-content/uploads/2023/10/TECHNOLOGY.jpg"
                  alt="Axpert Technology Architecture"
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: CORE FUNCTIONALITY */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl space-y-8">
          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
            <img
              src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
              alt="Icon"
              className="w-8 h-8 object-contain shrink-0"
            />
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
                CORE FUNCTIONALITY &amp; SYSTEM CAPABILITIES
              </h2>
              <p className="text-slate-500 font-medium text-sm mt-1">
                Fully functional Professional Services Automation (PSA) system — a single operational system to run the entire company.
              </p>
            </div>
          </div>

          <div className="bg-[#f8fafc] p-6 rounded-2xl border border-slate-200/60">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Fully scalable solution that will allow the software system to continue to grow with the company
            </h3>
            <p className="text-slate-600 text-sm font-medium">
              Core functionality comprising the following capabilities:
            </p>
          </div>

          {/* Grid Layout: Features List & Showcase Images */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Capabilities Bullet List */}
            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  title: "Study Proposals",
                  desc: "built-in flexibility, allows customizable proposals for each client's unique requirements, with risk-free, fixed-bid, engagement model."
                },
                {
                  title: "Study Management",
                  desc: "includes automated staffing, timesheet and expense report generation."
                },
                {
                  title: "Revenue Forecasting",
                  desc: "using business intelligence technology that can be fine-tuned by user input. No programing required."
                },
                {
                  title: "Resource Planning",
                  desc: "allows Ockham to align their professional resources with the client's exact needs."
                },
                {
                  title: "Invoicing",
                  desc: "highly automated invoice generation cuts invoicing time, allows for high level of individual client personalization."
                },
                {
                  title: "Customer Relationship Management (CRM)",
                  desc: "includes client management, lead generation, and site report generation."
                },
                {
                  title: "Human Resources (HR)",
                  desc: "automated expense reports, vacations, and sick days."
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-[#fff6e5]/60 border border-slate-100 hover:border-[#fc8151]/30 transition-all duration-200"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#fc8151] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#00007f]">{item.title}: </span>
                    <span className="text-slate-700 text-sm md:text-base">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Images Column: PE and CEO-Ockham */}
            <div className="lg:col-span-5 space-y-6 flex flex-col items-center">
              <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-3 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 w-full">
                <img
                  src="https://agile-labs.com/wp-content/uploads/2023/10/PE.jpg"
                  alt="Process & Execution"
                  className="w-full h-auto object-cover rounded-xl"
                />
              </div>

              <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-3 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 w-full">
                <img
                  src="https://agile-labs.com/wp-content/uploads/2023/10/CEO-Ockham.jpg"
                  alt="Ockham Leadership & Operations"
                  className="w-full h-auto object-cover rounded-xl"
                />
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 5: BENEFITS */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Image Column: Benefits Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center order-2 lg:order-1">
              <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-4 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 w-full">
                <img
                  src="https://agile-labs.com/wp-content/uploads/2023/10/BENEFITS.jpg"
                  alt="Ockham Business Benefits"
                  className="w-full h-auto object-contain rounded-2xl max-h-[600px]"
                />
              </div>
            </div>

            {/* Right Text Column: Benefits List */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
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
                    highlight: "Entire company working on a single & simple-to-use platform.",
                    detail: " Excellent scalability and low training requirements."
                  },
                  {
                    highlight: "Much more accurate financial data.",
                    detail: " No mis-reported units and returned invoices Accurate financial forecasts for the entire company. Senior management can look into the next 12 months of expected cash flow with the click of a single button."
                  },
                  {
                    highlight: "More discipline in budgets.",
                    detail: " Ockham team is able to churn out dozens of budgets from our system every month."
                  },
                  {
                    highlight: "Invoicing time cut down drastically.",
                    detail: ""
                  },
                  {
                    highlight: "High visibility into profitability.",
                    detail: " Study profitability is measured down to each unit based on the salary of employees actually working on those units."
                  },
                  {
                    highlight: "Decreased administration overhead costs.",
                    detail: " Ockham can quickly start operations in a new country or geography."
                  }
                ].map((b, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-[#f0f5fa] hover:bg-[#e6f0fa] border border-[#046bd2]/20 transition-all duration-200"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#046bd2] shrink-0 mt-0.5" />
                    <p className="text-slate-800 text-sm md:text-base leading-relaxed">
                      <strong className="text-[#00007f] font-bold">{b.highlight}</strong>
                      {b.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* CTA FOOTER WRAPPER */}
      <section className="bg-gradient-to-r from-[#00007f] via-[#000055] to-[#1e156d] py-20 px-6 relative z-10 text-center text-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#fc8151]/20 blur-[120px] pointer-events-none" />
        <h2 className="text-3xl md:text-5xl font-bold font-display mb-6 relative z-10">Ready to transform your enterprise?</h2>
        <p className="text-white/80 mb-10 max-w-2xl mx-auto relative z-10 text-lg">
          Join leading organizations worldwide that trust Axpert to build mission-critical applications at scale.
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
