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
        className="fixed inset-0 bg-[#201F1D]/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-warm border border-[#E7E1D7] animate-in fade-in zoom-in-95">
          {/* Close button */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-xl text-[#777269] hover:text-[#201F1D] hover:bg-[#F0EDE6] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Heading */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#F0EDE6] text-[#205BE8] mx-auto flex items-center justify-center mb-3">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#201F1D]">
              {mode === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
            </h2>
            <p className="text-xs text-[#777269] mt-1">
              {mode === 'login'
                ? 'Welcome back to BOLT 2.0. Access saved carts & orders.'
                : 'Join BOLT 2.0 for priority shipping and members-only deals.'}
            </p>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#F0EDE6] rounded-xl mb-6">
            <button
              onClick={() => {
                setMode('login');
                setErrors({});
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login' ? 'bg-white text-[#201F1D] shadow-xs' : 'text-[#777269] hover:text-[#201F1D]'
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
                mode === 'register' ? 'bg-white text-[#201F1D] shadow-xs' : 'text-[#777269] hover:text-[#201F1D]'
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
                <label className="block text-xs font-bold text-[#201F1D] uppercase mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#777269] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Kiran Lokhande"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-[#E7E1D7] rounded-xl text-[#201F1D] placeholder-[#777269] focus:border-[#205BE8] focus:ring-2 focus:ring-[#205BE8]/20 focus:outline-hidden"
                  />
                </div>
                {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#201F1D] uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#777269] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-[#E7E1D7] rounded-xl text-[#201F1D] placeholder-[#777269] focus:border-[#205BE8] focus:ring-2 focus:ring-[#205BE8]/20 focus:outline-hidden"
                />
              </div>
              {errors.email && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#201F1D] uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#777269] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-[#E7E1D7] rounded-xl text-[#201F1D] placeholder-[#777269] focus:border-[#205BE8] focus:ring-2 focus:ring-[#205BE8]/20 focus:outline-hidden"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#205BE8] hover:bg-[#174AC4] text-white font-bold rounded-xl text-sm shadow-warm transition-all cursor-pointer mt-2"
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
