import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export const PackagesPage: React.FC = () => {
  const { tourPackages } = useData();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const published = useMemo(() => tourPackages.filter((p) => p.isPublished), [tourPackages]);
  const categories = ['All', ...Array.from(new Set(published.map((p) => p.category)))];

  const filtered = useMemo(() => {
    return published.filter((p) => {
      const catOk = category === 'All' || p.category === category;
      const searchOk =
        !search.trim() ||
        `${p.title} ${p.subtitle} ${p.summary} ${p.category}`
          .toLowerCase()
          .includes(search.toLowerCase());
      return catOk && searchOk;
    });
  }, [published, category, search]);

  return (
    <div className="pt-20 bg-[#FAF9F5] text-[#18231F]">
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#064E3B]/10">
        <span className="text-[11px] uppercase tracking-[0.26em] text-[#745B1C] font-semibold">
          Signature Tour Packages • Blueprint Itineraries
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#064E3B] mt-3 max-w-4xl leading-tight">
          Curated Sri Lankan Expeditions.
        </h1>
        <p className="text-base text-[#404944] max-w-2xl mt-4 leading-relaxed">
          Explore our sample bespoke circuits across ancient citadels, tea highlands, and coastal sanctuaries. Every itinerary adapts effortlessly to your preferred dates and sanctuary tier.
        </p>

        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-semibold cursor-pointer transition-colors ${
                  category === cat
                    ? 'bg-[#064E3B] text-[#FAF9F5]'
                    : 'bg-white border border-[#064E3B]/15 text-[#404944] hover:border-[#064E3B]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#7B847F] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter circuits..."
              className="w-full bg-white border border-[#064E3B]/15 pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#064E3B]"
            />
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filtered.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white border border-[#064E3B]/12 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <ImageWithFallback
                    src={pkg.heroImage}
                    alt={pkg.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-[#022C22]/90 text-[#D6B56D] px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold">
                    {pkg.category}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-[#FAF9F5]/95 text-[#064E3B] px-3 py-1 text-xs font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{pkg.durationLabel}</span>
                  </div>
                </div>
                <div className="p-7 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#745B1C] font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{pkg.seasonWindow}</span>
                  </div>
                  <h2 className="font-serif text-3xl text-[#064E3B]">{pkg.title}</h2>
                  <p className="text-sm text-[#404944] leading-relaxed">{pkg.summary}</p>
                  <ul className="space-y-1.5 pt-2">
                    {(pkg.highlights || []).slice(0, 3).map((hl, idx) => (
                      <li key={idx} className="text-xs text-[#18231F] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D6B56D]" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-7 py-5 bg-[#FAF9F5] border-t border-[#064E3B]/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#7B847F] block">
                    Sample Indicative Tariff
                  </span>
                  <span className="font-serif text-2xl text-[#064E3B]">
                    ${pkg.indicativePriceUsd.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#7B847F]"> / guest</span>
                </div>
                <div className="flex gap-2.5">
                  <Link
                    to={`/packages/${pkg.slug}`}
                    className="bg-[#064E3B] hover:bg-[#022C22] text-white px-5 py-2.5 text-[11px] uppercase tracking-[0.16em] font-semibold inline-flex items-center gap-1.5"
                  >
                    <span>Explore Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
