import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Compass, MapPin } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export const ExperienceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { experiences } = useData();
  const exp = experiences.find((e) => e.slug === slug && e.isPublished);

  if (!exp) {
    return (
      <div className="pt-32 pb-24 max-w-3xl mx-auto px-4 text-center space-y-4">
        <h1 className="font-serif text-4xl text-[#064E3B]">Experience Not Found</h1>
        <Link
          to="/experiences"
          className="inline-flex items-center gap-2 bg-[#064E3B] text-white px-6 py-3 text-xs uppercase tracking-[0.16em]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Experiences</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-[#FAF9F5] text-[#18231F]">
      <section className="relative h-[58vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0">
          <ImageWithFallback src={exp.heroImage} alt={exp.title} priority className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#022C22]/90 via-[#022C22]/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full text-[#FAF9F5] space-y-3">
          <Link
            to="/experiences"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D6B56D]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Experiences</span>
          </Link>
          <span className="block text-[11px] uppercase tracking-[0.22em] text-[#D6B56D] font-semibold">
            {exp.realmCategory}
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl max-w-4xl leading-tight">{exp.title}</h1>
        </div>
      </section>

      <section className="bg-[#022C22] text-[#FAF9F5] border-y border-[#D6B56D]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-[#D6B56D]" />
            <div>
              <span className="text-[10px] uppercase text-[#FAF9F5]/60 block">Setting</span>
              <span className="font-semibold">{exp.region}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-[#D6B56D]" />
            <div>
              <span className="text-[10px] uppercase text-[#FAF9F5]/60 block">Duration</span>
              <span className="font-semibold">{exp.duration}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Compass className="w-4 h-4 text-[#D6B56D]" />
            <div>
              <span className="text-[10px] uppercase text-[#FAF9F5]/60 block">Format</span>
              <span className="font-semibold">{exp.equipmentOrSetting}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-serif text-3xl text-[#064E3B]">Encounter Overview</h2>
          <p className="text-base text-[#404944] leading-relaxed whitespace-pre-line">
            {exp.description}
          </p>
          {exp.fieldNote && (
            <blockquote className="bg-white border-l-4 border-[#D6B56D] p-6 space-y-2 shadow-xs">
              <p className="font-serif italic text-lg text-[#064E3B]">“{exp.fieldNote}”</p>
              {exp.fieldNoteAuthor && (
                <footer className="text-xs uppercase tracking-wider text-[#7B847F]">
                  — {exp.fieldNoteAuthor}
                </footer>
              )}
            </blockquote>
          )}
        </div>

        <aside className="lg:col-span-5">
          <div className="bg-white border border-[#064E3B]/12 p-7 space-y-5 shadow-xs">
            <h3 className="font-serif text-2xl text-[#064E3B]">What Makes This Singular</h3>
            <ul className="space-y-3">
              {(exp.highlights || []).map((hl, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#404944]">
                  <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
            <Link
              to={`/plan-your-journey?experience=${encodeURIComponent(exp.title)}`}
              className="w-full bg-[#064E3B] hover:bg-[#022C22] text-[#FAF9F5] py-3.5 px-5 text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Include This Experience</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
};
