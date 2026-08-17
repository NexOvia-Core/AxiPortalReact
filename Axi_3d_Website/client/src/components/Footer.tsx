/**
 * Footer - Enhanced with glassmorphism social icons and orbital motifs
 */
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const footerLinks = {
  Platform: ["FAQ", "Modules"],
  Company: ["The Team", "Careers", "Blog", "About Us", "Contact Us"],
  Resources: ["Case Studies", "Testimonials", "News and Events"],
};

export default function Footer() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <footer ref={ref} className="bg-[#00007f] text-white relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#fc8151]/3 blur-[150px] pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="grid grid-cols-2 md:grid-cols-5 gap-10"
        >
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-3 mb-6 group">
              <img
                src="/AXI_LOGO_AXPERT.png"
                alt="Axi Platform Logo"
                className="h-9 w-auto object-contain brightness-0 invert"
              />
            </a>
            <p className="text-sm text-white leading-relaxed mb-6">
              Transforming enterprise data into living intelligence. Built for
              the orbital enterprise.
            </p>
            <div className="flex items-center gap-3">
              {[
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>,
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>,
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
              ].map((icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-[#fc8151] hover:border-[#fc8151] transition-all duration-300 hover:scale-110">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-[Space_Grotesk] font-semibold text-sm uppercase tracking-wider text-[#fc8151] mb-5">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => {
                  let href = "#";
                  if (link === "FAQ") href = "/faq";
                  if (link === "AXI Modules") href = "/modules";
                  if (link === "The Team") href = "/team";
                  if (link === "Careers") href = "/careers";
                  if (link === "Blog") href = "/blog";
                  if (link === "About Us") href = "/about";
                  if (link === "Contact Us") href = "/contact-us";
                  if (link === "Case Studies") href = "/case-studies";
                  if (link === "Testimonials") href = "/testimonials";
                  if (link === "News and Events") href = "/news-events";

                  return (
                    <li key={link}>
                      <a href={href} className="text-sm text-white hover:text-[#fc8151] transition-all duration-300 hover:pl-1">
                        {link}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white font-medium">
            © 2026 Axi Intelligence. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-white hover:text-[#fc8151] transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="text-sm text-white hover:text-[#fc8151] transition-colors duration-300">Terms of Service</a>
            <a href="#" className="text-sm text-white hover:text-[#fc8151] transition-colors duration-300">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
