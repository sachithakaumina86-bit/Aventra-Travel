import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Save } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useData } from '../../context/DataContext';
import { WebsiteSettings } from '../../types/aventra';

export const AdminSettingsPage: React.FC = () => {
  const { settings, saveWebsiteSettings } = useData();
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

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#745B1C] font-semibold">
            Global Brand & Placeholder Configuration
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#064E3B] mt-1">
            Website Settings
          </h1>
          <p className="text-sm text-[#404944] mt-1">
            Edit public contact information, hero copy, founder profile placeholders, and social links stored in Firestore.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white border border-[#064E3B]/12 p-6 sm:p-8 space-y-4 text-xs">
            <h2 className="font-serif text-2xl text-[#064E3B] border-b border-[#064E3B]/10 pb-2">
              Brand & Hero
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
              Contact & Social Desk (Replace Placeholders With Verified Details)
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
              About Us & Founder Story
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
              <label className="block font-semibold uppercase mb-1">Accreditations & Provenance Note</label>
              <input
                type="text"
                value={form.accreditationsNote}
                onChange={(e) => setForm({ ...form, accreditationsNote: e.target.value })}
                className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {error && <div className="bg-[#FFDAD6] text-[#93000A] p-3 text-xs">{error}</div>}
          {saved && (
            <div className="bg-[#B0F0D6]/50 text-[#022C22] p-3 text-xs flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Website settings saved to Firestore and reflected live across the public site.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="bg-[#064E3B] hover:bg-[#022C22] text-white px-7 py-3.5 text-xs uppercase tracking-[0.18em] font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-[#D6B56D]" />}
            <span>Publish Website Settings</span>
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};
