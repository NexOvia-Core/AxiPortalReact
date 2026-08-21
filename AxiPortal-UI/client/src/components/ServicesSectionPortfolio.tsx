import React from "react";
import FadeIn from "./FadeIn";

export interface ServiceItem {
  number: string;
  name: string;
  description: string;
}

const servicesData: ServiceItem[] = [
  {
    number: "01",
    name: "3D Modeling",
    description:
      "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.",
  },
  {
    number: "02",
    name: "Rendering",
    description:
      "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.",
  },
  {
    number: "03",
    name: "Motion Design",
    description:
      "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.",
  },
  {
    number: "04",
    name: "Branding",
    description:
      "Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.",
  },
  {
    number: "05",
    name: "Web Design",
    description:
      "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.",
  },
];

export const ServicesSectionPortfolio: React.FC = () => {
  return (
    <section id="price" className="w-full bg-[#FFFFFF] text-[#1E1B4B] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-10 shadow-xl border-t border-[#1E1B4B]/10">
      <div className="max-w-5xl mx-auto flex flex-col">
        {/* Heading */}
        <FadeIn delay={0} y={40}>
          <h2
            className="font-black uppercase text-center text-[#1E1B4B] tracking-tight leading-none mb-16 sm:mb-20 md:mb-28 select-none"
            style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
          >
            Services
          </h2>
        </FadeIn>

        {/* Vertical List of 5 Services */}
        <div className="w-full flex flex-col">
          {servicesData.map((item, i) => (
            <FadeIn key={item.number} delay={i * 0.1} y={30}>
              <div className="w-full flex flex-col md:flex-row md:items-center justify-between border-b border-[rgba(30,27,75,0.15)] py-8 sm:py-10 md:py-12 gap-4 md:gap-10 group transition-colors duration-300 hover:bg-neutral-50/80 px-2 rounded-xl">
                {/* Left Number */}
                <div
                  className="font-black text-[#1E1B4B] leading-none tracking-tighter flex-shrink-0 select-none opacity-90"
                  style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
                >
                  {item.number}
                </div>

                {/* Right Stacked Name + Description */}
                <div className="flex flex-col justify-center gap-2 md:gap-3 flex-grow">
                  <h3
                    className="font-medium uppercase tracking-tight text-[#1E1B4B]"
                    style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
                  >
                    {item.name}
                  </h3>
                  <p
                    className="font-light leading-relaxed max-w-2xl text-[#1E1B4B] opacity-70"
                    style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)" }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSectionPortfolio;
