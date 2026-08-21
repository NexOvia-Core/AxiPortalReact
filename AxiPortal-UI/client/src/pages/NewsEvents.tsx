import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";

const newsItems = [
  {
    type: "News",
    title: "An introduction to Axpert by Agile Labs",
    date: "October 15, 2025",
    description: "Discover how Axpert is transforming the enterprise software landscape with its patented low-code rapid application development capabilities.",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80",
  },
  {
    type: "Event",
    title: "Agile Labs at Global Tech Summit",
    date: "November 10, 2025",
    description: "Join our leadership team in Dubai as we showcase the newest Axpert Cloud Engine capabilities to global enterprise architects.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
  },
  {
    type: "Press Release",
    title: "SKOCH Smart Governance Award",
    date: "September 28, 2025",
    description: "Agile Labs recognized for outstanding contribution to public sector digital transformation and e-governance solutions.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80",
  },
  {
    type: "News",
    title: "Axpert 11.0 Released",
    date: "August 05, 2025",
    description: "The latest version of our platform introduces AI-assisted schema generation and advanced microservices architecture.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80",
  }
];

export default function NewsEvents() {
  return (
    <div className="min-h-screen bg-[#fff6e5] font-body relative overflow-hidden">
      <ScrollProgress />
      <Navigation />

      {/* Ambient glows */}
      <div className="ambient-glow ambient-glow-blue w-[600px] h-[600px] top-0 right-0 opacity-50" />
      <div className="ambient-glow ambient-glow-coral w-[600px] h-[600px] bottom-0 left-0 opacity-30" />

      {/* 1. HERO SECTION */}
      <section className="pt-36 pb-20 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-[#00007f]/10 text-[#00007f] text-xs font-bold uppercase tracking-widest mb-8 shadow-sm"
        >
          <Newspaper className="w-4 h-4 text-[#fc8151]" />
          News & Events
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="text-4xl md:text-6xl font-extrabold font-display tracking-tight text-[#00007f] leading-[1.1] mb-6 max-w-4xl mx-auto"
        >
          Catch the latest happenings at <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#fc8151] to-[#ffb25d]">Agile Labs</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="text-lg md:text-xl text-[#00007f]/70 max-w-2xl mx-auto font-medium"
        >
          Stay up to date with product announcements, enterprise case studies, webinars, and global tech events.
        </motion.p>
      </section>

      {/* 2. GRID SECTION */}
      <section className="py-10 pb-32 px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newsItems.map((item, idx) => (
            <motion.article
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="glass-card bg-white/70 rounded-3xl overflow-hidden border border-white/80 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group flex flex-col"
            >
              {/* Image Header */}
              <div className="relative h-60 overflow-hidden">
                <div className="absolute inset-0 bg-[#00007f]/10 z-10 group-hover:bg-transparent transition-colors duration-500" />
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/50 text-xs font-bold text-[#00007f] shadow-sm uppercase tracking-wider">
                    {item.type}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-8 flex-1 flex flex-col justify-between relative">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#fc8151] mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.date}
                  </div>
                  
                  <h3 className="text-2xl font-bold font-display text-[#00007f] mb-3 group-hover:text-[#fc8151] transition-colors leading-tight">
                    {item.title}
                  </h3>
                  
                  <p className="text-[#00007f]/60 font-medium leading-relaxed mb-8">
                    {item.description}
                  </p>
                </div>
                
                <div className="inline-flex items-center gap-2 text-[#fc8151] font-bold text-sm group-hover:gap-3 transition-all cursor-pointer">
                  Read Article <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
