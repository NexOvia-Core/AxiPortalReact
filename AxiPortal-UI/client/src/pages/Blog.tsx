import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { BookOpen, ArrowRight, User } from "lucide-react";

const blogPosts = [
  {
    title: "The Evolution of Low-Code in Enterprise Environments",
    category: "Technology",
    author: "Sabarish Santhanam",
    date: "October 02, 2025",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80",
    excerpt: "Exploring how rapid application development platforms are reshaping the way modern enterprises approach custom software development.",
  },
  {
    title: "Modernizing Legacy Systems Without Downtime",
    category: "Strategy",
    author: "Vishwanatha HV",
    date: "September 15, 2025",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80",
    excerpt: "A comprehensive guide to transitioning from legacy mainframes to agile, cloud-native ERP solutions using Axpert.",
  },
  {
    title: "Building Secure Applications for Government",
    category: "Security",
    author: "Bijaya Singh",
    date: "August 28, 2025",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80",
    excerpt: "Key considerations for architecting high-security governance and skill tracking systems for public sector procurement.",
  },
  {
    title: "Microservices Architecture in Low Code",
    category: "Engineering",
    author: "Ganga K Unni",
    date: "July 12, 2025",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80",
    excerpt: "Deep dive into how the Axpert platform leverages microservices to ensure scalability across African and international markets.",
  },
  {
    title: "Optimizing Supply Chain with Axpert",
    category: "Supply Chain",
    author: "Jeyram S R",
    date: "June 05, 2025",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80",
    excerpt: "How process manufacturing and multi-national logistics operations achieve 40% cost reductions.",
  },
  {
    title: "The Future of E-Governance",
    category: "Public Sector",
    author: "Chandrashekar Gopalan",
    date: "May 20, 2025",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80",
    excerpt: "Strategic insights into corporate governance, philanthropic education, and bridging the public-private tech gap.",
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#fff6e5] font-body relative overflow-hidden">
      <ScrollProgress />
      <Navigation />

      {/* Ambient glows */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] rounded-full bg-[#00007f]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full bg-[#fc8151]/10 blur-[150px] pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="pt-36 pb-20 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-[#00007f]/10 text-[#fc8151] text-xs font-bold uppercase tracking-widest mb-8 shadow-sm"
        >
          <BookOpen className="w-4 h-4 text-[#fc8151]" />
          The Agile Blog
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="text-4xl md:text-6xl font-extrabold font-display tracking-tight text-[#00007f] leading-[1.1] mb-6 max-w-4xl mx-auto"
        >
          We love to share our <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00007f] to-[#fc8151]">knowledge</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="text-lg md:text-xl text-[#00007f]/70 max-w-2xl mx-auto font-medium"
        >
          Insights, engineering deep-dives, and strategic perspectives from the creators of the Axpert platform.
        </motion.p>
      </section>

      {/* 2. BLOG GRID */}
      <section className="py-10 pb-32 px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, idx) => (
            <motion.article
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="glass-card bg-white/70 rounded-3xl overflow-hidden border border-white/80 shadow-lg hover:shadow-2xl transition-all duration-500 group flex flex-col"
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-[#00007f]/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/50 text-[10px] font-bold text-[#00007f] shadow-sm uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold font-display text-[#00007f] mb-3 group-hover:text-[#fc8151] transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-[#00007f]/60 text-sm leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between pt-4 border-t border-[#00007f]/10">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#00007f]/50">
                      <User className="w-3.5 h-3.5" />
                      {post.author}
                    </div>
                    <span className="text-[10px] font-bold text-[#fc8151] uppercase tracking-wider">{post.date}</span>
                  </div>
                  
                  <div className="mt-5 inline-flex items-center gap-2 text-[#fc8151] font-bold text-sm group-hover:gap-3 transition-all cursor-pointer">
                    Read Post <ArrowRight className="w-4 h-4" />
                  </div>
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
