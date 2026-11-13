import React, { useMemo, useState } from 'react';
import { Edit3, Eye, Loader2, Plus, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useData } from '../../context/DataContext';
import { ItineraryDay, TourPackage } from '../../types/aventra';
import { STITCH_IMAGES } from '../../data/initialSeedData';
import { ImageWithFallback } from '../../components/ImageWithFallback';

const EMPTY_PKG: Partial<TourPackage> = {
  title: '',
  slug: '',
  subtitle: '',
  category: 'Signature Circuit',
  durationDays: 8,
  durationNights: 7,
  indicativePriceUsd: 4850,
  priceDisclaimer: 'Indicative sample tariff — editable in Admin.',
  seasonWindow: 'Nov – Apr',
  heroImage: STITCH_IMAGES.ceylonDiscoveryHero,
  summary: '',
  overviewQuote: '',
  overviewNarrative: '',
  highlights: [],
  itineraryDays: [{ dayNumber: 1, title: 'Arrival & Sanctuary Transfer', location: 'Colombo → Sigiriya', description: 'Private transfer to sanctuary.', highlights: ['Welcome dinner'] }],
  inclusions: ['Curated boutique sanctuaries', 'Private chauffeur-guide'],
  exclusions: ['International flights'],
  isPublished: true,
  isFeatured: false,
};

export const AdminPackagesPage: React.FC = () => {
  const { tourPackages, saveTourPackage, deleteTourPackage } = useData();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<TourPackage>>(EMPTY_PKG);
  const [highlightsText, setHighlightsText] = useState('');
  const [inclusionsText, setInclusionsText] = useState('');
  const [days, setDays] = useState<ItineraryDay[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return tourPackages.filter((p) =>
      `${p.title} ${p.category} ${p.summary}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [tourPackages, search]);

  const openNew = () => {
    setEditing({ ...EMPTY_PKG });
    setHighlightsText('');
    setInclusionsText((EMPTY_PKG.inclusions || []).join('\n'));
    setDays(EMPTY_PKG.itineraryDays || []);
    setError(null);
    setDrawerOpen(true);
  };

  const openEdit = (pkg: TourPackage) => {
    setEditing({ ...pkg });
    setHighlightsText((pkg.highlights || []).join('\n'));
    setInclusionsText((pkg.inclusions || []).join('\n'));
    setDays(pkg.itineraryDays || []);
    setError(null);
    setDrawerOpen(true);
  };

  const addDay = () => {
    setDays((prev) => [
      ...prev,
      {
        dayNumber: prev.length + 1,
        title: `Day ${prev.length + 1} Passage`,
        location: 'Sri Lanka',
        description: '',
        highlights: [],
      },
    ]);
  };

  const updateDay = (idx: number, field: keyof ItineraryDay, value: string) => {
    setDays((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, [field]: value } : d))
    );
  };

  const removeDay = (idx: number) => {
    setDays((prev) =>
      prev.filter((_, i) => i !== idx).map((d, i) => ({ ...d, dayNumber: i + 1 }))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!editing.title || editing.title.trim().length < 2) {
      setError('Package title is required.');
      return;
    }
    if (!editing.summary || editing.summary.trim().length < 10) {
      setError('Summary must be at least 10 characters.');
      return;
    }

    setSaving(true);
    try {
      await saveTourPackage({
        ...editing,
        highlights: highlightsText.split('\n').map((s) => s.trim()).filter(Boolean),
        inclusions: inclusionsText.split('\n').map((s) => s.trim()).filter(Boolean),
        itineraryDays: days,
      });
      setDrawerOpen(false);
    } catch {
      setError('Could not save tour package. Verify fields and try again.');
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
              Circuit Blueprints • Tour Packages
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#064E3B] mt-1">
              Tour Packages & Itineraries
            </h1>
          </div>
          <button
            type="button"
            onClick={openNew}
            className="bg-[#064E3B] hover:bg-[#022C22] text-white px-5 py-2.5 text-xs uppercase tracking-[0.14em] font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D6B56D]" />
            <span>Add Package</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pkg) => (
            <div key={pkg.id} className="bg-white border border-[#064E3B]/12 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="aspect-[16/10] relative overflow-hidden">
                  <ImageWithFallback src={pkg.heroImage} alt={pkg.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-[#022C22]/90 text-[#D6B56D] px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold">
                    {pkg.durationLabel}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#745B1C] font-semibold">
                    {pkg.category}
                  </span>
                  <h2 className="font-serif text-2xl text-[#064E3B]">{pkg.title}</h2>
                  <p className="text-xs text-[#404944] line-clamp-2">{pkg.summary}</p>
                  <p className="text-sm font-semibold text-[#064E3B] pt-1">
                    ${pkg.indicativePriceUsd.toLocaleString()}{' '}
                    <span className="text-[11px] font-normal text-[#7B847F]">indicative / guest</span>
                  </p>
                </div>
              </div>

              <div className="px-5 py-3 bg-[#FAF9F5] border-t border-[#064E3B]/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => void saveTourPackage({ ...pkg, isPublished: !pkg.isPublished })}
                  className={`text-[10px] uppercase px-2.5 py-1 font-semibold cursor-pointer ${
                    pkg.isPublished ? 'bg-[#B0F0D6] text-[#022C22]' : 'bg-[#E9E8E4] text-[#404944]'
                  }`}
                >
                  {pkg.isPublished ? 'Published' : 'Draft'}
                </button>
                <div className="flex items-center gap-1.5">
                  <a href={`/packages/${pkg.slug}`} target="_blank" rel="noreferrer" className="p-1.5 text-[#404944]">
                    <Eye className="w-3.5 h-3.5" />
                  </a>
                  <button type="button" onClick={() => openEdit(pkg)} className="p-1.5 text-[#064E3B] cursor-pointer">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteTourPackage(pkg.id)}
                    className="p-1.5 text-[#BA1A1A] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/45">
          <div className="w-full max-w-2xl bg-[#FAF9F5] h-full overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#064E3B]/15 pb-4">
              <h2 className="font-serif text-2xl text-[#064E3B]">
                {editing.id ? `Edit ${editing.title}` : 'Create Tour Package'}
              </h2>
              <button type="button" onClick={() => setDrawerOpen(false)} className="cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={editing.title || ''}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider mb-1">Category</label>
                  <input
                    type="text"
                    value={editing.category || ''}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider mb-1">Days</label>
                  <input
                    type="number"
                    min={1}
                    value={editing.durationDays || 7}
                    onChange={(e) => setEditing({ ...editing, durationDays: Number(e.target.value) || 7 })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider mb-1">Nights</label>
                  <input
                    type="number"
                    min={0}
                    value={editing.durationNights ?? 6}
                    onChange={(e) => setEditing({ ...editing, durationNights: Number(e.target.value) || 0 })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider mb-1">Indicative Tariff (USD)</label>
                  <input
                    type="number"
                    min={0}
                    value={editing.indicativePriceUsd || 0}
                    onChange={(e) =>
                      setEditing({ ...editing, indicativePriceUsd: Number(e.target.value) || 0 })
                    }
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider mb-1">Season Window</label>
                  <input
                    type="text"
                    value={editing.seasonWindow || ''}
                    onChange={(e) => setEditing({ ...editing, seasonWindow: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1">Hero Image URL *</label>
                <input
                  type="url"
                  required
                  value={editing.heroImage || ''}
                  onChange={(e) => setEditing({ ...editing, heroImage: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1">Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={editing.summary || ''}
                  onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1">Overview Narrative</label>
                <textarea
                  rows={3}
                  value={editing.overviewNarrative || ''}
                  onChange={(e) => setEditing({ ...editing, overviewNarrative: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                />
              </div>

              {/* Itinerary Builder */}
              <div className="space-y-3 bg-white border border-[#064E3B]/12 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold uppercase tracking-wider text-[#064E3B]">
                    Day-by-Day Itinerary Builder ({days.length} Days)
                  </span>
                  <button
                    type="button"
                    onClick={addDay}
                    className="bg-[#064E3B] text-white px-3 py-1 text-[10px] uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    + Add Day
                  </button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {days.map((day, idx) => (
                    <div key={idx} className="bg-[#FAF9F5] p-3 border border-[#064E3B]/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#064E3B]">Day {day.dayNumber}</span>
                        <button
                          type="button"
                          onClick={() => removeDay(idx)}
                          className="text-[#BA1A1A] text-[10px] uppercase cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={day.title}
                          onChange={(e) => updateDay(idx, 'title', e.target.value)}
                          placeholder="Day Title"
                          className="bg-white border border-[#064E3B]/15 px-2.5 py-1.5"
                        />
                        <input
                          type="text"
                          value={day.location}
                          onChange={(e) => updateDay(idx, 'location', e.target.value)}
                          placeholder="Route / Location"
                          className="bg-white border border-[#064E3B]/15 px-2.5 py-1.5"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={day.description}
                        onChange={(e) => updateDay(idx, 'description', e.target.value)}
                        placeholder="Day narrative..."
                        className="w-full bg-white border border-[#064E3B]/15 px-2.5 py-1.5"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider mb-1">Highlights (1 per line)</label>
                  <textarea
                    rows={3}
                    value={highlightsText}
                    onChange={(e) => setHighlightsText(e.target.value)}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider mb-1">Inclusions (1 per line)</label>
                  <textarea
                    rows={3}
                    value={inclusionsText}
                    onChange={(e) => setInclusionsText(e.target.value)}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(editing.isPublished)}
                  onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })}
                  className="accent-[#064E3B]"
                />
                <span>Published on Public Website</span>
              </label>

              {error && <div className="bg-[#FFDAD6] text-[#93000A] p-3">{error}</div>}

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#064E3B] text-white py-3 uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Save Tour Package</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
