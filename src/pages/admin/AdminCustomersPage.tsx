import React, { useMemo, useState } from 'react';
import { Loader2, Plus, Trash2, Users, X } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useData } from '../../context/DataContext';
import { Customer, CustomerTier } from '../../types/aventra';

export const AdminCustomersPage: React.FC = () => {
  const { customers, bookings, inquiries, saveCustomer, deleteCustomer } = useData();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Customer>>({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    tier: 'Standard',
    preferredStyle: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    return customers.filter((c) =>
      `${c.fullName} ${c.email} ${c.country} ${c.tier}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [customers, search]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveCustomer(editing);
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout searchQuery={search} onSearchChange={setSearch}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#745B1C] font-semibold">
              Client Registry • CRM
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#064E3B] mt-1">
              Customers & Patrons
            </h1>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditing({ fullName: '', email: '', phone: '', country: '', tier: 'Standard', preferredStyle: '', notes: '' });
              setModalOpen(true);
            }}
            className="bg-[#064E3B] text-white px-5 py-2.5 text-xs uppercase tracking-[0.14em] font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D6B56D]" />
            <span>Add Client</span>
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-[#064E3B]/12 p-12 text-center space-y-2">
            <Users className="w-8 h-8 text-[#064E3B]/40 mx-auto" />
            <h2 className="font-serif text-2xl text-[#064E3B]">No Client Profiles Yet</h2>
            <p className="text-sm text-[#404944]">
              Client profiles are created automatically when inquiries are converted to bookings, or added manually above.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[#064E3B]/12 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F4F4F0] border-b border-[#064E3B]/10 text-[10px] uppercase tracking-wider text-[#7B847F]">
                  <th className="py-3 px-4">Guest Name</th>
                  <th className="py-3 px-4">Email & Phone</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Tier</th>
                  <th className="py-3 px-4">Bookings / Inquiries</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#064E3B]/10">
                {filtered.map((cust) => {
                  const bCount = bookings.filter(
                    (b) => b.customerId === cust.id || b.guestEmail === cust.email
                  ).length;
                  const iCount = inquiries.filter((i) => i.email === cust.email).length;
                  return (
                    <tr key={cust.id} className="hover:bg-[#FAF9F5]">
                      <td className="py-3.5 px-4 font-semibold text-[#064E3B]">{cust.fullName}</td>
                      <td className="py-3.5 px-4">
                        <span className="block">{cust.email}</span>
                        <span className="text-[11px] text-[#7B847F]">{cust.phone}</span>
                      </td>
                      <td className="py-3.5 px-4">{cust.country}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-[#F0E9DC] text-[#745B1C] px-2.5 py-0.5 text-[10px] uppercase font-semibold">
                          {cust.tier}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#404944]">
                        {bCount} Bookings • {iCount} Inquiries
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => void deleteCustomer(cust.id)}
                          className="p-1.5 text-[#BA1A1A] hover:bg-[#FFDAD6] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#064E3B]/15 pb-3">
              <h2 className="font-serif text-2xl text-[#064E3B]">Add Client Profile</h2>
              <button type="button" onClick={() => setModalOpen(false)} className="cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editing.fullName || ''}
                  onChange={(e) => setEditing({ ...editing, fullName: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={editing.email || ''}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={editing.phone || ''}
                    onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Country</label>
                  <input
                    type="text"
                    value={editing.country || ''}
                    onChange={(e) => setEditing({ ...editing, country: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Patron Tier</label>
                <select
                  value={editing.tier || 'Standard'}
                  onChange={(e) => setEditing({ ...editing, tier: e.target.value as CustomerTier })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                >
                  <option value="Standard">Standard</option>
                  <option value="Collector">Collector</option>
                  <option value="VIP Patron">VIP Patron</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={editing.notes || ''}
                  onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#064E3B] text-white py-3 uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Save Customer</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
