import React from 'react';
import { Package, Truck, ArrowRight, ExternalLink } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OrderHistoryView: React.FC = () => {
  const { orders, setActiveTab } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1A17]">Order History & Tracking</h1>
          <p className="text-sm text-[#6B645A] mt-1">
            Review active deliveries, tracking codes, and past order invoices.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('shop')}
          className="px-4 py-2 bg-[#1A56DB] hover:bg-[#1646B0] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-warm"
        >
          Browse Catalog
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-[#FFFEFB] border border-[#E3DDD2] rounded-3xl p-12 text-center shadow-warm">
          <div className="w-16 h-16 rounded-2xl bg-[#ECE8E0] text-[#1A56DB] mx-auto flex items-center justify-center mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#1C1A17]">No orders placed yet</h3>
          <p className="text-sm text-[#6B645A] mt-1 mb-6 max-w-sm mx-auto">
            Once you complete a purchase, your real-time tracking updates and digital receipts will show up here.
          </p>
          <button
            onClick={() => setActiveTab('shop')}
            className="px-6 py-3 bg-[#1A56DB] text-white rounded-xl text-sm font-bold shadow-warm hover:bg-[#1646B0] transition-colors cursor-pointer"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#FFFEFB] border border-[#E3DDD2] rounded-2xl p-6 shadow-warm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E3DDD2] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ECE8E0] text-[#1A56DB] flex items-center justify-center font-bold text-sm">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1C1A17]">
                      Order <span className="font-mono text-[#1A56DB]">{order.id}</span>
                    </h3>
                    <p className="text-xs text-[#6B645A]">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-3 py-1 bg-[#1A56DB]/10 text-[#1A56DB] rounded-full">
                    {order.status}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#1C1A17] font-mono tabular-nums">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B645A]">Items</h4>
                <div className="divide-y divide-[#E3DDD2]">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-bold text-[#6B645A]">{item.quantity}×</span>
                        <span className="font-semibold text-[#1C1A17] truncate">{item.product.name}</span>
                        {(item.selectedSize || item.selectedColor) && (
                          <span className="text-[#6B645A]">
                            ({[item.selectedSize, item.selectedColor].filter(Boolean).join(', ')})
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[#1C1A17] tabular-nums font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Meta Strip */}
              <div className="pt-3 border-t border-[#E3DDD2] flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2 text-[#6B645A]">
                  <Truck className="w-4 h-4 text-[#1A56DB]" />
                  <span>
                    Tracking: <strong className="font-mono text-[#1C1A17]">{order.trackingNumber}</strong>
                  </span>
                </div>
                <div className="text-[#6B645A]">
                  Shipping to: <span className="font-semibold text-[#1C1A17]">{order.shippingAddress.fullName}</span>, {order.shippingAddress.city}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
