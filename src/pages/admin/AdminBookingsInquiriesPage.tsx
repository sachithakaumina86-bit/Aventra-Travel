import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Download,
  Loader2,
  Plus,
  Search,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useData } from '../../context/DataContext';
import {
  Booking,
  BookingStatus,
  Inquiry,
  InquiryStatus,
  PaymentStatus,
} from '../../types/aventra';

export const AdminBookingsInquiriesPage: React.FC<{ initialTab?: 'bookings' | 'inquiries' }> = ({
  initialTab = 'bookings',
}) => {
  const {
    bookings,
    inquiries,
    tourPackages,
    saveBooking,
    updateBookingStatus,
    deleteBooking,
    updateInquiry,
    deleteInquiry,
    convertInquiryToBooking,
  } = useData();

  const [tab, setTab] = useState<'bookings' | 'inquiries'>(initialTab);
  const [search, setSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // New Booking state
  const [newBooking, setNewBooking] = useState<Partial<Booking>>({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestCountry: '',
    packageTitle: tourPackages[0]?.title || 'The Ceylon Discovery',
    startDate: '',
    endDate: '',
    adults: 2,
    children: 0,
    assignedChauffeur: '',
    vehicleInfo: 'Luxury Chauffeur Van',
    totalAmountUsd: 4850,
    depositAmountUsd: 1500,
    paymentStatus: 'unpaid',
    status: 'confirmed',
    adminNotes: '',
  });

  // Convert Inquiry state
  const [convertDates, setConvertDates] = useState({
    startDate: '',
    endDate: '',
    totalAmountUsd: 4850,
    depositAmountUsd: 1500,
    packageTitle: 'Bespoke Sri Lanka Expedition',
    assignedChauffeur: 'Pending Assignment',
  });

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const statusOk = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
      const qOk =
        !search.trim() ||
        `${b.referenceCode} ${b.guestName} ${b.guestEmail} ${b.packageTitle} ${b.guestCountry}`
          .toLowerCase()
          .includes(search.toLowerCase());
      return statusOk && qOk;
    });
  }, [bookings, bookingStatusFilter, search]);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      return (
        !search.trim() ||
        `${inq.referenceCode} ${inq.fullName} ${inq.email} ${inq.country} ${inq.selectedDestinations?.join(' ')}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [inquiries, search]);

  const activeBooking =
    filteredBookings.find((b) => b.id === selectedBookingId) || filteredBookings[0] || null;
  const activeInquiry =
    filteredInquiries.find((i) => i.id === selectedInquiryId) || filteredInquiries[0] || null;

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!newBooking.guestName || !newBooking.guestEmail || !newBooking.startDate || !newBooking.endDate) {
      setModalError('Guest name, email, start date, and end date are required.');
      return;
    }
    setSaving(true);
    try {
      const id = await saveBooking(newBooking);
      setSelectedBookingId(id);
      setCreateModalOpen(false);
    } catch {
      setModalError('Could not save booking. Verify email format and fields.');
    } finally {
      setSaving(false);
    }
  };

  const handleConvertInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInquiry) return;
    setModalError(null);
    if (!convertDates.startDate || !convertDates.endDate) {
      setModalError('Start and end dates are required to confirm a booking.');
      return;
    }
    setSaving(true);
    try {
      const bookingId = await convertInquiryToBooking(activeInquiry, convertDates);
      setConvertModalOpen(false);
      setTab('bookings');
      setSelectedBookingId(bookingId);
    } catch {
      setModalError('Conversion failed. Check permissions or input values.');
    } finally {
      setSaving(false);
    }
  };

  const exportBookingsCsv = () => {
    const headers = ['Ref', 'Guest', 'Email', 'Package', 'Start', 'End', 'Total USD', 'Payment', 'Status'];
    const rows = filteredBookings.map((b) => [
      b.referenceCode,
      `"${b.guestName.replace(/"/g, '""')}"`,
      b.guestEmail,
      `"${(b.packageTitle || '').replace(/"/g, '""')}"`,
      b.startDate,
      b.endDate,
      b.totalAmountUsd,
      b.paymentStatus,
      b.status,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aventra-bookings.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const openConvert = (inq: Inquiry) => {
    setConvertDates({
      startDate: inq.preferredArrivalDate || new Date().toISOString().slice(0, 10),
      endDate: inq.preferredArrivalDate || new Date().toISOString().slice(0, 10),
      totalAmountUsd: 4850,
      depositAmountUsd: 1500,
      packageTitle: inq.selectedDestinations?.[0]
        ? `Bespoke: ${inq.selectedDestinations.slice(0, 2).join(' & ')}`
        : 'Bespoke Sri Lanka Expedition',
      assignedChauffeur: 'Pending Assignment',
    });
    setModalError(null);
    setConvertModalOpen(true);
  };

  return (
    <AdminLayout searchQuery={search} onSearchChange={setSearch}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#745B1C] font-semibold">
              Concierge Logistics Atelier • Dispatch Operations
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#064E3B] mt-1">
              Bookings & Inquiries Dispatch
            </h1>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={exportBookingsCsv}
              className="bg-white border border-[#064E3B]/20 text-[#064E3B] px-4 py-2.5 text-xs uppercase tracking-[0.14em] font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Ledger</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setModalError(null);
                setCreateModalOpen(true);
              }}
              className="bg-[#064E3B] hover:bg-[#022C22] text-white px-5 py-2.5 text-xs uppercase tracking-[0.14em] font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D6B56D]" />
              <span>Create Booking</span>
            </button>
          </div>
        </div>

        {/* Main Mode Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#064E3B]/10 pb-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTab('bookings')}
              className={`px-5 py-2.5 text-xs uppercase tracking-[0.16em] font-semibold cursor-pointer ${
                tab === 'bookings'
                  ? 'bg-[#064E3B] text-white'
                  : 'bg-white border border-[#064E3B]/15 text-[#404944]'
              }`}
            >
              Bookings Ledger ({bookings.length})
            </button>
            <button
              type="button"
              onClick={() => setTab('inquiries')}
              className={`px-5 py-2.5 text-xs uppercase tracking-[0.16em] font-semibold cursor-pointer ${
                tab === 'inquiries'
                  ? 'bg-[#064E3B] text-white'
                  : 'bg-white border border-[#064E3B]/15 text-[#404944]'
              }`}
            >
              Bespoke Inquiries ({inquiries.length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#7B847F] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ref, guest, route..."
              className="w-full bg-white border border-[#064E3B]/15 pl-9 pr-3 py-2 text-xs"
            />
          </div>
        </div>

        {tab === 'bookings' ? (
          <div className="space-y-6">
            {/* Booking Status Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setBookingStatusFilter(st)}
                  className={`px-3.5 py-1.5 text-[10px] uppercase tracking-wider font-semibold cursor-pointer ${
                    bookingStatusFilter === st
                      ? 'bg-[#064E3B] text-white'
                      : 'bg-white border border-[#064E3B]/15 text-[#404944]'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            {filteredBookings.length === 0 ? (
              <div className="bg-white border border-[#064E3B]/12 p-12 text-center space-y-3">
                <h2 className="font-serif text-2xl text-[#064E3B]">No Bookings Found</h2>
                <p className="text-sm text-[#404944] max-w-md mx-auto">
                  Create a new expedition booking manually or review an inbound inquiry and convert it to a booking.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Ledger Table */}
                <div className="xl:col-span-7 bg-white border border-[#064E3B]/12 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#F4F4F0] border-b border-[#064E3B]/10 text-[10px] uppercase tracking-wider text-[#7B847F]">
                        <th className="py-3 px-4">Ref</th>
                        <th className="py-3 px-4">Lead Guest</th>
                        <th className="py-3 px-4">Route</th>
                        <th className="py-3 px-4">Value</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#064E3B]/10">
                      {filteredBookings.map((b) => {
                        const selected = activeBooking?.id === b.id;
                        return (
                          <tr
                            key={b.id}
                            onClick={() => setSelectedBookingId(b.id)}
                            className={`cursor-pointer transition-colors ${
                              selected ? 'bg-[#F0E9DC]/65' : 'hover:bg-[#FAF9F5]'
                            }`}
                          >
                            <td className="py-3.5 px-4 font-mono font-semibold text-[#064E3B]">
                              {b.referenceCode}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-[#18231F] block">{b.guestName}</span>
                              <span className="text-[11px] text-[#7B847F]">{b.guestCountry}</span>
                            </td>
                            <td className="py-3.5 px-4 text-[#404944]">
                              <span className="block">{b.packageTitle}</span>
                              <span className="text-[11px] text-[#7B847F]">
                                {b.startDate} → {b.endDate}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-[#064E3B]">
                              ${(b.totalAmountUsd || 0).toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-[#064E3B]/10 text-[#064E3B]">
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Dossier Inspector */}
                {activeBooking && (
                  <div className="xl:col-span-5 bg-white border border-[#064E3B]/15 p-6 space-y-5 shadow-xs">
                    <div className="flex items-start justify-between border-b border-[#064E3B]/10 pb-4">
                      <div>
                        <span className="font-mono text-xs text-[#745B1C] font-semibold">
                          Dossier {activeBooking.referenceCode}
                        </span>
                        <h2 className="font-serif text-2xl text-[#064E3B]">
                          {activeBooking.guestName}
                        </h2>
                        <p className="text-xs text-[#7B847F]">
                          {activeBooking.guestEmail} • {activeBooking.guestPhone}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void deleteBooking(activeBooking.id)}
                        title="Delete Booking"
                        className="p-2 text-[#BA1A1A] hover:bg-[#FFDAD6] cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF9F5] p-4 border border-[#064E3B]/10">
                      <div>
                        <span className="text-[10px] uppercase text-[#7B847F] block">Route</span>
                        <span className="font-semibold text-[#064E3B]">{activeBooking.packageTitle}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[#7B847F] block">Party</span>
                        <span className="font-semibold">
                          {activeBooking.adults} Adults, {activeBooking.children} Children
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[#7B847F] block">Chauffeur</span>
                        <span className="font-semibold">{activeBooking.assignedChauffeur || 'Unassigned'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[#7B847F] block">Total Tariff</span>
                        <span className="font-semibold text-[#064E3B]">
                          ${(activeBooking.totalAmountUsd || 0).toLocaleString()} USD
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#7B847F] font-semibold mb-1">
                          Expedition Status
                        </label>
                        <select
                          value={activeBooking.status}
                          onChange={(e) =>
                            void updateBookingStatus(
                              activeBooking.id,
                              e.target.value as BookingStatus
                            )
                          }
                          className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2 text-xs font-semibold"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#7B847F] font-semibold mb-1">
                          Payment Status
                        </label>
                        <select
                          value={activeBooking.paymentStatus}
                          onChange={(e) =>
                            void updateBookingStatus(
                              activeBooking.id,
                              activeBooking.status,
                              e.target.value as PaymentStatus
                            )
                          }
                          className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2 text-xs font-semibold"
                        >
                          <option value="unpaid">Unpaid</option>
                          <option value="deposit_paid">Deposit Paid</option>
                          <option value="paid_full">Paid Full</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </div>
                    </div>

                    {activeBooking.dietaryAndNotes && (
                      <div className="text-xs text-[#404944] bg-[#F4F4F0] p-3.5">
                        <strong className="block text-[#064E3B] mb-1">Guest Notes:</strong>
                        {activeBooking.dietaryAndNotes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Inquiries View */
          <div>
            {filteredInquiries.length === 0 ? (
              <div className="bg-white border border-[#064E3B]/12 p-12 text-center space-y-2">
                <h2 className="font-serif text-2xl text-[#064E3B]">No Inquiries Yet</h2>
                <p className="text-sm text-[#404944]">
                  Submissions from the public Plan Your Journey form appear here for review and quotation.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                <div className="xl:col-span-6 space-y-3">
                  {filteredInquiries.map((inq) => {
                    const selected = activeInquiry?.id === inq.id;
                    return (
                      <div
                        key={inq.id}
                        onClick={() => setSelectedInquiryId(inq.id)}
                        className={`bg-white border p-5 cursor-pointer transition-all space-y-2 ${
                          selected
                            ? 'border-[#064E3B] shadow-md'
                            : 'border-[#064E3B]/12 hover:border-[#064E3B]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider">
                          <span className="font-mono font-semibold text-[#745B1C]">
                            {inq.referenceCode}
                          </span>
                          <span className="bg-[#F4F4F0] text-[#064E3B] px-2.5 py-0.5 font-semibold">
                            {inq.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-xl text-[#064E3B]">{inq.fullName}</h3>
                          <span className="text-xs text-[#7B847F]">{inq.country}</span>
                        </div>
                        <p className="text-xs text-[#404944]">
                          {inq.adults} Adults • {inq.durationPreference} • {inq.sanctuaryTier}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {activeInquiry && (
                  <div className="xl:col-span-6 bg-white border border-[#064E3B]/15 p-6 space-y-5 shadow-xs">
                    <div className="flex items-start justify-between border-b border-[#064E3B]/10 pb-4">
                      <div>
                        <span className="font-mono text-xs text-[#745B1C] font-semibold">
                          Inquiry {activeInquiry.referenceCode}
                        </span>
                        <h2 className="font-serif text-2xl text-[#064E3B]">
                          {activeInquiry.fullName}
                        </h2>
                        <p className="text-xs text-[#7B847F]">
                          {activeInquiry.email} • {activeInquiry.phone} ({activeInquiry.preferredContactMethod})
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void deleteInquiry(activeInquiry.id)}
                        title="Delete Inquiry"
                        className="p-2 text-[#BA1A1A] hover:bg-[#FFDAD6] cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF9F5] p-4 border border-[#064E3B]/10">
                      <div>
                        <span className="text-[10px] uppercase text-[#7B847F] block">Party</span>
                        <span className="font-semibold">
                          {activeInquiry.adults} Adults, {activeInquiry.children} Children ({activeInquiry.partyType})
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[#7B847F] block">Arrival / Duration</span>
                        <span className="font-semibold">
                          {activeInquiry.preferredArrivalDate || 'Flexible'} • {activeInquiry.durationPreference}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[#7B847F] block">Budget Guide</span>
                        <span className="font-semibold text-[#064E3B]">
                          {activeInquiry.estimatedBudgetUsd || 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[#7B847F] block">Cadence</span>
                        <span className="font-semibold">{activeInquiry.travelCadence}</span>
                      </div>
                    </div>

                    {(activeInquiry.selectedDestinations || []).length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-[#7B847F] font-semibold">
                          Requested Destinations
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {activeInquiry.selectedDestinations.map((d) => (
                            <span key={d} className="bg-[#F4F4F0] px-2.5 py-1 text-xs text-[#064E3B]">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeInquiry.notes && (
                      <div className="bg-[#F4F4F0] p-4 text-xs text-[#404944]">
                        <strong className="block text-[#064E3B] mb-1">Traveler Notes:</strong>
                        {activeInquiry.notes}
                      </div>
                    )}

                    <div className="space-y-3 pt-2 border-t border-[#064E3B]/10">
                      <label className="block text-[10px] uppercase tracking-wider text-[#7B847F] font-semibold">
                        Update Inquiry Status
                      </label>
                      <select
                        value={activeInquiry.status}
                        onChange={(e) =>
                          void updateInquiry(activeInquiry.id, {
                            status: e.target.value as InquiryStatus,
                          })
                        }
                        className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2 text-xs font-semibold"
                      >
                        <option value="pending">Pending Review</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="quoted">Proposal Sent / Quoted</option>
                        <option value="converted">Converted to Booking</option>
                        <option value="archived">Archived</option>
                      </select>

                      {activeInquiry.status !== 'converted' ? (
                        <button
                          type="button"
                          onClick={() => openConvert(activeInquiry)}
                          className="w-full bg-[#064E3B] hover:bg-[#022C22] text-white py-3 text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <UserPlus className="w-4 h-4 text-[#D6B56D]" />
                          <span>Convert Inquiry to Confirmed Booking</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-[#064E3B] bg-[#B0F0D6]/40 p-3 font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Converted to Booking Ledger</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Booking Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] max-w-lg w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#064E3B]/15 pb-3">
              <h2 className="font-serif text-2xl text-[#064E3B]">Create Bespoke Booking</h2>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateBooking} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Guest Name *</label>
                  <input
                    type="text"
                    required
                    value={newBooking.guestName || ''}
                    onChange={(e) => setNewBooking({ ...newBooking, guestName: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Guest Email *</label>
                  <input
                    type="email"
                    required
                    value={newBooking.guestEmail || ''}
                    onChange={(e) => setNewBooking({ ...newBooking, guestEmail: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={newBooking.guestPhone || ''}
                    onChange={(e) => setNewBooking({ ...newBooking, guestPhone: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Country</label>
                  <input
                    type="text"
                    value={newBooking.guestCountry || ''}
                    onChange={(e) => setNewBooking({ ...newBooking, guestCountry: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={newBooking.startDate || ''}
                    onChange={(e) => setNewBooking({ ...newBooking, startDate: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={newBooking.endDate || ''}
                    onChange={(e) => setNewBooking({ ...newBooking, endDate: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tour Package / Route</label>
                  <input
                    type="text"
                    value={newBooking.packageTitle || ''}
                    onChange={(e) => setNewBooking({ ...newBooking, packageTitle: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Total Value (USD)</label>
                  <input
                    type="number"
                    min={0}
                    value={newBooking.totalAmountUsd || 0}
                    onChange={(e) =>
                      setNewBooking({ ...newBooking, totalAmountUsd: Number(e.target.value) || 0 })
                    }
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
              </div>
              {modalError && <div className="bg-[#FFDAD6] text-[#93000A] p-2.5">{modalError}</div>}
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#064E3B] text-white py-3 uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Save Booking Record</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Convert Inquiry Modal */}
      {convertModalOpen && activeInquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#064E3B]/15 pb-3">
              <h2 className="font-serif text-2xl text-[#064E3B]">Convert Inquiry to Booking</h2>
              <button type="button" onClick={() => setConvertModalOpen(false)} className="cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleConvertInquiry} className="space-y-3 text-xs">
              <p className="text-[#404944]">
                Creating CRM profile & confirmed booking for <strong>{activeInquiry.fullName}</strong>.
              </p>
              <div>
                <label className="block font-semibold mb-1">Route / Package Title</label>
                <input
                  type="text"
                  required
                  value={convertDates.packageTitle}
                  onChange={(e) => setConvertDates({ ...convertDates, packageTitle: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={convertDates.startDate}
                    onChange={(e) => setConvertDates({ ...convertDates, startDate: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={convertDates.endDate}
                    onChange={(e) => setConvertDates({ ...convertDates, endDate: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Agreed Total Value (USD)</label>
                <input
                  type="number"
                  min={0}
                  value={convertDates.totalAmountUsd}
                  onChange={(e) =>
                    setConvertDates({ ...convertDates, totalAmountUsd: Number(e.target.value) || 0 })
                  }
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                />
              </div>
              {modalError && <div className="bg-[#FFDAD6] text-[#93000A] p-2.5">{modalError}</div>}
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#064E3B] text-white py-3 uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Confirm Conversion</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
