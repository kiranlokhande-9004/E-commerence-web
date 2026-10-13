import React from 'react';
import { CheckCircle, Truck, ShoppingBag, Package } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OrderConfirmationView: React.FC = () => {
  const { lastOrder, setActiveTab } = useStore();

  // If no valid order exists, do not show fake data; show graceful guidance
  if (!lastOrder) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-[#F0EDE6] text-[#777269] mx-auto flex items-center justify-center mb-4 border border-[#E7E1D7]">
          <Package className="w-8 h-8 text-[#205BE8]" />
        </div>
        <h2 className="text-xl font-bold text-[#201F1D]">No recent order found</h2>
        <p className="text-sm text-[#777269] mt-2 mb-6 max-w-sm mx-auto">
          You don't have an active confirmation session. Past orders can be reviewed in your order history.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('shop')}
            className="px-6 py-2.5 bg-[#205BE8] hover:bg-[#174AC4] text-white rounded-xl font-bold text-sm cursor-pointer shadow-warm transition-colors inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Go to Shop</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className="neu-button px-5 py-2.5 bg-[#FFFFFF] border border-[#E7E1D7] text-[#201F1D] rounded-xl font-semibold text-sm cursor-pointer transition-colors"
          >
            View Order History
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { title: 'Order Confirmed', date: 'Just now', completed: true },
    { title: 'Preparing Shipment', date: 'Expected today', completed: true },
    { title: 'In Transit', date: '2–3 days', completed: false },
    { title: 'Out for Delivery', date: 'Pending', completed: false },
    { title: 'Delivered', date: 'Pending', completed: false },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in">
      {/* Success Hero Header with Soft Depth */}
      <div className="bg-[#FFFFFF] border border-[#E7E1D7] rounded-3xl p-6 sm:p-8 text-center shadow-warm mb-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4 border border-emerald-200">
          <CheckCircle className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Payment & Order Successful
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#201F1D] mt-1 tracking-tight">
          Thank you for your order!
        </h1>
        <p className="text-sm text-[#777269] max-w-md mx-auto mt-2">
          We’ve received your order and will notify you at{' '}
          <span className="font-semibold text-[#201F1D]">{lastOrder.shippingAddress.email}</span> when it ships.
        </p>

        {/* Quick Meta Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs">
          <div className="px-3.5 py-1.5 bg-[#F0EDE6] border border-[#E7E1D7] rounded-xl shadow-2xs">
            <span className="text-[#777269]">Order ID: </span>
            <span className="font-mono font-bold text-[#201F1D]">{lastOrder.id}</span>
          </div>
          <div className="px-3.5 py-1.5 bg-[#F0EDE6] border border-[#E7E1D7] rounded-xl shadow-2xs">
            <span className="text-[#777269]">Tracking: </span>
            <span className="font-mono font-bold text-[#205BE8]">{lastOrder.trackingNumber}</span>
          </div>
          <div className="px-3.5 py-1.5 bg-[#F0EDE6] border border-[#E7E1D7] rounded-xl shadow-2xs">
            <span className="text-[#777269]">Payment: </span>
            <span className="font-bold text-[#201F1D]">{lastOrder.paymentMethod}</span>
          </div>
        </div>
      </div>

      {/* Live Tracking Progress Bar */}
      <div className="bg-[#FFFFFF] border border-[#E7E1D7] rounded-2xl p-6 sm:p-8 shadow-warm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-[#201F1D] flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#205BE8]" />
            <span>Delivery Tracking Progress</span>
          </h3>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#205BE8]/10 text-[#205BE8]">
            Status: {lastOrder.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                  step.completed
                    ? 'bg-[#205BE8] text-white shadow-warm'
                    : 'bg-[#F0EDE6] text-[#777269] border border-[#E7E1D7]'
                }`}
              >
                {step.completed ? '✓' : idx + 1}
              </div>
              <span className="text-xs font-bold text-[#201F1D]">{step.title}</span>
              <span className="text-[11px] text-[#777269] mt-0.5">{step.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setActiveTab('shop')}
          className="px-6 py-3 bg-[#205BE8] hover:bg-[#174AC4] text-white rounded-xl text-sm font-bold shadow-warm transition-colors cursor-pointer"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className="neu-button px-6 py-3 bg-[#FFFFFF] border border-[#E7E1D7] hover:bg-[#F0EDE6] text-[#201F1D] rounded-xl text-sm font-bold shadow-warm transition-colors cursor-pointer"
        >
          View All Orders
        </button>
      </div>
    </div>
  );
};
