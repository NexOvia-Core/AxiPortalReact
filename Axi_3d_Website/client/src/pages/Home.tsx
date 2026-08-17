import React, { useState } from "react";
import HeroSection from "@/components/HeroSection";
import MarqueeSectionPortfolio from "@/components/MarqueeSectionPortfolio";
import AboutSectionPortfolio from "@/components/AboutSectionPortfolio";
import PlatformSection from "@/components/PlatformSection";
import PackagesSection from "@/components/PackagesSection";
import ProjectsSectionPortfolio from "@/components/ProjectsSectionPortfolio";
import AiPlatformShowcaseSection from "@/components/AiPlatformShowcaseSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import ContactModal from "@/components/ContactModal";
import Footer from "@/components/Footer";

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleOpenContact = () => setIsContactOpen(true);
  const handleCloseContact = () => setIsContactOpen(false);

  return (
    <div className="main-wrapper min-h-screen bg-[#fff6e5] text-[#1E1B4B] font-sans antialiased overflow-x-clip selection:bg-[#B600A8] selection:text-white">
      {/* 1. HERO SECTION - 3D ORBITAL LOOP DESIGN */}
      <HeroSection onContactClick={handleOpenContact} />

      {/* 2. MARQUEE SECTION */}
      <MarqueeSectionPortfolio />

      {/* 3. ABOUT SECTION */}
      <AboutSectionPortfolio onContactClick={handleOpenContact} />

      {/* 4. PLATFORM SECTION - "WHERE AXI KEEPS MOVING" WITH VIDEO & SOLUTION CARDS */}
      <PlatformSection />

      {/* 4.5. OUR PACKAGES SECTION - GLASSMORPHISM 3D REALISTIC KPI CARDS */}
      <PackagesSection onInstallClick={handleOpenContact} />

      {/* 5. PROJECTS SECTION - PPTX MOTION STACKING CARDS */}
      <ProjectsSectionPortfolio onLiveProjectClick={handleOpenContact} />

      {/* 6. AI ASSISTED BUSINESS PLATFORM SHOWCASE SECTION */}
      <AiPlatformShowcaseSection onContactClick={handleOpenContact} />

      {/* 6.5. TESTIMONIALS SECTION */}
      <TestimonialsSection />

      {/* 7. CTA SECTION - UNLEASH THE POWER */}
      <CTASection />

      {/* FOOTER */}
      <Footer />

      {/* REUSABLE CONTACT MODAL */}
      <ContactModal isOpen={isContactOpen} onClose={handleCloseContact} />
    </div>
  );
}
