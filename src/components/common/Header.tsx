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
import { BoltLogo } from './BoltLogo';

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
      {/* Top Announcement Bar (Warm charcoal #201F1D) */}
      <div className="bg-[#201F1D] text-[#F7F5F0] text-xs py-2 px-4 sm:px-8 border-b border-[#2E2C29]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="text-amber-400 font-bold">⚡</span>
            <span className="hidden sm:inline font-medium">Summer Tech Fest is Live! Save up to 50% across accessories</span>
            <span className="sm:hidden font-medium">Summer Fest: Up to 50% OFF</span>
            <button
              onClick={() => handleNavClick('deals')}
              className="text-[#60A5FA] hover:text-[#93C5FD] font-semibold underline underline-offset-2 ml-1 inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              Shop Deals <ArrowRight className="w-3 h-3 inline" />
            </button>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[#F7F5F0]/75 shrink-0 text-[11px]">
            <span>Free Shipping on orders over $99</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="border-b border-[#E7E1D7] bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">


          {/* Brand Logo: BOLT 2.0 */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#205BE8] rounded-xl shrink-0 cursor-pointer"
            aria-label="BOLT 2.0 Home"
          >
            <BoltLogo />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#777269]">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`transition-colors relative py-1 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#205BE8] rounded cursor-pointer ${
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

          {/* Soft Neumorphic Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-xs xl:max-w-md relative">
            <Search className="w-4 h-4 text-[#777269] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search gear, audio, watches..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'shop') setActiveTab('shop');
              }}
              className="w-full pl-10 pr-4 py-2 neu-inset focus:bg-white text-sm text-[#201F1D] placeholder-[#777269] rounded-full border border-[#E7E1D7] focus:border-[#205BE8] focus:outline-hidden focus:ring-2 focus:ring-[#205BE8]/20 transition-all"
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
                    className="p-2 text-[#201F1D] hover:text-[#205BE8] hover:bg-[#F0EDE6] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    aria-label="User Account"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#205BE8]/10 text-[#205BE8] font-bold text-xs flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E7E1D7] rounded-2xl shadow-warm py-1.5 z-50 text-sm animate-in fade-in zoom-in-95">
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
                  className="p-2.5 text-[#201F1D] hover:text-[#205BE8] hover:bg-[#F0EDE6] rounded-xl transition-colors cursor-pointer"
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
              className={`p-2.5 rounded-xl transition-colors relative cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'text-[#205BE8] bg-[#205BE8]/10'
                  : 'text-[#201F1D] hover:text-[#205BE8] hover:bg-[#F0EDE6]'
              }`}
              aria-label={`Wishlist (${wishlist.length} items)`}
            >
              <Heart className={`w-5 h-5 ${activeTab === 'wishlist' ? 'fill-[#205BE8]' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 text-[#201F1D] hover:text-[#205BE8] hover:bg-[#F0EDE6] rounded-xl transition-colors relative cursor-pointer"
              aria-label={`Cart (${cartCount} items)`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#205BE8] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#201F1D] hover:bg-[#F0EDE6] rounded-xl lg:hidden cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
              className="w-full pl-10 pr-4 py-2 neu-inset text-sm text-[#201F1D] placeholder-[#777269] rounded-full border border-[#E7E1D7] focus:border-[#205BE8] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Mobile Nav Links Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E7E1D7] bg-white px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left py-2.5 px-3.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${
                  activeTab === link.id
                    ? 'bg-[#205BE8]/10 text-[#205BE8] font-bold'
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
                className="w-full text-left py-2.5 px-3.5 rounded-xl text-sm font-semibold text-[#201F1D] hover:bg-[#F0EDE6] cursor-pointer transition-colors"
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
