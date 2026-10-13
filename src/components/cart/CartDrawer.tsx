import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AssetSlot } from '../common/AssetSlot';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    subtotal,
    freeShippingThreshold,
    shippingFee,
    discount,
    promoCode,
    applyPromoCode,
    total,
    setActiveTab,
  } = useStore();

  const [inputPromo, setInputPromo] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const success = applyPromoCode(inputPromo);
    if (!success) {
      setPromoError('Invalid code. Try "BOLT10" or "WELCOME20"');
    } else {
      setInputPromo('');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setActiveTab('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#201F1D]/45 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E7E1D7] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#E7E1D7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#205BE8]" />
              <h2 className="text-lg font-bold text-[#201F1D]">Your Cart</h2>
              <span className="text-xs font-mono font-bold bg-[#F0EDE6] text-[#777269] px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#777269] hover:text-[#201F1D] rounded-xl hover:bg-[#F0EDE6] transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Strip */}
          <div className="bg-[#F0EDE6]/70 px-6 py-3 border-b border-[#E7E1D7]">
            <div className="flex justify-between text-xs font-semibold text-[#777269] mb-1.5">
              <span>
                {amountNeededForFreeShipping === 0
                  ? '🎉 Free Shipping Unlocked!'
                  : `Add $${amountNeededForFreeShipping.toFixed(2)} more for Free Shipping`}
              </span>
              <span className="font-mono">{freeShippingProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-[#E7E1D7] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#205BE8] h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#F0EDE6] text-[#205BE8] flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#201F1D]">Your cart is empty</h3>
                  <p className="text-xs text-[#777269] mt-1 max-w-xs">
                    Explore our curated collection of tech essentials, audio gear, and accessories.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveTab('shop');
                  }}
                  className="px-5 py-2.5 bg-[#205BE8] hover:bg-[#174AC4] text-white rounded-xl text-xs font-bold shadow-warm transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                  className="flex gap-4 p-3 bg-[#F0EDE6]/40 rounded-2xl border border-[#E7E1D7]"
                >
                  <div className="w-20 h-20 bg-white rounded-xl p-1 shrink-0 flex items-center justify-center border border-[#E7E1D7]">
                    <AssetSlot
                      src={item.product.images?.[0] || item.product.image || ''}
                      alt={item.product.name}
                      category={item.product.category}
                      aspectRatio="aspect-square"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-[#201F1D] truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() =>
                            removeFromCart(item.product.id, item.selectedSize, item.selectedColor)
                          }
                          className="text-[#777269] hover:text-rose-500 transition-colors cursor-pointer"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Variant Info */}
                      {(item.selectedSize || item.selectedColor) && (
                        <p className="text-[11px] text-[#777269] mt-0.5">
                          {item.selectedSize && `Size: ${item.selectedSize}`}
                          {item.selectedSize && item.selectedColor && ' · '}
                          {item.selectedColor && `Color: ${item.selectedColor}`}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#E7E1D7] rounded-lg bg-white">
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              Math.max(1, item.quantity - 1),
                              item.selectedSize,
                              item.selectedColor
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center text-[#777269] hover:bg-[#F0EDE6] font-bold text-xs rounded-l cursor-pointer transition-colors"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-mono font-bold text-[#201F1D]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedSize,
                              item.selectedColor
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center text-[#777269] hover:bg-[#F0EDE6] font-bold text-xs rounded-r cursor-pointer transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-extrabold text-[#201F1D] font-mono tabular-nums">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-[#E7E1D7] bg-[#F0EDE6]/40 space-y-4">
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#777269] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Promo code (BOLT10)"
                      value={inputPromo}
                      onChange={(e) => setInputPromo(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E7E1D7] rounded-xl focus:border-[#205BE8] focus:ring-1 focus:ring-[#205BE8]/20 focus:outline-hidden uppercase text-[#201F1D]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-[#201F1D] text-white rounded-xl text-xs font-semibold hover:bg-[#2E2C29] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[11px] text-rose-500 font-medium">{promoError}</p>}
                {promoCode && (
                  <p className="text-[11px] text-emerald-600 font-semibold">
                    ✓ Code {promoCode} applied!
                  </p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#777269]">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#777269]">
                  <span>Shipping</span>
                  <span className="font-mono tabular-nums">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-[#E7E1D7] pt-2 flex justify-between text-base font-extrabold text-[#201F1D]">
                  <span>Total</span>
                  <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 px-4 bg-[#205BE8] hover:bg-[#174AC4] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-warm transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#777269]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#205BE8]" />
                <span>Encrypted 256-Bit Secure Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
