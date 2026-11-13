import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Eye, Feather, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { STITCH_IMAGES } from '../../data/initialSeedData';
import { ImageWithFallback } from '../../components/ImageWithFallback';
import { RevealItem, RevealSection, RevealStagger } from '../../components/MotionPrimitives';

export const AboutPage: React.FC = () => {
  const { settings } = useData();

  return (
    <div className="pt-20 bg-[#FAF9F5] text-[#18231F]">
      {/* Hero + Asymmetric Triptych */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.26em] text-[#745B1C] font-semibold">
              Our Genesis & Ethos • About AVENTRA
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#064E3B] leading-tight">
              Born of Ceylon.{' '}
              <span className="italic font-normal">Crafted for Thoughtful Discovery.</span>
            </h1>
          </div>
          <div className="lg:col-span-4 space-y-3">
            <p className="text-sm text-[#404944] leading-relaxed">
              AVENTRA is founded on the belief that Sri Lanka’s ancient citadels, misty tea valleys, and coastal wilderness deserve unhurried, deeply considered exploration.
            </p>
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#7B847F] bg-[#F4F4F0] px-3 py-2 border border-[#064E3B]/10">
              {settings.heritageEstablishedNote}
            </p>
          </div>
        </div>

        {/* Triptych */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 relative aspect-[16/11] overflow-hidden">
            <ImageWithFallback
              src={STITCH_IMAGES.bogawantalawa}
              alt="Bogawantalawa highlands misty valley"
              priority
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#022C22]/75 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-[#FAF9F5]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D6B56D] font-semibold block">
                  Golden Valley
                </span>
                <p className="font-serif text-2xl">Bogawantalawa Tea Highlands</p>
              </div>
              <span className="text-xs bg-[#022C22]/85 px-3 py-1">~1,600m</span>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-rows-2 gap-5">
            <div className="relative overflow-hidden min-h-[190px]">
              <ImageWithFallback
                src={STITCH_IMAGES.bawaArchitecture}
                alt="Sri Lankan Tropical Modernist architectural courtyard"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#022C22]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-[#FAF9F5]">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D6B56D] block">
                  Design Heritage
                </span>
                <p className="font-serif text-xl">Tropical Modernist Sanctuaries</p>
              </div>
            </div>

            <div className="relative overflow-hidden min-h-[190px]">
              <ImageWithFallback
                src={STITCH_IMAGES.yalaLeopard}
                alt="Yala coastal buffer corridor"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#022C22]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-[#FAF9F5]">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D6B56D] block">
                  Wild Corridors
                </span>
                <p className="font-serif text-xl">Yala & Southern Reserves</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Letter Split */}
      <section className="py-16 sm:py-24 bg-[#F4F4F0] border-y border-[#064E3B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#064E3B]/12 p-4 shadow-xs">
              <div className="aspect-[4/4] overflow-hidden relative">
                <ImageWithFallback
                  src={STITCH_IMAGES.hattonVeranda}
                  alt={settings.founderName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-[#022C22]/90 text-[#FAF9F5] p-4">
                  <p className="font-serif text-xl">{settings.founderName}</p>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#D6B56D] mt-0.5">
                    {settings.founderRole}
                  </p>
                </div>
              </div>
            </div>

            <blockquote className="bg-white border-l-4 border-[#D6B56D] p-6 space-y-3 shadow-xs">
              <p className="font-serif italic text-xl text-[#064E3B] leading-relaxed">
                “{settings.founderQuote}”
              </p>
              <footer className="text-[11px] uppercase tracking-[0.18em] text-[#7B847F]">
                Editable Editorial Profile • Admin Website Settings
              </footer>
            </blockquote>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#745B1C] font-semibold">
              The Genesis • Editable Editorial Dispatch
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#064E3B]">
              {settings.founderLetterTitle}
            </h2>
            <div className="text-base text-[#404944] leading-relaxed space-y-4 whitespace-pre-line">
              {settings.founderLetterBody}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#064E3B]/15 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#7B847F] block">
                  Concierge Desk (Editable)
                </span>
                <span className="font-semibold text-[#064E3B]">{settings.contactEmail}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#7B847F] block">
                  Field Station (Editable)
                </span>
                <span className="font-semibold text-[#064E3B]">{settings.officeAddress}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <RevealSection className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#745B1C] font-semibold">
              The AVENTRA Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#064E3B] mt-2">
              The Four Pillars of Curated Ceylon
            </h2>
          </div>
          <p className="text-sm text-[#404944] max-w-md">
            Thoughtful curation built on pacing, architectural intimacy, ecological care, and regional expertise.
          </p>
        </RevealSection>

        <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              num: '01',
              icon: Compass,
              title: 'Temporal Mastery',
              body: 'We reverse hectic tourist timing—planning quiet dawn visits to citadels and unhurried veranda afternoons.',
              footer: 'Unhurried Dawn Pacing',
            },
            {
              num: '02',
              icon: Feather,
              title: 'Architectural Intimacy',
              body: 'We favor characterful colonial bungalows, boutique courtyards, and coastal tents over impersonal mega-resorts.',
              footer: 'Boutique Sanctuaries',
            },
            {
              num: '03',
              icon: Eye,
              title: 'Naturalist Stewardship',
              body: 'Safaris and nature walks are curated around respectful wildlife distances and seasonal birding calendars.',
              footer: 'Zero Captivity Ethos',
            },
            {
              num: '04',
              icon: Sparkles,
              title: 'Personal Curation',
              body: 'Every journey proposal is reviewed directly by our concierge team before a single reservation is finalized.',
              footer: 'Bespoke Attention',
            },
          ].map((pillar) => {
            const Icon = pillar.icon;
            return (
              <RevealItem
                key={pillar.num}
                className="bg-white border border-[#064E3B]/12 p-7 flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[#745B1C]">
                    <span className="font-serif italic text-lg">{pillar.num}</span>
                    <Icon className="w-5 h-5 text-[#064E3B]" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#064E3B]">{pillar.title}</h3>
                  <p className="text-sm text-[#404944] leading-relaxed">{pillar.body}</p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#064E3B] font-semibold border-t border-[#064E3B]/10 pt-3 block">
                  {pillar.footer}
                </span>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </section>

      {/* Responsible Stewardship Pledge */}
      <section className="py-16 sm:py-20 bg-[#022C22] text-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#D6B56D] font-semibold">
              Responsible Exploration
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl">
              Luxury Without Consequence.{' '}
              <span className="italic font-normal text-[#D6B56D]">Our Stewardship Commitment.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#FAF9F5]/80 leading-relaxed max-w-2xl">
              The wild parks, coral reefs, and tea-growing villages that make Sri Lanka unforgettable deserve thoughtful care. We design routes that minimize plastic waste, respect national park habitats, and champion locally rooted hospitality.
            </p>
          </div>
          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            <div className="bg-[#064E3B]/45 border border-[#D6B56D]/25 p-5 flex items-start gap-4">
              <ShieldCheck className="w-5 h-5 text-[#D6B56D] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-lg">Ethical Wildlife Observation</h4>
                <p className="text-xs text-[#FAF9F5]/75 mt-1">
                  Strict refusal of captive wildlife rides or intrusive park crowding.
                </p>
              </div>
            </div>
            <div className="bg-[#064E3B]/45 border border-[#D6B56D]/25 p-5 flex items-start gap-4">
              <Leaf className="w-5 h-5 text-[#D6B56D] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-lg">Accreditations & Affiliations</h4>
                <p className="text-xs text-[#FAF9F5]/75 mt-1">{settings.accreditationsNote}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 text-center max-w-4xl mx-auto px-4 space-y-6">
        <span className="text-[11px] uppercase tracking-[0.26em] text-[#745B1C] font-semibold">
          Your Private Ceylon Passage
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl text-[#064E3B]">
          Begin Your Conversation With Our Curators
        </h2>
        <p className="text-base text-[#404944] max-w-xl mx-auto">
          Whether seeking a highland tea bungalow retreat or a coast-to-citadel expedition, our desk crafts proposals tailored to you.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            to="/plan-your-journey"
            className="bg-[#064E3B] hover:bg-[#022C22] text-[#FAF9F5] px-7 py-3.5 text-xs uppercase tracking-[0.18em] font-semibold inline-flex items-center gap-2"
          >
            <span>Plan Your Bespoke Journey</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact"
            className="border border-[#064E3B]/25 text-[#064E3B] px-7 py-3.5 text-xs uppercase tracking-[0.18em] font-semibold"
          >
            Contact Desk
          </Link>
        </div>
      </section>
    </div>
  );
};
