import React, { useState } from 'react';
import { Loader2, Plus, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useData } from '../../context/DataContext';
import { GalleryItem } from '../../types/aventra';
import { STITCH_IMAGES } from '../../data/initialSeedData';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export const AdminGalleryPage: React.FC = () => {
  const { gallery, saveGalleryItem, deleteGalleryItem } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<GalleryItem>>({
    title: '',
    region: 'Sri Lanka',
    category: 'Landscapes',
    imageUrl: STITCH_IMAGES.sigiriyaHero,
    caption: '',
    isPublished: true,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveGalleryItem(editing);
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
              Visual Archive
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#064E3B] mt-1">Media Gallery</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditing({
                title: '',
                region: 'Sri Lanka',
                category: 'Landscapes',
                imageUrl: STITCH_IMAGES.sigiriyaHero,
                caption: '',
                isPublished: true,
              });
              setModalOpen(true);
            }}
            className="bg-[#064E3B] text-white px-5 py-2.5 text-xs uppercase tracking-[0.14em] font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D6B56D]" />
            <span>Add Photograph</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {gallery.map((item) => (
            <div key={item.id} className="bg-white border border-[#064E3B]/12 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageWithFallback src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#745B1C] font-semibold">
                    {item.category} • {item.region}
                  </span>
                  <h2 className="font-serif text-lg text-[#064E3B]">{item.title}</h2>
                  <p className="text-xs text-[#404944] line-clamp-2">{item.caption}</p>
                </div>
              </div>
              <div className="px-4 py-2.5 bg-[#FAF9F5] border-t border-[#064E3B]/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => void saveGalleryItem({ ...item, isPublished: !item.isPublished })}
                  className={`text-[10px] uppercase px-2 py-0.5 font-semibold cursor-pointer ${
                    item.isPublished ? 'bg-[#B0F0D6] text-[#022C22]' : 'bg-[#E9E8E4] text-[#404944]'
                  }`}
                >
                  {item.isPublished ? 'Published' : 'Hidden'}
                </button>
                <button
                  type="button"
                  onClick={() => void deleteGalleryItem(item.id)}
                  className="p-1 text-[#BA1A1A] cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#064E3B]/15 pb-3">
              <h2 className="font-serif text-2xl text-[#064E3B]">Add Media Item</h2>
              <button type="button" onClick={() => setModalOpen(false)} className="cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={editing.title || ''}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={editing.category || ''}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Region</label>
                  <input
                    type="text"
                    value={editing.region || ''}
                    onChange={(e) => setEditing({ ...editing, region: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={editing.imageUrl || ''}
                  onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Caption</label>
                <textarea
                  rows={2}
                  value={editing.caption || ''}
                  onChange={(e) => setEditing({ ...editing, caption: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#064E3B] text-white py-3 uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Save Photograph</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
