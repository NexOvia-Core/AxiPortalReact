import React, { useState } from "react";
import { motion } from "framer-motion";
import FadeIn from "./FadeIn";

interface PartnerLogo {
  name: string;
  url: string;
  fallbackText: string;
  accentColor: string;
}

// Complete list of 21 companies from AxiPortal
const partnerLogosRow1: PartnerLogo[] = [
  {
    name: "Reitzel India",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/reitzel.png",
    fallbackText: "REITZEL INDIA",
    accentColor: "#10B981",
  },
  {
    name: "Quess Corp",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/quess.png",
    fallbackText: "QUESS CORP",
    accentColor: "#0284C7",
  },
  {
    name: "Gi Group",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/GI.png",
    fallbackText: "Gi Group",
    accentColor: "#2563EB",
  },
  {
    name: "Zi Sanzi",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/sanzi.png",
    fallbackText: "Zi SANZI",
    accentColor: "#1E1B4B",
  },
  {
    name: "TVS Motors",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/tvs.png",
    fallbackText: "TVS MOTORS",
    accentColor: "#DC2626",
  },
  {
    name: "Avdel India",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/avdel.png",
    fallbackText: "AVDEL INDIA",
    accentColor: "#0284C7",
  },
  {
    name: "Dilmah Tea",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/dilmah.png",
    fallbackText: "DILMAH TEA",
    accentColor: "#047857",
  },
];

const partnerLogosRow2: PartnerLogo[] = [
  {
    name: "Zishta Bangalore",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/Zishta_Logo.png",
    fallbackText: "ZISHTA",
    accentColor: "#7C3AED",
  },
  {
    name: "STS",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/sts.png",
    fallbackText: "STS",
    accentColor: "#059669",
  },
  {
    name: "Maris Associates",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/maris.png",
    fallbackText: "MARIS",
    accentColor: "#047857",
  },
  {
    name: "Formula 1",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/formula.png",
    fallbackText: "FORMULA 1",
    accentColor: "#EF4444",
  },
  {
    name: "Bapco Energies",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/bapco.png",
    fallbackText: "BAPCO ENERGIES",
    accentColor: "#B45309",
  },
  {
    name: "Salcomp",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/salcomp.png",
    fallbackText: "SALCOMP",
    accentColor: "#4338CA",
  },
  {
    name: "Lexir",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/lexir.png",
    fallbackText: "LEXIR",
    accentColor: "#00007f",
  },
];

const partnerLogosRow3: PartnerLogo[] = [
  {
    name: "Govt of Rajasthan",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/Government-of-Rajasthan.png",
    fallbackText: "GOVT. OF RAJASTHAN",
    accentColor: "#D97706",
  },
  {
    name: "BMRCL Metro",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/BMRCL.png",
    fallbackText: "BMRCL METRO",
    accentColor: "#059669",
  },
  {
    name: "Kauvery Hospital",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/Kauvery-Hospital.png",
    fallbackText: "KAUVERY HOSPITAL",
    accentColor: "#E11D48",
  },
  {
    name: "Al Nowras",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/Alnowras.png",
    fallbackText: "AL NOWRAS",
    accentColor: "#00007f",
  },
  {
    name: "BNB",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/BNB.png",
    fallbackText: "BNB",
    accentColor: "#2563EB",
  },
  {
    name: "Al Turki",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/Al-Turki.png",
    fallbackText: "AL TURKI",
    accentColor: "#1E1B4B",
  },
  {
    name: "Assurant",
    url: "https://axi-global.com/AxiPortal/assets/imgs/partners/Assurant.png",
    fallbackText: "ASSURANT",
    accentColor: "#0284C7",
  },
];

// Crisp Logo Card component with white background tile (No shadow fade overlay)
const LogoCard: React.FC<{ logo: PartnerLogo }> = ({ logo }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="h-20 sm:h-24 px-6 sm:px-8 bg-white border border-[#1E1B4B]/15 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-300 min-w-[170px] sm:min-w-[210px]">
      {!imageError ? (
        <img
          src={logo.url}
          alt={logo.name}
          onError={() => setImageError(true)}
          className="max-h-10 sm:max-h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
        />
      ) : (
        <span
          className="font-black text-sm sm:text-base tracking-wider uppercase text-center"
          style={{ color: logo.accentColor }}
        >
          {logo.fallbackText}
        </span>
      )}
    </div>
  );
};

export const MarqueeSectionPortfolio: React.FC = () => {
  // Triple arrays for seamless 100% infinite marquee loops
  const loopRow1 = [...partnerLogosRow1, ...partnerLogosRow1, ...partnerLogosRow1];
  const loopRow2 = [...partnerLogosRow2, ...partnerLogosRow2, ...partnerLogosRow2];
  const loopRow3 = [...partnerLogosRow3, ...partnerLogosRow3, ...partnerLogosRow3];

  return (
    <section className="w-full bg-[#fff6e5] text-[#1E1B4B] py-20 px-5 sm:px-8 md:px-10 overflow-hidden flex flex-col items-center justify-center gap-12 border-y border-[#1E1B4B]/10">

      {/* Centered Header & Subheader from AxiPortal */}
      <div className="flex flex-col items-center text-center gap-3 max-w-3xl">
        <FadeIn delay={0} y={20}>
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#00007f]/20 bg-white/80 text-xs uppercase tracking-widest text-[#00007f] font-bold shadow-xs">
            GLOBAL TRUST & SCALE
          </span>
        </FadeIn>

        <FadeIn delay={0.1} y={20}>
          <h2 className="font-[Space_Grotesk] text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-[#00007f]">
            1 Lakh users <span className="gradient-text">worldwide</span>
          </h2>
        </FadeIn>

        <motion.p initial=
          {{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-base sm:text-lg md:text-xl text-[#00007f]/75 max-w-3xl mx-auto mb-10 leading-relaxed font-normal" >
          Axpert software trusted by the great company
        </motion.p>
      </div>

      {/* Full-width Infinity Loop Ticker Rows (No overlay fade shadows) */}
      <div className="w-full flex flex-col gap-6 overflow-hidden relative">

        {/* Row 1 Ticker (Slides LEFT infinitely) */}
        <div className="w-full overflow-hidden flex">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 28,
              repeat: Infinity,
            }}
            className="flex gap-4 sm:gap-6 items-center flex-nowrap w-max"
          >
            {loopRow1.map((logo, idx) => (
              <LogoCard key={`row1-${logo.name}-${idx}`} logo={logo} />
            ))}
          </motion.div>
        </div>

        {/* Row 2 Ticker (Slides RIGHT infinitely) */}
        <div className="w-full overflow-hidden flex">
          <motion.div
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              ease: "linear",
              duration: 32,
              repeat: Infinity,
            }}
            className="flex gap-4 sm:gap-6 items-center flex-nowrap w-max"
          >
            {loopRow2.map((logo, idx) => (
              <LogoCard key={`row2-${logo.name}-${idx}`} logo={logo} />
            ))}
          </motion.div>
        </div>

        {/* Row 3 Ticker (Slides LEFT infinitely) */}
        <div className="w-full overflow-hidden flex">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 30,
              repeat: Infinity,
            }}
            className="flex gap-4 sm:gap-6 items-center flex-nowrap w-max"
          >
            {loopRow3.map((logo, idx) => (
              <LogoCard key={`row3-${logo.name}-${idx}`} logo={logo} />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default MarqueeSectionPortfolio;
