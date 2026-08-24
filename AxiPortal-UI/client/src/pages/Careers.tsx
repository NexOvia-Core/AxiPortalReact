import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { Briefcase, ArrowRight, CheckCircle2, ChevronRight, Zap } from "lucide-react";

const openPositions = [
  {
    title: "Senior Full Stack Engineer (Axpert Engine)",
    department: "Engineering",
    location: "Bangalore, India",
    type: "Full-time",
  },
  {
    title: "Enterprise Solutions Architect",
    department: "Solutions",
    location: "Dubai, UAE",
    type: "Full-time",
  },
  {
    title: "Product Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Database Administrator (Oracle/PostgreSQL)",
    department: "Engineering",
    location: "Bangalore, India",
    type: "Full-time",
  }
];

const benefits = [
  "Comprehensive Health Insurance",
  "Flexible Work Hours",
  "Continuous Learning & Certification Allowance",
  "Performance Bonuses",
  "Global Exposure & Travel",
  "Inclusive & Diverse Culture"
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-[#00007f] text-white selection:bg-[#fc8151] selection:text-white relative overflow-hidden font-body">
      <ScrollProgress />
      <Navigation />

      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[#fc8151]/10 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-[#00007f]/50 blur-[120px] pointer-events-none -z-10" />

      {/* 1. HERO SECTION */}
      <section className="pt-36 pb-20 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#fc8151] text-xs font-semibold uppercase tracking-widest mb-8"
        >
          <Zap className="w-4 h-4 text-[#fc8151]" />
          Join the Agile Team
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight text-white leading-[1.1] mb-6 max-w-4xl mx-auto"
        >
          Build the future of <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#fc8151] via-[#ffb25d] to-white">Enterprise IT</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
        >
          We are committed to bringing world-class, passionate professionals together. We take pride in our work culture and innovative platform.
        </motion.p>
      </section>

      {/* 2. WHY WORK WITH US */}
      <section className="py-16 px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-6">
              Our Culture & Benefits
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              At Agile Labs, you will work on the core of Axpert — an enterprise-grade low code platform that runs mission-critical applications globally. Be part of a culture that values engineering mastery, autonomy, and continuous growth.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#fc8151] shrink-0" />
                  <span className="text-white/80 text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="relative"
          >
            <div className="aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden glass border border-white/20 p-2">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
                alt="Agile Labs Team Collaboration"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. OPEN POSITIONS */}
      <section className="py-24 px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
            Open Positions
          </h2>
          <p className="text-white/60">Find your next role at Agile Labs.</p>
        </div>

        <div className="space-y-4">
          {openPositions.map((job, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="bg-[#fff6e5]/10 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-[#fff6e5]/20 hover:border-[#fc8151]/60 hover:bg-[#fff6e5]/20 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#fc8151] transition-colors">
                  {job.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4 text-[#fc8151]" /> {job.department}
                  </span>
                  <span>•</span>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.type}</span>
                </div>
              </div>
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#fff6e5]/15 border border-[#fff6e5]/25 group-hover:bg-[#fc8151] group-hover:text-[#00007f] transition-all text-white">
                <ChevronRight className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
