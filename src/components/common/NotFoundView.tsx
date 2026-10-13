import React from 'react';
import { Compass, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const NotFoundView: React.FC = () => {
  const { setActiveTab } = useStore();

  return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center animate-in fade-in">
      <div className="w-20 h-20 rounded-3xl bg-[#ECE8E0] text-[#1A56DB] mx-auto flex items-center justify-center mb-6 shadow-warm">
        <Compass className="w-10 h-10 animate-spin [animation-duration:8s]" />
      </div>

      <span className="text-xs font-mono font-bold text-[#1A56DB] uppercase tracking-widest bg-[#1A56DB]/10 px-3 py-1 rounded-full">
        Error 404 · Page Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1A17] mt-4 tracking-tight">
        Lost in transit?
      </h1>

      <p className="text-sm text-[#6B645A] mt-2 mb-8 max-w-md mx-auto">
        The link you followed may be expired or the product category was relocated. Let's get you back to the collection.
      </p>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setActiveTab('home')}
          className="px-6 py-3 bg-[#1A56DB] hover:bg-[#1646B0] text-white font-bold rounded-xl text-sm shadow-warm transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Explore Storefront</span>
        </button>
        <button
          onClick={() => window.history.back()}
          className="px-5 py-3 bg-[#FFFEFB] border border-[#E3DDD2] hover:bg-[#ECE8E0] text-[#1C1A17] font-semibold rounded-xl text-sm shadow-warm transition-colors cursor-pointer"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};
