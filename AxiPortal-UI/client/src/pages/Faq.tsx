import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { HelpCircle, ChevronDown, Search } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Axpert?",
    answer: "Axpert is a US-Patented Rapid Application Development (RAD) low-code platform that enables enterprises to build complex, mission-critical applications at unparalleled speeds without sacrificing security or scalability.",
    category: "General"
  },
  {
    question: "How secure is the platform?",
    answer: "Security is built into the core. We employ advanced encryption, role-based access control, and comprehensive audit trails. Axpert is trusted by global banking, government, and defence organizations.",
    category: "Security"
  },
  {
    question: "Can Axpert integrate with our existing ERP?",
    answer: "Yes, Axpert features a powerful integration layer capable of connecting with legacy mainframes, modern cloud ERPs (like SAP or Oracle), and third-party APIs via REST and SOAP.",
    category: "Integration"
  },
  {
    question: "A site was created with HTTP. Subsequently, how to configure HTTPS?",
    answer: "You can transition your Axpert instance to HTTPS by installing a valid SSL certificate on your web server (IIS or Apache) and updating the base URL in the Axpert configuration manager.",
    category: "Deployment"
  },
  {
    question: "What deployment models are supported?",
    answer: "Axpert offers complete deployment flexibility. You can deploy it on-premise, in a private cloud, or use our fully managed Axpert Cloud Engine.",
    category: "Deployment"
  },
  {
    question: "What industries does Axpert serve?",
    answer: "Axpert powers applications across Government & Defence, Healthcare, Banking & Finance, Manufacturing, Logistics, and e-Courts — deployed in over 30 countries.",
    category: "General"
  },
  {
    question: "Do I need to know how to code to build on Axpert?",
    answer: "No. Axpert offers a range of ways to build, from a no-code visual app builder and drag-and-drop workflow designer, to low-code custom data sources and plugins, up to full REST APIs for teams that want complete control.",
    category: "Development"
  },
  {
    question: "Can Axpert integrate with the systems we already use?",
    answer: "Yes. Axpert connects to your existing ERP, HRMS, and finance tools out of the box, and offers a fully documented REST API and webhook events so your team can build custom integrations wherever you need them.",
    category: "Integration"
  },
  {
    question: "What deployment and security options does Axpert support?",
    answer: "Axpert can run in the cloud, on-premise, or in a private cloud, with role-based access control, full audit trails, and single sign-on — the same platform with no compromise on your security posture.",
    category: "Security"
  },
  {
    question: "How long does it take to get started?",
    answer: "Most teams go live in days, not months. Axpert Quickstart scaffolds a production-ready application from a starter template so you can start customising immediately instead of building from scratch.",
    category: "Getting Started"
  },
  {
    question: "What kind of support does Axpert offer?",
    answer: "Beyond our sales and support teams, Axpert has a growing ecosystem of certified consulting, technology, and professional services partners who can help with strategy, implementation, and ongoing managed services.",
    category: "Support"
  },
  {
    question: "Can Axpert scale as our business grows?",
    answer: "Yes. Add new teams, departments, and offices without rebuilding your workflows — role-based routing and full audit history come standard, so the same platform scales from your first workflow to thousands of users.",
    category: "Scalability"
  }
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const query = searchQuery.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        (faq.category && faq.category.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#fff6e5] font-body relative overflow-hidden">
      <ScrollProgress />
      <Navigation />

      {/* Ambient glows */}
      <div className="absolute top-20 left-1/4 w-[700px] h-[700px] rounded-full bg-[#00007f]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-[#fc8151]/10 blur-[150px] pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="pt-36 pb-12 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto text-center">
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
          className="text-lg md:text-xl text-[#00007f]/70 max-w-2xl mx-auto font-medium mb-10"
        >
          Find answers to common questions about Axpert's architecture, security, deployment, and capabilities.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="max-w-xl mx-auto relative"
        >
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-[#00007f]/40 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or keywords..."
              className="w-full pl-12 pr-4 py-3.5 bg-white/80 backdrop-blur-md rounded-2xl border border-[#00007f]/15 text-[#00007f] placeholder-[#00007f]/40 focus:outline-none focus:ring-2 focus:ring-[#fc8151]/50 shadow-sm transition-all text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 text-xs font-semibold text-[#00007f]/50 hover:text-[#fc8151] transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* 2. FAQ ACCORDION */}
      <section className="py-6 pb-32 px-6 lg:px-8 max-w-3xl mx-auto relative z-10">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 text-[#00007f]/60 font-medium">
            No questions found matching "{searchQuery}".
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.23, 1, 0.32, 1] }}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden backdrop-blur-md ${isOpen ? "bg-white border-[#fc8151]/50 shadow-md" : "bg-white/70 border-[#00007f]/10 hover:bg-white/90 shadow-sm"
                    }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <div className="flex flex-col gap-1">
                      {faq.category && (
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#fc8151]">
                          {faq.category}
                        </span>
                      )}
                      <h3 className={`text-lg font-bold font-display transition-colors ${isOpen ? "text-[#fc8151]" : "text-[#00007f]"}`}>
                        {faq.question}
                      </h3>
                    </div>
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
        )}
      </section>

      <Footer />
    </div>
  );
}

