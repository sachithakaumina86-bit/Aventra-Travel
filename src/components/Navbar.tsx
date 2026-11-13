import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, ShieldCheck, X } from 'lucide-react';
import { STITCH_IMAGES } from '../data/initialSeedData';
import { useData } from '../context/DataContext';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { settings } = useData();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/destinations', label: 'Destinations' },
    { to: '/experiences', label: 'Experiences' },
    { to: '/packages', label: 'Tour Packages' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
    { to: '/journal', label: 'Travel Journal' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHome
          ? 'bg-[#FAF9F5]/88 backdrop-blur-xl border-b border-[#064E3B]/10'
          : 'bg-[#FAF9F5]/95 backdrop-blur-xl border-b border-[#064E3B]/10 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Mark */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <img
            src={STITCH_IMAGES.logo}
            alt="AVENTRA Logo"
            className="h-11 w-auto object-contain rounded-sm transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="leading-none">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.14em] text-[#064E3B] block">
              {settings.brandName || 'AVENTRA'}
            </span>
            <span className="text-[9px] uppercase tracking-[0.26em] text-[#745B1C] font-semibold block mt-1">
              Discover Beyond Ordinary
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-[12px] uppercase tracking-[0.14em] font-medium transition-colors py-1 border-b-2 ${
                  isActive
                    ? 'text-[#064E3B] border-[#D6B56D]'
                    : 'text-[#404944] border-transparent hover:text-[#064E3B] hover:border-[#D6B56D]/50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link
            to="/plan-your-journey"
            className="bg-[#064E3B] hover:bg-[#022C22] text-[#FAF9F5] px-5 py-2.5 text-[11px] uppercase tracking-[0.16em] font-semibold transition-all duration-300 shadow-xs"
          >
            Plan Your Journey
          </Link>
          <Link
            to="/admin"
            title="Admin Atelier Portal"
            aria-label="Admin Atelier Portal"
            className="w-9 h-9 rounded-full border border-[#064E3B]/20 flex items-center justify-center text-[#064E3B] hover:bg-[#064E3B] hover:text-[#FAF9F5] transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          className="lg:hidden p-2 text-[#064E3B] border border-[#064E3B]/15 rounded"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#FAF9F5] border-t border-[#064E3B]/10 px-6 py-6 space-y-4 shadow-lg">
          <div className="grid grid-cols-1 gap-3">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `text-xs uppercase tracking-[0.16em] py-2 border-b border-[#064E3B]/10 ${
                    isActive ? 'text-[#064E3B] font-semibold' : 'text-[#404944]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Link
              to="/plan-your-journey"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center bg-[#064E3B] text-[#FAF9F5] py-3 text-xs uppercase tracking-[0.16em] font-semibold"
            >
              Plan Your Journey
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center border border-[#064E3B]/25 text-[#064E3B] py-2.5 text-xs uppercase tracking-[0.16em] font-medium"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
