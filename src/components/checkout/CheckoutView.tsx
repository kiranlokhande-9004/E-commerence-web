import React, { useState } from 'react';
import { z } from 'zod';
import { ShieldCheck, ArrowLeft, CheckCircle2, Lock, CreditCard, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { processPayment } from '../../services/paymentAdapter';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name (at least 2 characters)'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number (at least 7 digits)'),
  addressLine1: z.string().min(4, 'Please enter a valid street address'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State or province is required'),
  postalCode: z.string().min(3, 'Postal or ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
  botTrap: z.string().max(0, 'Bot detected'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const CheckoutView: React.FC = () => {
  const { cart, subtotal, shippingFee, discount, total, createOrder, setActiveTab } = useStore();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    botTrap: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cod'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/28',
    cvv: '123',
    nameOnCard: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cooldownRemaining > 0) {
      alert(`Please wait ${cooldownRemaining} seconds before submitting again.`);
      return;
    }

    setPaymentError(null);

    const validationResult = checkoutSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await processPayment({
        amount: total,
        currency: 'USD',
        paymentMethod,
        cardDetails: paymentMethod === 'card' ? cardDetails : undefined,
      });

      if (!result.success) {
        setPaymentError(result.errorMessage || 'Payment could not be authorized. Please review your details.');
        setIsSubmitting(false);
        return;
      }

      createOrder(
        {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod === 'card'
          ? 'Credit Card (**** 4242)'
          : paymentMethod === 'apple_pay'
          ? 'Apple Pay / Digital Wallet'
          : 'Cash on Delivery'
      );

      setCooldownRemaining(30);
      const interval = setInterval(() => {
        setCooldownRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setIsSubmitting(false);
      setActiveTab('order-confirmation');
    } catch (err: any) {
      setPaymentError(err.message || 'An unexpected payment error occurred.');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-extrabold text-[#201F1D] dark:text-[#F3EFE8]">Your Cart is Empty</h2>
        <p className="text-sm text-[#777269] dark:text-[#A59D91] mt-2 mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => setActiveTab('shop')}
          className="px-6 py-3 bg-[#205BE8] text-white rounded-xl font-bold text-sm shadow-warm hover:bg-[#174AC4] transition-colors cursor-pointer"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Return to shop */}
      <button
        onClick={() => setActiveTab('shop')}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#201F1D] dark:text-[#F3EFE8] hover:text-[#205BE8] dark:hover:text-[#3B82F6] mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shop</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Shipping + Payment */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#201F1D] dark:text-[#F3EFE8] tracking-tight">
              Express Checkout
            </h1>
            <p className="text-xs sm:text-sm text-[#777269] dark:text-[#A59D91] mt-1">
              Please enter your shipping destination and payment information.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot field for bot/spam protection */}
            <div className="hidden" aria-hidden="true">
              <input
                name="botTrap"
                type="text"
                value={formData.botTrap}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Shipping Details Card */}
            <div className="bg-[#FFFFFF] dark:bg-[#1C1916] border border-[#E7E1D7] dark:border-[#332E28] rounded-2xl p-6 shadow-warm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E7E1D7] dark:border-[#332E28] pb-3">
                <h2 className="text-lg font-bold text-[#201F1D] dark:text-[#F3EFE8] flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#205BE8]" />
                  <span>1. Shipping Details</span>
                </h2>
                <span className="text-xs text-[#777269] dark:text-[#A59D91] font-medium">* Required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#201F1D] dark:text-[#F3EFE8] uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Kiran Lokhande"
                    className={`w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] dark:bg-[#221F1B] border rounded-xl text-[#201F1D] dark:text-[#F3EFE8] placeholder-[#777269] dark:placeholder-[#A59D91] focus:outline-hidden transition-colors ${
                      errors.fullName
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-[#E7E1D7] dark:border-[#332E28] focus:border-[#205BE8] focus:ring-2 focus:ring-[#205BE8]/20'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.fullName}</p>
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
                    onChange={handleChange}
                    placeholder="you@domain.com"
                    className={`w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] dark:bg-[#221F1B] border rounded-xl text-[#201F1D] dark:text-[#F3EFE8] placeholder-[#777269] dark:placeholder-[#A59D91] focus:outline-hidden transition-colors ${
                      errors.email
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-[#E7E1D7] dark:border-[#332E28] focus:border-[#205BE8] focus:ring-2 focus:ring-[#205BE8]/20'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#201F1D] dark:text-[#F3EFE8] uppercase mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 019-2834"
                    className={`w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] dark:bg-[#221F1B] border rounded-xl text-[#201F1D] dark:text-[#F3EFE8] placeholder-[#777269] dark:placeholder-[#A59D91] focus:outline-hidden transition-colors ${
                      errors.phone
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-[#E7E1D7] dark:border-[#332E28] focus:border-[#205BE8] focus:ring-2 focus:ring-[#205BE8]/20'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.phone}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#201F1D] dark:text-[#F3EFE8] uppercase mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="123 Innovation Blvd, Apt 4B"
                    className={`w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] dark:bg-[#221F1B] border rounded-xl text-[#201F1D] dark:text-[#F3EFE8] placeholder-[#777269] dark:placeholder-[#A59D91] focus:outline-hidden transition-colors ${
                      errors.addressLine1
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-[#E7E1D7] dark:border-[#332E28] focus:border-[#205BE8] focus:ring-2 focus:ring-[#205BE8]/20'
                    }`}
                  />
                  {errors.addressLine1 && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.addressLine1}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#201F1D] dark:text-[#F3EFE8] uppercase mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="San Francisco"
                    className={`w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] dark:bg-[#221F1B] border rounded-xl text-[#201F1D] dark:text-[#F3EFE8] placeholder-[#777269] dark:placeholder-[#A59D91] focus:outline-hidden transition-colors ${
                      errors.city
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-[#E7E1D7] dark:border-[#332E28] focus:border-[#205BE8] focus:ring-2 focus:ring-[#205BE8]/20'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.city}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-[#201F1D] dark:text-[#F3EFE8] uppercase mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="CA"
                      className={`w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] dark:bg-[#221F1B] border rounded-xl text-[#201F1D] dark:text-[#F3EFE8] placeholder-[#777269] dark:placeholder-[#A59D91] focus:outline-hidden transition-colors ${
                        errors.state
                          ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-[#E7E1D7] dark:border-[#332E28] focus:border-[#205BE8] focus:ring-2 focus:ring-[#205BE8]/20'
                      }`}
                    />
                    {errors.state && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{errors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#201F1D] dark:text-[#F3EFE8] uppercase mb-1">
                      ZIP *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="94107"
                      className={`w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] dark:bg-[#221F1B] border rounded-xl text-[#201F1D] dark:text-[#F3EFE8] placeholder-[#777269] dark:placeholder-[#A59D91] focus:outline-hidden transition-colors ${
                        errors.postalCode
                          ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-[#E7E1D7] dark:border-[#332E28] focus:border-[#205BE8] focus:ring-2 focus:ring-[#205BE8]/20'
                      }`}
                    />
                    {errors.postalCode && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{errors.postalCode}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-[#FFFFFF] dark:bg-[#1C1916] border border-[#E7E1D7] dark:border-[#332E28] rounded-2xl p-6 shadow-warm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E7E1D7] dark:border-[#332E28] pb-3">
                <h2 className="text-lg font-bold text-[#201F1D] dark:text-[#F3EFE8] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#205BE8]" />
                  <span>2. Payment Method</span>
                </h2>
                <div className="flex items-center gap-1 text-xs text-[#777269] dark:text-[#A59D91]">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-bit SSL</span>
                </div>
              </div>

              {/* Selector Tabs with Soft Depth */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#205BE8] bg-[#205BE8]/10 text-[#205BE8] shadow-xs'
                      : 'neu-button border-[#E7E1D7] dark:border-[#332E28] bg-[#FFFFFF] dark:bg-[#221F1B] text-[#201F1D] dark:text-[#F3EFE8] hover:border-[#205BE8]'
                  }`}
                >
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    paymentMethod === 'apple_pay'
                      ? 'border-[#205BE8] bg-[#205BE8]/10 text-[#205BE8] shadow-xs'
                      : 'neu-button border-[#E7E1D7] dark:border-[#332E28] bg-[#FFFFFF] dark:bg-[#221F1B] text-[#201F1D] dark:text-[#F3EFE8] hover:border-[#205BE8]'
                  }`}
                >
                  Apple Pay / GPay
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#205BE8] bg-[#205BE8]/10 text-[#205BE8] shadow-xs'
                      : 'neu-button border-[#E7E1D7] dark:border-[#332E28] bg-[#FFFFFF] dark:bg-[#221F1B] text-[#201F1D] dark:text-[#F3EFE8] hover:border-[#205BE8]'
                  }`}
                >
                  Cash on Delivery
                </button>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-[#F0EDE6]/50 dark:bg-[#221F1B]/70 rounded-xl space-y-3 border border-[#E7E1D7] dark:border-[#332E28]">
                  <div>
                    <label className="block text-[11px] font-bold text-[#777269] dark:text-[#A59D91] uppercase mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={(e) =>
                        setCardDetails((prev) => ({ ...prev, cardNumber: e.target.value }))
                      }
                      placeholder="4242 4242 4242 4242"
                      className="w-full px-3 py-2 text-sm bg-[#FFFFFF] dark:bg-[#1C1916] border border-[#E7E1D7] dark:border-[#332E28] rounded-lg font-mono text-[#201F1D] dark:text-[#F3EFE8] focus:border-[#205BE8] focus:ring-1 focus:ring-[#205BE8]/20 focus:outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#777269] dark:text-[#A59D91] uppercase mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) =>
                          setCardDetails((prev) => ({ ...prev, expiry: e.target.value }))
                        }
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 text-sm bg-[#FFFFFF] dark:bg-[#1C1916] border border-[#E7E1D7] dark:border-[#332E28] rounded-lg font-mono text-[#201F1D] dark:text-[#F3EFE8] focus:border-[#205BE8] focus:ring-1 focus:ring-[#205BE8]/20 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#777269] dark:text-[#A59D91] uppercase mb-1">
                        Security CVC
                      </label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) =>
                          setCardDetails((prev) => ({ ...prev, cvv: e.target.value }))
                        }
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-3 py-2 text-sm bg-[#FFFFFF] dark:bg-[#1C1916] border border-[#E7E1D7] dark:border-[#332E28] rounded-lg font-mono text-[#201F1D] dark:text-[#F3EFE8] focus:border-[#205BE8] focus:ring-1 focus:ring-[#205BE8]/20 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'apple_pay' && (
                <div className="p-4 bg-[#F0EDE6]/50 dark:bg-[#221F1B]/70 rounded-xl text-center text-xs text-[#777269] dark:text-[#A59D91] border border-[#E7E1D7] dark:border-[#332E28]">
                  Biometric one-touch authorization will launch when you place order.
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-[#F0EDE6]/50 dark:bg-[#221F1B]/70 rounded-xl text-xs text-[#777269] dark:text-[#A59D91] space-y-1 border border-[#E7E1D7] dark:border-[#332E28]">
                  <p className="font-semibold text-[#201F1D] dark:text-[#F3EFE8]">Cash on Delivery selected.</p>
                  <p>You can pay via card or cash directly to the courier when your package arrives.</p>
                </div>
              )}

              {paymentError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-400 font-medium">
                  {paymentError}
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting || cooldownRemaining > 0}
                className="w-full py-4 px-6 bg-[#205BE8] hover:bg-[#174AC4] disabled:bg-[#F0EDE6] dark:disabled:bg-[#221F1B] disabled:text-[#777269] dark:disabled:text-[#A59D91] text-white font-bold rounded-xl text-base shadow-warm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Securing & Processing Order...</span>
                ) : cooldownRemaining > 0 ? (
                  <span>Please wait ({cooldownRemaining}s)...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirm Order · ${total.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#FFFFFF] dark:bg-[#1C1916] border border-[#E7E1D7] dark:border-[#332E28] rounded-2xl p-6 shadow-warm space-y-4 sticky top-24">
            <h3 className="text-base font-bold text-[#201F1D] dark:text-[#F3EFE8] border-b border-[#E7E1D7] dark:border-[#332E28] pb-3">
              Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </h3>

            {/* Item list */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-5 h-5 bg-[#F0EDE6] dark:bg-[#221F1B] rounded text-[#201F1D] dark:text-[#F3EFE8] font-bold flex items-center justify-center shrink-0 border border-[#E7E1D7] dark:border-[#332E28]">
                      {item.quantity}×
                    </span>
                    <span className="font-semibold text-[#201F1D] dark:text-[#F3EFE8] truncate">{item.product.name}</span>
                  </div>
                  <span className="font-mono tabular-nums text-[#201F1D] dark:text-[#F3EFE8] font-bold shrink-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-[#E7E1D7] dark:border-[#332E28] pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-[#777269] dark:text-[#A59D91]">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Promo Discount</span>
                  <span className="font-mono tabular-nums">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#777269] dark:text-[#A59D91]">
                <span>Estimated Shipping</span>
                <span className="font-mono tabular-nums">
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-[#777269] dark:text-[#A59D91]">
                <span>Estimated Sales Tax (8%)</span>
                <span className="font-mono tabular-nums">${(subtotal * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t border-[#E7E1D7] dark:border-[#332E28] pt-3 flex justify-between text-lg font-extrabold text-[#201F1D] dark:text-[#F3EFE8]">
                <span>Total Due</span>
                <span className="font-mono tabular-nums text-[#205BE8] dark:text-[#60A5FA]">
                  ${(total + subtotal * 0.08).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-[#F0EDE6]/60 dark:bg-[#221F1B]/70 border border-[#E7E1D7] dark:border-[#332E28] rounded-xl p-3 text-[11px] text-[#777269] dark:text-[#A59D91] space-y-1">
              <p className="flex items-center gap-1.5 font-semibold text-[#201F1D] dark:text-[#F3EFE8]">
                <ShieldCheck className="w-4 h-4 text-[#205BE8]" />
                <span>Bomato Buyer Protection Guarantee</span>
              </p>
              <p>Every purchase includes comprehensive tracking, insurance, and authentic merchandise warranty.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
