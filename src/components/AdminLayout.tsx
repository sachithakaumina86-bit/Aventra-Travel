import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Bell,
  BookOpen,
  CalendarCheck,
  Compass,
  ExternalLink,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Plus,
  Search,
  Settings,
  Star,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { STITCH_IMAGES } from '../data/initialSeedData';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  currency?: 'USD' | 'LKR';
  onCurrencyChange?: (c: 'USD' | 'LKR') => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  searchQuery = '',
  onSearchChange,
  currency = 'USD',
  onCurrencyChange,
}) => {
  const { adminProfile, user, logout } = useAuth();
  const { inquiries, contactMessages } = useData();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newMenuOpen, setNewMenuOpen] = useState(false);

  const pendingInquiriesCount = inquiries.filter((i) => i.status === 'pending' || i.status === 'reviewing').length;
  const unreadMessagesCount = contactMessages.filter((m) => m.status === 'unread').length;

  const managementLinks = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/destinations', label: 'Destinations', icon: MapPin },
    { to: '/admin/packages', label: 'Tour Packages', icon: Compass },
    {
      to: '/admin/bookings',
      label: 'Bookings & Inquiries',
      icon: CalendarCheck,
      badge: pendingInquiriesCount > 0 ? pendingInquiriesCount : undefined,
    },
    { to: '/admin/experiences', label: 'Experiences', icon: Star },
    { to: '/admin/customers', label: 'Customers', icon: Users },
  ];

  const curationLinks = [
    { to: '/admin/testimonials', label: 'Testimonials', icon: UserCheck },
    { to: '/admin/blog', label: 'Travel Journal', icon: BookOpen },
    { to: '/admin/gallery', label: 'Media Gallery', icon: ImageIcon },
    {
      to: '/admin/messages',
      label: 'Contact Messages',
      icon: Mail,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    { to: '/admin/settings', label: 'Website Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-[#FAF9F5] border-r border-[#064E3B]/10">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-[#064E3B]/10 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-3">
          <img
            src={STITCH_IMAGES.logo}
            alt="AVENTRA"
            className="h-9 w-9 object-contain bg-white border border-[#064E3B]/10 p-0.5"
          />
          <div>
            <span className="font-serif text-base font-bold tracking-[0.14em] text-[#064E3B] block leading-none">
              AVENTRA
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#745B1C] font-semibold block mt-1">
              Ceylon Atelier
            </span>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1 text-[#064E3B]"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        <div>
          <p className="px-3 text-[10px] uppercase tracking-[0.22em] text-[#7B847F] font-semibold mb-2">
            Management
          </p>
          <nav className="space-y-1">
            {managementLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 text-xs font-medium transition-colors rounded-xs ${
                      isActive
                        ? 'bg-[#064E3B] text-[#FAF9F5]'
                        : 'text-[#404944] hover:bg-[#EFEEEA] hover:text-[#064E3B]'
                    }`
                  }
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span className="bg-[#D6B56D] text-[#18231F] text-[10px] font-bold px-1.5 py-0.5 rounded-xs">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="px-3 text-[10px] uppercase tracking-[0.22em] text-[#7B847F] font-semibold mb-2">
            Curation & Journal
          </p>
          <nav className="space-y-1">
            {curationLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 text-xs font-medium transition-colors rounded-xs ${
                      isActive
                        ? 'bg-[#064E3B] text-[#FAF9F5]'
                        : 'text-[#404944] hover:bg-[#EFEEEA] hover:text-[#064E3B]'
                    }`
                  }
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span className="bg-[#BA1A1A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-xs">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Admin Identity Card */}
      <div className="p-3 border-t border-[#064E3B]/10 space-y-2">
        <Link
          to="/admin/profile"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 p-2.5 bg-white border border-[#064E3B]/10 hover:border-[#064E3B]/30 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[#064E3B] text-[#D6B56D] flex items-center justify-center font-serif text-xs font-bold shrink-0">
            {(adminProfile?.name || user?.email || 'A').slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#18231F] truncate">
              {adminProfile?.name || user?.displayName || 'AVENTRA Admin'}
            </p>
            <p className="text-[10px] text-[#745B1C] uppercase tracking-wider truncate">
              {adminProfile?.role === 'super_admin' ? 'Primary Admin' : 'Concierge Admin'}
            </p>
          </div>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 text-[11px] uppercase tracking-[0.14em] text-[#404944] hover:text-[#BA1A1A] border border-transparent hover:border-[#BA1A1A]/20 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="w-64 h-full shadow-2xl">{renderSidebarContent()}</div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Utility Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#064E3B]/10 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#064E3B] border border-[#064E3B]/15"
              aria-label="Open admin sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
            {onSearchChange ? (
              <div className="relative max-w-md w-full hidden sm:block">
                <Search className="w-4 h-4 text-[#7B847F] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search bookings, destinations, inquiries..."
                  className="w-full bg-white border border-[#064E3B]/15 pl-9 pr-3 py-1.5 text-xs text-[#18231F] placeholder:text-[#7B847F] focus:outline-none focus:border-[#064E3B]"
                />
              </div>
            ) : (
              <span className="text-xs uppercase tracking-[0.2em] text-[#7B847F] hidden sm:inline">
                AVENTRA Executive Atelier Console
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {onCurrencyChange && (
              <div className="hidden sm:flex border border-[#064E3B]/20 bg-white text-[10px] font-semibold">
                <button
                  type="button"
                  onClick={() => onCurrencyChange('USD')}
                  className={`px-2.5 py-1.5 cursor-pointer ${
                    currency === 'USD' ? 'bg-[#064E3B] text-white' : 'text-[#404944]'
                  }`}
                >
                  USD
                </button>
                <button
                  type="button"
                  onClick={() => onCurrencyChange('LKR')}
                  className={`px-2.5 py-1.5 cursor-pointer ${
                    currency === 'LKR' ? 'bg-[#064E3B] text-white' : 'text-[#404944]'
                  }`}
                >
                  LKR
                </button>
              </div>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => setNewMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 bg-[#064E3B] hover:bg-[#022C22] text-white px-3.5 py-2 text-[11px] uppercase tracking-[0.14em] font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
              {newMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white border border-[#064E3B]/15 shadow-xl py-1.5 z-50 text-xs"
                  onMouseLeave={() => setNewMenuOpen(false)}
                >
                  <Link
                    to="/admin/destinations"
                    onClick={() => setNewMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-[#FAF9F5] text-[#18231F]"
                  >
                    + New Destination
                  </Link>
                  <Link
                    to="/admin/packages"
                    onClick={() => setNewMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-[#FAF9F5] text-[#18231F]"
                  >
                    + New Tour Package
                  </Link>
                  <Link
                    to="/admin/experiences"
                    onClick={() => setNewMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-[#FAF9F5] text-[#18231F]"
                  >
                    + New Experience
                  </Link>
                  <Link
                    to="/admin/bookings"
                    onClick={() => setNewMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-[#FAF9F5] text-[#18231F]"
                  >
                    + New Booking Record
                  </Link>
                  <Link
                    to="/admin/blog"
                    onClick={() => setNewMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-[#FAF9F5] text-[#18231F]"
                  >
                    + New Journal Dispatch
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/admin/inquiries"
              title="Pending Inquiries & Messages"
              className="relative p-2 bg-white border border-[#064E3B]/15 text-[#064E3B] hover:bg-[#F0E9DC]"
            >
              <Bell className="w-4 h-4" />
              {pendingInquiriesCount + unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#BA1A1A] text-white text-[9px] flex items-center justify-center font-bold">
                  {pendingInquiriesCount + unreadMessagesCount}
                </span>
              )}
            </Link>

            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-1.5 border border-[#064E3B]/20 bg-white px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-[#064E3B] hover:bg-[#064E3B] hover:text-white transition-colors"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
