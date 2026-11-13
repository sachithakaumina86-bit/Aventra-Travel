import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2, Compass, MapPin, Mountain } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { destinations, experiences, tourPackages } = useData();

  const destination = destinations.find((d) => d.slug === slug && d.isPublished);

  if (!destination) {
    return (
      <div className="pt-32 pb-24 max-w-3xl mx-auto px-4 text-center space-y-4">
        <h1 className="font-serif text-4xl text-[#064E3B]">Sanctuary Not Found</h1>
        <p className="text-sm text-[#404944]">
          The destination you requested is unavailable or currently drafted in curation.
        </p>
        <Link
          to="/destinations"
          className="inline-flex items-center gap-2 bg-[#064E3B] text-white px-6 py-3 text-xs uppercase tracking-[0.16em] font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Destinations</span>
        </Link>
      </div>
    );
  }

  const relatedPackages = tourPackages.filter((p) => p.isPublished).slice(0, 2);
  const relatedExperiences = experiences.filter((e) => e.isPublished).slice(0, 3);

  return (
    <div className="pt-20 bg-[#FAF9F5] text-[#18231F]">
      {/* Hero */}
      <section className="relative h-[62vh] min-h-[420px] flex items-end">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#022C22]/90 via-[#022C22]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full text-[#FAF9F5] space-y-4">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D6B56D] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Destinations Directory</span>
          </Link>
          <h1 className="font-serif text-4xl sm:text-6xl leading-tight">{destination.name}</h1>
          <p className="text-base sm:text-lg text-[#FAF9F5]/85 max-w-2xl">{destination.tagline}</p>
        </div>
      </section>

      {/* Telemetry Ribbon */}
      <section className="bg-[#022C22] text-[#FAF9F5] border-y border-[#D6B56D]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-[#D6B56D] shrink-0" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#FAF9F5]/60 block">Region</span>
              <span className="font-semibold">{destination.region}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mountain className="w-4 h-4 text-[#D6B56D] shrink-0" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#FAF9F5]/60 block">Elevation</span>
              <span className="font-semibold">{destination.elevation}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-[#D6B56D] shrink-0" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#FAF9F5]/60 block">Best Season</span>
              <span className="font-semibold">{destination.bestSeason}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Compass className="w-4 h-4 text-[#D6B56D] shrink-0" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#FAF9F5]/60 block">Microclimate</span>
              <span className="font-semibold">{destination.microclimate}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Overview & Highlights */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#745B1C] font-semibold">
            Sanctuary Narrative
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#064E3B]">
            The Rhythm of {destination.name}
          </h2>
          <p className="text-base text-[#404944] leading-relaxed whitespace-pre-line">
            {destination.description}
          </p>

          {(destination.galleryImages || []).length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {destination.galleryImages.map((imgUrl, idx) => (
                <div key={idx} className="aspect-[16/10] overflow-hidden border border-[#064E3B]/10">
                  <ImageWithFallback
                    src={imgUrl}
                    alt={`${destination.name} gallery ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#064E3B]/12 p-7 space-y-5 shadow-xs sticky top-28">
            <h3 className="font-serif text-2xl text-[#064E3B]">Curated Highlights</h3>
            <ul className="space-y-3">
              {(destination.highlights || []).map((hl, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-[#404944]">
                  <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-[#064E3B]/10 space-y-3">
              {destination.startingRateUsd > 0 && (
                <p className="text-xs text-[#7B847F]">
                  Indicative sanctuary nightly tier from{' '}
                  <strong className="text-[#064E3B] font-serif text-base">
                    ${destination.startingRateUsd.toLocaleString()}
                  </strong>{' '}
                  <span className="text-[11px]">(sample guide, customizable)</span>
                </p>
              )}
              <Link
                to={`/plan-your-journey?destination=${encodeURIComponent(destination.name)}`}
                className="w-full bg-[#064E3B] hover:bg-[#022C22] text-[#FAF9F5] py-3.5 px-5 text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Include {destination.name.split('&')[0].trim()} in My Journey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </aside>
      </section>

      {/* Related Experiences & Packages */}
      <section className="py-16 bg-[#F4F4F0] border-t border-[#064E3B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-3xl text-[#064E3B]">Pair With Signature Experiences</h2>
            <Link to="/experiences" className="text-xs uppercase tracking-[0.16em] text-[#064E3B] font-semibold">
              All Realms →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedExperiences.map((exp) => (
              <Link
                key={exp.id}
                to={`/experiences/${exp.slug}`}
                className="bg-white border border-[#064E3B]/10 overflow-hidden group hover:shadow-md transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <ImageWithFallback
                    src={exp.heroImage}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 space-y-1.5">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#745B1C] font-semibold">
                    {exp.realmCategory}
                  </span>
                  <h3 className="font-serif text-xl text-[#064E3B]">{exp.title}</h3>
                </div>
              </Link>
            ))}
          </div>

          {relatedPackages.length > 0 && (
            <div className="pt-6 border-t border-[#064E3B]/10 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-[#404944]">
                Featured Itinerary: <strong className="text-[#064E3B]">{relatedPackages[0].title}</strong> ({relatedPackages[0].durationLabel})
              </p>
              <Link
                to={`/packages/${relatedPackages[0].slug}`}
                className="text-xs uppercase tracking-[0.16em] font-semibold text-[#064E3B] hover:text-[#745B1C]"
              >
                View Full Itinerary Dossier →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
