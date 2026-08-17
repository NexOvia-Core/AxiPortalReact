import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { MapPin, Phone, Mail, Send, MessageSquare } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-[#00007f] text-white selection:bg-[#fc8151] selection:text-white relative overflow-hidden font-body">
      <ScrollProgress />
      <Navigation />

      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[#fc8151]/10 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-[#00007f]/50 blur-[120px] pointer-events-none -z-10" />

      {/* 1. HERO SECTION */}
      <section className="pt-36 pb-16 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#fc8151] text-xs font-semibold uppercase tracking-widest mb-8"
        >
          <MessageSquare className="w-4 h-4 text-[#fc8151]" />
          Talk to us
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight text-white leading-[1.1] mb-6 max-w-4xl mx-auto"
        >
          We're here to <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#fc8151] via-[#ffb25d] to-white">help</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
        >
          You have questions, and we have answers. Reach out to our global teams for sales, support, or partnership inquiries.
        </motion.p>
      </section>

      {/* 2. CONTACT CONTENT */}
      <section className="py-12 pb-24 px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side: Office Information (Cream Card) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-8"
          >
            <div className="bg-[#fff8ee] text-[#1e293b] p-8 md:p-10 rounded-3xl border border-[#fc8151]/20 shadow-2xl relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(252,129,81,0.15)] transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#fc8151]/15 to-transparent rounded-bl-full pointer-events-none" />
              
              <h3 className="text-2xl font-bold font-display text-[#00007f] mb-6 flex items-center gap-3">
                <MapPin className="text-[#fc8151] w-6 h-6" />
                Corporate Office
              </h3>
              
              <div className="space-y-4 text-[#373e79]">
                <p className="font-bold text-[#00007f] text-lg">Agile Labs Pvt Ltd.</p>
                <p className="leading-relaxed font-medium text-[#373e79]">
                  #117, 3rd Floor, SV Complex,<br />
                  KR Road, 7th Block Jayanagar,<br />
                  Bangalore – 560070
                </p>
                
                <div className="pt-6 border-t border-slate-200/80 space-y-3 mt-6">
                  <a href="tel:+918041461141" className="flex items-center gap-3 text-[#373e79] font-semibold hover:text-[#fc8151] transition-colors">
                    <Phone className="w-5 h-5 text-[#fc8151]" />
                    +91 80 4146 1141
                  </a>
                  <a href="mailto:info@agile-labs.com" className="flex items-center gap-3 text-[#373e79] font-semibold hover:text-[#fc8151] transition-colors">
                    <Mail className="w-5 h-5 text-[#fc8151]" />
                    info@agile-labs.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-[#fff8ee] text-[#1e293b] p-8 md:p-10 rounded-3xl border border-[#fc8151]/20 shadow-2xl relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(252,129,81,0.15)] transition-all duration-500">
              <h3 className="text-xl font-bold font-display text-[#00007f] mb-6">Global Presence</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-extrabold text-[#fc8151] uppercase tracking-wider mb-2">Middle East</h4>
                  <p className="text-base font-semibold text-[#373e79]">Dubai, UAE</p>
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#fc8151] uppercase tracking-wider mb-2">Africa</h4>
                  <p className="text-base font-semibold text-[#373e79]">Nairobi, Kenya</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Contact Form (Cream Card) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="bg-[#fff8ee] text-[#1e293b] p-8 md:p-10 rounded-3xl border border-[#fc8151]/20 shadow-2xl hover:shadow-[0_20px_50px_rgba(252,129,81,0.15)] transition-all duration-500">
              <h3 className="text-2xl font-bold font-display text-[#00007f] mb-2">Send us a message</h3>
              <p className="text-[#373e79] mb-8 font-medium">We'll get back to you within 24 hours.</p>
              
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">First Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#fc8151] focus:ring-1 focus:ring-[#fc8151] transition-all font-medium"
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#fc8151] focus:ring-1 focus:ring-[#fc8151] transition-all font-medium"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#fc8151] focus:ring-1 focus:ring-[#fc8151] transition-all font-medium"
                    placeholder="jane@company.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Message</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#fc8151] focus:ring-1 focus:ring-[#fc8151] transition-all resize-none font-medium"
                    placeholder="How can we help you?"
                  />
                </div>

                <button className="w-full mt-4 bg-gradient-to-r from-[#fc8151] to-[#ffb25d] text-[#00007f] font-bold px-6 py-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-[0_0_25px_rgba(252,129,81,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer">
                  Send Message
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
