import React, { useState } from 'react';
import { Edit3, Loader2, Plus, Star, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useData } from '../../context/DataContext';
import { Testimonial } from '../../types/aventra';
import { AdminCardGridSkeleton } from '../../components/CardSkeletons';

export const AdminTestimonialsPage: React.FC = () => {
  const { loadingAdmin, testimonials, saveTestimonial, deleteTestimonial } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Testimonial>>({
    guestName: '',
    guestOrigin: '',
    journeyTitle: '',
    quote: '',
    rating: 5,
    stayDateLabel: '',
    isPublished: true,
    isFeatured: true,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveTestimonial(editing);
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#745B1C] font-semibold">
              Curation • Guest Reflections
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#064E3B] mt-1">
              Testimonials Management
            </h1>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditing({ guestName: '', guestOrigin: '', journeyTitle: '', quote: '', rating: 5, stayDateLabel: '', isPublished: true, isFeatured: true });
              setModalOpen(true);
            }}
            className="bg-[#064E3B] text-white px-5 py-2.5 text-xs uppercase tracking-[0.14em] font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D6B56D]" />
            <span>Add Testimonial</span>
          </button>
        </div>

        {loadingAdmin ? (
          <AdminCardGridSkeleton columns={3} textOnly count={6} />
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white border border-[#064E3B]/12 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-[#D6B56D]">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#D6B56D]" />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => void saveTestimonial({ ...t, isPublished: !t.isPublished })}
                    className={`text-[10px] uppercase px-2 py-0.5 font-semibold cursor-pointer ${
                      t.isPublished ? 'bg-[#B0F0D6] text-[#022C22]' : 'bg-[#E9E8E4] text-[#404944]'
                    }`}
                  >
                    {t.isPublished ? 'Published' : 'Hidden'}
                  </button>
                </div>
                <p className="font-serif italic text-base text-[#18231F]">“{t.quote}”</p>
              </div>
              <div className="pt-3 border-t border-[#064E3B]/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#064E3B]">{t.guestName}</p>
                  <p className="text-[11px] text-[#7B847F]">{t.guestOrigin}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing({ ...t });
                      setModalOpen(true);
                    }}
                    className="p-1.5 text-[#064E3B] cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteTestimonial(t.id)}
                    className="p-1.5 text-[#BA1A1A] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#064E3B]/15 pb-3">
              <h2 className="font-serif text-2xl text-[#064E3B]">
                {editing.id ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button type="button" onClick={() => setModalOpen(false)} className="cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Guest Name *</label>
                <input
                  type="text"
                  required
                  value={editing.guestName || ''}
                  onChange={(e) => setEditing({ ...editing, guestName: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Origin / City</label>
                  <input
                    type="text"
                    value={editing.guestOrigin || ''}
                    onChange={(e) => setEditing({ ...editing, guestOrigin: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Rating (1–5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={editing.rating || 5}
                    onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) || 5 })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Journey Title</label>
                <input
                  type="text"
                  value={editing.journeyTitle || ''}
                  onChange={(e) => setEditing({ ...editing, journeyTitle: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Quote (min 10 chars) *</label>
                <textarea
                  rows={3}
                  required
                  value={editing.quote || ''}
                  onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                />
              </div>
              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(editing.isPublished)}
                  onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })}
                  className="accent-[#064E3B]"
                />
                <span>Published</span>
              </label>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#064E3B] text-white py-3 uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Save Testimonial</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
