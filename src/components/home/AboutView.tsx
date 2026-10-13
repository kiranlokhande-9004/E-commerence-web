import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Sparkles, Truck, Mail, CheckCircle2, Send } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AssetSlot } from '../common/AssetSlot';

const ABOUT_SAMPLE_CONFIG = {
  customerSupportEmail: 'support@bomatoessentials.com',
  inquiryHours: 'Monday – Friday, 9:00 AM – 6:00 PM EST',
  responseWindow: 'Typically responds within 2 hours',
};

export const AboutView: React.FC = () => {
  const { setActiveTab } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    botTrap: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.botTrap) {
      setIsSubmitted(true);
      return;
    }

    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'Please provide your name';
    }
    if (!formData.email.trim()) {
      errors.email = 'Please provide your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email format';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Please enter a message with at least 10 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in space-y-10">
      {/* Return to home */}
      <button
        onClick={() => setActiveTab('home')}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#201F1D] dark:text-[#F3EFE8] hover:text-[#205BE8] dark:hover:text-[#3B82F6] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </button>

      {/* Hero & Brand Story */}
      <div className="bg-[#FFFFFF] dark:bg-[#1C1916] border border-[#E7E1D7] dark:border-[#332E28] rounded-3xl p-6 sm:p-10 shadow-warm transition-colors">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#205BE8] dark:text-[#60A5FA] font-mono">
            Craftsmanship & Everyday Utility
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#201F1D] dark:text-[#F3EFE8] tracking-tight">
            About Bomato
          </h1>
          <p className="text-sm text-[#777269] dark:text-[#A59D91] leading-relaxed">
            Bomato designs and curates durable everyday technology gear, high-fidelity audio equipment, and resilient travel accessories. We prioritize tactile materials, functional ergonomics, and timeless design over disposable trends.
          </p>
        </div>

        {/* 3 Real Product Photo Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
          <div className="bg-[#F0EDE6] dark:bg-[#221F1B] rounded-2xl p-4 border border-[#E7E1D7] dark:border-[#332E28] flex flex-col items-center">
            <div className="w-full aspect-square">
              <AssetSlot
                src="/hero/showcase-hero.webp"
                alt="Bomato everyday lifestyle collection"
                aspectRatio="aspect-square"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <span className="text-xs font-bold text-[#201F1D] dark:text-[#F3EFE8] mt-3">Curated Showcase</span>
          </div>

          <div className="bg-[#F0EDE6] dark:bg-[#221F1B] rounded-2xl p-4 border border-[#E7E1D7] dark:border-[#332E28] flex flex-col items-center">
            <div className="w-full aspect-square">
              <AssetSlot
                src="/products/classic-backpack.webp"
                alt="Classic carry backpack"
                aspectRatio="aspect-square"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs font-bold text-[#201F1D] dark:text-[#F3EFE8] mt-3">Ergonomic Carry</span>
          </div>

          <div className="bg-[#F0EDE6] dark:bg-[#221F1B] rounded-2xl p-4 border border-[#E7E1D7] dark:border-[#332E28] flex flex-col items-center">
            <div className="w-full aspect-square">
              <AssetSlot
                src="/products/wh-1000xm5.webp"
                alt="High-fidelity audio"
                aspectRatio="aspect-square"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs font-bold text-[#201F1D] dark:text-[#F3EFE8] mt-3">Acoustic Precision</span>
          </div>
        </div>

        {/* 3 Value Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#E7E1D7] dark:border-[#332E28]">
          <div className="p-5 bg-[#F0EDE6]/50 dark:bg-[#221F1B]/60 rounded-2xl border border-[#E7E1D7] dark:border-[#332E28] text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#205BE8]/10 text-[#205BE8] dark:text-[#60A5FA] mx-auto flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#201F1D] dark:text-[#F3EFE8]">1. Curated Quality</h3>
            <p className="text-xs text-[#777269] dark:text-[#A59D91] leading-relaxed">
              Every item is tested for material durability, tactile response, and seamless compatibility with modern mobile ecosystems.
            </p>
          </div>

          <div className="p-5 bg-[#F0EDE6]/50 dark:bg-[#221F1B]/60 rounded-2xl border border-[#E7E1D7] dark:border-[#332E28] text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#201F1D] dark:text-[#F3EFE8]">2. Swift Logistics</h3>
            <p className="text-xs text-[#777269] dark:text-[#A59D91] leading-relaxed">
              Orders are packaged with recycled protective materials and dispatched with clear tracking updates.
            </p>
          </div>

          <div className="p-5 bg-[#F0EDE6]/50 dark:bg-[#221F1B]/60 rounded-2xl border border-[#E7E1D7] dark:border-[#332E28] text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 text-[#205BE8] dark:text-[#60A5FA] mx-auto flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#201F1D] dark:text-[#F3EFE8]">3. Transparent Support</h3>
            <p className="text-xs text-[#777269] dark:text-[#A59D91] leading-relaxed">
              Straightforward 30-day exchange policy with direct customer support for repairs, firmware tips, and warranty claims.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="bg-[#FFFFFF] dark:bg-[#1C1916] border border-[#E7E1D7] dark:border-[#332E28] rounded-3xl p-6 sm:p-10 shadow-warm transition-colors">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#205BE8]/10 text-[#205BE8] dark:text-[#60A5FA] mx-auto flex items-center justify-center mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#201F1D] dark:text-[#F3EFE8]">Get in Touch</h2>
            <p className="text-xs sm:text-sm text-[#777269] dark:text-[#A59D91] mt-1">
              Have questions regarding sizing, specs, or shipping status? Drop us a note below.
            </p>
            <p className="text-xs text-[#777269]/80 dark:text-[#A59D91]/80 mt-1 italic">
              Support email: <span className="font-semibold text-[#201F1D] dark:text-[#F3EFE8]">{ABOUT_SAMPLE_CONFIG.customerSupportEmail}</span> · {ABOUT_SAMPLE_CONFIG.responseWindow}
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-center space-y-2 animate-in fade-in">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">Message Received</h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Thank you for reaching out, {formData.name || 'there'}! Our team will review your inquiry and follow up at {formData.email}.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ name: '', email: '', message: '', botTrap: '' });
                }}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="hidden" aria-hidden="true">
                <input
                  name="botTrap"
                  type="text"
                  value={formData.botTrap}
                  onChange={handleInputChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#201F1D] dark:text-[#F3EFE8] uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Alex Morgan"
                  className={`w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] dark:bg-[#221F1B] border rounded-xl text-[#201F1D] dark:text-[#F3EFE8] placeholder-[#777269] dark:placeholder-[#A59D91] focus:outline-hidden transition-colors ${
                    formErrors.name
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-[#E7E1D7] dark:border-[#332E28] focus:border-[#205BE8] focus:ring-2 focus:ring-[#205BE8]/20'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#201F1D] dark:text-[#F3EFE8] uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="alex@domain.com"
                  className={`w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] dark:bg-[#221F1B] border rounded-xl text-[#201F1D] dark:text-[#F3EFE8] placeholder-[#777269] dark:placeholder-[#A59D91] focus:outline-hidden transition-colors ${
                    formErrors.email
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-[#E7E1D7] dark:border-[#332E28] focus:border-[#205BE8] focus:ring-2 focus:ring-[#205BE8]/20'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#201F1D] dark:text-[#F3EFE8] uppercase mb-1">
                  Message *
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us what you need help with..."
                  className={`w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] dark:bg-[#221F1B] border rounded-xl text-[#201F1D] dark:text-[#F3EFE8] placeholder-[#777269] dark:placeholder-[#A59D91] focus:outline-hidden transition-colors ${
                    formErrors.message
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-[#E7E1D7] dark:border-[#332E28] focus:border-[#205BE8] focus:ring-2 focus:ring-[#205BE8]/20'
                  }`}
                />
                {formErrors.message && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.message}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-[#205BE8] hover:bg-[#174AC4] text-white font-bold rounded-xl text-sm shadow-warm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
