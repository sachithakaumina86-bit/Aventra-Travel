import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Leaf, ShieldCheck, Sparkles, TreePine } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ImageWithFallback } from '../../components/ImageWithFallback';

const EXPERIENCE_FAQS = [
  {
    q: 'How far in advance should private encounters be reserved?',
    a: 'For peak winter months (December–April), booking 3–6 months ahead helps secure prime tea bungalows, safari lodge suites, and observation rail passes. Off-peak bespoke planning can be coordinated on shorter notice.',
  },
  {
    q: 'Can encounters be customized for multigenerational families?',
    a: 'Yes. Walking grades, safari drive durations, private chef menus, and catamaran charters are tailored smoothly for both young explorers and older guests.',
  },
  {
    q: 'What ethical standards govern wildlife experiences?',
    a: 'AVENTRA maintains a strict zero-captivity interaction policy: no elephant riding, no unnatural wildlife feeding, and respectful vehicle spacing in national parks.',
  },
  {
    q: 'How do Sri Lanka monsoons affect outdoor and marine encounters?',
    a: 'November–April favors southern blue whale charters and highland tea treks; May–October highlights eastern snorkeling and Minneriya elephant gatherings.',
  },
];

export const ExperiencesPage: React.FC = () => {
  const { experiences } = useData();
  const [selectedCategory, setSelectedCategory] = useState('All Encounters');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const published = useMemo(() => experiences.filter((e) => e.isPublished), [experiences]);
  const categories = ['All Encounters', ...Array.from(new Set(published.map((e) => e.realmCategory)))];
  const allTags = Array.from(new Set(published.flatMap((e) => e.tags || []))).slice(0, 6);

  const spotlight = published.find((e) => e.isSpotlight) || published[0];

  const filtered = useMemo(() => {
    return published.filter((e) => {
      const catOk = selectedCategory === 'All Encounters' || e.realmCategory === selectedCategory;
      const tagOk = !selectedTag || (e.tags || []).includes(selectedTag);
      return catOk && tagOk;
    });
  }, [published, selectedCategory, selectedTag]);

  return (
    <div className="pt-20 bg-[#FAF9F5] text-[#18231F]">
      {/* Header */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#064E3B]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.26em] text-[#745B1C] font-semibold">
              The Ceylon Expedition Archive • Signature Encounters
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#064E3B] leading-tight">
              Extraordinary Encounters.{' '}
              <span className="italic font-normal">Beyond the Ordinary Horizon.</span>
            </h1>
          </div>
          <div className="lg:col-span-4 space-y-4">
            <p className="text-sm text-[#404944] leading-relaxed">
              Sri Lanka is felt through pulse, scent, and quiet timing—from dawn wildlife drives to misty tea-estate verandas. Explore AVENTRA’s curated experiential realms.
            </p>
            <div className="flex gap-6 text-xs border-t border-[#064E3B]/10 pt-4">
              <div>
                <span className="font-serif text-2xl text-[#064E3B] block">{published.length}</span>
                <span className="text-[10px] uppercase tracking-wider text-[#7B847F]">Curated Realms</span>
              </div>
              <div>
                <span className="font-serif text-2xl text-[#064E3B] block">100%</span>
                <span className="text-[10px] uppercase tracking-wider text-[#7B847F]">Private Pacing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs & Precision Chips */}
        <div className="mt-10 space-y-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-[11px] uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#064E3B] text-[#FAF9F5]'
                    : 'bg-white border border-[#064E3B]/15 text-[#404944] hover:border-[#064E3B]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#7B847F] mr-1">
              Precision Filter:
            </span>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag((prev) => (prev === tag ? null : tag))}
                className={`px-3 py-1 text-[10px] uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-[#745B1C] text-white'
                    : 'bg-[#F4F4F0] text-[#404944] hover:bg-[#E9E8E4]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight Card */}
      {spotlight && (
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#064E3B]/12 grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-sm">
            <div className="lg:col-span-6 relative min-h-[340px]">
              <ImageWithFallback
                src={spotlight.heroImage}
                alt={spotlight.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#D6B56D] text-[#18231F] px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-bold">
                Signature Spotlight
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-[#022C22]/85 text-[#FAF9F5] p-4 flex flex-wrap justify-between gap-2 text-xs">
                <span>{spotlight.region}</span>
                <span className="text-[#D6B56D]">{spotlight.equipmentOrSetting}</span>
              </div>
            </div>
            <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#745B1C] font-semibold">
                  Experiential Realm • {spotlight.realmCategory}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#064E3B]">
                  {spotlight.title}
                </h2>
                <p className="text-sm text-[#404944] leading-relaxed">{spotlight.description}</p>
                <ul className="space-y-2 pt-2">
                  {(spotlight.highlights || []).map((hl, i) => (
                    <li key={i} className="text-xs text-[#18231F] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D6B56D]" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
                {spotlight.fieldNote && (
                  <blockquote className="bg-[#FAF9F5] border-l-2 border-[#D6B56D] p-4 text-xs italic text-[#404944]">
                    “{spotlight.fieldNote}”
                  </blockquote>
                )}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to={`/plan-your-journey?experience=${encodeURIComponent(spotlight.title)}`}
                  className="bg-[#064E3B] hover:bg-[#022C22] text-[#FAF9F5] px-6 py-3 text-xs uppercase tracking-[0.16em] font-semibold"
                >
                  Reserve Private Expedition
                </Link>
                <Link
                  to={`/experiences/${spotlight.slug}`}
                  className="border border-[#064E3B]/25 text-[#064E3B] px-6 py-3 text-xs uppercase tracking-[0.16em] font-semibold"
                >
                  View Dossier
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Eight Experiential Realms Grid + Bespoke Commission Card */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#745B1C] font-semibold">
            Compendium of Curated Expeditions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#064E3B] mt-1">
            Signature Experiential Realms
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((exp) => (
            <Link
              key={exp.id}
              to={`/experiences/${exp.slug}`}
              className="group bg-white border border-[#064E3B]/12 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <ImageWithFallback
                    src={exp.heroImage}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#022C22]/90 text-[#D6B56D] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]">
                    {exp.badgeText || exp.realmCategory}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#FAF9F5]/95 text-[#064E3B] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] font-semibold">
                    {exp.duration}
                  </div>
                </div>
                <div className="p-6 space-y-2.5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#7B847F] font-semibold">
                    {exp.region}
                  </p>
                  <h3 className="font-serif text-2xl text-[#064E3B] leading-snug">{exp.title}</h3>
                  <p className="text-sm text-[#404944] line-clamp-3 leading-relaxed">
                    {exp.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[#064E3B]/10 flex items-center justify-between text-xs">
                <span className="text-[#7B847F] truncate pr-3">{exp.equipmentOrSetting}</span>
                <span className="text-[#064E3B] uppercase tracking-[0.16em] font-semibold shrink-0 inline-flex items-center gap-1">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}

          {/* Bespoke Commission Dark Card */}
          <div className="bg-[#022C22] text-[#FAF9F5] p-8 flex flex-col justify-between border border-[#D6B56D]/30">
            <div className="space-y-4">
              <Sparkles className="w-7 h-7 text-[#D6B56D]" />
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#D6B56D] font-semibold block">
                Unlisted Access
              </span>
              <h3 className="font-serif text-3xl leading-snug">
                Looking for a Singular Commission?
              </h3>
              <p className="text-sm text-[#FAF9F5]/80 leading-relaxed">
                From chartered scenic transfers and private culinary tastings to specialized wildlife photography itineraries—our curators design encounters tailored solely for you.
              </p>
            </div>
            <Link
              to="/plan-your-journey"
              className="mt-8 bg-[#D6B56D] hover:bg-[#e4c279] text-[#18231F] py-3.5 px-5 text-xs uppercase tracking-[0.18em] font-semibold text-center"
            >
              Commission Bespoke Encounter
            </Link>
          </div>
        </div>
      </section>

      {/* Ethical Stewardship */}
      <section className="my-16 py-20 bg-[#022C22] text-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#D6B56D] font-semibold">
              Ethos & Preservation
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl mt-2">
              The AVENTRA Code of Ethical Stewardship
            </h2>
            <p className="text-sm sm:text-base text-[#FAF9F5]/75 mt-3">
              Luxury travel in Sri Lanka should respect and protect the wild ecosystems and artisan communities that make the island extraordinary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Zero Captivity Interaction Policy',
                desc: 'We decline elephant riding, tethered wildlife shows, and intrusive animal encounters—supporting respectful wild habitat observation.',
              },
              {
                icon: Leaf,
                title: 'Community & Artisan Respect',
                desc: 'We collaborate with small tea bungalows, local boat crews, and independent Sri Lankan culinary and heritage hosts.',
              },
              {
                icon: TreePine,
                title: 'Low-Impact Field Etiquette',
                desc: 'Quiet safari pacing, minimal single-use plastics in transit, and adherence to national park sanctuary rules.',
              },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="bg-[#064E3B]/40 border border-[#D6B56D]/20 p-7 space-y-3">
                  <Icon className="w-6 h-6 text-[#D6B56D]" />
                  <h3 className="font-serif text-xl">{p.title}</h3>
                  <p className="text-sm text-[#FAF9F5]/80 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#745B1C] font-semibold">
            Planning Protocol
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#064E3B]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#404944] leading-relaxed">
            Practical considerations regarding seasonal monsoons, bespoke pacing, and private guiding across Sri Lanka.
          </p>
        </div>

        <div className="lg:col-span-7 space-y-3">
          {EXPERIENCE_FAQS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="bg-white border border-[#064E3B]/12">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-serif text-lg text-[#064E3B]">{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#064E3B] transition-transform shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-[#404944] leading-relaxed border-t border-[#064E3B]/10 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
