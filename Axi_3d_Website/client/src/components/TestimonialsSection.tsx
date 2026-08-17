/**
 * Testimonials Section - Smooth Sliding Carousel
 * Updated with exact reviews from AxiPortal website & design matching Image 2
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Thirumavalavan",
    role: "Associate Vice President IT, Kauvey Hospital",
    text: "We built our complete Hospital Management System on Axpert low code platform. Our HMS is mission critical and has been running for 7+ years. Axpert has empowered our IT team. It helps us develop and deploy enterprise grade reliable applications."
  },
  {
    id: 2,
    name: "Nitin",
    role: "Vice President - Technology at Quess",
    text: "We use Axpert as our low code platform. AMS is one of our large application that is built on Axpert. We found Axpert to be capable of managing large data volumes and complex business scenarios with ease."
  },
  {
    id: 3,
    name: "Lalit",
    role: "Director Alnowras Logistics, Oman",
    text: "We have been using Axpert as our low code platform for nearly a decade. We have built our complete ERP on Axpert. We find it stable. It empowers our internal IT team. They have complete control on the software and are able change it as business needs change."
  },
  {
    id: 4,
    name: "Cylesh",
    role: "Addl. GM IT BMRCL",
    text: "At BMRCL, we have been using Axpert as our low code platform for more than a decade. We have built our end-to-end ERP and a comprehensive project monitoring system on Axpert. We have found it be a stable platform."
  }
];

export default function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [handleNext, isHovered]);

  // Show 2 cards at once on desktop, active index and next index
  const nextIndex = (currentIndex + 1) % reviews.length;
  const currentReviews = [reviews[currentIndex], reviews[nextIndex]];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 80 : -80,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <section id="testimonials" ref={ref} className="py-12 md:py-16 px-6 relative overflow-hidden" style={{ background: "#fff6e5" }}>
      {/* Ambient glows */}
      <div className="ambient-glow ambient-glow-coral w-[450px] h-[450px] top-0 left-1/4" />
      <div className="ambient-glow ambient-glow-blue w-[400px] h-[400px] bottom-0 right-1/4" />

      {/* Decorative orbital background rings */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full border border-[#fc8151]/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="font-[Space_Grotesk] text-4xl md:text-6xl font-bold text-[#00007f] mb-5 leading-tight">
            What the <span className="gradient-text">users says</span>
          </h2>
        </motion.div>

        {/* Main Sliding Grid Wrapper */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Reviews Slider Container (8 Cols) */}
          <div className="lg:col-span-8 relative min-h-[320px] flex flex-col justify-between">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full"
              >
                {currentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="glass-card rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden border border-white/70 shadow-lg hover:shadow-xl transition-all duration-500 bg-white/60"
                  >
                    {/* Hover Shimmer */}
                    <div className="absolute inset-0 shimmer opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#fc8151]/10 text-[#fc8151] mb-6">
                        <Quote size={20} />
                      </div>
                      <p className="text-[#00007f]/75 leading-relaxed text-sm md:text-[15px] font-normal mb-8">
                        "{review.text}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#00007f]/8">
                      <h4 className="font-[Space_Grotesk] font-bold text-[#00007f] text-base mb-0.5">
                        {review.name}
                      </h4>
                      <p className="text-xs text-[#00007f]/50 font-medium">
                        {review.role}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Average Rating & Navigation Sidebar (4 Cols) */}
          <div className="lg:col-span-4 glass-card rounded-3xl p-8 flex flex-col justify-between items-center text-center border border-white/80 bg-white/70 shadow-lg">
            <div className="w-full">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00007f]/40 mb-3 block">
                Average Rating
              </span>
              <h3 className="font-[Space_Grotesk] text-6xl font-bold text-[#00007f] mb-3">
                4.9
              </h3>
              <div className="flex items-center justify-center gap-1.5 text-[#fc8151] mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#fc8151" className="text-[#fc8151]" />
                ))}
              </div>
              <p className="text-xs font-medium text-[#00007f]/50">
                (30+) Customer reviews
              </p>
            </div>

            {/* Carousel Indicators & Arrow Controls */}
            <div className="w-full pt-8 border-t border-[#00007f]/8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all duration-400 ${idx === currentIndex || idx === nextIndex
                        ? "w-7 bg-[#fc8151]"
                        : "w-2 bg-[#00007f]/20 hover:bg-[#00007f]/40"
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-[#00007f] hover:bg-[#00007f] hover:text-white transition-all duration-300 shadow-sm active:scale-95"
                  aria-label="Previous review"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-[#00007f] hover:bg-[#00007f] hover:text-white transition-all duration-300 shadow-sm active:scale-95"
                  aria-label="Next review"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
