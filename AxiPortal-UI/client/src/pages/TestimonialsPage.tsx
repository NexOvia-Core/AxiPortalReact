import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import TestimonialsSection from "@/components/TestimonialsSection";

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen font-body bg-[#fff6e5]">
      <ScrollProgress />
      <Navigation />
      
      <div className="pt-24">
        {/* We reuse the existing TestimonialsSection component which already has AXI style */}
        <TestimonialsSection />
      </div>

      <Footer />
    </div>
  );
}
