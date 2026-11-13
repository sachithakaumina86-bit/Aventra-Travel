import React, { useMemo, useState } from 'react';
import { Download, Edit3, Eye, Loader2, Plus, Search, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useData } from '../../context/DataContext';
import { Destination } from '../../types/aventra';
import { STITCH_IMAGES } from '../../data/initialSeedData';
import { ImageWithFallback } from '../../components/ImageWithFallback';

const EMPTY_DEST: Partial<Destination> = {
  name: '',
  slug: '',
  region: 'Cultural Triangle',
  microclimate: 'North-Central Plains',
  elevation: '300m',
  bestSeason: 'Dec – Apr',
  tagline: '',
  summary: '',
  description: '',
  heroImage: STITCH_IMAGES.sigiriyaDirectory,
  highlights: [],
  tags: [],
  startingRateUsd: 950,
  isFeatured: false,
  isPublished: true,
};

export const AdminDestinationsPage: React.FC = () => {
  const { destinations, saveDestination, deleteDestination } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [regionFilter, setRegionFilter] = useState('All');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Destination>>(EMPTY_DEST);
  const [highlightsText, setHighlightsText] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const regions = ['All', ...Array.from(new Set(destinations.map((d) => d.region)))];

  const filtered = useMemo(() => {
    return destinations.filter((d) => {
      const qOk =
        !search.trim() ||
        `${d.name} ${d.region} ${d.microclimate} ${d.tagline}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const statusOk =
        statusFilter === 'all' ||
        (statusFilter === 'published' && d.isPublished) ||
        (statusFilter === 'draft' && !d.isPublished);
      const regionOk = regionFilter === 'All' || d.region === regionFilter;
      return qOk && statusOk && regionOk;
    });
  }, [destinations, search, statusFilter, regionFilter]);

  const openNew = () => {
    setEditing({ ...EMPTY_DEST });
    setHighlightsText('');
    setTagsText('UNESCO Heritage, Luxury Sanctuary');
    setError(null);
    setDrawerOpen(true);
  };

  const openEdit = (dest: Destination) => {
    setEditing({ ...dest });
    setHighlightsText((dest.highlights || []).join('\n'));
    setTagsText((dest.tags || []).join(', '));
    setError(null);
    setDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!editing.name || editing.name.trim().length < 2) {
      setError('Destination name is required.');
      return;
    }
    if (!editing.summary || editing.summary.trim().length < 10) {
      setError('Summary must be at least 10 characters.');
      return;
    }
    if (!editing.description || editing.description.trim().length < 10) {
      setError('Description must be at least 10 characters.');
      return;
    }

    setSaving(true);
    try {
      await saveDestination({
        ...editing,
        highlights: highlightsText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        tags: tagsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setDrawerOpen(false);
    } catch {
      setError('Could not save destination to Firestore. Verify field values and admin permissions.');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (dest: Destination) => {
    await saveDestination({ ...dest, isPublished: !dest.isPublished });
  };

  const exportCsv = () => {
    const headers = ['Slug', 'Name', 'Region', 'Elevation', 'Best Season', 'Published'];
    const rows = filtered.map((d) => [
      d.slug,
      `"${d.name.replace(/"/g, '""')}"`,
      `"${d.region}"`,
      `"${d.elevation}"`,
      `"${d.bestSeason}"`,
      d.isPublished ? 'Published' : 'Draft',
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aventra-destinations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout searchQuery={search} onSearchChange={setSearch}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#745B1C] font-semibold">
              Atelier Curation • Destinations & Territory
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#064E3B] mt-1">
              Destinations & Sacred Sanctuaries
            </h1>
            <p className="text-sm text-[#404944] mt-1">
              Curate geographical sanctuaries, microclimate metadata, and published visibility.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={exportCsv}
              className="bg-white border border-[#064E3B]/20 text-[#064E3B] px-4 py-2.5 text-xs uppercase tracking-[0.14em] font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={openNew}
              className="bg-[#064E3B] hover:bg-[#022C22] text-white px-5 py-2.5 text-xs uppercase tracking-[0.14em] font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D6B56D]" />
              <span>Add Sanctuary</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-[#064E3B]/10 p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#7B847F] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by sanctuary, region, or microclimate..."
                className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 pl-9 pr-3 py-2 text-xs"
              />
            </div>
            <div className="flex border border-[#064E3B]/15 text-[11px] font-semibold">
              {(['all', 'published', 'draft'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-2 uppercase tracking-wider cursor-pointer ${
                    statusFilter === st ? 'bg-[#064E3B] text-white' : 'bg-white text-[#404944]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {regions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegionFilter(r)}
                className={`px-3 py-1 text-[10px] uppercase tracking-wider font-semibold cursor-pointer ${
                  regionFilter === r
                    ? 'bg-[#064E3B] text-white'
                    : 'bg-[#F4F4F0] text-[#404944]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Sanctuary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((dest) => (
            <div
              key={dest.id}
              className="bg-white border border-[#064E3B]/12 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <ImageWithFallback
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#022C22]/90 text-[#FAF9F5] px-2 py-0.5 text-[10px] uppercase tracking-wider">
                    {dest.elevation}
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-[#D6B56D] text-[#18231F] px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold">
                    {dest.bestSeason}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#745B1C] font-semibold">
                    {dest.region}
                  </p>
                  <h2 className="font-serif text-xl text-[#064E3B] leading-snug">{dest.name}</h2>
                  <p className="text-xs text-[#404944] line-clamp-2">{dest.summary}</p>
                </div>
              </div>

              <div className="px-4 py-3 bg-[#FAF9F5] border-t border-[#064E3B]/10 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => void togglePublish(dest)}
                  className={`text-[10px] uppercase tracking-wider px-2.5 py-1 font-semibold cursor-pointer ${
                    dest.isPublished
                      ? 'bg-[#B0F0D6] text-[#022C22]'
                      : 'bg-[#E9E8E4] text-[#404944]'
                  }`}
                >
                  {dest.isPublished ? 'Published' : 'Draft'}
                </button>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`/destinations/${dest.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    title="Preview Public Page"
                    className="p-1.5 text-[#404944] hover:text-[#064E3B]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => openEdit(dest)}
                    title="Edit Sanctuary"
                    className="p-1.5 text-[#064E3B] hover:bg-[#E9E8E4] cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteDestination(dest.id)}
                    title="Delete Sanctuary"
                    className="p-1.5 text-[#BA1A1A] hover:bg-[#FFDAD6] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide-Over Dossier Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/45">
          <div className="w-full max-w-xl bg-[#FAF9F5] h-full overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#064E3B]/15 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#745B1C] font-semibold">
                  Sanctuary Dossier Editor
                </span>
                <h2 className="font-serif text-2xl text-[#064E3B]">
                  {editing.id ? `Edit ${editing.name}` : 'Create New Sanctuary'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-[#404944] hover:text-[#064E3B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1">
                    Sanctuary Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editing.name || ''}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1">
                    URL Slug (auto if blank)
                  </label>
                  <input
                    type="text"
                    value={editing.slug || ''}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    placeholder="sigiriya"
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1">
                    Region
                  </label>
                  <input
                    type="text"
                    value={editing.region || ''}
                    onChange={(e) => setEditing({ ...editing, region: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1">
                    Microclimate
                  </label>
                  <input
                    type="text"
                    value={editing.microclimate || ''}
                    onChange={(e) => setEditing({ ...editing, microclimate: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1">
                    Elevation
                  </label>
                  <input
                    type="text"
                    value={editing.elevation || ''}
                    onChange={(e) => setEditing({ ...editing, elevation: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1">
                    Best Season
                  </label>
                  <input
                    type="text"
                    value={editing.bestSeason || ''}
                    onChange={(e) => setEditing({ ...editing, bestSeason: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1">
                  Editorial Tagline
                </label>
                <input
                  type="text"
                  value={editing.tagline || ''}
                  onChange={(e) => setEditing({ ...editing, tagline: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1">
                  Hero Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={editing.heroImage || ''}
                  onChange={(e) => setEditing({ ...editing, heroImage: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1">
                  Summary (min 10 chars) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editing.summary || ''}
                  onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1">
                  Full Narrative Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1">
                  Highlights (One per line)
                </label>
                <textarea
                  rows={3}
                  value={highlightsText}
                  onChange={(e) => setHighlightsText(e.target.value)}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1">
                  Filter Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editing.isPublished)}
                    onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })}
                    className="accent-[#064E3B]"
                  />
                  <span>Published on Public Website</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editing.isFeatured)}
                    onChange={(e) => setEditing({ ...editing, isFeatured: e.target.checked })}
                    className="accent-[#064E3B]"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>

              {error && <div className="bg-[#FFDAD6] text-[#93000A] p-3 text-xs">{error}</div>}

              <div className="flex gap-3 pt-4 border-t border-[#064E3B]/15">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#064E3B] hover:bg-[#022C22] text-white py-3 text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Sanctuary Dossier</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="px-5 border border-[#064E3B]/20 text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
