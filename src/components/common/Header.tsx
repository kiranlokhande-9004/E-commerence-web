import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  LogOut,
  Package,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cartCount,
    setIsCartOpen,
    wishlist,
    user,
    logout,
    setIsAuthModalOpen,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'categories', label: 'Categories' },
    { id: 'deals', label: 'Deals' },
    { id: 'new-arrivals', label: 'New Arrivals' },
    { id: 'about', label: 'About Us' },
  ];

  const handleNavClick = (id: string) => {
    setSelectedCategory(null);
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white">
      {/* Top Announcement Bar (Warm charcoal #1F1B17) */}
      <div className="bg-[#1F1B17] text-[#ECE8E0] text-xs py-2 px-4 sm:px-8 border-b border-[#2D2722]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="text-amber-400 font-bold">⚡</span>
            <span className="hidden sm:inline">Summer Sale is Live! Get Up to 60% OFF on Selected Items</span>
            <span className="sm:hidden font-medium">Summer Sale: Up to 60% OFF</span>
            <button
              onClick={() => handleNavClick('deals')}
              className="text-[#60A5FA] hover:text-[#93C5FD] font-semibold underline underline-offset-2 ml-1 inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              Shop Now <ArrowRight className="w-3 h-3 inline" />
            </button>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[#ECE8E0]/70 shrink-0">
            <span>Free Shipping on orders over $99</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="border-b border-[#E3DDD2] bg-[#FFFEFB]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A56DB] rounded-lg shrink-0 cursor-pointer"
            aria-label="Bomato Home"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1A56DB] flex items-center justify-center text-white shadow-sm shadow-[#1A56DB]/20">
              {/* Distinctive geometric shopping motif */}
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-[#1C1A17] font-['Plus_Jakarta_Sans']">
                Bomato
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#6B645A]">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`transition-colors relative py-1 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A56DB] rounded cursor-pointer ${
                    isActive ? 'text-[#1A56DB] font-bold' : 'hover:text-[#1C1A17]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A56DB] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-xs xl:max-w-md relative">
            <Search className="w-4 h-4 text-[#6B645A] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'shop') setActiveTab('shop');
              }}
              className="w-full pl-10 pr-4 py-2 bg-[#ECE8E0] hover:bg-[#ECE8E0]/80 focus:bg-[#FFFEFB] text-sm text-[#1C1A17] placeholder-[#6B645A] rounded-full border border-[#E3DDD2] focus:border-[#1A56DB] focus:outline-hidden focus:ring-2 focus:ring-[#1A56DB]/20 transition-all"
            />
          </div>

          {/* Actions: Account, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Account */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="p-2 text-[#1C1A17] hover:text-[#1A56DB] hover:bg-[#ECE8E0] rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
                    aria-label="User Account"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1A56DB]/10 text-[#1A56DB] font-bold text-xs flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#FFFEFB] border border-[#E3DDD2] rounded-xl shadow-warm py-1.5 z-50 text-sm animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2 border-b border-[#E3DDD2]">
                        <p className="font-semibold text-[#1C1A17] truncate">{user.name}</p>
                        <p className="text-xs text-[#6B645A] truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('orders');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-[#1C1A17] hover:bg-[#ECE8E0] flex items-center gap-2 cursor-pointer"
                      >
                        <Package className="w-4 h-4 text-[#1A56DB]" /> My Orders
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="p-2.5 text-[#1C1A17] hover:text-[#1A56DB] hover:bg-[#ECE8E0] rounded-full transition-colors cursor-pointer"
                  aria-label="Sign in"
                >
                  <UserIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={() => {
                setActiveTab('wishlist');
              }}
              className={`p-2.5 rounded-full transition-colors relative cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'text-[#1A56DB] bg-[#1A56DB]/10'
                  : 'text-[#1C1A17] hover:text-[#1A56DB] hover:bg-[#ECE8E0]'
              }`}
              aria-label={`Wishlist (${wishlist.length} items)`}
            >
              <Heart className={`w-5 h-5 ${activeTab === 'wishlist' ? 'fill-[#1A56DB]' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer Trigger (Image 1 style) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 text-[#1C1A17] hover:text-[#1A56DB] hover:bg-[#ECE8E0] rounded-full transition-colors relative cursor-pointer"
              aria-label={`Cart (${cartCount} items)`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#1A56DB] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#FFFEFB]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1C1A17] hover:bg-[#ECE8E0] rounded-lg lg:hidden cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#6B645A] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'shop') setActiveTab('shop');
              }}
              className="w-full pl-10 pr-4 py-2 bg-[#ECE8E0] text-sm text-[#1C1A17] placeholder-[#6B645A] rounded-full border border-[#E3DDD2] focus:border-[#1A56DB] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Mobile Nav Links Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E3DDD2] bg-[#FFFEFB] px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left py-2 px-3 rounded-lg text-sm font-semibold cursor-pointer ${
                  activeTab === link.id
                    ? 'bg-[#1A56DB]/10 text-[#1A56DB]'
                    : 'text-[#1C1A17] hover:bg-[#ECE8E0]'
                }`}
              >
                {link.label}
              </button>
            ))}
            {user && (
              <button
                onClick={() => {
                  setActiveTab('orders');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-[#1C1A17] hover:bg-[#ECE8E0] cursor-pointer"
              >
                My Orders
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
