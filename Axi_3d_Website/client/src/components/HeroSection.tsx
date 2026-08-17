/**
 * Hero Section - Full viewport with Three.js 3D particle field & orbital 3D loop design
 * Restored matching Image 1: Top Nav (Platform, AXI Modules, About Us, Agile Labs, Get Started CTA button),
 * Subtitle ("orbital dashboards"), and center gradient CTA button ("Get Started").
 */
import React, { Suspense, useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import PartnerModal from "./PartnerModal";
import { useAuthModal } from "@/contexts/AuthContext";

function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const particleCount = 1600;

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const blue = new THREE.Color("#00007f");
    const coral = new THREE.Color("#fc8151");

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.5) * 12;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const color = Math.random() > 0.5 ? blue : coral;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      sizes[i] = Math.random() * 2 + 0.5;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
      state.invalidate();
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[particles.colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[particles.sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function OrbitRing({ radius, speed, color, tilt = 0 }: { radius: number; speed: number; color: string; tilt?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = tilt + state.clock.elapsedTime * speed;
      ref.current.rotation.z = state.clock.elapsedTime * speed * 0.3;
      state.invalidate();
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.006, 12, 64]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} transparent opacity={0.6} />
    </mesh>
  );
}

function FloatingDots() {
  const dots = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10 - 2,
      ] as [number, number, number],
      speed: 0.5 + Math.random() * 1.5,
      size: 0.02 + Math.random() * 0.04,
      color: Math.random() > 0.5 ? "#fc8151" : "#00007f",
    }));
  }, []);

  return (
    <>
      {dots.map((dot, i) => (
        <Float key={i} speed={dot.speed} rotationIntensity={0} floatIntensity={0.5}>
          <mesh position={dot.position}>
            <sphereGeometry args={[dot.size, 8, 8]} />
            <meshStandardMaterial color={dot.color} emissive={dot.color} emissiveIntensity={0.5} transparent opacity={0.6} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[8, 5, 5]} intensity={1.2} color="#fc8151" />
      <pointLight position={[-8, -3, -5]} intensity={0.6} color="#00007f" />
      <pointLight position={[0, 8, 0]} intensity={0.4} color="#ffffff" />
      <ParticleField />
      <OrbitRing radius={3} speed={0.2} color="#00007f" tilt={0.1} />
      <OrbitRing radius={3.8} speed={0.15} color="#fc8151" tilt={-0.15} />
      <OrbitRing radius={2.2} speed={0.35} color="#00007f" tilt={0.3} />
      <OrbitRing radius={4.5} speed={0.1} color="#fc8151" tilt={-0.05} />
      <FloatingDots />
    </>
  );
}

interface HeroSectionProps {
  onContactClick?: () => void;
}

const navItems = [
  { label: "Platform", href: "#platform" },
  { label: "Packages", href: "/modules" },
  { label: "About Us", href: "/about" },
  { label: "Partners", href: "/partners" },
  { label: "Agile Labs", href: "https://agile-labs.com", external: true },
];

export default function HeroSection({ onContactClick }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const { openLogin, openSignUp } = useAuthModal();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between"
      style={{ background: "#fff6e5" }}
    >
      {/* Ambient glow orbs */}
      <div className="ambient-glow ambient-glow-coral w-[600px] h-[600px] top-[10%] left-[20%]" />
      <div className="ambient-glow ambient-glow-blue w-[500px] h-[500px] bottom-[10%] right-[10%]" />
      <div className="ambient-glow ambient-glow-coral w-[300px] h-[300px] top-[60%] left-[5%]" />

      {/* 3D Canvas - Orbital 3D Loop */}
      {isInView && (
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 9], fov: 45 }}
              gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
              style={{ background: "transparent" }}
              dpr={[1, 1.25]}
              frameloop="demand"
            >
              <Scene3D />
            </Canvas>
          </Suspense>
        </div>
      )}

      {/* Top Navbar (Matching Image 1) */}
      <div className="w-full z-20">
        <nav className="w-full flex items-center justify-between px-6 md:px-12 pt-6 md:pt-8">
          {/* Brand Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <img
              src="/AXI_LOGO_AXPERT.png"
              alt="AXI Logo"
              className="h-9 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </a>

          {/* Center Nav Links (Image 1: Platform, AXI Modules, About Us, Agile Labs) */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="text-[#1E1B4B] font-medium text-sm md:text-base hover:text-[#fc8151] transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => openLogin()}
              className="text-[#1E1B4B] font-semibold text-sm hover:text-[#fc8151] px-4 py-2 transition-colors cursor-pointer"
            >
              Login
            </button>

            <button
              onClick={() => openSignUp()}
              className="text-[#1E1B4B] font-semibold text-sm border border-[#1E1B4B]/30 hover:border-[#1E1B4B] px-4.5 py-2 rounded-full transition-all cursor-pointer hover:bg-[#1E1B4B]/5"
            >
              Sign Up
            </button>

            <button
              onClick={() => openLogin("https://agile.axi-global.com/aspx/signin.aspx")}
              className="bg-gradient-to-r from-[#210062] via-[#5c1380] to-[#d6573c] text-[#ffffff] shadow-md hover:shadow-xl rounded-full px-6 py-2.5 font-semibold text-sm transition-all duration-300 hover:scale-105 inline-block cursor-pointer"
            >
              Get Started
            </button>
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
          <div className="md:hidden flex flex-col items-center gap-4 py-6 bg-[#fff6e5]/95 backdrop-blur-md border-b border-[#1E1B4B]/10 text-center">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={() => setNavOpen(false)}
                className="text-[#1E1B4B] font-medium text-base hover:text-[#fc8151]"
              >
                {item.label}
              </a>
            ))}
            <div className="flex flex-col items-center gap-2.5 w-full px-6 pt-2">
              <button
                onClick={() => {
                  setNavOpen(false);
                  openLogin();
                }}
                className="w-full py-2.5 text-center font-semibold text-[#1E1B4B] bg-white/80 rounded-xl transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setNavOpen(false);
                  openSignUp();
                }}
                className="w-full py-2.5 text-center font-semibold text-[#1E1B4B] border border-[#1E1B4B]/30 rounded-xl transition-colors"
              >
                Sign Up
              </button>
              <button
                onClick={() => {
                  setNavOpen(false);
                  openLogin("https://agile.axi-global.com/aspx/signin.aspx");
                }}
                className="w-full py-2.5 bg-gradient-to-r from-[#210062] via-[#5c1380] to-[#d6573c] text-white rounded-full font-semibold text-sm shadow-md"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hero Main Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto px-6 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="text-center max-w-5xl"
        >
          {/* US Patent Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass border border-[#00007f]/15 shadow-sm mb-6 bg-white/80"
          >
            <img src="/us-flag.png" alt="US Flag" className="h-4 w-auto object-contain rounded-xs shadow-xs" />
            <span className="font-[JetBrains_Mono] text-xs font-bold tracking-widest text-[#00007f] uppercase">
              PATENTED IN USA
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs md:text-sm font-semibold tracking-[0.35em] uppercase text-[#fc8151] mb-6"
          >
            ENTERPRISE INTELLIGENCE PLATFORM
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-[Space_Grotesk] text-4xl sm:text-5xl md:text-6xl lg:text-[4.8rem] font-bold leading-[1.08] mb-8 max-w-5xl mx-auto"
          >
            <span className="gradient-text">SIMPLE — </span>
            <span className="gradient-text">INTUITIVE — </span>
            <span className="hero-heading">GENUINELY </span>
            <span className="text-[#00007f]">INTELLIGENT</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-base sm:text-lg md:text-xl text-[#00007f]/75 max-w-3xl mx-auto mb-10 leading-relaxed font-normal"
          >
            The one ERP that goes as deep as enterprise-grade systems —
            without the cost or the cage.

          </motion.p>

          {/* Centered Action Buttons (Get Started & Explore the Packages) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => openLogin("https://agile.axi-global.com/aspx/signin.aspx")}
              className="bg-gradient-to-r from-[#210062] via-[#5c1380] to-[#d6573c] text-white shadow-xl hover:shadow-2xl rounded-full px-8 sm:px-10 py-3.5 sm:py-4 font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 inline-block cursor-pointer"
            >
              Get Started
            </button>


            <a
              href="/modules"
              className="border-2 border-[#1E1B4B]/30 hover:border-[#1E1B4B] text-[#1E1B4B] hover:bg-[#1E1B4B] hover:text-white shadow-md hover:shadow-xl rounded-full px-8 sm:px-10 py-3.5 sm:py-4 font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 inline-block cursor-pointer bg-white/60 backdrop-blur-sm"
            >
              Explore Our Packages
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="relative z-10 pb-6 flex justify-center"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-7 h-11 rounded-full border-2 border-[#00007f]/20 flex items-start justify-center p-2 glass bg-white/50"
        >
          <motion.div
            animate={{ y: [0, 14, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "linear-gradient(135deg, #00007f, #5c1380, #d6573c)" }}
          />
        </motion.div>
      </motion.div>

      <PartnerModal isOpen={partnerOpen} onClose={() => setPartnerOpen(false)} />
    </section>
  );
}
