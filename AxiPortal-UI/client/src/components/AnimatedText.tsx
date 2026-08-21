import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
}

interface CharProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Char: React.FC<CharProps> = ({ char, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative inline-block">
      <span className="opacity-20">{char}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0 text-[#1E1B4B]">
        {char}
      </motion.span>
    </span>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = "",
}) => {
  const elementRef = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: elementRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const characters = text.split("");
  const totalChars = characters.length;

  return (
    <p
      ref={elementRef}
      className={`text-[#1E1B4B] font-medium text-center leading-relaxed max-w-[650px] font-sans ${className}`}
      style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
    >
      {characters.map((char, i) => {
        if (char === " ") {
          return <span key={i}> </span>;
        }
        const start = i / totalChars;
        const end = start + 1 / totalChars;
        return (
          <Char
            key={i}
            char={char}
            progress={scrollYProgress}
            range={[start, end]}
          />
        );
      })}
    </p>
  );
};

export default AnimatedText;
