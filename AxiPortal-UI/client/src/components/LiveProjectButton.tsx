import React from "react";

interface LiveProjectButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
  href?: string;
}

export const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({
  label = "Live Project",
  onClick,
  className = "",
  href,
}) => {
  const content = (
    <button
      onClick={onClick}
      className={`rounded-full border-2 border-[#1E1B4B] text-[#1E1B4B] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#1E1B4B]/10 transition-colors duration-200 cursor-pointer whitespace-nowrap select-none ${className}`}
    >
      {label}
    </button>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block">
        {content}
      </a>
    );
  }

  return content;
};

export default LiveProjectButton;
