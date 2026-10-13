import React from 'react';
import { Compass, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const NotFoundView: React.FC = () => {
  const { setActiveTab } = useStore();

  const handleGoBack = () => {
    if (window.history.length > 1 && document.referrer) {
      window.history.back();
    } else {
      setActiveTab('home');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center animate-in fade-in">
      <div className="w-20 h-20 rounded-3xl bg-[#F0EDE6] text-[#205BE8] mx-auto flex items-center justify-center mb-6 shadow-warm border border-[#E7E1D7]">
        <Compass className="w-10 h-10 animate-spin [animation-duration:8s]" />
      </div>

      <span className="text-xs font-mono font-bold text-[#205BE8] uppercase tracking-widest bg-[#205BE8]/10 px-3 py-1 rounded-full border border-[#205BE8]/20">
        Error 404 · Page Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#201F1D] mt-4 tracking-tight">
        Lost in transit?
      </h1>

      <p className="text-sm text-[#777269] mt-2 mb-8 max-w-md mx-auto leading-relaxed">
        The link you followed may be expired or the product category was relocated. Let's get you back to the collection.
      </p>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setActiveTab('home')}
          className="px-6 py-3 bg-[#205BE8] hover:bg-[#174AC4] text-white font-bold rounded-xl text-sm shadow-warm transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Explore Storefront</span>
        </button>
        <button
          onClick={handleGoBack}
          className="neu-button px-5 py-3 bg-[#FFFFFF] border border-[#E7E1D7] hover:bg-[#F0EDE6] text-[#201F1D] font-semibold rounded-xl text-sm shadow-warm transition-colors cursor-pointer inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
};
