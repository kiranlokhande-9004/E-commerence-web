import React, { useState } from 'react';
import { z } from 'zod';
import { X, User, Mail, Lock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const authSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  botTrap: z.string().max(0, 'Bot detected'),
});

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    botTrap: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = authSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      login(formData.name || formData.email.split('@')[0], formData.email);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-[#1F1B17]/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-[#FFFEFB] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-warm border border-[#E3DDD2] animate-in fade-in zoom-in-95">
          {/* Close button */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full text-[#6B645A] hover:text-[#1C1A17] hover:bg-[#ECE8E0] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Heading */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#ECE8E0] text-[#1A56DB] mx-auto flex items-center justify-center mb-3">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#1C1A17]">
              {mode === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
            </h2>
            <p className="text-xs text-[#6B645A] mt-1">
              {mode === 'login'
                ? 'Welcome back to Bomato. Access saved carts & orders.'
                : 'Join Bomato for priority shipping and members-only deals.'}
            </p>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#ECE8E0] rounded-xl mb-6">
            <button
              onClick={() => {
                setMode('login');
                setErrors({});
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login' ? 'bg-[#FFFEFB] text-[#1C1A17] shadow-xs' : 'text-[#6B645A] hover:text-[#1C1A17]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrors({});
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'register' ? 'bg-[#FFFEFB] text-[#1C1A17] shadow-xs' : 'text-[#6B645A] hover:text-[#1C1A17]'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                value={formData.botTrap}
                onChange={(e) => setFormData((p) => ({ ...p, botTrap: e.target.value }))}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-[#1C1A17] uppercase mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#6B645A] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Kiran Lokhande"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-[#FFFEFB] border border-[#E3DDD2] rounded-xl text-[#1C1A17] placeholder-[#6B645A] focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/20 focus:outline-hidden"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#1C1A17] uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6B645A] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-[#FFFEFB] border border-[#E3DDD2] rounded-xl text-[#1C1A17] placeholder-[#6B645A] focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/20 focus:outline-hidden"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1A17] uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6B645A] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-[#FFFEFB] border border-[#E3DDD2] rounded-xl text-[#1C1A17] placeholder-[#6B645A] focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/20 focus:outline-hidden"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#1A56DB] hover:bg-[#1646B0] text-white font-bold rounded-xl text-sm shadow-warm transition-all cursor-pointer mt-2"
            >
              {isSubmitting
                ? 'Authenticating...'
                : mode === 'login'
                ? 'Sign In to Account'
                : 'Create My Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
