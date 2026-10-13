import React from 'react';
import { Cookie } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CookieBanner: React.FC = () => {
  const { cookieConsent, setConsent } = useStore();

  // If already consented or denied, don't show banner
  if (cookieConsent !== null) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#FFFEFB] border border-[#E3DDD2] rounded-2xl p-5 shadow-warm animate-in slide-in-from-bottom duration-300"
      role="region"
      aria-label="Cookie Preferences"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#ECE8E0] text-[#1A56DB] flex items-center justify-center shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-[#1C1A17]">Cookie & Privacy Choices</h3>
          <p className="text-xs text-[#6B645A] leading-relaxed">
            We use essential cookies to maintain your shopping cart and order history. With your consent, we also measure store traffic to refine the browsing experience.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2.5">
        <button
          onClick={() => setConsent(false)}
          className="px-3.5 py-2 text-xs font-semibold text-[#1C1A17] bg-[#ECE8E0] hover:bg-[#E3DDD2] rounded-xl transition-colors cursor-pointer"
        >
          Essential Only
        </button>
        <button
          onClick={() => setConsent(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-[#1A56DB] hover:bg-[#1646B0] rounded-xl shadow-warm transition-colors cursor-pointer"
        >
          Accept All
        </button>
      </div>
    </div>
  );
};
