import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarCheck,
  Compass,
  Database,
  Loader2,
  Mail,
  MapPin,
  Plus,
  Users,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useData } from '../../context/DataContext';
import { ImageWithFallback } from '../../components/ImageWithFallback';
import { AdminCardGridSkeleton } from '../../components/CardSkeletons';

const LKR_RATE = 300; // Indicative conversion display toggle only

export const AdminDashboardPage: React.FC = () => {
  const {
    loadingAdmin,
    destinations,
    tourPackages,
    bookings,
    inquiries,
    customers,
    contactMessages,
    hasLiveCatalog,
    seeding,
    seedSampleCatalog,
  } = useData();

  const [currency, setCurrency] = useState<'USD' | 'LKR'>('USD');
  const [searchQuery, setSearchQuery] = useState('');

  const metrics = useMemo(() => {
    const activeBookings = bookings.filter((b) => b.status !== 'cancelled');
    const confirmedBookings = bookings.filter(
      (b) => b.status === 'confirmed' || b.status === 'in_progress' || b.status === 'completed'
    );
    const totalUsd = activeBookings.reduce((sum, b) => sum + (b.totalAmountUsd || 0), 0);
    const pendingInquiries = inquiries.filter(
      (i) => i.status === 'pending' || i.status === 'reviewing'
    );
    const unreadMsgs = contactMessages.filter((m) => m.status === 'unread');
    const publishedDestinations = destinations.filter((d) => d.isPublished);
    const publishedPackages = tourPackages.filter((p) => p.isPublished);

    const statusCounts = {
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      in_progress: bookings.filter((b) => b.status === 'in_progress').length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      completed: bookings.filter((b) => b.status === 'completed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    };

    // Route affinity computed strictly from live bookings + inquiries
    const routeCounts: Record<string, number> = {};
    bookings.forEach((b) => {
      const label = b.packageTitle || b.customRouteTitle || 'Bespoke Route';
      routeCounts[label] = (routeCounts[label] || 0) + 1;
    });
    inquiries.forEach((inq) => {
      (inq.selectedDestinations || []).forEach((destName) => {
        routeCounts[destName] = (routeCounts[destName] || 0) + 1;
      });
    });

    const topRoutes = Object.entries(routeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    return {
      confirmedCount: confirmedBookings.length,
      totalBookings: bookings.length,
      totalUsd,
      pendingInquiriesCount: pendingInquiries.length,
      unreadMessagesCount: unreadMsgs.length,
      customersCount: customers.length,
      publishedDestinationsCount: publishedDestinations.length,
      totalDestinationsCount: destinations.length,
      publishedPackagesCount: publishedPackages.length,
      statusCounts,
      topRoutes,
    };
  }, [bookings, inquiries, customers, contactMessages, destinations, tourPackages]);

  const formatMoney = (usd: number) => {
    if (currency === 'LKR') {
      return `Rs. ${Math.round(usd * LKR_RATE).toLocaleString()}`;
    }
    return `$${usd.toLocaleString()}`;
  };

  const filteredBookings = useMemo(() => {
    if (!searchQuery.trim()) return bookings.slice(0, 5);
    const q = searchQuery.toLowerCase();
    return bookings
      .filter((b) =>
        `${b.referenceCode} ${b.guestName} ${b.packageTitle} ${b.guestCountry}`
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 8);
  }, [bookings, searchQuery]);

  const recentInquiries = useMemo(() => inquiries.slice(0, 4), [inquiries]);
  const previewSanctuaries = useMemo(() => destinations.slice(0, 3), [destinations]);

  return (
    <AdminLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      currency={currency}
      onCurrencyChange={setCurrency}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#745B1C] font-semibold">
              Executive Atelier Console • Live Firestore Metrics
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#064E3B] mt-1">
              Expedition Dossier & Operations
            </h1>
            <p className="text-sm text-[#404944] mt-1">
              Real-time overview computed strictly from your Cloud Firestore collections.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/admin/bookings"
              className="bg-[#064E3B] hover:bg-[#022C22] text-white px-4 py-2.5 text-xs uppercase tracking-[0.14em] font-semibold inline-flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5 text-[#D6B56D]" />
              <span>Create Booking</span>
            </Link>
            <Link
              to="/admin/destinations"
              className="bg-white border border-[#064E3B]/20 hover:border-[#064E3B] text-[#064E3B] px-4 py-2.5 text-xs uppercase tracking-[0.14em] font-semibold"
            >
              Manage Sanctuaries
            </Link>
          </div>
        </div>

        {/* First-time Seed Banner if Firestore catalog collections are empty */}
        {!hasLiveCatalog && (
          <div className="bg-[#022C22] text-[#FAF9F5] p-6 border border-[#D6B56D]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-[#D6B56D] shrink-0 mt-0.5" />
              <div>
                <h2 className="font-serif text-xl">Initialize Sample Catalog in Firestore</h2>
                <p className="text-xs text-[#FAF9F5]/80 mt-1 max-w-2xl">
                  Your live Firestore database has not yet been seeded with initial destinations, experiences, tour packages, sample journal stories, and editable placeholder settings. Seed them once so you can customize or delete any entry.
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={seeding}
              onClick={() => void seedSampleCatalog()}
              className="bg-[#D6B56D] hover:bg-[#e4c279] text-[#18231F] px-5 py-3 text-xs uppercase tracking-[0.16em] font-semibold shrink-0 cursor-pointer inline-flex items-center gap-2 disabled:opacity-60"
            >
              {seeding && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Seed Sample Catalog</span>
            </button>
          </div>
        )}

        {/* 6 Live KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="bg-white border border-[#064E3B]/10 p-5 space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-[#7B847F] font-semibold">
              <span>Confirmed Expeditions</span>
              <CalendarCheck className="w-4 h-4 text-[#064E3B]" />
            </div>
            <p className="font-serif text-3xl text-[#064E3B]">{metrics.confirmedCount}</p>
            <p className="text-[11px] text-[#7B847F]">
              {metrics.totalBookings} total booking records
            </p>
          </div>

          <div className="bg-white border border-[#064E3B]/10 p-5 space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-[#7B847F] font-semibold">
              <span>Pending Inquiries</span>
              <Mail className="w-4 h-4 text-[#745B1C]" />
            </div>
            <p className="font-serif text-3xl text-[#064E3B]">{metrics.pendingInquiriesCount}</p>
            <p className="text-[11px] text-[#745B1C]">
              {inquiries.length} total submissions
            </p>
          </div>

          <div className="bg-white border border-[#064E3B]/10 p-5 space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-[#7B847F] font-semibold">
              <span>CRM Clients</span>
              <Users className="w-4 h-4 text-[#064E3B]" />
            </div>
            <p className="font-serif text-3xl text-[#064E3B]">{metrics.customersCount}</p>
            <p className="text-[11px] text-[#7B847F]">Registered traveler profiles</p>
          </div>

          <div className="bg-white border border-[#064E3B]/10 p-5 space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-[#7B847F] font-semibold">
              <span>Tour Packages</span>
              <Compass className="w-4 h-4 text-[#064E3B]" />
            </div>
            <p className="font-serif text-3xl text-[#064E3B]">{metrics.publishedPackagesCount}</p>
            <p className="text-[11px] text-[#7B847F]">
              {tourPackages.length} total catalogued
            </p>
          </div>

          <div className="bg-white border border-[#064E3B]/10 p-5 space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-[#7B847F] font-semibold">
              <span>Sanctuaries</span>
              <MapPin className="w-4 h-4 text-[#064E3B]" />
            </div>
            <p className="font-serif text-3xl text-[#064E3B]">{metrics.publishedDestinationsCount}</p>
            <p className="text-[11px] text-[#7B847F]">
              {metrics.totalDestinationsCount} total curated
            </p>
          </div>

          <div className="bg-[#022C22] text-[#FAF9F5] p-5 space-y-2 border border-[#D6B56D]/30">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-[#D6B56D] font-semibold">
              <span>Booked Value ({currency})</span>
            </div>
            <p className="font-serif text-2xl sm:text-3xl text-[#FAF9F5]">
              {formatMoney(metrics.totalUsd)}
            </p>
            <p className="text-[11px] text-[#FAF9F5]/70">
              {metrics.unreadMessagesCount} unread messages
            </p>
          </div>
        </div>

        {/* Status Distribution & Route Breakdown (Strictly computed from live records) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white border border-[#064E3B]/10 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#745B1C] font-semibold">
                  Booking Ledger Breakdown
                </span>
                <h2 className="font-serif text-2xl text-[#064E3B]">Expedition Status Pool</h2>
              </div>
              <Link
                to="/admin/bookings"
                className="text-xs uppercase tracking-[0.14em] text-[#064E3B] font-semibold hover:underline"
              >
                Open Ledger →
              </Link>
            </div>

            {bookings.length === 0 ? (
              <div className="py-10 text-center bg-[#FAF9F5] border border-[#064E3B]/10 space-y-2">
                <p className="font-serif text-xl text-[#064E3B]">No Bookings Recorded Yet</p>
                <p className="text-xs text-[#7B847F] max-w-md mx-auto">
                  Confirmed bookings appear here when you convert a traveler inquiry or create a bespoke booking record.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: 'Pending', count: metrics.statusCounts.pending, color: 'bg-[#FFDB90] text-[#251A00]' },
                  { label: 'Confirmed', count: metrics.statusCounts.confirmed, color: 'bg-[#B0F0D6] text-[#022C22]' },
                  { label: 'In Progress', count: metrics.statusCounts.in_progress, color: 'bg-[#064E3B] text-white' },
                  { label: 'Completed', count: metrics.statusCounts.completed, color: 'bg-[#E9E8E4] text-[#18231F]' },
                  { label: 'Cancelled', count: metrics.statusCounts.cancelled, color: 'bg-[#FFDAD6] text-[#93000A]' },
                ].map((s) => (
                  <div key={s.label} className="p-4 bg-[#FAF9F5] border border-[#064E3B]/10 space-y-2">
                    <span className={`inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 font-semibold ${s.color}`}>
                      {s.label}
                    </span>
                    <p className="font-serif text-3xl text-[#064E3B]">{s.count}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-white border border-[#064E3B]/10 p-6 space-y-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#745B1C] font-semibold">
                Demand Affinity
              </span>
              <h2 className="font-serif text-2xl text-[#064E3B]">Top Requested Routes</h2>
            </div>

            {metrics.topRoutes.length === 0 ? (
              <div className="py-8 text-center bg-[#FAF9F5] border border-[#064E3B]/10 text-xs text-[#7B847F]">
                Route demand bars populate automatically as travelers submit inquiries or bookings are created.
              </div>
            ) : (
              <div className="space-y-3">
                {metrics.topRoutes.map(([routeName, count]) => {
                  const max = metrics.topRoutes[0][1] || 1;
                  const pct = Math.round((count / max) * 100);
                  return (
                    <div key={routeName} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-[#18231F] truncate pr-2">{routeName}</span>
                        <span className="text-[#064E3B] font-semibold">{count}</span>
                      </div>
                      <div className="h-2 bg-[#F4F4F0] overflow-hidden">
                        <div className="h-full bg-[#064E3B]" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Bookings + Live Inquiry Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-[#064E3B]/10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-[#064E3B]">Recent Bookings</h2>
              <Link
                to="/admin/bookings"
                className="text-xs uppercase tracking-[0.14em] text-[#064E3B] font-semibold inline-flex items-center gap-1"
              >
                Full Ledger <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {filteredBookings.length === 0 ? (
              <p className="text-sm text-[#7B847F] py-6">
                No booking records match or exist yet. Create a booking or convert an inquiry from Bookings & Inquiries.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#064E3B]/10 text-[10px] uppercase tracking-wider text-[#7B847F]">
                      <th className="py-2.5 pr-3">Ref</th>
                      <th className="py-2.5 pr-3">Guest</th>
                      <th className="py-2.5 pr-3">Route</th>
                      <th className="py-2.5 pr-3">Dates</th>
                      <th className="py-2.5 pr-3">Value</th>
                      <th className="py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#064E3B]/10">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#FAF9F5]">
                        <td className="py-3 pr-3 font-mono font-semibold text-[#064E3B]">
                          {b.referenceCode}
                        </td>
                        <td className="py-3 pr-3">
                          <span className="font-medium block text-[#18231F]">{b.guestName}</span>
                          <span className="text-[11px] text-[#7B847F]">{b.guestCountry}</span>
                        </td>
                        <td className="py-3 pr-3 text-[#404944]">{b.packageTitle}</td>
                        <td className="py-3 pr-3 text-[#404944]">
                          {b.startDate} → {b.endDate}
                        </td>
                        <td className="py-3 pr-3 font-semibold text-[#064E3B]">
                          {formatMoney(b.totalAmountUsd || 0)}
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-[#F4F4F0] text-[#064E3B]">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-white border border-[#064E3B]/10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-[#064E3B]">Inbound Inquiries</h2>
              <Link
                to="/admin/inquiries"
                className="text-xs uppercase tracking-[0.14em] text-[#745B1C] font-semibold"
              >
                Review All →
              </Link>
            </div>

            {recentInquiries.length === 0 ? (
              <p className="text-xs text-[#7B847F] py-6">
                No bespoke inquiries submitted yet. Submissions from Plan Your Journey appear here immediately.
              </p>
            ) : (
              <div className="space-y-3">
                {recentInquiries.map((inq) => (
                  <Link
                    key={inq.id}
                    to="/admin/inquiries"
                    className="block p-4 bg-[#FAF9F5] border border-[#064E3B]/10 hover:border-[#064E3B]/30 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-wider">
                      <span className="font-mono text-[#745B1C] font-semibold">{inq.referenceCode}</span>
                      <span className="bg-white px-2 py-0.5 text-[#064E3B] font-semibold">
                        {inq.status}
                      </span>
                    </div>
                    <p className="font-serif text-lg text-[#064E3B]">{inq.fullName}</p>
                    <p className="text-xs text-[#404944]">
                      {inq.country} • {inq.adults} Adults • {inq.durationPreference}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sanctuary Preview Row */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-[#064E3B]">Current Destination Sanctuaries</h2>
            <Link
              to="/admin/destinations"
              className="text-xs uppercase tracking-[0.14em] text-[#064E3B] font-semibold"
            >
              Manage All ({destinations.length}) →
            </Link>
          </div>
          {loadingAdmin ? (
            <AdminCardGridSkeleton columns={3} aspectClass="aspect-[16/9]" count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {previewSanctuaries.map((dest) => (
                <div key={dest.id} className="bg-white border border-[#064E3B]/10 overflow-hidden">
                  <div className="aspect-[16/9] overflow-hidden relative bg-[#E9E8E4]">
                    <ImageWithFallback
                      src={dest.heroImage}
                      alt={dest.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-[#022C22]/90 text-[#D6B56D] px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold">
                      {dest.region}
                    </span>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg text-[#064E3B]">{dest.name}</h3>
                      <p className="text-xs text-[#7B847F]">
                        {dest.elevation} • {dest.bestSeason}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] uppercase px-2 py-0.5 font-semibold ${
                        dest.isPublished ? 'bg-[#B0F0D6] text-[#022C22]' : 'bg-[#E9E8E4] text-[#404944]'
                      }`}
                    >
                      {dest.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
