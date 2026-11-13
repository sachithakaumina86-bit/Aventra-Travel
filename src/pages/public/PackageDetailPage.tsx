import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  MapPin,
  XCircle,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export const PackageDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { tourPackages } = useData();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  const pkg = tourPackages.find((p) => p.slug === slug && p.isPublished);

  if (!pkg) {
    return (
      <div className="pt-32 pb-24 max-w-3xl mx-auto px-4 text-center space-y-4">
        <h1 className="font-serif text-4xl text-[#064E3B]">Itinerary Not Found</h1>
        <Link
          to="/packages"
          className="inline-flex items-center gap-2 bg-[#064E3B] text-white px-6 py-3 text-xs uppercase tracking-[0.16em]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Tour Packages</span>
        </Link>
      </div>
    );
  }

  const relatedPackages = tourPackages.filter((p) => p.isPublished && p.id !== pkg.id).slice(0, 2);
  const mosaic = pkg.mosaicImages && pkg.mosaicImages.length >= 3 ? pkg.mosaicImages : [pkg.heroImage, pkg.heroImage, pkg.heroImage];

  return (
    <div className="pt-20 bg-[#FAF9F5] text-[#18231F]">
      {/* Asymmetric 3-Photo Mosaic Hero (Faithful to Stitch Ceylon Discovery) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#745B1C] font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Curated Packages</span>
          </Link>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#064E3B] bg-[#F4F4F0] px-3 py-1 border border-[#064E3B]/10">
            {pkg.category}
          </span>
        </div>

        <div className="space-y-3 max-w-4xl">
          <h1 className="font-serif text-4xl sm:text-6xl text-[#064E3B] leading-tight">
            {pkg.title}
          </h1>
          <p className="text-base sm:text-lg text-[#404944] leading-relaxed">{pkg.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
          <div className="md:col-span-7 aspect-[16/10] overflow-hidden">
            <ImageWithFallback src={mosaic[0]} alt={pkg.title} className="w-full h-full object-cover" />
          </div>
          <div className="md:col-span-5 grid grid-rows-2 gap-4">
            <div className="overflow-hidden aspect-[16/9] md:aspect-auto">
              <ImageWithFallback src={mosaic[1]} alt={`${pkg.title} preview 2`} className="w-full h-full object-cover" />
            </div>
            <div className="overflow-hidden aspect-[16/9] md:aspect-auto">
              <ImageWithFallback src={mosaic[2]} alt={`${pkg.title} preview 3`} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="bg-[#022C22] text-[#FAF9F5] border-y border-[#D6B56D]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-[#D6B56D]" />
            <div>
              <span className="text-[10px] uppercase text-[#FAF9F5]/60 block">Duration</span>
              <span className="font-semibold">{pkg.durationLabel}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-[#D6B56D]" />
            <div>
              <span className="text-[10px] uppercase text-[#FAF9F5]/60 block">Season Window</span>
              <span className="font-semibold">{pkg.seasonWindow}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Compass className="w-4 h-4 text-[#D6B56D]" />
            <div>
              <span className="text-[10px] uppercase text-[#FAF9F5]/60 block">Pacing</span>
              <span className="font-semibold">Private Chauffeur-Guided</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-[#D6B56D]" />
            <div>
              <span className="text-[10px] uppercase text-[#FAF9F5]/60 block">Sample Tariff</span>
              <span className="font-semibold text-[#D6B56D]">
                ${pkg.indicativePriceUsd.toLocaleString()} / guest
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Section Anchor Bar */}
      <nav className="sticky top-20 z-30 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#064E3B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 overflow-x-auto no-scrollbar text-[11px] uppercase tracking-[0.18em] font-semibold">
          {[
            { href: '#overview', label: 'Overview' },
            { href: '#itinerary', label: `${pkg.durationDays}-Day Itinerary` },
            { href: '#sanctuaries', label: 'Sanctuaries' },
            { href: '#inclusions', label: 'Inclusions' },
            { href: '#dossier', label: 'Travel Dossier' },
          ].map((tab) => (
            <a
              key={tab.href}
              href={tab.href}
              className="py-4 text-[#404944] hover:text-[#064E3B] border-b-2 border-transparent hover:border-[#D6B56D] whitespace-nowrap"
            >
              {tab.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Main Content + Sticky Reservation Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-16">
          {/* Overview */}
          <section id="overview" className="space-y-6 scroll-mt-36">
            <span className="text-[11px] uppercase tracking-[0.24em] text-[#745B1C] font-semibold">
              Editorial Synopsis
            </span>
            {pkg.overviewQuote && (
              <blockquote className="font-serif italic text-2xl sm:text-3xl text-[#064E3B] border-l-4 border-[#D6B56D] pl-6 leading-snug">
                “{pkg.overviewQuote}”
              </blockquote>
            )}
            <p className="text-base text-[#404944] leading-relaxed whitespace-pre-line">
              {pkg.overviewNarrative}
            </p>
            <div className="bg-white border border-[#064E3B]/10 p-6 space-y-3">
              <h3 className="font-serif text-xl text-[#064E3B]">Expedition Highlights</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(pkg.highlights || []).map((hl, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-[#404944]">
                    <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Day-by-Day Timeline */}
          <section id="itinerary" className="space-y-6 scroll-mt-36">
            <div>
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#745B1C] font-semibold">
                Day-by-Day Passage
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#064E3B] mt-1">
                {pkg.durationDays}-Day Curated Timeline
              </h2>
            </div>

            <div className="space-y-3">
              {(pkg.itineraryDays || []).map((day) => {
                const isOpen = expandedDay === day.dayNumber;
                return (
                  <div key={day.dayNumber} className="bg-white border border-[#064E3B]/12">
                    <button
                      type="button"
                      onClick={() => setExpandedDay(isOpen ? null : day.dayNumber)}
                      className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <span className="bg-[#064E3B] text-[#D6B56D] font-serif text-sm px-3 py-1 font-semibold shrink-0">
                          Day {String(day.dayNumber).padStart(2, '0')}
                        </span>
                        <div>
                          <h3 className="font-serif text-xl text-[#064E3B]">{day.title}</h3>
                          <p className="text-xs text-[#7B847F]">
                            {day.location} {day.sanctuary ? `• ${day.sanctuary}` : ''}
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-[#064E3B] transition-transform shrink-0 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 pt-3 border-t border-[#064E3B]/10 space-y-4">
                        <p className="text-sm text-[#404944] leading-relaxed">{day.description}</p>
                        {(day.highlights || []).length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {day.highlights.map((h, i) => (
                              <span
                                key={i}
                                className="bg-[#F4F4F0] text-[#064E3B] text-[11px] px-3 py-1"
                              >
                                {h}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Sanctuaries */}
          {(pkg.sanctuaries || []).length > 0 && (
            <section id="sanctuaries" className="space-y-6 scroll-mt-36">
              <div>
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#745B1C] font-semibold">
                  Sample Boutique Properties
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#064E3B] mt-1">
                  Curated Sanctuaries Along the Route
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {pkg.sanctuaries.map((sanc, idx) => (
                  <div key={idx} className="bg-white border border-[#064E3B]/12 overflow-hidden">
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <ImageWithFallback
                        src={sanc.imageUrl}
                        alt={sanc.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-[#022C22]/90 text-[#D6B56D] px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold">
                        {sanc.nightsLabel}
                      </div>
                    </div>
                    <div className="p-5 space-y-1.5">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#745B1C] font-semibold">
                        {sanc.region} • {sanc.suiteType}
                      </p>
                      <h3 className="font-serif text-xl text-[#064E3B]">{sanc.name}</h3>
                      <p className="text-xs text-[#404944] leading-relaxed">{sanc.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Inclusions & Exclusions */}
          <section id="inclusions" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-36">
            <div className="bg-white border border-[#064E3B]/12 p-7 space-y-4">
              <h3 className="font-serif text-2xl text-[#064E3B]">Included Provisions</h3>
              <ul className="space-y-2.5">
                {(pkg.inclusions || []).map((inc, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#404944]">
                    <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#F4F4F0] border border-[#064E3B]/12 p-7 space-y-4">
              <h3 className="font-serif text-2xl text-[#064E3B]">Not Included</h3>
              <ul className="space-y-2.5">
                {(pkg.exclusions || []).map((exc, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#404944]">
                    <XCircle className="w-4 h-4 text-[#7B847F] shrink-0 mt-0.5" />
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* FAQs */}
          {(pkg.faqs || []).length > 0 && (
            <section id="dossier" className="space-y-5 scroll-mt-36">
              <h2 className="font-serif text-3xl text-[#064E3B]">Travel Dossier & FAQs</h2>
              <div className="space-y-3">
                {pkg.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white border border-[#064E3B]/12">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="font-serif text-lg text-[#064E3B]">{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#064E3B] transition-transform shrink-0 ${
                          openFaq === idx ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="px-6 pb-5 pt-2 text-sm text-[#404944] border-t border-[#064E3B]/10">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sticky Reservation Sidebar */}
        <aside className="lg:col-span-4">
          <div className="sticky top-36 bg-[#022C22] text-[#FAF9F5] p-8 border border-[#D6B56D]/30 shadow-xl space-y-6">
            <div className="space-y-2 border-b border-[#FAF9F5]/15 pb-5">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#D6B56D] font-semibold">
                Private Commission Blueprint
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-4xl text-[#FAF9F5]">
                  ${pkg.indicativePriceUsd.toLocaleString()}
                </span>
                <span className="text-xs text-[#FAF9F5]/70">USD / guest (sample)</span>
              </div>
              <p className="text-[11px] text-[#FAF9F5]/70 leading-relaxed">{pkg.priceDisclaimer}</p>
            </div>

            <div className="space-y-3 text-xs text-[#FAF9F5]/85">
              <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]/10">
                <span className="text-[#FAF9F5]/60">Duration</span>
                <span className="font-medium">{pkg.durationLabel}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]/10">
                <span className="text-[#FAF9F5]/60">Season Window</span>
                <span className="font-medium">{pkg.seasonWindow}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#FAF9F5]/60">Modifications</span>
                <span className="font-medium text-[#D6B56D]">100% Customizable</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                to={`/plan-your-journey?package=${encodeURIComponent(pkg.title)}`}
                className="w-full bg-[#D6B56D] hover:bg-[#e4c279] text-[#18231F] py-3.5 px-5 text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Request Custom Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="w-full border border-[#FAF9F5]/30 hover:border-[#D6B56D] text-[#FAF9F5] py-3 px-5 text-xs uppercase tracking-[0.18em] text-center block"
              >
                Ask a Question First
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Related Expeditions */}
      {relatedPackages.length > 0 && (
        <section className="py-16 bg-[#F4F4F0] border-t border-[#064E3B]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <h2 className="font-serif text-3xl text-[#064E3B]">Explore Related Expeditions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPackages.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/packages/${rel.slug}`}
                  className="bg-white border border-[#064E3B]/10 flex flex-col sm:flex-row overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="sm:w-48 aspect-[4/3] sm:aspect-auto shrink-0">
                    <ImageWithFallback
                      src={rel.heroImage}
                      alt={rel.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#745B1C] font-semibold">
                      {rel.durationLabel}
                    </span>
                    <h3 className="font-serif text-2xl text-[#064E3B]">{rel.title}</h3>
                    <p className="text-xs text-[#404944] line-clamp-2">{rel.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
