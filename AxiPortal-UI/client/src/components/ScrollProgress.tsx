/**
 * Scroll Progress Indicator - Top gradient bar showing scroll position
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      setProgress(totalHeight > 0 ? scrolled / totalHeight : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px]">
      <motion.div
        className="h-full origin-left"
        style={{
          width: `${progress * 100}%`,
          background: "linear-gradient(90deg, #00007f, #fc8151)",
        }}
      />
    </div>
  );
}
