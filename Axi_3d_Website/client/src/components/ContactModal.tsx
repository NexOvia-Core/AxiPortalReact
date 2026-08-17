import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactButton from "./ContactButton";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#fff6e5] border-2 border-[#1E1B4B] rounded-[36px] p-6 sm:p-10 text-[#1E1B4B] shadow-2xl z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-[#1E1B4B]/60 hover:text-[#1E1B4B] transition-colors p-2 cursor-pointer"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center border border-emerald-500/30">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black uppercase text-[#1E1B4B] tracking-tight">Message Received!</h3>
                <p className="text-sm text-[#1E1B4B]/80 font-light max-w-xs">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#1E1B4B]/60 font-semibold">Get In Touch</span>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight hero-heading">
                    Let's Build Together
                  </h3>
                </div>

                <div className="flex flex-col gap-4 mt-2">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#1E1B4B]/70 mb-1 font-medium">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Jack Smith"
                      className="w-full bg-white border border-[#1E1B4B]/20 rounded-xl px-4 py-3 text-sm text-[#1E1B4B] placeholder-neutral-400 focus:outline-none focus:border-[#1E1B4B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#1E1B4B]/70 mb-1 font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jack@enterprise.com"
                      className="w-full bg-white border border-[#1E1B4B]/20 rounded-xl px-4 py-3 text-sm text-[#1E1B4B] placeholder-neutral-400 focus:outline-none focus:border-[#1E1B4B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#1E1B4B]/70 mb-1 font-medium">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Agile Labs Enterprise"
                      className="w-full bg-white border border-[#1E1B4B]/20 rounded-xl px-4 py-3 text-sm text-[#1E1B4B] placeholder-neutral-400 focus:outline-none focus:border-[#1E1B4B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#1E1B4B]/70 mb-1 font-medium">
                      Message
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your project or enterprise requirements..."
                      className="w-full bg-white border border-[#1E1B4B]/20 rounded-xl px-4 py-3 text-sm text-[#1E1B4B] placeholder-neutral-400 focus:outline-none focus:border-[#1E1B4B]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-center">
                  <ContactButton label="Send Message" className="w-full text-center" />
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
