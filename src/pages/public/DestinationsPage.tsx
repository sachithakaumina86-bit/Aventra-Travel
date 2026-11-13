import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, MapPin, Search, Sun } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export const DestinationsPage: React.FC = () => {
  const { destinations } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedSeason, setSelectedSeason] = useState('All Seasons');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const published = useMemo(
    () => destinations.filter((d) => d.isPublished),
    [destinations]
  );

  const regions = ['All Regions', ...Array.from(new Set(published.map((d) => d.region)))];
  const allTags = Array.from(new Set(published.flatMap((d) => d.tags || []))).slice(0, 8);

  const filtered = useMemo(() => {
    return published.filter((d) => {
      const matchesSearch =
        !searchTerm.trim() ||
        `${d.name} ${d.region} ${d.tagline} ${d.summary}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesRegion = selectedRegion === 'All Regions' || d.region === selectedRegion;
      const matchesSeason =
        selectedSeason === 'All Seasons' ||
        (selectedSeason === 'Winter Sun (Nov–Apr)' &&
          /nov|dec|jan|feb|mar|apr/i.test(d.bestSeason)) ||
        (selectedSeason === 'Summer Sun (May–Oct)' && /may|jun|jul|aug|sep|oct/i.test(d.bestSeason));
      const matchesTag = !activeTag || (d.tags || []).includes(activeTag);
      return matchesSearch && matchesRegion && matchesSeason && matchesTag;
    });
  }, [published, searchTerm, selectedRegion, selectedSeason, activeTag]);

  return (
    <div className="pt-20 bg-[#FAF9F5] text-[#18231F]">
      {/* Editorial Header */}
      <section className="py-16 sm:py-24 border-b border-[#064E3B]/10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-[11px] uppercase tracking-[0.26em] text-[#745B1C] font-semibold">
          The Ceylon Expedition Archive • Destinations Directory
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#064E3B] mt-3 max-w-4xl leading-tight">
          Curated Sanctuaries & Sacred Lands across Sri Lanka.
        </h1>
        <p className="text-base sm:text-lg text-[#404944] max-w-3xl mt-4 leading-relaxed">
          From mist-draped ancestral tea estates and 5th-century rock citadels to tranquil southern coves and leopard-rich coastal wilderness—explore AVENTRA’s curated sanctuaries.
        </p>

        {/* Search & Filters */}
        <div className="mt-10 bg-white border border-[#064E3B]/12 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-[#7B847F] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Sigiriya, Ella, Galle Fort..."
                className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#064E3B]"
              />
            </div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-[#FAF9F5] border border-[#064E3B]/15 px-4 py-2.5 text-sm focus:outline-none focus:border-[#064E3B]"
            >
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="bg-[#FAF9F5] border border-[#064E3B]/15 px-4 py-2.5 text-sm focus:outline-none focus:border-[#064E3B]"
            >
              <option>All Seasons</option>
              <option>Winter Sun (Nov–Apr)</option>
              <option>Summer Sun (May–Oct)</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#064E3B]/10">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#7B847F] mr-2">
              Filters:
            </span>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag((prev) => (prev === tag ? null : tag))}
                className={`px-3 py-1 text-[10px] uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                  activeTag === tag
                    ? 'bg-[#064E3B] text-[#FAF9F5]'
                    : 'bg-[#F4F4F0] text-[#404944] hover:bg-[#E9E8E4]'
                }`}
              >
                {tag}
              </button>
            ))}
            {(searchTerm || selectedRegion !== 'All Regions' || selectedSeason !== 'All Seasons' || activeTag) && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRegion('All Regions');
                  setSelectedSeason('All Seasons');
                  setActiveTag(null);
                }}
                className="ml-auto text-[11px] uppercase tracking-[0.14em] text-[#BA1A1A] font-semibold cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Five Distinct Microclimates */}
      <section className="py-16 bg-[#F4F4F0] border-b border-[#064E3B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#745B1C] font-semibold">
                Regional Geographies
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#064E3B] mt-1">
                Sri Lanka’s Five Distinct Microclimates
              </h2>
            </div>
            <p className="text-xs text-[#7B847F]">
              Traverse sea-level maritime ramparts to 2,000-meter cloud forests in under four hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[#064E3B]/12 p-7 space-y-4">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#745B1C] font-semibold">
                <span>Territory 01 • North-Central Plains</span>
                <span>Ancient Royal Realm</span>
              </div>
              <h3 className="font-serif text-3xl text-[#064E3B]">The Cultural Triangle</h3>
              <p className="text-sm text-[#404944] leading-relaxed">
                Sigiriya, Dambulla & Polonnaruwa. Sandstone monoliths, mirror-calm monastic reservoirs, and centuries-old frescoes nestled amid forest lakes.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-[#064E3B]/10 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-[#7B847F] block">Elevation</span>
                  <span className="font-semibold text-[#064E3B]">150m – 350m</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#7B847F] block">Optimal Sun</span>
                  <span className="font-semibold text-[#064E3B]">Dec – Apr</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#7B847F] block">Focus</span>
                  <span className="font-semibold text-[#064E3B]">Water Villas</span>
                </div>
              </div>
            </div>

            <div className="bg-[#022C22] text-[#FAF9F5] p-7 space-y-4">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#D6B56D] font-semibold">
                <span>Territory 02 • Hill Country</span>
                <span>Cool Tea Country</span>
              </div>
              <h3 className="font-serif text-3xl text-[#FAF9F5]">The Central Highlands</h3>
              <p className="text-sm text-[#FAF9F5]/80 leading-relaxed">
                Kandy, Hatton, Nuwara Eliya, Ella & Horton Plains. High tea on mahogany planter verandas, scenic railway viaducts, and misty cloud plateaus.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-[#FAF9F5]/15 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-[#D6B56D] block">Elevation</span>
                  <span className="font-semibold">1,000m – 2,100m</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#D6B56D] block">Optimal Sun</span>
                  <span className="font-semibold">Jan – May</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#D6B56D] block">Focus</span>
                  <span className="font-semibold">Tea Bungalows</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: 'Territory 03',
                name: 'The Southern Coastline',
                desc: 'Galle Fort, Weligama, Mirissa & Tangalle. Living ramparts, private ocean villas, and winter blue whale horizons.',
                season: 'Peak Nov – Apr',
              },
              {
                num: 'Territory 04',
                name: 'The Wild South & Yala',
                desc: 'Yala, Kumana & Udawalawe. Coastal scrub forests renowned for leopard corridors and wild elephant herds.',
                season: 'Peak Feb – Jul',
              },
              {
                num: 'Territory 05',
                name: 'Untamed East Coast',
                desc: 'Trincomalee, Passikudah & Arugam Bay. Calm sapphire bays, coral snorkeling, and summer sunshine.',
                season: 'Peak May – Sep',
              },
            ].map((t) => (
              <div key={t.num} className="bg-white border border-[#064E3B]/10 p-6 space-y-2.5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#745B1C] font-semibold">
                  {t.num}
                </span>
                <h4 className="font-serif text-xl text-[#064E3B]">{t.name}</h4>
                <p className="text-xs text-[#404944] leading-relaxed">{t.desc}</p>
                <p className="text-[11px] font-semibold text-[#064E3B] pt-1">{t.season}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premier Sanctuary Directory */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#745B1C] font-semibold">
              Hand-Selected Portfolios
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#064E3B] mt-1">
              The Premier Sanctuary Directory
            </h2>
          </div>
          <p className="text-xs text-[#7B847F]">
            Showing {filtered.length} of {published.length} curated sanctuaries
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-[#064E3B]/15 p-12 text-center space-y-3">
            <Compass className="w-8 h-8 text-[#064E3B]/50 mx-auto" />
            <h3 className="font-serif text-2xl text-[#064E3B]">No Matching Sanctuaries Found</h3>
            <p className="text-sm text-[#404944]">
              Try clearing your search or selecting a different season window.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((dest) => (
              <Link
                key={dest.id}
                to={`/destinations/${dest.slug}`}
                className="group bg-white border border-[#064E3B]/12 overflow-hidden flex flex-col hover:shadow-xl transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <ImageWithFallback
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#022C22]/90 text-[#FAF9F5] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]">
                    {dest.region}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#FAF9F5]/95 text-[#064E3B] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] font-semibold">
                    {dest.elevation}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#745B1C] font-semibold">
                      Best Window: {dest.bestSeason}
                    </p>
                    <h3 className="font-serif text-2xl text-[#064E3B] mt-1">{dest.name}</h3>
                    <p className="text-xs italic text-[#7B847F] mt-0.5">{dest.tagline}</p>
                    <p className="text-sm text-[#404944] mt-3 line-clamp-3 leading-relaxed">
                      {dest.summary}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#064E3B]/10">
                    <div className="flex flex-wrap gap-1.5">
                      {(dest.tags || []).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-[#F4F4F0] text-[#404944] px-2 py-0.5 text-[10px] uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] font-semibold text-[#064E3B]">
                      <span>Explore {dest.name.split('&')[0].trim()}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Dual Monsoon Guide */}
      <section className="py-16 bg-[#F4F4F0] border-t border-[#064E3B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#745B1C] font-semibold">
                Seasonal Meteorological Wisdom
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#064E3B] mt-1">
                ‘It is always sunny somewhere on the island.’
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 bg-white border border-[#D6B56D]/50 px-4 py-2.5 text-xs text-[#064E3B] font-medium">
              <Sun className="w-4 h-4 text-[#D6B56D]" />
              <span>Dual-Monsoon Year-Round Planning</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#064E3B]/12 p-7 space-y-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#745B1C] font-semibold">
                Period 01 • November – April
              </span>
              <h3 className="font-serif text-2xl text-[#064E3B]">
                The Southwest & Central Highlands Zenith
              </h3>
              <p className="text-sm text-[#404944] leading-relaxed">
                Calm ocean horizons across Galle, Mirissa, and Tangalle paired with crisp blue mornings in Hatton tea trails, Ella ridges, and dry Yala leopard safaris.
              </p>
            </div>
            <div className="bg-white border border-[#064E3B]/12 p-7 space-y-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#745B1C] font-semibold">
                Period 02 • May – October
              </span>
              <h3 className="font-serif text-2xl text-[#064E3B]">
                The East Coast & Cultural Triangle Sanctuary
              </h3>
              <p className="text-sm text-[#404944] leading-relaxed">
                While tropical showers nourish the south, Trincomalee, Passikudah, and Arugam Bay glow with glassy turquoise seas alongside dry Cultural Triangle citadels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-[#022C22] text-[#FAF9F5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <MapPin className="w-6 h-6 text-[#D6B56D] mx-auto" />
          <h2 className="font-serif text-3xl sm:text-5xl">Can’t Decide Where Your Journey Begins?</h2>
          <p className="text-sm sm:text-base text-[#FAF9F5]/80 max-w-2xl mx-auto">
            Let our concierge curators compose a custom multi-region Sri Lankan route tailored to your exact travel dates.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to="/plan-your-journey"
              className="bg-[#D6B56D] hover:bg-[#e4c279] text-[#18231F] px-7 py-3.5 text-xs uppercase tracking-[0.18em] font-semibold"
            >
              Consult With An Island Curator
            </Link>
            <Link
              to="/packages"
              className="border border-[#FAF9F5]/35 hover:border-[#D6B56D] text-[#FAF9F5] px-7 py-3.5 text-xs uppercase tracking-[0.18em]"
            >
              Browse Curated Packages
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
