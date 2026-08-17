import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { ChevronLeft, Sparkles, CheckCircle2, Shield, Smartphone, CreditCard, Building, Car, QrCode, Radio } from "lucide-react";
import { Link } from "wouter";

export default function CaseStudyBidhannagar() {
  return (
    <div className="min-h-screen bg-[#fcfcfd] font-body text-[#1e293b] relative overflow-hidden selection:bg-[#fc8151] selection:text-white">
      <ScrollProgress />
      <Navigation />

      {/* 1. HERO BANNER SECTION */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 bg-gradient-to-br from-[#00007f] via-[#000055] to-[#1e156d] text-white overflow-hidden">
        {/* Background Banner Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
          <img
            src="https://agile-labs.com/wp-content/uploads/2023/11/bidhannagar-commissionerate.jpg"
            alt="Bidhannagar Commissionerate Banner"
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
            Public Governance &amp; Smart Policing
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.15] mb-6"
          >
            Bidhannagar Commissionerate
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="text-lg md:text-xl text-white/80 font-medium leading-relaxed max-w-3xl"
          >
            Digitalizing traffic fine collections, citizen e-services portal, and airport prepaid taxi management powered by Axpert RAD.
          </motion.p>
        </div>
      </section>

      {/* MAIN CONTENT BODY CONTAINER */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-16 space-y-16 relative z-10">

        {/* SECTION 1: MOBILE TRAFFIC FINE COLLECTION */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl space-y-6">
          <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
            <img
              src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
              alt="Icon"
              className="w-8 h-8 object-contain shrink-0"
            />
            <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
              MOBILE TRAFFIC FINE COLLECTION
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="bg-[#f0f5fa] p-5 rounded-2xl border border-[#046bd2]/20 space-y-2">
              <div className="flex items-center gap-2 text-[#00007f] font-bold">
                <Smartphone className="w-5 h-5 text-[#fc8151]" /> On-Spot POS Digital Fine
              </div>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                Equipped police personnel with mobile POS devices for card payments and instant on-the-spot challans &amp; web seizure payments.
              </p>
            </div>

            <div className="bg-[#f0f5fa] p-5 rounded-2xl border border-[#046bd2]/20 space-y-2">
              <div className="flex items-center gap-2 text-[#00007f] font-bold">
                <Shield className="w-5 h-5 text-[#046bd2]" /> VAHAN DB Integration
              </div>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                Automatic vehicle owner details lookup from VAHAN database via vehicle and chassis number search with SMS alert receipts.
              </p>
            </div>

            <div className="bg-[#f0f5fa] p-5 rounded-2xl border border-[#046bd2]/20 space-y-2">
              <div className="flex items-center gap-2 text-[#00007f] font-bold">
                <CreditCard className="w-5 h-5 text-emerald-600" /> Repeat Offender History
              </div>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                Stores complete traffic violation histories accessible on mobile POS devices, ensuring total enforcement transparency.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-slate-700 text-base md:text-lg leading-relaxed">
            <p>
              The Traffic Fine Collection Under Bidhannagar Commissionerate Is Digitalized And The Police Personal Is Equipped With Mobile Devices Using Which Citizens Can Pay Fine Using Debit/Credit Cards And Challans Can Be Generated On The Spot. It Also Has A Web Portal Through Which Payment Towards Seizure Challans Can Be Made.
            </p>
            <p>
              The System Will Generate SMS Alert On Paying The Penalty. The Details Of The Vehicle Owner Will Be Automatically Picked From The VAHAN Database, The Police Officer Just Needs To Search Using The Vehicle Number And The Chassis Number.
            </p>
            <p>
              The System Will Also Store The History Of Traffic Violations And Helps The Police In Keeping A Track On The Repeat Offenders. The Data Is Easily Accessible On The Mobile Device For The Police And It Makes Law Enforcement So Much Easier. Also, The Public Is At An Advantage That The Payment Can Be Made Easily Using Card And Getting The Challan Immediately. The Whole System Of Fine Collection Has Become Extremely Transparent.
            </p>
          </div>
        </section>

        {/* SECTION 2: POLICE SERVICES PORTAL VIA AXPERT RAD */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl space-y-6">
          <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
            <img
              src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
              alt="Icon"
              className="w-8 h-8 object-contain shrink-0"
            />
            <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
              Police Services Through Portal Made Possible Using Axpert RAD Platform:
            </h2>
          </div>

          <div className="space-y-4 text-slate-700 text-base md:text-lg leading-relaxed">
            <p>
              Digitization Of Police Services Seldom Happens In Our Country And Bidhannagar Commissionerate Would Be Among The Few Commissionerates That Offers Digitalized Service To The Citizens. Such A System Saves The Citizens From The Pain Of Physically Visiting The Police Stations, Waiting In Queue For Making Payments And Puts An End To The Indefinite Wait Time To Know The Status Of Their Applications. Also, For The Police Department, It Has Reduced The Work Load And The Amount Of Paper Work Involved.
            </p>

            <div className="bg-[#fff6e5] border-l-4 border-[#fc8151] p-6 rounded-r-2xl space-y-3">
              <p className="text-slate-800 font-medium">
                The Solution Developed Using Axpert RAD Platform Is A Workflow Enabled System That Enables The Citizens File The Applications Online. At Each Stage Of Processing Of The Application By The Department, SMS And Email Notifications Will Be Send To The Applicant.
              </p>
              <p className="text-slate-700 text-sm">
                It Also Has Dashboard And Reporting Capabilities Which Lets The Higher Authorities Keep A Track Of Pending Applications And Bottle Necks. Citizens Can Register On The Portal Using Their Mobile Numbers. Unique ID Will Be Provided For Each Citizen Registered. For Online Payments, There Is Integration With BillDesk. Also, Citizens Can View The FIR Registered Through Portal.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: SERVICES THAT ARE AUTOMATED */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl space-y-8">
          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
            <img
              src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
              alt="Icon"
              className="w-8 h-8 object-contain shrink-0"
            />
            <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
              Services That Are Automated :
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* B2B Services */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <Building className="w-6 h-6 text-[#00007f]" />
                <h3 className="text-lg font-extrabold font-display text-[#00007f] uppercase tracking-wide">
                  Business to Business (B2B)
                </h3>
              </div>

              <div className="space-y-2.5">
                {[
                  "New Arms Licenses For Companies",
                  "Renewal Arms Licenses For Companies",
                  "Application For Addition/Deletion Of Retainer",
                  "Application For Holding Festivals(Mela)/ Ceremonies/ Meeting/ Procession/ Musical Function/ Political Procession/ Political Meeting Etc."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/60 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#fc8151] shrink-0 mt-0.5" />
                    <span className="text-slate-800 text-xs md:text-sm font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* B2C Services */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <Smartphone className="w-6 h-6 text-[#fc8151]" />
                <h3 className="text-lg font-extrabold font-display text-[#fc8151] uppercase tracking-wide">
                  Business to Customer (B2C)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  "Report Grievance",
                  "Lost Item E-GD",
                  "Tenant Registration",
                  "Domestic Help / Baby Sitter Reg.",
                  "Security Guard Registration",
                  "Registration Of Milk Man",
                  "Senior Citizen Registration",
                  "New Arms License (Individual)",
                  "Renewal Arms License (Individual)",
                  "Outside Licensing Authority (Arms)",
                  "Registration Of Sarai",
                  "Paying Guest Registration",
                  "Landlord Registration",
                  "Sarai License Renewal"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200/60 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#046bd2] shrink-0" />
                    <span className="text-slate-800 text-xs font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 4: AIRPORT PREPAID TAXI AUTOMATION */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl space-y-6">
          <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
            <img
              src="https://agile-labs.com/wp-content/uploads/2021/08/ball-icon-48.png"
              alt="Icon"
              className="w-8 h-8 object-contain shrink-0"
            />
            <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#00007f] tracking-tight uppercase">
              AIRPORT PREPAID TAXI AUTOMATION
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="bg-[#f0f5fa] p-5 rounded-2xl border border-[#046bd2]/20 space-y-2">
              <div className="flex items-center gap-2 text-[#00007f] font-bold">
                <QrCode className="w-5 h-5 text-[#fc8151]" /> QR-Code Dual Challan
              </div>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                Passengers book at prepaid counter with cash/card. Dual QR-code challans generated for passenger &amp; driver scanning for payout.
              </p>
            </div>

            <div className="bg-[#f0f5fa] p-5 rounded-2xl border border-[#046bd2]/20 space-y-2">
              <div className="flex items-center gap-2 text-[#00007f] font-bold">
                <Smartphone className="w-5 h-5 text-[#046bd2]" /> Portal &amp; Mobile Advance Booking
              </div>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                Advance portal &amp; app booking sends instant SMS with QR-code for direct scanning at airport taxi bays.
              </p>
            </div>

            <div className="bg-[#f0f5fa] p-5 rounded-2xl border border-[#046bd2]/20 space-y-2">
              <div className="flex items-center gap-2 text-[#00007f] font-bold">
                <Radio className="w-5 h-5 text-emerald-600" /> RFID Cab Tracking &amp; Complaints
              </div>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                Automatic RFID airport bay cab tracking and integrated passenger complaint handling module.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-slate-700 text-base md:text-lg leading-relaxed">
            <p>
              At The Prepaid Counter, Passengers Can Book The Taxi By Providing The Destination. Payment Can Be Made With Cash Or Card. Two Challans Will Be Generated With QR Code – One For The Passenger And The Other For The Driver. After The Trip, Driver Can Scan The QR Code At The Counter And Get Payment.
            </p>
            <p>
              If The Taxi Is Booked In Advance Through The Portal, The Passenger Will Get A Message With A QR Code. This QR Code Can Be Scanned At The Taxi Counter At The Airport And Avail The Ride. The Mobile App Can Also Be Used For Booking The Taxi And Payment Can Be Made Through The App.
            </p>
            <p>
              The System Also Has A Passenger Complaint Handling Module. The Cabs Are Tracked At The Airport Bay Using RFID.
            </p>
          </div>
        </section>

      </main>

      {/* CTA FOOTER WRAPPER */}
      <section className="bg-gradient-to-r from-[#00007f] via-[#000055] to-[#1e156d] py-20 px-6 relative z-10 text-center text-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#fc8151]/20 blur-[120px] pointer-events-none" />
        <h2 className="text-3xl md:text-5xl font-bold font-display mb-6 relative z-10">Ready to transform public governance and smart policing?</h2>
        <p className="text-white/80 mb-10 max-w-2xl mx-auto relative z-10 text-lg">
          Discover how Axpert RAD enables police departments and municipal authorities to automate mobile fine collection, citizen e-services, and transit portals.
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
