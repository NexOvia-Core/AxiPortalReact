import React, { useState } from "react";
import FadeIn from "./FadeIn";
import Magnet from "./Magnet";
import ContactButton from "./ContactButton";

interface HeroSectionPortfolioProps {
  onContactClick?: () => void;
}

export const HeroSectionPortfolio: React.FC<HeroSectionPortfolioProps> = ({ onContactClick }) => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <section className="h-screen w-full flex flex-col justify-between overflow-x-clip relative bg-[#fff6e5] text-[#1E1B4B]">
      {/* 1. NAVBAR */}
      <FadeIn delay={0} y={-20} className="w-full z-20">
        <nav className="w-full flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8">
          {/* Brand / Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <img 
              src="/AXI_LOGO_AXPERT.png" 
              alt="AXI Logo" 
              className="h-9 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </a>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-14">
            {["About", "Price", "Projects", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[#1E1B4B] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setNavOpen(!navOpen)}
            className="md:hidden text-[#1E1B4B] p-2 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {navOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Dropdown */}
        {navOpen && (
          <div className="md:hidden flex flex-col items-center gap-4 py-6 bg-[#fff6e5]/95 border-b border-[#1E1B4B]/10 text-center">
            {["About", "Price", "Projects", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setNavOpen(false)}
                className="text-[#1E1B4B] font-medium uppercase tracking-wider text-base hover:opacity-70"
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </FadeIn>

      {/* 2. HERO PORTRAIT / 3D CENTER GRAPHIC (ABSOLUTE CENTERED WITH MAGNET) */}
      <FadeIn delay={0.6} y={30} className="absolute left-1/2 -translate-x-1/2 z-10 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 pointer-events-auto">
        <Magnet
          padding={150}
          strength={3}
          activeTransition="transform 0.3s ease-out"
          inactiveTransition="transform 0.6s ease-in-out"
          className="w-full flex justify-center items-end"
        >
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png"
            alt="3D Creator Portrait"
            className="w-full h-auto object-contain max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] drop-shadow-2xl select-none"
            onError={(e) => {
              // Fallback to local 3D hero asset if figma URL has network restrictions
              (e.target as HTMLImageElement).src = "/hero-3d-scene_e55b0c1e.webp";
            }}
          />
        </Magnet>
      </FadeIn>

      {/* 3. HERO HEADING */}
      <div className="w-full overflow-hidden z-0 mt-6 sm:mt-4 md:-mt-5 px-2">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] select-none">
            HI, i&apos;m jack
          </h1>
        </FadeIn>
      </div>

      {/* 4. BOTTOM BAR */}
      <div className="w-full px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 flex items-end justify-between z-20">
        {/* Left text */}
        <FadeIn delay={0.35} y={20}>
          <p 
            className="text-[#1E1B4B] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}
          >
            a 3d creator driven by crafting striking and unforgettable projects
          </p>
        </FadeIn>

        {/* Right contact button */}
        <FadeIn delay={0.5} y={20}>
          <ContactButton label="Contact Me" onClick={onContactClick} />
        </FadeIn>
      </div>
    </section>
  );
};

export default HeroSectionPortfolio;
