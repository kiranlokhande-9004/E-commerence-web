import React from 'react';
import { Cookie } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CookieBanner: React.FC = () => {
  const { cookieConsent, setConsent } = useStore();

  if (cookieConsent !== null) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#FFFFFF] border border-[#E7E1D7] rounded-2xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-300"
      role="region"
      aria-label="Cookie Preferences"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#F0EDE6] text-[#205BE8] flex items-center justify-center shrink-0 border border-[#E7E1D7]">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-[#201F1D]">Cookie & Privacy Choices</h3>
          <p className="text-xs text-[#777269] leading-relaxed">
            We use essential cookies to maintain your shopping cart and order history. With your consent, we also measure store traffic to refine the browsing experience.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2.5">
        <button
          onClick={() => setConsent(false)}
          className="neu-button px-3.5 py-2 text-xs font-semibold text-[#201F1D] bg-[#F0EDE6] border border-[#E7E1D7] rounded-xl transition-colors cursor-pointer"
        >
          Essential Only
        </button>
        <button
          onClick={() => setConsent(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-[#205BE8] hover:bg-[#174AC4] rounded-xl shadow-warm transition-colors cursor-pointer"
        >
          Accept All
        </button>
      </div>
    </div>
  );
};
