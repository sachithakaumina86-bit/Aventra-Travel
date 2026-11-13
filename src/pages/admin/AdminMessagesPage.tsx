import React, { useMemo, useState } from 'react';
import { Mail, Trash2 } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useData } from '../../context/DataContext';
import { ContactMessageStatus } from '../../types/aventra';

export const AdminMessagesPage: React.FC = () => {
  const { contactMessages, updateContactMessage, deleteContactMessage } = useData();
  const [filterType, setFilterType] = useState<'all' | 'contact' | 'newsletter'>('all');

  const filtered = useMemo(() => {
    return contactMessages.filter((m) => filterType === 'all' || m.type === filterType);
  }, [contactMessages, filterType]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#745B1C] font-semibold">
              Desk Correspondence
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#064E3B] mt-1">
              Contact Messages & Subscribers
            </h1>
          </div>
          <div className="flex gap-2">
            {(['all', 'contact', 'newsletter'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className={`px-4 py-2 text-[11px] uppercase tracking-wider font-semibold cursor-pointer ${
                  filterType === t
                    ? 'bg-[#064E3B] text-white'
                    : 'bg-white border border-[#064E3B]/15 text-[#404944]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-[#064E3B]/12 p-12 text-center space-y-2">
            <Mail className="w-8 h-8 text-[#064E3B]/40 mx-auto" />
            <h2 className="font-serif text-2xl text-[#064E3B]">Inbox Empty</h2>
            <p className="text-sm text-[#404944]">
              Messages sent via the Contact page and footer newsletter subscriptions appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((msg) => (
              <div key={msg.id} className="bg-white border border-[#064E3B]/12 p-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#064E3B]/10 pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider bg-[#F0E9DC] text-[#745B1C] px-2 py-0.5 font-semibold mr-2">
                      {msg.type}
                    </span>
                    <strong className="font-serif text-xl text-[#064E3B]">{msg.fullName}</strong>
                    <span className="text-xs text-[#7B847F] ml-2">
                      ({msg.email} {msg.phone ? `• ${msg.phone}` : ''})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={msg.status}
                      onChange={(e) =>
                        void updateContactMessage(msg.id, e.target.value as ContactMessageStatus)
                      }
                      className="bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-1.5 text-xs font-semibold"
                    >
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => void deleteContactMessage(msg.id)}
                      className="p-1.5 text-[#BA1A1A] hover:bg-[#FFDAD6] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {msg.subject && (
                  <p className="text-xs font-semibold text-[#064E3B]">Subject: {msg.subject}</p>
                )}
                {msg.message && (
                  <p className="text-sm text-[#404944] leading-relaxed whitespace-pre-line">
                    {msg.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
