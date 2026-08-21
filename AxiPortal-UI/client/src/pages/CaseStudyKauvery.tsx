import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { ChevronLeft, Sparkles, CheckCircle2, Hospital, Activity, FileCheck, Layers, Smartphone } from "lucide-react";
import { Link } from "wouter";

export default function CaseStudyKauvery() {
  return (
    <div className="min-h-screen bg-[#fcfcfd] font-body text-[#1e293b] relative overflow-hidden selection:bg-[#fc8151] selection:text-white">
      <ScrollProgress />
      <Navigation />

      {/* 1. HERO BANNER SECTION */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 bg-gradient-to-br from-[#00007f] via-[#000055] to-[#1e156d] text-white overflow-hidden">
        {/* Background Banner Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
          <img
            src="https://agile-labs.com/wp-content/uploads/2023/11/kauvery_case_studies.jpg"
            alt="Kauvery Group of Hospitals Banner"
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
            Multi-Speciality Healthcare Enterprise
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.15] mb-6"
          >
            Kauvery Group of Hospitals
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="text-lg md:text-xl text-white/80 font-medium leading-relaxed max-w-3xl"
          >
            Unified Hospital Information Management System (HIMS) powered by Axpert HIP across 7 multi-speciality hospital centers in Tamil Nadu.
          </motion.p>
        </div>
      </section>

      {/* MAIN CONTENT BODY CONTAINER */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-16 space-y-16 relative z-10">

        {/* SECTION 1: EXECUTIVE OVERVIEW */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
              <img
                src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
                alt="Icon"
                className="w-8 h-8 object-contain shrink-0"
              />
              <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
                EXECUTIVE OVERVIEW
              </h2>
            </div>

            <p className="text-slate-700 text-base md:text-lg leading-relaxed">
              Kauvery Group Of Hospitals Is A Chain Of 7 Multi-Speciality Hospitals Spread Across The State Of Tamil Nadu. Sprouting From An Established Foundation Laid In 1999, Kauvery Hospital Has Mushroomed Across Tamil Nadu To Become A Leading Global, Multispecialty Healthcare Enterprise. Their Medical And Non-Medical Staff Unite At The “Centres Of Excellence,” At Each Location, To Bring Together Healthcare Professionals And State-Of-The-Art Medical Technology To Serve Communities Across The Globe. Kauvery Hospital Is Globally Known For Its Multidisciplinary Services At All Its Centres Of Excellence, And For Its Comprehensive, Avant-Grade Technology, Especially In Diagnostics And Remedial Care In Heart Diseases, Transplantation, Vascular And Neurosciences Medicine.
            </p>
          </div>
        </section>

        {/* SECTION 2: AXPERT HIP IMPLEMENTATION */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
              <img
                src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
                alt="Icon"
                className="w-8 h-8 object-contain shrink-0"
              />
              <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
                AXPERT HIP IMPLEMENTATION
              </h2>
            </div>

            <p className="text-slate-700 text-base md:text-lg leading-relaxed">
              Agile Labs Implemented HIMS Built Using <span className="font-bold text-[#00007f]">Axpert HIP (Health Information Platform)</span> For Kauvery Group Of Hospitals, Tamil Nadu. Axpert HIP Is The Offshoot Of Axpert RAD Platform Which Is A US Patented Technology For Building Enterprise Class Applications. Axpert HIP Provides Unmatched Scalability For Healthcare Enterprises And It Suites Hospitals With Single As Well As Multiple Locations, Chain Of Labs, Pharmacy Chains, Chain Of Clinics, Large Enterprise Hospitals, Public Healthcare Establishments Etc. Being A Low Code Technology, Axpert HIP Can Be Quickly Customized And Configured As Per The Needs And Provides 100% Flexibility To Incorporate Change Requests That Arises In The Future. It Also Enables A Healthcare Establishment To Manage The HIMS In-House With A Small IT Team And Avoid Getting Vendor Locked.
            </p>
          </div>
        </section>

        {/* SECTION 3: SELECTION & RESULTS */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
              <img
                src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
                alt="Icon"
                className="w-8 h-8 object-contain shrink-0"
              />
              <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
                SELECTION &amp; RESULTS
              </h2>
            </div>

            <div className="bg-[#f0f5fa] border-l-4 border-[#046bd2] p-6 rounded-r-2xl space-y-4">
              <p className="text-slate-800 text-base md:text-lg leading-relaxed">
                Kauvery Group Of Hospitals Selected Axpert HIP For Its Low Coding Architecture, Scalability On Offer And Vendor Independence That Axpert Brings To The Table As A USP. The Entire Implementation At <span className="font-bold text-[#00007f]">7 Hospitals Under Kauvery Group Was Completed In 9 Months</span> With Customization At Each Of The Hospital Which Would Not Have Been Possible Without A Low Coding Platform.
              </p>
              <p className="text-slate-700 text-base md:text-lg leading-relaxed">
                With Axpert HIP, Kauvery Group Now Has An Advantage That They Could Build Any Module On Their Own If Required In Future With A <span className="font-bold text-[#fc8151]">2 Member IT Team Skilled In SQL</span>. The Internal IT Team Of Kauvery Is Currently Managing And Further Building Ancillary Modules In The HIMS Application Without Any Dependency On Agile Labs.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: ABOUT THE PROJECT */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl space-y-6">
          <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
            <img
              src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
              alt="Icon"
              className="w-8 h-8 object-contain shrink-0"
            />
            <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
              About The Project
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Integrated HIMS", icon: Hospital },
              { title: "LIMS And RIS Integrated Using HL7 Protocol", icon: Activity },
              { title: "Administration Workflow Streamlined", icon: Layers },
              { title: "Streamlined Discharge Process", icon: FileCheck },
              { title: "State Of The Art Dashboards With Drill Downs", icon: Smartphone }
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-[#fff6e5]/60 hover:border-[#fc8151]/30 transition-all duration-200"
                >
                  <IconComp className="w-6 h-6 text-[#fc8151] shrink-0" />
                  <span className="font-bold text-slate-800 text-sm md:text-base">{item.title}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: HIGHLIGHTS */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl space-y-6">
          <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
            <img
              src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
              alt="Icon"
              className="w-8 h-8 object-contain shrink-0"
            />
            <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
              Highlights:
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Automated Work Flow Across Departments and Hospitals",
              "End-to-end integration",
              "Reduction in TAT (Turnaround Time)",
              "Live Feeds: Daily Updates to Stakeholders on Status",
              "Status Updates Through Mobile Devices",
              "Monthly Updates from Management Based on Key Performance Indicators",
              "MIS Reports and Dashboards",
              "Event-Based Alerts for Patient Safety",
              "Integrated Finance and Supply Chain Modules",
              "Mobile Interface",
              "NABL and NABH Accreditation Reports"
            ].map((highlight, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-[#f0f5fa] hover:bg-[#e6f0fa] border border-[#046bd2]/20 transition-all duration-200"
              >
                <CheckCircle2 className="w-5 h-5 text-[#046bd2] shrink-0 mt-0.5" />
                <span className="text-slate-800 font-semibold text-sm md:text-base leading-relaxed">
                  {highlight}
                </span>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* CTA FOOTER WRAPPER */}
      <section className="bg-gradient-to-r from-[#00007f] via-[#000055] to-[#1e156d] py-20 px-6 relative z-10 text-center text-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#fc8151]/20 blur-[120px] pointer-events-none" />
        <h2 className="text-3xl md:text-5xl font-bold font-display mb-6 relative z-10">Ready to transform your healthcare network?</h2>
        <p className="text-white/80 mb-10 max-w-2xl mx-auto relative z-10 text-lg">
          Discover how Axpert HIP enables multi-speciality hospital networks to streamline clinical workflows and achieve HL7, NABH &amp; NABL compliance.
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
