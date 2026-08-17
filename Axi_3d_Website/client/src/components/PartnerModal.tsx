import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2 } from "lucide-react";

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PartnerModal({ isOpen, onClose }: PartnerModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    domain: "Enterprise ERP & Supply Chain",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      domain: "Enterprise ERP & Supply Chain",
      message: "",
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto"
          onClick={handleResetAndClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-white rounded-[32px] p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.25)] border border-neutral-100 my-auto text-center"
          >
            {/* Close Button on Top Right Corner */}
            <button
              onClick={handleResetAndClose}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-neutral-100 hover:bg-[#fc8151] text-[#00007f] hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-neutral-200 cursor-pointer z-20"
              aria-label="Close Partner Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold font-[Space_Grotesk] text-[#00007f] mb-2">
                  Partner Application Submitted!
                </h3>
                <p className="text-sm text-[#00007f]/70 max-w-md mx-auto mb-6">
                  Thank you for your interest in partnering with Agile Labs. Our Partner Alliances team will review your details and contact you shortly.
                </p>
                <button
                  onClick={handleResetAndClose}
                  className="px-8 py-3 rounded-full bg-[#00007f] text-white text-sm font-bold shadow-md hover:bg-[#fc8151] transition-colors"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div>
                {/* Header Tag */}
                <span className="px-4 py-1.5 rounded-full bg-[#fc8151]/15 text-[#fc8151] text-[11px] font-extrabold tracking-widest uppercase mb-3 inline-block">
                  START YOUR JOURNEY
                </span>

                <h2 className="text-2xl sm:text-3xl font-extrabold font-[Space_Grotesk] text-[#00007f] mb-2 tracking-tight">
                  Become an Authorized Agile Labs Partner
                </h2>
                <p className="text-xs sm:text-sm text-[#00007f]/70 font-medium mb-8 leading-relaxed max-w-lg mx-auto">
                  Fill out the form below to connect with our Partner Alliances team and explore revenue growth.
                </p>

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase text-[#00007f]/80 mb-1.5 tracking-wider">
                        FULL NAME *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-[#fff6e5]/40 text-[#00007f] text-sm focus:outline-none focus:border-[#fc8151] focus:ring-2 focus:ring-[#fc8151]/20 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase text-[#00007f]/80 mb-1.5 tracking-wider">
                        COMPANY NAME *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Acme Technologies"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-[#fff6e5]/40 text-[#00007f] text-sm focus:outline-none focus:border-[#fc8151] focus:ring-2 focus:ring-[#fc8151]/20 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase text-[#00007f]/80 mb-1.5 tracking-wider">
                        WORK EMAIL *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-[#fff6e5]/40 text-[#00007f] text-sm focus:outline-none focus:border-[#fc8151] focus:ring-2 focus:ring-[#fc8151]/20 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase text-[#00007f]/80 mb-1.5 tracking-wider">
                        PHONE NUMBER *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-[#fff6e5]/40 text-[#00007f] text-sm focus:outline-none focus:border-[#fc8151] focus:ring-2 focus:ring-[#fc8151]/20 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-[#00007f]/80 mb-1.5 tracking-wider">
                      PRIMARY FOCUS VERTICAL / DOMAIN
                    </label>
                    <select
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-[#fff6e5]/40 text-[#00007f] text-sm focus:outline-none focus:border-[#fc8151] focus:ring-2 focus:ring-[#fc8151]/20 transition-all font-medium"
                    >
                      <option value="Enterprise ERP & Supply Chain">Enterprise ERP & Supply Chain</option>
                      <option value="Healthcare & HMS">Healthcare & HMS</option>
                      <option value="E-Government & Public Sector">E-Government & Public Sector</option>
                      <option value="Banking & Financial Services">Banking & Financial Services</option>
                      <option value="Manufacturing & Retail POS">Manufacturing & Retail POS</option>
                      <option value="Other Custom Solutions">Other Custom Solutions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-[#00007f]/80 mb-1.5 tracking-wider">
                      TELL US ABOUT YOUR BUSINESS & GOALS
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share details regarding your team size, current technical stack, and target market..."
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-[#fff6e5]/40 text-[#00007f] text-sm focus:outline-none focus:border-[#fc8151] focus:ring-2 focus:ring-[#fc8151]/20 transition-all font-medium resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl text-sm sm:text-base font-extrabold text-white shadow-lg hover:scale-[1.01] hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mt-2 cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #210062 0%, #00007f 40%, #d6573c 80%, #fc8151 100%)",
                    }}
                  >
                    <Send className="w-4 h-4" />
                    Submit Partner Application
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
