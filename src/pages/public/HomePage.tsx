import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Calendar,
  Compass,
  Feather,
  Globe,
  HeartHandshake,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { STITCH_IMAGES } from '../../data/initialSeedData';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export const HomePage: React.FC = () => {
  const { destinations, experiences, tourPackages, testimonials, blogPosts, settings } = useData();
  const navigate = useNavigate();

  const [dockRegion, setDockRegion] = useState('All Regions');
  const [dockStyle, setDockStyle] = useState('Signature Circuit');
  const [dockMonth, setDockMonth] = useState('Dec – Apr');
  const [activeRegionFilter, setActiveRegionFilter] = useState('All');

  const publishedDestinations = useMemo(
    () => destinations.filter((d) => d.isPublished),
    [destinations]
  );

  const filteredDestinations = useMemo(() => {
    const list =
      activeRegionFilter === 'All'
        ? publishedDestinations
        : publishedDestinations.filter((d) => d.region === activeRegionFilter);
    return list.slice(0, 8);
  }, [publishedDestinations, activeRegionFilter]);

  const publishedExperiences = useMemo(
    () => experiences.filter((e) => e.isPublished).slice(0, 8),
    [experiences]
  );

  const publishedPackages = useMemo(
    () => tourPackages.filter((p) => p.isPublished).slice(0, 5),
    [tourPackages]
  );

  const publishedTestimonials = useMemo(
    () => testimonials.filter((t) => t.isPublished).slice(0, 3),
    [testimonials]
  );

  const publishedPosts = useMemo(
    () => blogPosts.filter((b) => b.isPublished).slice(0, 3),
    [blogPosts]
  );

  const regions = ['All', 'Cultural Triangle', 'Central Highlands', 'Southern Coast', 'Wild South', 'Untamed East'];

  const handleConciergeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (dockRegion !== 'All Regions') params.set('region', dockRegion);
    if (dockStyle) params.set('style', dockStyle);
    if (dockMonth) params.set('season', dockMonth);
    navigate(`/plan-your-journey?${params.toString()}`);
  };

  return (
    <div className="bg-[#FAF9F5] text-[#18231F] overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] pt-20 flex items-center">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={settings.heroImageUrl || STITCH_IMAGES.homeHero}
            alt="Sri Lanka luxury highland and coastal sanctuary landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#022C22]/85 via-[#022C22]/55 to-[#022C22]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#022C22]/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="max-w-3xl space-y-6"
          >
            <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[#D6B56D] font-semibold">
              <span className="w-8 h-[1px] bg-[#D6B56D]" />
              <span>Private Sri Lanka Expeditions</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-[#FAF9F5] font-normal leading-[1.06] tracking-tight">
              {settings.heroHeadline || 'Discover Beyond Ordinary.'}
            </h1>
            <p className="text-base sm:text-lg text-[#FAF9F5]/85 leading-relaxed max-w-2xl font-light">
              {settings.heroSubheadline}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                to="/plan-your-journey"
                className="bg-[#D6B56D] hover:bg-[#e4c279] text-[#18231F] px-7 py-4 text-xs uppercase tracking-[0.18em] font-semibold transition-all inline-flex items-center gap-2.5 shadow-lg"
              >
                <span>Plan Your Bespoke Journey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/packages/the-ceylon-discovery"
                className="border border-[#FAF9F5]/45 hover:border-[#D6B56D] bg-[#022C22]/40 backdrop-blur-sm text-[#FAF9F5] px-7 py-4 text-xs uppercase tracking-[0.18em] font-medium transition-all"
              >
                Explore The Ceylon Discovery
              </Link>
            </div>
          </motion.div>

          {/* Concierge Search Dock */}
          <form
            onSubmit={handleConciergeSearch}
            className="mt-14 bg-[#FAF9F5]/95 backdrop-blur-md border border-[#D6B56D]/30 p-4 sm:p-5 shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
          >
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7B847F] font-semibold mb-1.5">
                Preferred Territory
              </label>
              <select
                value={dockRegion}
                onChange={(e) => setDockRegion(e.target.value)}
                className="w-full bg-white border border-[#064E3B]/15 px-3 py-2.5 text-sm text-[#18231F] focus:outline-none focus:border-[#064E3B]"
              >
                <option>All Regions</option>
                <option>Cultural Triangle</option>
                <option>Central Highlands</option>
                <option>Southern Coast</option>
                <option>Wild South</option>
                <option>Untamed East</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7B847F] font-semibold mb-1.5">
                Journey Style
              </label>
              <select
                value={dockStyle}
                onChange={(e) => setDockStyle(e.target.value)}
                className="w-full bg-white border border-[#064E3B]/15 px-3 py-2.5 text-sm text-[#18231F] focus:outline-none focus:border-[#064E3B]"
              >
                <option>Signature Circuit</option>
                <option>Honeymoon & Slow Luxury</option>
                <option>Wildlife & Safari</option>
                <option>Highland Tea & Wellness</option>
                <option>Coastal & Architectural</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7B847F] font-semibold mb-1.5">
                Travel Window
              </label>
              <select
                value={dockMonth}
                onChange={(e) => setDockMonth(e.target.value)}
                className="w-full bg-white border border-[#064E3B]/15 px-3 py-2.5 text-sm text-[#18231F] focus:outline-none focus:border-[#064E3B]"
              >
                <option>Dec – Apr (South & West Sun)</option>
                <option>May – Oct (East Coast & Cultural)</option>
                <option>Flexible / Year-Round</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-[#064E3B] hover:bg-[#022C22] text-[#FAF9F5] py-3 px-5 text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#D6B56D]" />
              <span>Compose Route</span>
            </button>
          </form>
        </div>
      </section>

      {/* 2. INTRODUCTION TO AVENTRA */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/5] overflow-hidden shadow-xl">
              <ImageWithFallback
                src={STITCH_IMAGES.hattonVeranda}
                alt="Hatton tea estate colonial veranda overlooking misty valleys"
                className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700"
              />
            </div>
            <div className="hidden sm:block absolute -bottom-6 -right-6 bg-[#022C22] text-[#FAF9F5] p-6 max-w-xs border-l-2 border-[#D6B56D] shadow-xl">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#D6B56D] font-semibold">
                Editorial Travel Atelier
              </p>
              <p className="font-serif text-lg mt-1.5 leading-snug">
                Privately paced itineraries sculpted around Sri Lanka’s seasonal rhythms.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-7">
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#745B1C] font-semibold">
                The AVENTRA Ethos
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#064E3B] leading-tight">
                Sri Lanka, Unfolded in Quiet Luxury.
              </h2>
            </div>
            <p className="text-base text-[#404944] leading-relaxed">
              Sri Lanka compresses ancient sky citadels, emerald tea plateaus, leopard-dense scrub coasts, and serene colonial fortresses within a single compact island. AVENTRA exists to transform those contrasts into a seamless, deeply restorative private journey.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                {
                  title: 'Tailored Pacing',
                  desc: 'Every route adapts to your rhythm—never rushed coach schedules.',
                },
                {
                  title: 'Curated Sanctuaries',
                  desc: 'Tea bungalows, water villas, coastal tents, and heritage manors.',
                },
                {
                  title: 'Monsoon Intelligence',
                  desc: 'Dual-monsoon routing so sunny skies follow your itinerary year-round.',
                },
                {
                  title: 'Dedicated Concierge',
                  desc: 'Single point of planning from inquiry draft to departure day.',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-[#F4F4F0] p-5 border border-[#064E3B]/10 space-y-1.5"
                >
                  <h3 className="font-serif text-lg text-[#064E3B]">{card.title}</h3>
                  <p className="text-xs text-[#404944] leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-[#064E3B] border-b border-[#D6B56D] pb-1 hover:text-[#745B1C] transition-colors"
              >
                <span>Read Our Story & Philosophy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED DESTINATIONS */}
      <section className="py-20 bg-[#F4F4F0] border-y border-[#064E3B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#745B1C] font-semibold">
                Curated Geography
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#064E3B] mt-2">
                Featured Sanctuaries
              </h2>
            </div>
            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-[#064E3B] hover:text-[#745B1C]"
            >
              <span>View Full Directory ({publishedDestinations.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Region Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {regions.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setActiveRegionFilter(region)}
                className={`px-4 py-2 text-[11px] uppercase tracking-[0.16em] font-medium transition-colors cursor-pointer ${
                  activeRegionFilter === region
                    ? 'bg-[#064E3B] text-[#FAF9F5]'
                    : 'bg-white text-[#404944] border border-[#064E3B]/15 hover:border-[#064E3B]'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDestinations.map((dest) => (
              <Link
                key={dest.id}
                to={`/destinations/${dest.slug}`}
                className="group bg-white border border-[#064E3B]/10 overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#022C22]/85 text-[#D6B56D] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-semibold">
                    {dest.bestSeason}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#FAF9F5]/90 text-[#18231F] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]">
                    {dest.elevation}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#745B1C] font-semibold">
                      {dest.region}
                    </p>
                    <h3 className="font-serif text-xl text-[#064E3B] mt-1 group-hover:text-[#0F766E] transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-[#404944] mt-2 line-clamp-3 leading-relaxed">
                      {dest.summary}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#064E3B]/10 flex items-center justify-between text-[11px] uppercase tracking-[0.15em] text-[#064E3B] font-semibold">
                    <span>Explore Sanctuary</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SIGNATURE EXPERIENCES */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#745B1C] font-semibold">
              Experiential Realms
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#064E3B] mt-2">
              Signature Encounters
            </h2>
          </div>
          <Link
            to="/experiences"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-[#064E3B] hover:text-[#745B1C]"
          >
            <span>Explore All Experiences</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {publishedExperiences.map((exp) => (
            <Link
              key={exp.id}
              to={`/experiences/${exp.slug}`}
              className="group relative aspect-[3/4] overflow-hidden bg-[#022C22]"
            >
              <ImageWithFallback
                src={exp.heroImage}
                alt={exp.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#022C22] via-[#022C22]/30 to-transparent" />
              <div className="absolute top-4 left-4 bg-[#FAF9F5]/90 text-[#064E3B] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-semibold">
                {exp.duration}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D6B56D] font-semibold block">
                  {exp.realmCategory}
                </span>
                <h3 className="font-serif text-xl text-[#FAF9F5] leading-snug">
                  {exp.title}
                </h3>
                <p className="text-xs text-[#FAF9F5]/75 line-clamp-2">{exp.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. FEATURED TOUR PACKAGES */}
      <section className="py-20 bg-[#F0E9DC]/60 border-y border-[#064E3B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#745B1C] font-semibold">
                Curated Multi-Day Routes
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#064E3B] mt-2">
                Signature Tour Packages
              </h2>
            </div>
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-[#064E3B]"
            >
              <span>Compare All Circuits</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            {publishedPackages.map((pkg, idx) => (
              <div
                key={pkg.id}
                className={`bg-white border border-[#064E3B]/12 flex flex-col justify-between overflow-hidden hover:shadow-xl transition-all ${
                  idx === 0 ? 'lg:col-span-2 lg:grid lg:grid-cols-2' : ''
                }`}
              >
                <div className={`relative overflow-hidden ${idx === 0 ? 'h-full min-h-[280px]' : 'aspect-[16/10]'}`}>
                  <ImageWithFallback
                    src={pkg.heroImage}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#022C22]/90 text-[#D6B56D] px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold">
                    {pkg.durationLabel}
                  </div>
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.18em] text-[#745B1C] font-semibold">
                      <span>{pkg.category}</span>
                      <span>{pkg.seasonWindow}</span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#064E3B]">
                      {pkg.title}
                    </h3>
                    <p className="text-sm text-[#404944] leading-relaxed">{pkg.summary}</p>
                  </div>
                  <div className="pt-4 border-t border-[#064E3B]/10 space-y-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.16em] text-[#7B847F] block">
                          Sample Indicative Tariff
                        </span>
                        <span className="font-serif text-2xl text-[#064E3B]">
                          ${pkg.indicativePriceUsd.toLocaleString()}
                        </span>
                        <span className="text-xs text-[#7B847F]"> / guest</span>
                      </div>
                      <Link
                        to={`/packages/${pkg.slug}`}
                        className="inline-flex items-center gap-2 bg-[#064E3B] hover:bg-[#022C22] text-[#FAF9F5] px-4 py-2.5 text-[11px] uppercase tracking-[0.16em] font-semibold transition-colors"
                      >
                        <span>View Dossier</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE AVENTRA */}
      <section className="py-20 sm:py-24 bg-[#022C22] text-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#D6B56D] font-semibold">
              The AVENTRA Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#FAF9F5] mt-2">
              Why Travel With AVENTRA
            </h2>
            <p className="text-sm sm:text-base text-[#FAF9F5]/75 mt-3 leading-relaxed">
              Designed around private access, local geographical mastery, and calm personal service at every island crossing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Compass,
                title: '100% Bespoke Routing',
                body: 'No fixed group departures. Every route is sketched from scratch around your arrival dates and passions.',
              },
              {
                icon: Sun,
                title: 'Dual-Monsoon Precision',
                body: 'We match regions to island microclimates—pairing sunny coasts with dry highland or eastern windows.',
              },
              {
                icon: ShieldCheck,
                title: 'Dedicated Chauffeur-Guides',
                body: 'Travel in private air-conditioned comfort with vetted English-speaking driver-guides.',
              },
              {
                icon: HeartHandshake,
                title: 'Ethical Wildlife Pledge',
                body: 'Zero captive elephant riding or intrusive wildlife chasing—prioritizing conservation habitats.',
              },
              {
                icon: Feather,
                title: 'Architectural Sanctuaries',
                body: 'Intimate bungalows, water villas, and heritage forts chosen for warmth, quietness, and craft.',
              },
              {
                icon: Globe,
                title: 'Seamless Island Logistics',
                body: 'From scenic train tickets to safari permits and coastal transfers—coordinated quietly behind the scenes.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-[#064E3B]/35 border border-[#D6B56D]/20 p-7 space-y-3"
                >
                  <Icon className="w-6 h-6 text-[#D6B56D]" />
                  <h3 className="font-serif text-xl text-[#FAF9F5]">{item.title}</h3>
                  <p className="text-sm text-[#FAF9F5]/75 leading-relaxed">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. ONE ISLAND. ENDLESS WONDERS. */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={STITCH_IMAGES.oneIslandBanner}
            alt="Sri Lanka misty highlands to southern shoreline panorama"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#022C22]/70" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center text-[#FAF9F5] space-y-6">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#D6B56D] font-semibold">
            Five Microclimates • One Island
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl leading-tight">
            One Island. Endless Wonders.
          </h2>
          <p className="text-base sm:text-lg text-[#FAF9F5]/85 max-w-2xl mx-auto font-light leading-relaxed">
            Breakfast among cool cloud-forest tea slopes, afternoon passes through ancient rock kingdoms, and twilight beside warm Indian Ocean waves—all within a compact island sanctuary.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/destinations"
              className="bg-[#D6B56D] hover:bg-[#e4c279] text-[#18231F] px-7 py-3.5 text-xs uppercase tracking-[0.18em] font-semibold"
            >
              Explore Regional Microclimates
            </Link>
            <Link
              to="/experiences"
              className="border border-[#FAF9F5]/45 hover:border-[#D6B56D] text-[#FAF9F5] px-7 py-3.5 text-xs uppercase tracking-[0.18em]"
            >
              Discover 8 Experiential Realms
            </Link>
          </div>
        </div>
      </section>

      {/* 8. TRAVEL JOURNAL PREVIEW */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#745B1C] font-semibold">
              Editorial Dispatches
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#064E3B] mt-2">
              The Ceylon Travel Journal
            </h2>
          </div>
          <Link
            to="/journal"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-[#064E3B]"
          >
            <span>Read All Stories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {publishedPosts.map((post) => (
            <Link
              key={post.id}
              to={`/journal/${post.slug}`}
              className="group bg-white border border-[#064E3B]/10 overflow-hidden flex flex-col hover:shadow-lg transition-all"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <ImageWithFallback
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[#745B1C] font-semibold">
                    <span>{post.category}</span>
                    <span>{post.readTimeMinutes} Min Read</span>
                  </div>
                  <h3 className="font-serif text-xl text-[#064E3B] leading-snug group-hover:text-[#0F766E]">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#404944] line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#064E3B] inline-flex items-center gap-1.5 pt-2">
                  <span>Read Dispatch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="py-20 bg-[#F4F4F0] border-t border-[#064E3B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#745B1C] font-semibold">
              Traveler Reflections (Editable Sample Stories)
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#064E3B] mt-2">
              Notes From Past Voyages
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publishedTestimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#064E3B]/10 p-7 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex gap-1 text-[#D6B56D]">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D6B56D]" />
                    ))}
                  </div>
                  <p className="font-serif text-lg italic text-[#18231F] leading-relaxed">
                    “{item.quote}”
                  </p>
                </div>
                <div className="pt-4 border-t border-[#064E3B]/10">
                  <p className="text-sm font-semibold text-[#064E3B]">{item.guestName}</p>
                  <p className="text-xs text-[#7B847F]">
                    {item.guestOrigin} • {item.journeyTitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FINAL JOURNEY-PLANNING CTA */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={STITCH_IMAGES.finalSunsetCta}
            alt="Sunset Indian Ocean coast in Sri Lanka"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#022C22]/75" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-[#FAF9F5] space-y-6">
          <Sparkles className="w-6 h-6 text-[#D6B56D] mx-auto" />
          <h2 className="font-serif text-4xl sm:text-6xl leading-tight">
            Ready to Compose Your Sri Lankan Passage?
          </h2>
          <p className="text-base text-[#FAF9F5]/80 max-w-2xl mx-auto leading-relaxed">
            Share your preferred dates, pace, and inspirations. Our concierge team will respond with a tailored bespoke itinerary proposal.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-3">
            <Link
              to="/plan-your-journey"
              className="bg-[#D6B56D] hover:bg-[#e4c279] text-[#18231F] px-8 py-4 text-xs uppercase tracking-[0.18em] font-semibold inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Start Journey Formulation</span>
            </Link>
            <Link
              to="/contact"
              className="border border-[#FAF9F5]/40 hover:border-[#D6B56D] text-[#FAF9F5] px-8 py-4 text-xs uppercase tracking-[0.18em] inline-flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Speak With Concierge</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
