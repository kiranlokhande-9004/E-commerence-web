import React from 'react';
import { CheckCircle, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OrderConfirmationView: React.FC = () => {
  const { lastOrder, setActiveTab } = useStore();

  if (!lastOrder) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-[#1C1A17]">No recent order found</h2>
        <p className="text-sm text-[#6B645A] mt-2 mb-6">
          Your active or past orders will appear in your order history.
        </p>
        <button
          onClick={() => setActiveTab('shop')}
          className="px-6 py-2.5 bg-[#1A56DB] text-white rounded-xl font-semibold text-sm cursor-pointer shadow-warm"
        >
          Go to Shop
        </button>
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
      {/* Success Hero Header */}
      <div className="bg-[#FFFEFB] border border-[#E3DDD2] rounded-3xl p-8 text-center shadow-warm mb-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4 shadow-xs">
          <CheckCircle className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Payment & Order Successful
        </span>
        <h1 className="text-3xl font-extrabold text-[#1C1A17] mt-1">Thank you for your order!</h1>
        <p className="text-sm text-[#6B645A] max-w-md mx-auto mt-2">
          We’ve received your order and will notify you at{' '}
          <span className="font-semibold text-[#1C1A17]">{lastOrder.shippingAddress.email}</span> when it ships.
        </p>

        {/* Quick Meta Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="px-3.5 py-1.5 bg-[#ECE8E0] border border-[#E3DDD2] rounded-xl">
            <span className="text-[#6B645A]">Order ID: </span>
            <span className="font-mono font-bold text-[#1C1A17]">{lastOrder.id}</span>
          </div>
          <div className="px-3.5 py-1.5 bg-[#ECE8E0] border border-[#E3DDD2] rounded-xl">
            <span className="text-[#6B645A]">Tracking: </span>
            <span className="font-mono font-bold text-[#1A56DB]">{lastOrder.trackingNumber}</span>
          </div>
          <div className="px-3.5 py-1.5 bg-[#ECE8E0] border border-[#E3DDD2] rounded-xl">
            <span className="text-[#6B645A]">Payment: </span>
            <span className="font-bold text-[#1C1A17]">{lastOrder.paymentMethod}</span>
          </div>
        </div>
      </div>

      {/* Live Tracking Progress Bar */}
      <div className="bg-[#FFFEFB] border border-[#E3DDD2] rounded-2xl p-6 sm:p-8 shadow-warm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-[#1C1A17] flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#1A56DB]" />
            <span>Delivery Tracking Progress</span>
          </h3>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#1A56DB]/10 text-[#1A56DB]">
            Status: {lastOrder.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 ${
                  step.completed
                    ? 'bg-[#1A56DB] text-white shadow-warm'
                    : 'bg-[#ECE8E0] text-[#6B645A] border border-[#E3DDD2]'
                }`}
              >
                {step.completed ? '✓' : idx + 1}
              </div>
              <span className="text-xs font-bold text-[#1C1A17]">{step.title}</span>
              <span className="text-[11px] text-[#6B645A] mt-0.5">{step.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setActiveTab('shop')}
          className="px-6 py-3 bg-[#1A56DB] hover:bg-[#1646B0] text-white rounded-xl text-sm font-bold shadow-warm transition-colors cursor-pointer"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className="px-6 py-3 bg-[#FFFEFB] border border-[#E3DDD2] hover:bg-[#ECE8E0] text-[#1C1A17] rounded-xl text-sm font-bold shadow-warm transition-colors cursor-pointer"
        >
          View All Orders
        </button>
      </div>
    </div>
  );
};
