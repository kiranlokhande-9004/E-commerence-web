import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
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
    <header className="sticky top-0 z-40">
      {/* Top Announcement Bar - Charcoal Brand Band */}
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
          <div className="hidden md:flex items-center gap-2 text-[#ECE8E0]/75 shrink-0">
            <span>Free Shipping on orders over $99</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar with Glassmorphism */}
      <div className="glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#205BE8] rounded-xl shrink-0 cursor-pointer"
            aria-label="Bomato Home"
          >
            <div className="w-10 h-10 rounded-xl bg-[#205BE8] flex items-center justify-center text-white shadow-sm shadow-[#205BE8]/25 transition-transform hover:scale-105">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-[#201F1D] font-['Plus_Jakarta_Sans']">
                Bomato
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#777269]">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`transition-colors relative py-1 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#205BE8] rounded cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive ? 'text-[#205BE8] font-bold' : 'hover:text-[#201F1D]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#205BE8] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Search Bar with Soft Neumorphic Inset Depth */}
          <div className="hidden md:flex items-center flex-1 max-w-xs xl:max-w-md relative">
            <Search className="w-4 h-4 text-[#777269] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'shop') setActiveTab('shop');
              }}
              className="w-full pl-10 pr-4 py-2 bg-[#F0EDE6] text-sm text-[#201F1D] placeholder-[#777269] rounded-full border border-[#E7E1D7] focus:border-[#205BE8] focus:outline-hidden focus:ring-2 focus:ring-[#205BE8]/20 transition-all shadow-[inset_1px_1px_3px_rgba(0,0,0,0.06)]"
            />
          </div>

          {/* Actions: Account, Wishlist, Cart, Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* User Account */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="p-1 sm:p-1.5 rounded-xl border border-[#E7E1D7] bg-[#FFFFFF] hover:border-[#205BE8] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    aria-label="User Account"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#205BE8]/10 text-[#205BE8] font-bold text-xs flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#FFFFFF] border border-[#E7E1D7] rounded-xl shadow-warm py-1.5 z-50 text-sm animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2 border-b border-[#E7E1D7]">
                        <p className="font-semibold text-[#201F1D] truncate">{user.name}</p>
                        <p className="text-xs text-[#777269] truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('orders');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-[#201F1D] hover:bg-[#F0EDE6] flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Package className="w-4 h-4 text-[#205BE8]" /> My Orders
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="p-2 sm:p-2.5 rounded-xl border border-[#E7E1D7] bg-[#FFFFFF] text-[#201F1D] hover:text-[#205BE8] shadow-xs hover:shadow-sm transition-all cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#205BE8]"
                  aria-label="Sign in"
                >
                  <UserIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`p-2 sm:p-2.5 rounded-xl border transition-all relative cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#205BE8] ${
                activeTab === 'wishlist'
                  ? 'border-[#205BE8] bg-[#205BE8]/10 text-[#205BE8] shadow-xs'
                  : 'border-[#E7E1D7] bg-[#FFFFFF] text-[#201F1D] hover:text-[#205BE8] shadow-xs hover:shadow-sm'
              }`}
              aria-label={`Wishlist (${wishlist.length} items)`}
            >
              <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${activeTab === 'wishlist' ? 'fill-[#205BE8]' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl border border-[#E7E1D7] bg-[#FFFFFF] text-[#201F1D] hover:text-[#205BE8] shadow-xs hover:shadow-sm transition-all relative cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#205BE8]"
              aria-label={`Cart (${cartCount} items)`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#205BE8] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#FFFFFF]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-[#E7E1D7] bg-[#FFFFFF] text-[#201F1D] lg:hidden cursor-pointer shadow-xs"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#777269] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'shop') setActiveTab('shop');
              }}
              className="w-full pl-10 pr-4 py-2 bg-[#F0EDE6] text-sm text-[#201F1D] placeholder-[#777269] rounded-full border border-[#E7E1D7] focus:border-[#205BE8] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Mobile Nav Links Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E7E1D7] bg-[#FFFFFF] px-4 py-3 space-y-1 shadow-lg">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left py-2 px-3 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${
                  activeTab === link.id
                    ? 'bg-[#205BE8]/10 text-[#205BE8]'
                    : 'text-[#201F1D] hover:bg-[#F0EDE6]'
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
                className="w-full text-left py-2 px-3 rounded-xl text-sm font-semibold text-[#201F1D] hover:bg-[#F0EDE6] cursor-pointer"
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
