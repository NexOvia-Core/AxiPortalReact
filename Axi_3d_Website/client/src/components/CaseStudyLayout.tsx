import { ReactNode } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { ChevronLeft, Globe2, Sparkles } from "lucide-react";
import { Link } from "wouter";

interface CaseStudyLayoutProps {
  title: string;
  industry: string;
  subtitle: string;
  heroImage: string;
  children: ReactNode;
}

export default function CaseStudyLayout({ title, industry, subtitle, heroImage, children }: CaseStudyLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fff6e5] font-body relative overflow-hidden">
      <ScrollProgress />
      <Navigation />

      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[#00007f]/5 blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] rounded-full bg-[#fc8151]/5 blur-[120px] pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="pt-36 pb-16 relative z-10 px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mb-8"
        >
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-[#00007f]/60 hover:text-[#fc8151] font-semibold text-sm transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Case Studies
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-[#00007f]/10 text-[#00007f] text-xs font-bold uppercase tracking-widest mb-6 shadow-sm"
        >
          <Globe2 className="w-4 h-4 text-[#fc8151]" />
          {industry}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-[#00007f] leading-[1.1] mb-6"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="text-lg md:text-xl text-[#00007f]/70 font-medium leading-relaxed max-w-3xl"
        >
          {subtitle}
        </motion.p>
      </section>

      {/* 2. HERO IMAGE */}
      <section className="px-6 lg:px-8 max-w-6xl mx-auto relative z-10 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-3xl overflow-hidden glass-card bg-white shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-white/80 p-4 aspect-video"
        >
          <img 
            src={heroImage} 
            alt={title} 
            className="w-full h-full object-contain rounded-2xl"
          />
        </motion.div>
      </section>

      {/* 3. CONTENT BODY */}
      <section className="px-6 lg:px-8 max-w-4xl mx-auto relative z-10 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-[#00007f] prose-headings:font-bold prose-p:text-[#00007f]/70 prose-p:leading-relaxed prose-li:text-[#00007f]/70 prose-strong:text-[#00007f] prose-strong:font-bold"
        >
          {children}
        </motion.div>
      </section>

      {/* CTA Footer Wrapper */}
      <section className="bg-[#00007f] py-20 px-6 relative z-10 text-center text-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#fc8151]/20 blur-[120px] pointer-events-none" />
        <h2 className="text-3xl md:text-5xl font-bold font-display mb-6 relative z-10">Ready to transform your enterprise?</h2>
        <p className="text-white/70 mb-10 max-w-2xl mx-auto relative z-10 text-lg">
          Join hundreds of organizations worldwide that trust Axpert to build mission-critical applications at scale.
        </p>
        <Link href="/contact-us">
          <button className="bg-gradient-to-r from-[#fc8151] to-[#ffb25d] text-[#00007f] font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(252,129,81,0.5)] transition-all duration-300 hover:-translate-y-1 active:scale-95 mx-auto relative z-10">
            Get Started with Axpert <Sparkles className="w-5 h-5" />
          </button>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
