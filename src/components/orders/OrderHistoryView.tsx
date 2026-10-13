import React from 'react';
import { Package, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OrderHistoryView: React.FC = () => {
  const { orders, setActiveTab } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#201F1D]">Order History & Tracking</h1>
          <p className="text-sm text-[#777269] mt-1">
            Review active deliveries, tracking codes, and past order invoices.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('shop')}
          className="px-4 py-2.5 bg-[#205BE8] hover:bg-[#174AC4] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-warm"
        >
          Browse Catalog
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-[#E7E1D7] rounded-3xl p-12 text-center shadow-warm">
          <div className="w-16 h-16 rounded-2xl bg-[#F0EDE6] text-[#205BE8] mx-auto flex items-center justify-center mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#201F1D]">No orders placed yet</h3>
          <p className="text-sm text-[#777269] mt-1 mb-6 max-w-sm mx-auto">
            Once you complete a purchase, your real-time tracking updates and digital receipts will show up here.
          </p>
          <button
            onClick={() => setActiveTab('shop')}
            className="px-6 py-3 bg-[#205BE8] text-white rounded-xl text-sm font-bold shadow-warm hover:bg-[#174AC4] transition-colors cursor-pointer"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-[#E7E1D7] rounded-2xl p-6 shadow-warm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E7E1D7] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F0EDE6] text-[#205BE8] flex items-center justify-center font-bold text-sm">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#201F1D]">
                      Order <span className="font-mono text-[#205BE8]">{order.id}</span>
                    </h3>
                    <p className="text-xs text-[#777269]">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-3 py-1 bg-[#205BE8]/10 text-[#205BE8] rounded-full">
                    {order.status}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#201F1D] font-mono tabular-nums">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#777269]">Items</h4>
                <div className="divide-y divide-[#E7E1D7]">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-bold text-[#777269]">{item.quantity}×</span>
                        <span className="font-semibold text-[#201F1D] truncate">{item.product.name}</span>
                        {(item.selectedSize || item.selectedColor) && (
                          <span className="text-[#777269]">
                            ({[item.selectedSize, item.selectedColor].filter(Boolean).join(', ')})
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[#201F1D] tabular-nums font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Meta Strip */}
              <div className="pt-3 border-t border-[#E7E1D7] flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2 text-[#777269]">
                  <Truck className="w-4 h-4 text-[#205BE8]" />
                  <span>
                    Tracking: <strong className="font-mono text-[#201F1D]">{order.trackingNumber}</strong>
                  </span>
                </div>
                <div className="text-[#777269]">
                  Shipping to: <span className="font-semibold text-[#201F1D]">{order.shippingAddress.fullName}</span>, {order.shippingAddress.city}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
