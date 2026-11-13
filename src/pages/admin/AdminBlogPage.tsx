import React, { useState } from 'react';
import { Edit3, Eye, Loader2, Plus, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useData } from '../../context/DataContext';
import { BlogPost } from '../../types/aventra';
import { STITCH_IMAGES } from '../../data/initialSeedData';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export const AdminBlogPage: React.FC = () => {
  const { blogPosts, saveBlogPost, deleteBlogPost } = useData();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    category: 'Seasonal Wisdom',
    excerpt: '',
    content: '',
    coverImage: STITCH_IMAGES.oneIslandBanner,
    authorName: 'AVENTRA Editorial Desk',
    readTimeMinutes: 5,
    isPublished: true,
    isFeatured: false,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveBlogPost(editing);
      setDrawerOpen(false);
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
              Curation • Editorial Stories
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#064E3B] mt-1">
              Travel Journal Manager
            </h1>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditing({
                title: '',
                slug: '',
                category: 'Seasonal Wisdom',
                excerpt: '',
                content: '',
                coverImage: STITCH_IMAGES.oneIslandBanner,
                authorName: 'AVENTRA Editorial Desk',
                readTimeMinutes: 5,
                isPublished: true,
                isFeatured: false,
              });
              setDrawerOpen(true);
            }}
            className="bg-[#064E3B] text-white px-5 py-2.5 text-xs uppercase tracking-[0.14em] font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D6B56D]" />
            <span>Write Dispatch</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white border border-[#064E3B]/12 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="aspect-[16/10] overflow-hidden">
                  <ImageWithFallback src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#745B1C] font-semibold">
                    {post.category} • {post.readTimeMinutes} Min
                  </span>
                  <h2 className="font-serif text-xl text-[#064E3B]">{post.title}</h2>
                  <p className="text-xs text-[#404944] line-clamp-2">{post.excerpt}</p>
                </div>
              </div>
              <div className="px-5 py-3 bg-[#FAF9F5] border-t border-[#064E3B]/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => void saveBlogPost({ ...post, isPublished: !post.isPublished })}
                  className={`text-[10px] uppercase px-2.5 py-1 font-semibold cursor-pointer ${
                    post.isPublished ? 'bg-[#B0F0D6] text-[#022C22]' : 'bg-[#E9E8E4] text-[#404944]'
                  }`}
                >
                  {post.isPublished ? 'Published' : 'Draft'}
                </button>
                <div className="flex gap-1.5">
                  <a href={`/journal/${post.slug}`} target="_blank" rel="noreferrer" className="p-1.5 text-[#404944]">
                    <Eye className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing({ ...post });
                      setDrawerOpen(true);
                    }}
                    className="p-1.5 text-[#064E3B] cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteBlogPost(post.id)}
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
          <div className="w-full max-w-xl bg-[#FAF9F5] h-full overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#064E3B]/15 pb-3">
              <h2 className="font-serif text-2xl text-[#064E3B]">
                {editing.id ? 'Edit Journal Dispatch' : 'New Journal Dispatch'}
              </h2>
              <button type="button" onClick={() => setDrawerOpen(false)} className="cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase mb-1">Article Title *</label>
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
                  <label className="block font-semibold uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={editing.category || ''}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase mb-1">Read Time (Mins)</label>
                  <input
                    type="number"
                    min={1}
                    value={editing.readTimeMinutes || 5}
                    onChange={(e) => setEditing({ ...editing, readTimeMinutes: Number(e.target.value) || 5 })}
                    className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold uppercase mb-1">Cover Image URL *</label>
                <input
                  type="url"
                  required
                  value={editing.coverImage || ''}
                  onChange={(e) => setEditing({ ...editing, coverImage: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase mb-1">Excerpt (min 10 chars) *</label>
                <textarea
                  rows={2}
                  required
                  value={editing.excerpt || ''}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  className="w-full bg-white border border-[#064E3B]/15 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase mb-1">Full Article Content (min 20 chars) *</label>
                <textarea
                  rows={8}
                  required
                  value={editing.content || ''}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
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
                <span>Save Dispatch</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
