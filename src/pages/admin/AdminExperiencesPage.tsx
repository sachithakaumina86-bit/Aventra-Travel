import React, { useMemo, useState } from 'react';
import { Edit3, Eye, Loader2, Plus, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useData } from '../../context/DataContext';
import { Experience } from '../../types/aventra';
import { STITCH_IMAGES } from '../../data/initialSeedData';
import { ImageWithFallback } from '../../components/ImageWithFallback';

const EMPTY_EXP: Partial<Experience> = {
  title: '',
  slug: '',
  realmCategory: 'Wildlife & Big Game Safaris',
  region: 'Yala & Ruhuna',
  duration: 'Half Day',
  badgeText: 'Signature Realm',
  summary: '',
  description: '',
  heroImage: STITCH_IMAGES.expElephants,
  equipmentOrSetting: 'Private Safari Cruiser',
  highlights: [],
  tags: [],
  isSpotlight: false,
  isPublished: true,
};

export const AdminExperiencesPage: React.FC = () => {
  const { experiences, saveExperience, deleteExperience } = useData();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Experience>>(EMPTY_EXP);
  const [highlightsText, setHighlightsText] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return experiences.filter((e) =>
      `${e.title} ${e.realmCategory} ${e.region}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [experiences, search]);

  const openNew = () => {
    setEditing({ ...EMPTY_EXP });
    setHighlightsText('');
    setTagsText('Private Guide');
    setError(null);
    setDrawerOpen(true);
  };

  const openEdit = (exp: Experience) => {
    setEditing({ ...exp });
    setHighlightsText((exp.highlights || []).join('\n'));
    setTagsText((exp.tags || []).join(', '));
    setError(null);
    setDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!editing.title || editing.title.trim().length < 2) {
      setError('Experience title is required.');
      return;
    }
    if (!editing.summary || editing.summary.trim().length < 10 || !editing.description || editing.description.trim().length < 10) {
      setError('Summary and description must each be at least 10 characters.');
      return;
    }

    setSaving(true);
    try {
      await saveExperience({
        ...editing,
        highlights: highlightsText.split('\n').map((s) => s.trim()).filter(Boolean),
        tags: tagsText.split(',').map((s) => s.trim()).filter(Boolean),
      });
      setDrawerOpen(false);
    } catch {
      setError('Failed to save experience.');
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
              Experiential Realms
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#064E3B] mt-1">
              Curated Experiences
            </h1>
          </div>
          <button
            type="button"
            onClick={openNew}
            className="bg-[#064E3B] text-white px-5 py-2.5 text-xs uppercase tracking-[0.14em] font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D6B56D]" />
            <span>Add Experience</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((exp) => (
            <div key={exp.id} className="bg-white border border-[#064E3B]/12 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="aspect-[16/10] relative overflow-hidden">
                  <ImageWithFallback src={exp.heroImage} alt={exp.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-[#022C22]/90 text-[#D6B56D] px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold">
                    {exp.duration}
                  </span>
                </div>
                <div className="p-5 space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#745B1C] font-semibold">
                    {exp.realmCategory}
                  </span>
                  <h2 className="font-serif text-xl text-[#064E3B]">{exp.title}</h2>
                  <p className="text-xs text-[#404944] line-clamp-2">{exp.summary}</p>
                </div>
              </div>
              <div className="px-5 py-3 bg-[#FAF9F5] border-t border-[#064E3B]/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => void saveExperience({ ...exp, isPublished: !exp.isPublished })}
                  className={`text-[10px] uppercase px-2.5 py-1 font-semibold cursor-pointer ${
                    exp.isPublished ? 'bg-[#B0F0D6] text-[#022C22]' : 'bg-[#E9E8E4] text-[#404944]'
                  }`}
                >
                  {exp.isPublished ? 'Published' : 'Draft'}
                </button>
                <div className="flex items-center gap-1.5">
                  <a href={`/experiences/${exp.slug}`} target="_blank" rel="noreferrer" className="p-1.5 text-[#404944]">
                    <Eye className="w-3.5 h-3.5" />
                  </a>
                  <button type="button" onClick={() => openEdit(exp)} className="p-1.5 text-[#064E3B] cursor-pointer">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => void deleteExperience(exp.id)} className="p-1.5 text-[#BA1A1A] cursor-pointer">
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
          <div className="w-full max-w-xl bg-[#FAF9F5] h-full overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#064E3B]/15 pb-3">
              <h2 className="font-serif text-2xl text-[#064E3B]">
                {editing.id ? `Edit Experience` : 'Create Experience'}
              </h2>
              <button type="button" onClick={() => setDrawerOpen(false)} className="cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={editing.title || ''}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase mb-1">Realm Category</label>
                  <input
                    type="text"
                    value={editing.realmCategory || ''}
                    onChange={(e) => setEditing({ ...editing, realmCategory: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase mb-1">Region</label>
                  <input
                    type="text"
                    value={editing.region || ''}
                    onChange={(e) => setEditing({ ...editing, region: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase mb-1">Duration</label>
                  <input
                    type="text"
                    value={editing.duration || ''}
                    onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase mb-1">Setting / Format</label>
                  <input
                    type="text"
                    value={editing.equipmentOrSetting || ''}
                    onChange={(e) => setEditing({ ...editing, equipmentOrSetting: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold uppercase mb-1">Hero Image URL *</label>
                <input
                  type="url"
                  required
                  value={editing.heroImage || ''}
                  onChange={(e) => setEditing({ ...editing, heroImage: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase mb-1">Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={editing.summary || ''}
                  onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase mb-1">Description *</label>
                <textarea
                  rows={4}
                  required
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase mb-1">Highlights (1 per line)</label>
                <textarea
                  rows={3}
                  value={highlightsText}
                  onChange={(e) => setHighlightsText(e.target.value)}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editing.isPublished)}
                    onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })}
                    className="accent-[#064E3B]"
                  />
                  <span>Published</span>
                </label>
                <label className="flex items-center gap-2 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editing.isSpotlight)}
                    onChange={(e) => setEditing({ ...editing, isSpotlight: e.target.checked })}
                    className="accent-[#064E3B]"
                  />
                  <span>Spotlight</span>
                </label>
              </div>
              {error && <div className="bg-[#FFDAD6] text-[#93000A] p-3">{error}</div>}
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#064E3B] text-white py-3 uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Save Experience</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
