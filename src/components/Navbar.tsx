import React, { memo, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, ShieldCheck, X } from 'lucide-react';
import { STITCH_IMAGES } from '../data/initialSeedData';
import { useData } from '../context/DataContext';
import { LUXURY_EASE } from './MotionPrimitives';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/experiences', label: 'Experiences' },
  { to: '/packages', label: 'Tour Packages' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
  { to: '/journal', label: 'Travel Journal' },
];

export const Navbar: React.FC = memo(() => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useData();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 24;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF9F5]/96 backdrop-blur-md border-b border-[#064E3B]/15 shadow-sm'
          : isHome
            ? 'bg-[#FAF9F5]/88 backdrop-blur-md border-b border-[#064E3B]/10'
            : 'bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#064E3B]/10 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Mark */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group min-w-0">
          <picture className="shrink-0">
            <source srcSet="/assets/aventra-logo-128.avif" type="image/avif" />
            <source srcSet={STITCH_IMAGES.logo} type="image/webp" />
            <img
              src="/assets/aventra-logo-128.png"
              alt="AVENTRA Logo"
              width={44}
              height={44}
              decoding="sync"
              className="h-10 sm:h-11 w-10 sm:w-11 object-contain rounded-sm transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </picture>
          <div className="leading-none min-w-0">
            <span className="font-serif text-lg sm:text-2xl font-bold tracking-[0.14em] text-[#064E3B] block truncate">
              {settings.brandName || 'AVENTRA'}
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.22em] sm:tracking-[0.26em] text-[#745B1C] font-semibold block mt-1 truncate">
              Discover Beyond Ordinary
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((item) => (
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
            className="bg-[#064E3B] hover:bg-[#022C22] active:scale-[0.98] text-[#FAF9F5] px-5 py-2.5 text-[11px] uppercase tracking-[0.16em] font-semibold transition-all duration-200 shadow-xs"
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
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-drawer"
          className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-[#064E3B] border border-[#064E3B]/15 rounded transition-colors hover:bg-[#064E3B]/5 cursor-pointer shrink-0"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: LUXURY_EASE }}
            className="lg:hidden bg-[#FAF9F5] border-t border-[#064E3B]/10 px-5 sm:px-6 py-5 space-y-4 shadow-xl max-h-[calc(100vh-5rem)] overflow-y-auto"
          >
            <nav aria-label="Mobile navigation" className="grid grid-cols-1 gap-1">
              {NAV_LINKS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `text-xs uppercase tracking-[0.16em] min-h-[44px] flex items-center border-b border-[#064E3B]/10 transition-colors ${
                      isActive ? 'text-[#064E3B] font-semibold' : 'text-[#404944] hover:text-[#064E3B]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="pt-2 flex flex-col gap-3">
              <Link
                to="/plan-your-journey"
                onClick={() => setMobileOpen(false)}
                className="w-full min-h-[44px] flex items-center justify-center bg-[#064E3B] hover:bg-[#022C22] active:scale-[0.99] text-[#FAF9F5] py-3 text-xs uppercase tracking-[0.16em] font-semibold transition-all"
              >
                Plan Your Journey
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="w-full min-h-[44px] flex items-center justify-center border border-[#064E3B]/25 text-[#064E3B] py-2.5 text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#064E3B]/5 transition-colors"
              >
                Admin Portal
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

Navbar.displayName = 'Navbar';
