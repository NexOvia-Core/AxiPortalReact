import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import { Link, useLocation } from "wouter";
import PartnerModal from "./PartnerModal";
import { useAuthModal } from "@/contexts/AuthContext";
import { assetUrl } from "@/lib/paths";

const navLinks = [
  { label: "Platform", href: "/#platform" },
  { label: "Packages", href: "/modules" },
  { label: "About Us", href: "/about" },
  { label: "Partners", href: "/partners" },
  { label: "Agile Labs", href: "https://agile-labs.com", external: true },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [location] = useLocation();
  const { openLogin, openSignUp } = useAuthModal();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 transform-gpu ${
        scrolled
          ? "bg-white/90 backdrop-blur-2xl shadow-md border-b border-white/60 py-3"
          : "bg-white/80 backdrop-blur-xl border-b border-white/50 py-4 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <motion.img
              src={assetUrl("AXI_LOGO_AXPERT.png")}
              alt="Axi Platform Logo"
              className="h-9 md:h-10 w-auto object-contain"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(link => {
              const isActive =
                !link.external &&
                (link.href === "/about"
                  ? location === "/about" || location === "/about-us"
                  : link.href === "/modules"
                    ? location === "/modules"
                    : link.href === "/partners"
                      ? location === "/partners"
                      : location === "/");

              return link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 group ${
                    isActive
                      ? "text-[#00007f]"
                      : "text-[#00007f]/75 hover:text-[#00007f]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-[#00007f] via-[#5c1380] to-[#d6573c] transition-transform duration-400 origin-left rounded-full ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 group ${
                    isActive
                      ? "text-[#00007f]"
                      : "text-[#00007f]/75 hover:text-[#00007f]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-[#00007f] via-[#5c1380] to-[#d6573c] transition-transform duration-400 origin-left rounded-full ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={() => openLogin()}
              className="px-4 py-2 text-sm font-semibold text-[#00007f] hover:text-[#5c1380] transition-all duration-300 flex items-center gap-1.5 rounded-full hover:bg-slate-100/70"
            >
              <LogIn size={16} />
              <span>Login</span>
            </button>

            <button
              onClick={() => openSignUp()}
              className="px-4.5 py-2 text-sm font-semibold text-[#00007f] border border-[#00007f]/30 hover:border-[#00007f] hover:bg-[#00007f]/5 transition-all duration-300 rounded-full flex items-center gap-1.5"
            >
              <UserPlus size={16} />
              <span>Sign Up</span>
            </button>

            <button
              onClick={() =>
                openLogin("https://agile.axi-global.com/aspx/signin.aspx")
              }
              className="relative px-5 py-2 text-sm font-semibold text-white rounded-full overflow-hidden group transition-all duration-400 hover:scale-105 hover:shadow-lg hover:shadow-[#00007f]/25"
              style={{
                background:
                  "linear-gradient(135deg, #210062 0%, #5c1380 50%, #d6573c 100%)",
              }}
            >
              Get Started
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#00007f] bg-white/60 backdrop-blur-md rounded-xl border border-white/60"
            whileTap={{ scale: 0.95 }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="md:hidden bg-white/95 backdrop-blur-2xl rounded-b-2xl mx-4 border border-t-0 border-white/60 shadow-xl overflow-hidden mt-2"
          >
            <div className="px-6 py-6 space-y-3">
              {navLinks.map((link, i) => {
                const isActive =
                  !link.external &&
                  (link.href === "/about"
                    ? location === "/about" || location === "/about-us"
                    : link.href === "/modules"
                      ? location === "/modules"
                      : link.href === "/partners"
                        ? location === "/partners"
                        : location === "/");

                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileOpen(false)}
                        className={`block text-base font-semibold transition-colors py-2 cursor-pointer ${
                          isActive
                            ? "text-[#00007f] font-bold"
                            : "text-[#00007f]/75 hover:text-[#00007f]"
                        }`}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block text-base font-semibold transition-colors py-2 cursor-pointer ${
                          isActive
                            ? "text-[#00007f] font-bold"
                            : "text-[#00007f]/75 hover:text-[#00007f]"
                        }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openLogin();
                  }}
                  className="w-full py-2.5 text-center font-semibold text-[#00007f] bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </button>

                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openSignUp();
                  }}
                  className="w-full py-2.5 text-center font-semibold text-[#00007f] border border-[#00007f]/30 hover:border-[#00007f] rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <UserPlus size={18} />
                  <span>Sign Up</span>
                </button>

                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openLogin("https://agile.axi-global.com/aspx/signin.aspx");
                  }}
                  className="w-full py-2.5 text-center text-white font-semibold text-sm rounded-xl shadow-md"
                  style={{
                    background:
                      "linear-gradient(135deg, #210062 0%, #5c1380 50%, #d6573c 100%)",
                  }}
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PartnerModal
        isOpen={partnerOpen}
        onClose={() => setPartnerOpen(false)}
      />
    </motion.nav>
  );
}
