import React, { useEffect, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Globe,
  Loader2,
  Save,
  Search,
  Share2,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { ImageWithFallback } from '../../components/ImageWithFallback';
import { useData } from '../../context/DataContext';
import { WebsiteSettings } from '../../types/aventra';

type SettingsTab = 'general' | 'seo';

export const AdminSettingsPage: React.FC = () => {
  const { settings, saveWebsiteSettings } = useData();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [form, setForm] = useState<WebsiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await saveWebsiteSettings(form);
      setSaved(true);
    } catch {
      setError('Could not update website settings. Verify required fields.');
    } finally {
      setSaving(false);
    }
  };

  const titleLength = (form.seoTitle || '').trim().length;
  const descLength = (form.seoDescription || '').trim().length;
  const previewTitle =
    form.seoTitle?.trim() || `${form.brandName || 'AVENTRA'} — ${form.tagline || ''}`;
  const previewDescription =
    form.seoDescription?.trim() || form.footerDescription || form.heroSubheadline || '';
  const previewOgTitle = form.ogTitle?.trim() || previewTitle;
  const previewOgDesc = form.ogDescription?.trim() || previewDescription;
  const previewOgImage = form.ogImage?.trim() || form.heroImageUrl || '';
  const previewUrl = form.canonicalUrl?.trim() || 'https://aventra.travel';

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#745B1C] font-semibold">
            Global Brand, Concierge & Metadata Configuration
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#064E3B] mt-1">
            Website Settings
          </h1>
          <p className="text-sm text-[#404944] mt-1">
            Edit public contact information, hero copy, founder profile, and global SEO & OpenGraph metadata stored directly in Firestore.
          </p>
        </div>

        {/* Section Tabs */}
        <div
          role="tablist"
          aria-label="Website Settings Sections"
          className="flex flex-wrap border-b border-[#064E3B]/15 gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'general'}
            onClick={() => {
              setActiveTab('general');
              setSaved(false);
              setError(null);
            }}
            className={`px-5 py-3 text-xs uppercase tracking-[0.16em] font-semibold inline-flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'general'
                ? 'border-[#064E3B] text-[#064E3B] bg-white'
                : 'border-transparent text-[#7B847F] hover:text-[#064E3B]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#D6B56D]" />
            <span>Brand &amp; Concierge</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'seo'}
            onClick={() => {
              setActiveTab('seo');
              setSaved(false);
              setError(null);
            }}
            className={`px-5 py-3 text-xs uppercase tracking-[0.16em] font-semibold inline-flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'seo'
                ? 'border-[#064E3B] text-[#064E3B] bg-white'
                : 'border-transparent text-[#7B847F] hover:text-[#064E3B]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#D6B56D]" />
            <span>SEO Metadata</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {activeTab === 'general' ? (
            <>
              <div className="bg-white border border-[#064E3B]/12 p-6 sm:p-8 space-y-4 text-xs">
                <h2 className="font-serif text-2xl text-[#064E3B] border-b border-[#064E3B]/10 pb-2">
                  Brand &amp; Hero
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase mb-1">Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={form.brandName}
                      onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase mb-1">Tagline *</label>
                    <input
                      type="text"
                      required
                      value={form.tagline}
                      onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold uppercase mb-1">Hero Headline</label>
                  <input
                    type="text"
                    value={form.heroHeadline}
                    onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase mb-1">Hero Subheadline</label>
                  <textarea
                    rows={2}
                    value={form.heroSubheadline}
                    onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase mb-1">Hero Image URL</label>
                  <input
                    type="url"
                    value={form.heroImageUrl}
                    onChange={(e) => setForm({ ...form, heroImageUrl: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="bg-white border border-[#064E3B]/12 p-6 sm:p-8 space-y-4 text-xs">
                <h2 className="font-serif text-2xl text-[#064E3B] border-b border-[#064E3B]/10 pb-2">
                  Contact &amp; Social Desk (Replace Placeholders With Verified Details)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase mb-1">Contact Email *</label>
                    <input
                      type="text"
                      required
                      value={form.contactEmail}
                      onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase mb-1">Office Address *</label>
                    <input
                      type="text"
                      required
                      value={form.officeAddress}
                      onChange={(e) => setForm({ ...form, officeAddress: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase mb-1">Telephone</label>
                    <input
                      type="text"
                      value={form.contactPhone}
                      onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={form.whatsappNumber}
                      onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase mb-1">Instagram URL</label>
                    <input
                      type="text"
                      value={form.instagramUrl}
                      onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase mb-1">Facebook URL</label>
                    <input
                      type="text"
                      value={form.facebookUrl}
                      onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#064E3B]/12 p-6 sm:p-8 space-y-4 text-xs">
                <h2 className="font-serif text-2xl text-[#064E3B] border-b border-[#064E3B]/10 pb-2">
                  About Us &amp; Founder Story
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase mb-1">Founder Name / Title</label>
                    <input
                      type="text"
                      value={form.founderName}
                      onChange={(e) => setForm({ ...form, founderName: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase mb-1">Founder Role</label>
                    <input
                      type="text"
                      value={form.founderRole}
                      onChange={(e) => setForm({ ...form, founderRole: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold uppercase mb-1">Founder Letter Body</label>
                  <textarea
                    rows={5}
                    value={form.founderLetterBody}
                    onChange={(e) => setForm({ ...form, founderLetterBody: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase mb-1">Accreditations &amp; Provenance Note</label>
                  <input
                    type="text"
                    value={form.accreditationsNote}
                    onChange={(e) => setForm({ ...form, accreditationsNote: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Global Search Engine Metadata */}
              <div className="bg-white border border-[#064E3B]/12 p-6 sm:p-8 space-y-5 text-xs">
                <div className="flex items-center justify-between border-b border-[#064E3B]/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#D6B56D]" />
                    <h2 className="font-serif text-2xl text-[#064E3B]">
                      Search Engine Title &amp; Meta Description
                    </h2>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[#7B847F]">
                    Synced to &lt;head&gt;
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="seo-title" className="block font-semibold uppercase">
                      Global Site Title (&lt;title&gt;)
                    </label>
                    <span
                      className={`text-[11px] font-medium ${
                        titleLength >= 30 && titleLength <= 65
                          ? 'text-[#064E3B]'
                          : 'text-[#745B1C]'
                      }`}
                    >
                      {titleLength} / 120 chars (30–60 ideal)
                    </span>
                  </div>
                  <input
                    id="seo-title"
                    type="text"
                    maxLength={120}
                    value={form.seoTitle || ''}
                    onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                    placeholder="AVENTRA — Discover Beyond Ordinary | Luxury Sri Lanka Travel"
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2.5 text-sm text-[#18231F]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="seo-description" className="block font-semibold uppercase">
                      Global Meta Description (&lt;meta name=&quot;description&quot;&gt;)
                    </label>
                    <span
                      className={`text-[11px] font-medium ${
                        descLength >= 120 && descLength <= 165
                          ? 'text-[#064E3B]'
                          : 'text-[#745B1C]'
                      }`}
                    >
                      {descLength} / 320 chars (120–160 ideal)
                    </span>
                  </div>
                  <textarea
                    id="seo-description"
                    rows={3}
                    maxLength={320}
                    value={form.seoDescription || ''}
                    onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                    placeholder="Summarize your luxury Sri Lanka expeditions in 1–2 compelling sentences..."
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2.5 text-sm text-[#18231F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="seo-keywords" className="block font-semibold uppercase mb-1">
                      Meta Keywords (Comma-Separated)
                    </label>
                    <input
                      id="seo-keywords"
                      type="text"
                      maxLength={400}
                      value={form.seoKeywords || ''}
                      onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })}
                      placeholder="Sri Lanka luxury travel, bespoke tours, AVENTRA"
                      className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2.5 text-sm text-[#18231F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="canonical-url" className="block font-semibold uppercase mb-1">
                      Canonical Base URL (Optional)
                    </label>
                    <input
                      id="canonical-url"
                      type="url"
                      maxLength={300}
                      value={form.canonicalUrl || ''}
                      onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })}
                      placeholder="https://aventra.travel (defaults to current origin)"
                      className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2.5 text-sm text-[#18231F]"
                    />
                  </div>
                </div>
              </div>

              {/* OpenGraph & Social Cards */}
              <div className="bg-white border border-[#064E3B]/12 p-6 sm:p-8 space-y-5 text-xs">
                <div className="flex items-center justify-between border-b border-[#064E3B]/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#D6B56D]" />
                    <h2 className="font-serif text-2xl text-[#064E3B]">
                      OpenGraph &amp; Social Share Tags
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        ogTitle: form.seoTitle || form.brandName,
                        ogDescription: form.seoDescription || form.footerDescription,
                        ogImage: form.ogImage || form.heroImageUrl,
                      })
                    }
                    className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#064E3B] hover:text-[#745B1C] cursor-pointer"
                  >
                    Sync From Global SEO
                  </button>
                </div>

                <div>
                  <label htmlFor="og-title" className="block font-semibold uppercase mb-1">
                    OpenGraph Title (og:title &amp; twitter:title)
                  </label>
                  <input
                    id="og-title"
                    type="text"
                    maxLength={120}
                    value={form.ogTitle || ''}
                    onChange={(e) => setForm({ ...form, ogTitle: e.target.value })}
                    placeholder="Defaults to Global Site Title when left blank"
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2.5 text-sm text-[#18231F]"
                  />
                </div>

                <div>
                  <label htmlFor="og-description" className="block font-semibold uppercase mb-1">
                    OpenGraph Description (og:description &amp; twitter:description)
                  </label>
                  <textarea
                    id="og-description"
                    rows={3}
                    maxLength={320}
                    value={form.ogDescription || ''}
                    onChange={(e) => setForm({ ...form, ogDescription: e.target.value })}
                    placeholder="Defaults to Global Meta Description when left blank"
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2.5 text-sm text-[#18231F]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="og-image" className="block font-semibold uppercase">
                      OpenGraph Image URL (og:image — 1200×630 Recommended)
                    </label>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, ogImage: form.heroImageUrl })}
                      className="text-[11px] text-[#745B1C] hover:text-[#064E3B] cursor-pointer"
                    >
                      Use Hero Image
                    </button>
                  </div>
                  <input
                    id="og-image"
                    type="url"
                    maxLength={1000}
                    value={form.ogImage || ''}
                    onChange={(e) => setForm({ ...form, ogImage: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2.5 text-sm text-[#18231F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="og-site-name" className="block font-semibold uppercase mb-1">
                      og:site_name
                    </label>
                    <input
                      id="og-site-name"
                      type="text"
                      maxLength={80}
                      value={form.ogSiteName || ''}
                      onChange={(e) => setForm({ ...form, ogSiteName: e.target.value })}
                      placeholder="AVENTRA"
                      className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2.5 text-sm text-[#18231F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="og-type" className="block font-semibold uppercase mb-1">
                      og:type
                    </label>
                    <select
                      id="og-type"
                      value={form.ogType || 'website'}
                      onChange={(e) => setForm({ ...form, ogType: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2.5 text-sm text-[#18231F]"
                    >
                      <option value="website">website</option>
                      <option value="article">article</option>
                      <option value="profile">profile</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="twitter-card" className="block font-semibold uppercase mb-1">
                      twitter:card
                    </label>
                    <select
                      id="twitter-card"
                      value={form.twitterCard || 'summary_large_image'}
                      onChange={(e) => setForm({ ...form, twitterCard: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2.5 text-sm text-[#18231F]"
                    >
                      <option value="summary_large_image">summary_large_image</option>
                      <option value="summary">summary</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Live Search & Social Share Card Preview */}
              <div className="bg-white border border-[#064E3B]/12 p-6 sm:p-8 space-y-5">
                <h2 className="font-serif text-2xl text-[#064E3B] border-b border-[#064E3B]/10 pb-2">
                  Live Snippet &amp; Social Card Preview
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Search Result Snippet */}
                  <div className="bg-[#FAF9F5] border border-[#064E3B]/10 p-5 space-y-1.5">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#745B1C] font-semibold block mb-2">
                      Search Engine Preview
                    </span>
                    <p className="text-xs text-[#064E3B] truncate">{previewUrl}</p>
                    <h3 className="text-lg font-medium text-[#1a0dab] leading-snug line-clamp-2">
                      {previewTitle}
                    </h3>
                    <p className="text-xs text-[#404944] leading-relaxed line-clamp-3">
                      {previewDescription}
                    </p>
                  </div>

                  {/* OpenGraph Share Card */}
                  <div className="bg-[#FAF9F5] border border-[#064E3B]/10 overflow-hidden">
                    <div className="px-4 py-2 border-b border-[#064E3B]/10 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-[#745B1C] font-semibold">
                        OpenGraph Share Preview
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.14em] text-[#7B847F]">
                        {form.twitterCard || 'summary_large_image'}
                      </span>
                    </div>
                    <div className="aspect-[1.91/1] bg-[#022C22] overflow-hidden">
                      <ImageWithFallback
                        src={previewOgImage}
                        alt={previewOgTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-1 bg-white">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-[#7B847F]">
                        {form.ogSiteName || form.brandName || 'AVENTRA'}
                      </span>
                      <p className="font-serif text-base text-[#064E3B] line-clamp-1">
                        {previewOgTitle}
                      </p>
                      <p className="text-xs text-[#404944] line-clamp-2">
                        {previewOgDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {error && <div className="bg-[#FFDAD6] text-[#93000A] p-3 text-xs">{error}</div>}
          {saved && (
            <div className="bg-[#B0F0D6]/50 text-[#022C22] p-3 text-xs flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {activeTab === 'seo'
                  ? 'SEO metadata & OpenGraph tags saved to Firestore and applied to document <head>.'
                  : 'Website settings saved to Firestore and reflected live across the public site.'}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="bg-[#064E3B] hover:bg-[#022C22] text-white px-7 py-3.5 text-xs uppercase tracking-[0.18em] font-semibold inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-[#D6B56D]" />}
            <span>
              {activeTab === 'seo' ? 'Save SEO & OpenGraph Metadata' : 'Publish Website Settings'}
            </span>
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

