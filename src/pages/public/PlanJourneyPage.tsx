import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CalendarCheck, CheckCircle2, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';

const EXPERIENCE_OPTIONS = [
  'Dawn Citadel & Ancient Kingdoms',
  'Yala & Wilpattu Leopard Safaris',
  'Wild Elephant Sanctuary Encounters',
  'Highland Tea Estates & Scenic Rail',
  'Blue Whale Marine Catamaran',
  'Tropical Modernist Architecture',
  'Ayurvedic Wellness & Slow Rituals',
  'Private Spice & Coastal Dining',
];

export const PlanJourneyPage: React.FC = () => {
  const { destinations, submitInquiry } = useData();
  const [searchParams] = useSearchParams();

  const [partyType, setPartyType] = useState('Couple / Honeymoon');
  const [durationPreference, setDurationPreference] = useState('8–10 Days');
  const [climatePreference, setClimatePreference] = useState('Highlands + Coast Blend');
  const [preferredArrivalDate, setPreferredArrivalDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [sanctuaryTier, setSanctuaryTier] = useState('Ultra-Luxury & Relais Heritage');
  const [travelCadence, setTravelCadence] = useState('Balanced & Unhurried');
  const [selectedExperienceTypes, setSelectedExperienceTypes] = useState<string[]>([]);
  const [estimatedBudgetUsd, setEstimatedBudgetUsd] = useState('$5,000 – $10,000 per guest');
  const [notes, setNotes] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState('Email');

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);

  // Pre-fill from query params
  useEffect(() => {
    const destParam = searchParams.get('destination');
    const pkgParam = searchParams.get('package');
    const expParam = searchParams.get('experience');
    const regionParam = searchParams.get('region');

    if (destParam && !selectedDestinations.includes(destParam)) {
      setSelectedDestinations((prev) => [...prev, destParam]);
    }
    if (pkgParam) {
      setNotes((prev) =>
        prev || `Interested in adapting the "${pkgParam}" itinerary blueprint.`
      );
    }
    if (expParam) {
      setNotes((prev) =>
        prev || `Would like to feature the "${expParam}" experience.`
      );
    }
    if (regionParam) {
      setClimatePreference(regionParam);
    }
  }, [searchParams]);

  const publishedDestinations = destinations.filter((d) => d.isPublished);

  const toggleItem = (list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setSubmitError(null);

    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      country: country.trim(),
      partyType,
      durationPreference,
      climatePreference,
      preferredArrivalDate,
      adults,
      children,
      selectedDestinations,
      sanctuaryTier,
      travelCadence,
      selectedExperienceTypes,
      estimatedBudgetUsd,
      notes: notes.trim(),
      preferredContactMethod,
    };

    setSubmitting(true);
    try {
      const validateRes = await fetch('/api/inquiries/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const validationData = await validateRes.json();
      if (!validateRes.ok || !validationData.valid) {
        setFieldErrors(validationData.errors || {});
        setSubmitError('Please review the highlighted traveler details before submitting.');
        setSubmitting(false);
        return;
      }

      const result = await submitInquiry(validationData.normalized);
      setConfirmedRef(result.referenceCode);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSubmitError('We could not save your bespoke inquiry right now. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedRef) {
    return (
      <div className="pt-28 pb-24 bg-[#FAF9F5] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white border border-[#064E3B]/15 p-8 sm:p-12 shadow-lg text-center space-y-6">
          <div className="w-14 h-14 bg-[#064E3B] text-[#D6B56D] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#745B1C] font-semibold block">
            Bespoke Inquiry Registered • Reference {confirmedRef}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#064E3B]">
            Your Journey Dossier Is With Our Atelier
          </h1>
          <p className="text-sm sm:text-base text-[#404944] leading-relaxed">
            Thank you, <strong>{fullName}</strong>. Your customized Sri Lanka inquiry has been recorded under reference <span className="font-mono font-semibold text-[#064E3B]">{confirmedRef}</span>. An AVENTRA curator will review availability and respond via <strong>{preferredContactMethod}</strong>.
          </p>
          <div className="bg-[#FAF9F5] border border-[#064E3B]/10 p-5 text-left text-xs text-[#404944] space-y-1.5">
            <p><strong>Party:</strong> {adults} Adults, {children} Children ({partyType})</p>
            <p><strong>Target Window:</strong> {preferredArrivalDate || 'Flexible Dates'} • {durationPreference}</p>
            <p><strong>Destinations Noted:</strong> {selectedDestinations.length ? selectedDestinations.join(', ') : 'Curator Choice'}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/"
              className="bg-[#064E3B] text-[#FAF9F5] px-7 py-3.5 text-xs uppercase tracking-[0.18em] font-semibold"
            >
              Return Home
            </Link>
            <Link
              to="/packages"
              className="border border-[#064E3B]/25 text-[#064E3B] px-7 py-3.5 text-xs uppercase tracking-[0.18em] font-semibold"
            >
              Explore Packages
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-[#FAF9F5] text-[#18231F]">
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#064E3B]/10">
        <span className="text-[11px] uppercase tracking-[0.26em] text-[#745B1C] font-semibold">
          Bespoke Commission Atelier
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#064E3B] mt-2">
          Plan Your Bespoke Journey
        </h1>
        <p className="text-base text-[#404944] max-w-2xl mt-3 leading-relaxed">
          Compose your ideal Sri Lankan expedition preferences below. Submitted inquiries enter our private concierge ledger for tailored itinerary design—no automated booking charges occur here.
        </p>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Form Steps */}
          <div className="lg:col-span-8 space-y-10">
            {/* Step 1: Party & Timing */}
            <div className="bg-white border border-[#064E3B]/12 p-7 sm:p-8 space-y-6">
              <div className="border-b border-[#064E3B]/10 pb-3">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#745B1C] font-semibold">
                  Step 01
                </span>
                <h2 className="font-serif text-2xl text-[#064E3B]">Travel Party & Seasonal Window</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-1.5">
                    Party Composition
                  </label>
                  <select
                    value={partyType}
                    onChange={(e) => setPartyType(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3.5 py-2.5 text-sm"
                  >
                    <option>Couple / Honeymoon</option>
                    <option>Private Family</option>
                    <option>Friends & Collectors</option>
                    <option>Solo Explorer</option>
                    <option>Multigenerational Celebration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-1.5">
                    Preferred Duration
                  </label>
                  <select
                    value={durationPreference}
                    onChange={(e) => setDurationPreference(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3.5 py-2.5 text-sm"
                  >
                    <option>5–7 Days</option>
                    <option>8–10 Days</option>
                    <option>11–14 Days</option>
                    <option>15+ Days Extended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-1.5">
                    Target Arrival Date
                  </label>
                  <input
                    type="date"
                    value={preferredArrivalDate}
                    onChange={(e) => setPreferredArrivalDate(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-1.5">
                    Climate & Horizon Focus
                  </label>
                  <select
                    value={climatePreference}
                    onChange={(e) => setClimatePreference(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3.5 py-2.5 text-sm"
                  >
                    <option>Highlands + Coast Blend</option>
                    <option>Cultural Triangle + Wildlife</option>
                    <option>Southwest Winter Coast (Nov–Apr)</option>
                    <option>East Coast Summer Sun (May–Oct)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-1.5">
                    Adults *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={adults}
                    onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3.5 py-2.5 text-sm"
                  />
                  {fieldErrors.adults && <p className="text-xs text-[#BA1A1A] mt-1">{fieldErrors.adults}</p>}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-1.5">
                    Children
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={children}
                    onChange={(e) => setChildren(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Destinations */}
            <div className="bg-white border border-[#064E3B]/12 p-7 sm:p-8 space-y-5">
              <div className="border-b border-[#064E3B]/10 pb-3">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#745B1C] font-semibold">
                  Step 02
                </span>
                <h2 className="font-serif text-2xl text-[#064E3B]">Select Preferred Regions & Sanctuaries</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {publishedDestinations.map((dest) => {
                  const selected = selectedDestinations.includes(dest.name);
                  return (
                    <button
                      key={dest.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleItem(selectedDestinations, setSelectedDestinations, dest.name)}
                      className={`p-3.5 min-h-[52px] text-left border transition-all active:scale-[0.99] cursor-pointer flex items-center justify-between ${
                        selected
                          ? 'bg-[#064E3B] text-[#FAF9F5] border-[#064E3B]'
                          : 'bg-[#FAF9F5] text-[#18231F] border-[#064E3B]/15 hover:border-[#064E3B]'
                      }`}
                    >
                      <div>
                        <span className="text-sm font-medium block">{dest.name}</span>
                        <span
                          className={`text-[10px] uppercase tracking-wider ${
                            selected ? 'text-[#D6B56D]' : 'text-[#7B847F]'
                          }`}
                        >
                          {dest.region} • {dest.bestSeason}
                        </span>
                      </div>
                      <span className="text-xs font-bold">{selected ? '✓' : '+'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Sanctuary Tier & Experiences */}
            <div className="bg-white border border-[#064E3B]/12 p-7 sm:p-8 space-y-6">
              <div className="border-b border-[#064E3B]/10 pb-3">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#745B1C] font-semibold">
                  Step 03
                </span>
                <h2 className="font-serif text-2xl text-[#064E3B]">Sanctuary Tier & Experiential Rhythm</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-1.5">
                    Sanctuary Tier
                  </label>
                  <select
                    value={sanctuaryTier}
                    onChange={(e) => setSanctuaryTier(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3.5 py-2.5 text-sm"
                  >
                    <option>Ultra-Luxury & Relais Heritage</option>
                    <option>Boutique Luxury & Architectural Villas</option>
                    <option>Eco-Safari Lodges & Tea Bungalows</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-1.5">
                    Travel Cadence
                  </label>
                  <select
                    value={travelCadence}
                    onChange={(e) => setTravelCadence(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3.5 py-2.5 text-sm"
                  >
                    <option>Balanced & Unhurried</option>
                    <option>Slow Retreat (Fewer Transfers)</option>
                    <option>Comprehensive Island Circuit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-2.5">
                  Desired Experiences
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {EXPERIENCE_OPTIONS.map((expOpt) => {
                    const checked = selectedExperienceTypes.includes(expOpt);
                    return (
                      <label
                        key={expOpt}
                        className={`flex items-center gap-3 p-3 border text-xs cursor-pointer transition-colors ${
                          checked
                            ? 'bg-[#F0E9DC] border-[#064E3B] text-[#064E3B] font-semibold'
                            : 'bg-[#FAF9F5] border-[#064E3B]/12 text-[#404944]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleItem(selectedExperienceTypes, setSelectedExperienceTypes, expOpt)
                          }
                          className="accent-[#064E3B]"
                        />
                        <span>{expOpt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 4: Traveler Details */}
            <div className="bg-white border border-[#064E3B]/12 p-7 sm:p-8 space-y-6">
              <div className="border-b border-[#064E3B]/10 pb-3">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#745B1C] font-semibold">
                  Step 04
                </span>
                <h2 className="font-serif text-2xl text-[#064E3B]">Traveler Contact Dossier</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3.5 py-2.5 text-sm"
                  />
                  {fieldErrors.fullName && (
                    <p className="text-xs text-[#BA1A1A] mt-1">{fieldErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3.5 py-2.5 text-sm"
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-[#BA1A1A] mt-1">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 7700 900077"
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3.5 py-2.5 text-sm"
                  />
                  {fieldErrors.phone && (
                    <p className="text-xs text-[#BA1A1A] mt-1">{fieldErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-1.5">
                    Country of Residence *
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United Kingdom, Switzerland, USA..."
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3.5 py-2.5 text-sm"
                  />
                  {fieldErrors.country && (
                    <p className="text-xs text-[#BA1A1A] mt-1">{fieldErrors.country}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-1.5">
                    Estimated Investment Range
                  </label>
                  <select
                    value={estimatedBudgetUsd}
                    onChange={(e) => setEstimatedBudgetUsd(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3.5 py-2.5 text-sm"
                  >
                    <option>$3,500 – $5,000 per guest</option>
                    <option>$5,000 – $10,000 per guest</option>
                    <option>$10,000 – $18,000 per guest</option>
                    <option>$18,000+ Ultra-Bespoke Charter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-1.5">
                    Preferred Consultation Medium
                  </label>
                  <select
                    value={preferredContactMethod}
                    onChange={(e) => setPreferredContactMethod(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3.5 py-2.5 text-sm"
                  >
                    <option>Email</option>
                    <option>WhatsApp</option>
                    <option>Private Video Call</option>
                    <option>Telephone</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-1.5">
                  Special Occasions, Dietary Notes, or Architectural Wishes
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share anniversary celebrations, flight preferences, mobility considerations, or particular properties you admire..."
                  className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3.5 py-2.5 text-sm"
                />
              </div>

              {submitError && (
                <div className="bg-[#ffdad6] text-[#93000a] px-4 py-3 text-xs font-medium">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#064E3B] hover:bg-[#022C22] active:scale-[0.99] text-[#FAF9F5] py-4 px-6 min-h-[48px] text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Journey Dossier...</span>
                  </>
                ) : (
                  <>
                    <CalendarCheck className="w-4 h-4 text-[#D6B56D]" />
                    <span>Submit Bespoke Inquiry</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Live Summary Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 bg-[#022C22] text-[#FAF9F5] p-7 border border-[#D6B56D]/30 space-y-6 shadow-xl">
              <div className="flex items-center gap-2.5 border-b border-[#FAF9F5]/15 pb-4">
                <Sparkles className="w-5 h-5 text-[#D6B56D]" />
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#D6B56D] block">
                    Live Specification
                  </span>
                  <h3 className="font-serif text-xl">Your Journey Brief</h3>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between gap-2">
                  <span className="text-[#FAF9F5]/60">Party</span>
                  <span className="font-medium text-right">
                    {adults} Adults{children > 0 ? `, ${children} Children` : ''} • {partyType}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#FAF9F5]/60">Duration</span>
                  <span className="font-medium">{durationPreference}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#FAF9F5]/60">Arrival</span>
                  <span className="font-medium">{preferredArrivalDate || 'Flexible'}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#FAF9F5]/60">Sanctuary Tier</span>
                  <span className="font-medium text-right">{sanctuaryTier}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#FAF9F5]/60">Cadence</span>
                  <span className="font-medium">{travelCadence}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#FAF9F5]/60">Budget Guide</span>
                  <span className="font-medium text-[#D6B56D]">{estimatedBudgetUsd}</span>
                </div>
              </div>

              {selectedDestinations.length > 0 && (
                <div className="pt-3 border-t border-[#FAF9F5]/15 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#D6B56D] block">
                    Selected Sanctuaries ({selectedDestinations.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDestinations.map((d) => (
                      <span key={d} className="bg-[#064E3B] px-2.5 py-1 text-[11px]">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-[#FAF9F5]/15 flex items-start gap-2.5 text-[11px] text-[#FAF9F5]/75">
                <ShieldCheck className="w-4 h-4 text-[#D6B56D] shrink-0 mt-0.5" />
                <p>
                  No deposit is billed online. Inquiries are reviewed personally by AVENTRA concierge specialists.
                </p>
              </div>
            </div>
          </aside>
        </form>
      </section>
    </div>
  );
};
