import React from "react";

interface ContactButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  label = "Contact Me",
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        background: "linear-gradient(135deg, #210062 0%, #5c1380 50%, #d6573c 100%)",
        boxShadow: "0px 4px 4px rgba(92, 19, 128, 0.25), inset 4px 4px 12px rgba(33, 0, 98, 0.3)",
        outline: "2px solid white",
        outlineOffset: "-3px",
      }}
      className={`rounded-full px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base text-white font-medium uppercase tracking-widest transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap select-none ${className}`}
    >
      {label}
    </button>
  );
};

export default ContactButton;
