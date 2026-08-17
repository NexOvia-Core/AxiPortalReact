/**
 * Logos Section - Enhanced with glassmorphism and smoother motion
 * Trusted by companies with orbital visual treatment
 */
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const partnerLogos = [
  { name: "Dilmah", logo: "dilmah.png" },
  { name: "Lexir", logo: "lexir.png" },
  { name: "Bapco Energies", logo: "bapco.png" },
  { name: "Salcomp", logo: "salcomp.png" },
  { name: "Al Nowras", logo: "Alnowras.png" },
  { name: "Reitzel", logo: "reitzel.png" },
  { name: "Quess Corp", logo: "quess.png" },
  { name: "GI", logo: "GI.png" },
  { name: "Sanzi", logo: "sanzi.png" },
  { name: "TVS", logo: "tvs.png" },
  { name: "Avdel", logo: "avdel.png" },
  { name: "Zishta", logo: "Zishta_Logo.png" },
  { name: "STS", logo: "sts.png" },
  { name: "Maris", logo: "maris.png" },
  { name: "Formula", logo: "formula.png" },
  { name: "BMRCL", logo: "BMRCL.png" },
  { name: "Kauvery Hospital", logo: "Kauvery-Hospital.png" },
  { name: "BNB", logo: "BNB.png" },
  { name: "Government of Rajasthan", logo: "Government-of-Rajasthan.png" },
  { name: "Al-Turki", logo: "Al-Turki.png" },
  { name: "Assurant", logo: "Assurant.png" }
];

export default function LogosSection() {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section ref={ref} className="py-24 px-6 overflow-hidden relative" style={{ background: "#fff6e5" }}>
      {/* Gradient line divider */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#00007f]/8 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="text-center text-sm font-medium text-[#00007f]/40 uppercase tracking-[0.35em] mb-14"
        >
          Trusted by industry leaders worldwide
        </motion.p>

        {/* Infinite scroll marquee */}
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]">
          <motion.div
            animate={{ x: [0, -2600] }}
            transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-8 whitespace-nowrap py-2"
          >
            {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((partner, index) => (
              <div key={index} className="shrink-0">
                <div className="glass px-7 py-3.5 rounded-2xl flex items-center justify-center border border-white/80 bg-white/80 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md">
                  <img
                    src={`/partners/${partner.logo}`}
                    alt={partner.name}
                    className="h-9 max-w-[130px] object-contain transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#fc8151]/8 to-transparent" />
      </div>
    </section>
  );
}
