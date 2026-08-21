import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Axpert?",
    answer: "Axpert is a US-Patented Rapid Application Development (RAD) low-code platform that enables enterprises to build complex, mission-critical applications at unparalleled speeds without sacrificing security or scalability."
  },
  {
    question: "How secure is the platform?",
    answer: "Security is built into the core. We employ advanced encryption, role-based access control, and comprehensive audit trails. Axpert is trusted by global banking, government, and defence organizations."
  },
  {
    question: "Can Axpert integrate with our existing ERP?",
    answer: "Yes, Axpert features a powerful integration layer capable of connecting with legacy mainframes, modern cloud ERPs (like SAP or Oracle), and third-party APIs via REST and SOAP."
  },
  {
    question: "A site was created with HTTP. Subsequently, how to configure HTTPS?",
    answer: "You can transition your Axpert instance to HTTPS by installing a valid SSL certificate on your web server (IIS or Apache) and updating the base URL in the Axpert configuration manager."
  },
  {
    question: "What deployment models are supported?",
    answer: "Axpert offers complete deployment flexibility. You can deploy it on-premise, in a private cloud, or use our fully managed Axpert Cloud Engine."
  }
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#fff6e5] font-body relative overflow-hidden">
      <ScrollProgress />
      <Navigation />

      {/* Ambient glows */}
      <div className="absolute top-20 left-1/4 w-[700px] h-[700px] rounded-full bg-[#00007f]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-[#fc8151]/10 blur-[150px] pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="pt-36 pb-16 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-[#00007f]/10 text-[#fc8151] text-xs font-bold uppercase tracking-widest mb-8 shadow-sm"
        >
          <HelpCircle className="w-4 h-4 text-[#fc8151]" />
          Support & Resources
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="text-4xl md:text-6xl font-extrabold font-display tracking-tight text-[#00007f] leading-[1.1] mb-6 max-w-4xl mx-auto"
        >
          Frequently Asked <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00007f] to-[#fc8151]">Questions</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="text-lg md:text-xl text-[#00007f]/70 max-w-2xl mx-auto font-medium"
        >
          Find answers to common questions about Axpert's architecture, security, deployment, and capabilities.
        </motion.p>
      </section>

      {/* 2. FAQ ACCORDION */}
      <section className="py-10 pb-32 px-6 lg:px-8 max-w-3xl mx-auto relative z-10">
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.23, 1, 0.32, 1] }}
                className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen ? "bg-white/80 border-[#fc8151]/50 shadow-lg" : "bg-white/40 border-white/60 hover:bg-white/60"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <h3 className={`text-lg font-bold font-display transition-colors ${isOpen ? "text-[#fc8151]" : "text-[#00007f]"}`}>
                    {faq.question}
                  </h3>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? "bg-[#fc8151]/10 text-[#fc8151] rotate-180" : "bg-[#00007f]/5 text-[#00007f]/50"}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <div className="px-6 pb-6 pt-2 text-[#00007f]/70 leading-relaxed border-t border-[#00007f]/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
