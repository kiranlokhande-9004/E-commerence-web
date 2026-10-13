import React from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const PrivacyPolicyView: React.FC = () => {
  const { setActiveTab } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      <button
        onClick={() => setActiveTab('shop')}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#1C1A17] hover:text-[#1A56DB] mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Store</span>
      </button>

      {/* Notice Banner */}
      <div className="bg-[#ECE8E0] border border-[#E3DDD2] rounded-2xl p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-[#1C1A17]">
          <p className="font-bold uppercase tracking-wider">[DRAFT TEMPLATE — NEEDS LEGAL REVIEW]</p>
          <p className="mt-0.5 text-[#6B645A]">
            This document outlines only the actual data collected by this client application (name, email, shipping address, cart state, cookie preferences). Replace bracketed placeholders before deployment.
          </p>
        </div>
      </div>

      <div className="bg-[#FFFEFB] border border-[#E3DDD2] rounded-3xl p-8 shadow-warm space-y-6 text-sm text-[#1C1A17] leading-relaxed">
        <div className="border-b border-[#E3DDD2] pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1A17]">Privacy Policy</h1>
          <p className="text-xs text-[#6B645A] mt-1">Effective Date: October 12, 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1C1A17]">1. Information We Collect</h2>
          <p>
            When you interact with <strong>[BUSINESS_LEGAL_NAME]</strong> (operating as Bomato), we collect information necessary to fulfill your orders and improve store usability:
          </p>
          <ul className="list-disc list-inside space-y-1 text-[#6B645A]">
            <li><strong>Order Fulfillment Data:</strong> Full name, shipping destination, phone number, and billing email.</li>
            <li><strong>Session & Cart Data:</strong> Selected items, product variants, and promo codes stored in browser local storage.</li>
            <li><strong>Consent-Gated Analytics:</strong> Aggregated page views and product engagement metrics, collected exclusively after consent is granted via the cookie banner.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1C1A17]">2. How Payment Data is Handled</h2>
          <p>
            Payment transactions are processed through tokenized gateway adapters. <strong>[BUSINESS_LEGAL_NAME]</strong> never stores raw credit card CVV numbers or complete unencrypted payment credentials on our client servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1C1A17]">3. Cookies & Local Storage</h2>
          <p>
            We utilize first-party browser storage for basic site operation (cart persistence, user authentication session, accessibility preferences). Analytics cookies are strictly blocked until explicit user consent is registered.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1C1A17]">4. Contact & Data Access Inquiries</h2>
          <div className="p-4 bg-[#ECE8E0]/40 rounded-xl space-y-1 font-mono text-xs text-[#6B645A] border border-[#E3DDD2]">
            <p><strong>Legal Entity:</strong> [LEGAL_BUSINESS_NAME_PLACEHOLDER]</p>
            <p><strong>Privacy Officer Email:</strong> [PRIVACY_EMAIL_PLACEHOLDER@domain.com]</p>
            <p><strong>Physical Address:</strong> [STREET_ADDRESS_PLACEHOLDER, CITY, STATE, ZIP]</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export const TermsConditionsView: React.FC = () => {
  const { setActiveTab } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      <button
        onClick={() => setActiveTab('shop')}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#1C1A17] hover:text-[#1A56DB] mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Store</span>
      </button>

      {/* Notice Banner */}
      <div className="bg-[#ECE8E0] border border-[#E3DDD2] rounded-2xl p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-[#1C1A17]">
          <p className="font-bold uppercase tracking-wider">[DRAFT TEMPLATE — NEEDS LEGAL REVIEW]</p>
          <p className="mt-0.5 text-[#6B645A]">
            This terms agreement covers e-commerce order conditions, product availability, 30-day return policies, and platform limitations.
          </p>
        </div>
      </div>

      <div className="bg-[#FFFEFB] border border-[#E3DDD2] rounded-3xl p-8 shadow-warm space-y-6 text-sm text-[#1C1A17] leading-relaxed">
        <div className="border-b border-[#E3DDD2] pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1A17]">Terms & Conditions</h1>
          <p className="text-xs text-[#6B645A] mt-1">Effective Date: October 12, 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1C1A17]">1. Acceptance of Terms</h2>
          <p>
            By purchasing goods or browsing <strong>Bomato</strong>, you agree to be bound by these standard terms and conditions provided by <strong>[LEGAL_BUSINESS_NAME_PLACEHOLDER]</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1C1A17]">2. Orders & Pricing</h2>
          <p>
            Prices displayed are subject to applicable local taxes and shipping thresholds. Orders are confirmed upon verification and fraud screening. We reserve the right to cancel orders in case of erroneous price display or inventory stock depletion.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1C1A17]">3. Shipping & 30-Day Returns</h2>
          <p>
            Standard orders over $99 qualify for complimentary domestic shipping. Customers are entitled to request returns or exchanges within 30 days of delivery provided items remain in original condition with intact packaging.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1C1A17]">4. Warranty & Disclaimer</h2>
          <p>
            Hardware products include manufacturer warranties where designated. In no event shall <strong>[LEGAL_BUSINESS_NAME_PLACEHOLDER]</strong> be liable for indirect damages arising from third-party logistics delays.
          </p>
        </section>
      </div>
    </div>
  );
};
