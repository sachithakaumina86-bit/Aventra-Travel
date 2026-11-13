import React from 'react';

interface SkeletonBoxProps {
  className?: string;
  dark?: boolean;
}

export const SkeletonBox: React.FC<SkeletonBoxProps> = ({ className = '', dark = false }) => (
  <div
    aria-hidden="true"
    className={`${dark ? 'skeleton-block-dark' : 'skeleton-block'} ${className}`}
  />
);

/* -------------------------------------------------------------------------- */
/* DESTINATIONS SKELETONS                                                     */
/* -------------------------------------------------------------------------- */

export const HomeDestinationsSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div
    role="status"
    aria-busy="true"
    aria-label="Loading featured sanctuaries"
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
  >
    <span className="sr-only">Loading featured sanctuaries...</span>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="w-full bg-white border border-[#064E3B]/10 overflow-hidden flex flex-col"
      >
        <div className="relative aspect-[4/3] bg-[#E9E8E4]">
          <SkeletonBox className="w-full h-full" />
          <div className="absolute top-3 left-3 w-20 h-5 bg-[#022C22]/15" aria-hidden="true" />
          <div className="absolute bottom-3 right-3 w-14 h-5 bg-[#FAF9F5]/80" aria-hidden="true" />
        </div>
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <SkeletonBox className="h-2.5 w-24" />
            <SkeletonBox className="h-6 w-3/4" />
            <div className="space-y-1.5 pt-1">
              <SkeletonBox className="h-3 w-full" />
              <SkeletonBox className="h-3 w-11/12" />
              <SkeletonBox className="h-3 w-2/3" />
            </div>
          </div>
          <div className="pt-3 border-t border-[#064E3B]/10 flex items-center justify-between">
            <SkeletonBox className="h-3 w-28" />
            <SkeletonBox className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const DestinationDirectorySkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div
    role="status"
    aria-busy="true"
    aria-label="Loading destination directory"
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
  >
    <span className="sr-only">Loading destination sanctuaries...</span>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="w-full bg-white border border-[#064E3B]/12 overflow-hidden flex flex-col"
      >
        <div className="relative aspect-[16/10] bg-[#E9E8E4]">
          <SkeletonBox className="w-full h-full" />
          <div className="absolute top-3 left-3 w-28 h-5 bg-[#022C22]/15" aria-hidden="true" />
          <div className="absolute bottom-3 right-3 w-16 h-5 bg-[#FAF9F5]/80" aria-hidden="true" />
        </div>
        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <SkeletonBox className="h-2.5 w-32" />
            <SkeletonBox className="h-7 w-4/5" />
            <SkeletonBox className="h-3 w-3/5" />
            <div className="space-y-1.5 pt-2">
              <SkeletonBox className="h-3.5 w-full" />
              <SkeletonBox className="h-3.5 w-11/12" />
              <SkeletonBox className="h-3.5 w-3/4" />
            </div>
          </div>
          <div className="space-y-3 pt-3 border-t border-[#064E3B]/10">
            <div className="flex gap-1.5">
              <SkeletonBox className="h-5 w-16" />
              <SkeletonBox className="h-5 w-20" />
              <SkeletonBox className="h-5 w-14" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <SkeletonBox className="h-3.5 w-32" />
              <SkeletonBox className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const DestinationsPageFallbackSkeleton: React.FC = () => (
  <div className="pt-20 bg-[#FAF9F5] min-h-screen">
    <section className="py-16 sm:py-24 border-b border-[#064E3B]/10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
      <SkeletonBox className="h-3 w-64" />
      <SkeletonBox className="h-12 sm:h-14 w-3/4 max-w-2xl" />
      <SkeletonBox className="h-5 w-full max-w-2xl" />
      <div className="mt-10 bg-white border border-[#064E3B]/12 p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkeletonBox className="h-10 w-full" />
        <SkeletonBox className="h-10 w-full" />
        <SkeletonBox className="h-10 w-full" />
      </div>
    </section>
    <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <DestinationDirectorySkeleton count={6} />
    </section>
  </div>
);

/* -------------------------------------------------------------------------- */
/* EXPERIENCES SKELETONS                                                      */
/* -------------------------------------------------------------------------- */

export const HomeExperiencesSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div
    role="status"
    aria-busy="true"
    aria-label="Loading signature encounters"
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
  >
    <span className="sr-only">Loading signature encounters...</span>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="relative aspect-[3/4] overflow-hidden bg-[#022C22] border border-[#D6B56D]/15"
      >
        <SkeletonBox dark className="w-full h-full" />
        <div className="absolute top-4 left-4 w-20 h-5 bg-[#FAF9F5]/20" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 p-5 space-y-2.5 bg-gradient-to-t from-[#022C22] via-[#022C22]/70 to-transparent">
          <SkeletonBox dark className="h-2.5 w-28" />
          <SkeletonBox dark className="h-6 w-4/5" />
          <SkeletonBox dark className="h-3 w-full" />
          <SkeletonBox dark className="h-3 w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

export const ExperienceSpotlightSkeleton: React.FC = () => (
  <div
    role="status"
    aria-busy="true"
    aria-label="Loading signature spotlight"
    className="bg-white border border-[#064E3B]/12 grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-sm"
  >
    <span className="sr-only">Loading featured experience spotlight...</span>
    <div className="lg:col-span-6 relative min-h-[340px] bg-[#E9E8E4]">
      <SkeletonBox className="w-full h-full min-h-[340px]" />
    </div>
    <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        <SkeletonBox className="h-3 w-48" />
        <SkeletonBox className="h-9 w-4/5" />
        <div className="space-y-2">
          <SkeletonBox className="h-3.5 w-full" />
          <SkeletonBox className="h-3.5 w-11/12" />
          <SkeletonBox className="h-3.5 w-3/4" />
        </div>
        <div className="space-y-2 pt-2">
          <SkeletonBox className="h-3 w-2/3" />
          <SkeletonBox className="h-3 w-3/5" />
          <SkeletonBox className="h-3 w-1/2" />
        </div>
      </div>
      <div className="flex flex-wrap gap-3 pt-2">
        <SkeletonBox className="h-11 w-48" />
        <SkeletonBox className="h-11 w-32" />
      </div>
    </div>
  </div>
);

export const ExperienceGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div
    role="status"
    aria-busy="true"
    aria-label="Loading experiential realms"
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
  >
    <span className="sr-only">Loading experiential realms...</span>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="w-full bg-white border border-[#064E3B]/12 overflow-hidden flex flex-col justify-between"
      >
        <div>
          <div className="relative aspect-[16/10] bg-[#E9E8E4]">
            <SkeletonBox className="w-full h-full" />
            <div className="absolute top-3 left-3 w-24 h-5 bg-[#022C22]/15" aria-hidden="true" />
            <div className="absolute bottom-3 right-3 w-16 h-5 bg-[#FAF9F5]/80" aria-hidden="true" />
          </div>
          <div className="p-6 space-y-3">
            <SkeletonBox className="h-2.5 w-28" />
            <SkeletonBox className="h-7 w-4/5" />
            <div className="space-y-1.5 pt-1">
              <SkeletonBox className="h-3.5 w-full" />
              <SkeletonBox className="h-3.5 w-11/12" />
              <SkeletonBox className="h-3.5 w-3/4" />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[#064E3B]/10 flex items-center justify-between">
          <SkeletonBox className="h-3 w-36" />
          <SkeletonBox className="h-3.5 w-16" />
        </div>
      </div>
    ))}
  </div>
);

export const ExperiencesPageFallbackSkeleton: React.FC = () => (
  <div className="pt-20 bg-[#FAF9F5] min-h-screen">
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#064E3B]/10 space-y-6">
      <SkeletonBox className="h-3 w-64" />
      <SkeletonBox className="h-12 sm:h-14 w-3/4 max-w-2xl" />
      <div className="flex flex-wrap gap-2 pt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBox key={i} className="h-9 w-32" />
        ))}
      </div>
    </section>
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <ExperienceSpotlightSkeleton />
      <ExperienceGridSkeleton count={6} />
    </section>
  </div>
);

/* -------------------------------------------------------------------------- */
/* TOUR PACKAGES SKELETONS                                                    */
/* -------------------------------------------------------------------------- */

export const HomePackagesSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div
    role="status"
    aria-busy="true"
    aria-label="Loading tour packages"
    className="grid grid-cols-1 lg:grid-cols-3 gap-7"
  >
    <span className="sr-only">Loading signature tour packages...</span>
    {Array.from({ length: count }).map((_, idx) => (
      <div
        key={idx}
        className={`bg-white border border-[#064E3B]/12 flex flex-col justify-between overflow-hidden ${
          idx === 0 ? 'lg:col-span-2 lg:grid lg:grid-cols-2' : ''
        }`}
      >
        <div
          className={`relative bg-[#E9E8E4] ${
            idx === 0 ? 'h-full min-h-[260px] sm:min-h-[280px]' : 'aspect-[16/10]'
          }`}
        >
          <SkeletonBox className="w-full h-full" />
          <div className="absolute top-4 left-4 w-28 h-5 bg-[#022C22]/15" aria-hidden="true" />
        </div>
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex justify-between gap-2">
              <SkeletonBox className="h-2.5 w-24" />
              <SkeletonBox className="h-2.5 w-20" />
            </div>
            <SkeletonBox className="h-8 w-4/5" />
            <div className="space-y-1.5 pt-1">
              <SkeletonBox className="h-3.5 w-full" />
              <SkeletonBox className="h-3.5 w-11/12" />
              <SkeletonBox className="h-3.5 w-2/3" />
            </div>
          </div>
          <div className="pt-4 border-t border-[#064E3B]/10 flex items-center justify-between gap-3">
            <div className="space-y-1.5">
              <SkeletonBox className="h-2.5 w-24" />
              <SkeletonBox className="h-7 w-28" />
            </div>
            <SkeletonBox className="h-10 w-32" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const PackageGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div
    role="status"
    aria-busy="true"
    aria-label="Loading curated tour packages"
    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
  >
    <span className="sr-only">Loading curated tour packages...</span>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-white border border-[#064E3B]/12 overflow-hidden flex flex-col justify-between"
      >
        <div>
          <div className="relative aspect-[16/10] bg-[#E9E8E4]">
            <SkeletonBox className="w-full h-full" />
            <div className="absolute top-4 left-4 w-28 h-5 bg-[#022C22]/15" aria-hidden="true" />
            <div className="absolute bottom-4 right-4 w-24 h-6 bg-[#FAF9F5]/80" aria-hidden="true" />
          </div>
          <div className="p-7 space-y-3.5">
            <SkeletonBox className="h-3 w-32" />
            <SkeletonBox className="h-8 w-3/4" />
            <div className="space-y-1.5">
              <SkeletonBox className="h-3.5 w-full" />
              <SkeletonBox className="h-3.5 w-10/12" />
            </div>
            <div className="space-y-2 pt-2">
              <SkeletonBox className="h-3 w-3/5" />
              <SkeletonBox className="h-3 w-2/3" />
              <SkeletonBox className="h-3 w-1/2" />
            </div>
          </div>
        </div>
        <div className="px-7 py-5 bg-[#FAF9F5] border-t border-[#064E3B]/10 flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <SkeletonBox className="h-2.5 w-28" />
            <SkeletonBox className="h-7 w-24" />
          </div>
          <SkeletonBox className="h-10 w-36" />
        </div>
      </div>
    ))}
  </div>
);

export const PackagesPageFallbackSkeleton: React.FC = () => (
  <div className="pt-20 bg-[#FAF9F5] min-h-screen">
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#064E3B]/10 space-y-5">
      <SkeletonBox className="h-3 w-64" />
      <SkeletonBox className="h-12 sm:h-14 w-3/4 max-w-2xl" />
      <SkeletonBox className="h-4 w-full max-w-xl" />
      <div className="mt-8 flex flex-wrap gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox key={i} className="h-9 w-28" />
          ))}
        </div>
        <SkeletonBox className="h-9 w-full md:w-72" />
      </div>
    </section>
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PackageGridSkeleton count={4} />
    </section>
  </div>
);

/* -------------------------------------------------------------------------- */
/* JOURNAL / BLOG SKELETONS                                                   */
/* -------------------------------------------------------------------------- */

export const JournalFeaturedSkeleton: React.FC = () => (
  <div
    role="status"
    aria-busy="true"
    aria-label="Loading featured travel dispatch"
    className="grid grid-cols-1 lg:grid-cols-12 bg-white border border-[#064E3B]/12 overflow-hidden"
  >
    <span className="sr-only">Loading featured dispatch...</span>
    <div className="lg:col-span-7 aspect-[16/10] bg-[#E9E8E4]">
      <SkeletonBox className="w-full h-full" />
    </div>
    <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-5">
      <div className="space-y-3.5">
        <SkeletonBox className="h-3 w-44" />
        <SkeletonBox className="h-9 w-11/12" />
        <div className="space-y-2 pt-1">
          <SkeletonBox className="h-3.5 w-full" />
          <SkeletonBox className="h-3.5 w-11/12" />
          <SkeletonBox className="h-3.5 w-3/4" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-[#064E3B]/10">
        <SkeletonBox className="h-3 w-40" />
        <SkeletonBox className="h-3.5 w-24" />
      </div>
    </div>
  </div>
);

export const JournalGridSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div
    role="status"
    aria-busy="true"
    aria-label="Loading travel journal dispatches"
    className="grid grid-cols-1 md:grid-cols-3 gap-7"
  >
    <span className="sr-only">Loading travel journal articles...</span>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="w-full bg-white border border-[#064E3B]/12 overflow-hidden flex flex-col justify-between"
      >
        <div>
          <div className="aspect-[16/10] bg-[#E9E8E4]">
            <SkeletonBox className="w-full h-full" />
          </div>
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <SkeletonBox className="h-2.5 w-24" />
              <SkeletonBox className="h-2.5 w-16" />
            </div>
            <SkeletonBox className="h-6 w-11/12" />
            <div className="space-y-1.5 pt-1">
              <SkeletonBox className="h-3 w-full" />
              <SkeletonBox className="h-3 w-11/12" />
              <SkeletonBox className="h-3 w-2/3" />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[#064E3B]/10 flex items-center justify-between">
          <SkeletonBox className="h-3 w-24" />
          <SkeletonBox className="h-3.5 w-3.5" />
        </div>
      </div>
    ))}
  </div>
);

export const JournalPageFallbackSkeleton: React.FC = () => (
  <div className="pt-20 bg-[#FAF9F5] min-h-screen">
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#064E3B]/10 space-y-5">
      <SkeletonBox className="h-3 w-64" />
      <SkeletonBox className="h-12 sm:h-14 w-2/3 max-w-xl" />
      <SkeletonBox className="h-4 w-full max-w-xl" />
      <div className="mt-8 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBox key={i} className="h-9 w-28" />
        ))}
      </div>
    </section>
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <JournalFeaturedSkeleton />
      <JournalGridSkeleton count={3} />
    </section>
  </div>
);

/* -------------------------------------------------------------------------- */
/* TESTIMONIALS SKELETON                                                      */
/* -------------------------------------------------------------------------- */

export const HomeTestimonialsSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div
    role="status"
    aria-busy="true"
    aria-label="Loading traveler reflections"
    className="grid grid-cols-1 md:grid-cols-3 gap-6"
  >
    <span className="sr-only">Loading traveler testimonials...</span>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-white border border-[#064E3B]/10 p-7 flex flex-col justify-between space-y-5"
      >
        <div className="space-y-4">
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, s) => (
              <SkeletonBox key={s} className="w-4 h-4" />
            ))}
          </div>
          <div className="space-y-2">
            <SkeletonBox className="h-4 w-full" />
            <SkeletonBox className="h-4 w-11/12" />
            <SkeletonBox className="h-4 w-4/5" />
          </div>
        </div>
        <div className="pt-4 border-t border-[#064E3B]/10 space-y-1.5">
          <SkeletonBox className="h-3.5 w-32" />
          <SkeletonBox className="h-3 w-48" />
        </div>
      </div>
    ))}
  </div>
);

/* -------------------------------------------------------------------------- */
/* ADMIN CARD GRID & SHELL SKELETONS                                          */
/* -------------------------------------------------------------------------- */

export const AdminCardGridSkeleton: React.FC<{
  columns?: 3 | 4;
  aspectClass?: string;
  count?: number;
  textOnly?: boolean;
}> = ({
  columns = 3,
  aspectClass = 'aspect-[16/10]',
  count = 6,
  textOnly = false,
}) => {
  const gridCols =
    columns === 4
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading atelier catalog cards"
      className={`grid ${gridCols}`}
    >
      <span className="sr-only">Loading catalog cards...</span>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-[#064E3B]/12 overflow-hidden flex flex-col justify-between"
        >
          {textOnly ? (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <SkeletonBox className="h-3.5 w-24" />
                <SkeletonBox className="h-5 w-16" />
              </div>
              <div className="space-y-2">
                <SkeletonBox className="h-4 w-full" />
                <SkeletonBox className="h-4 w-11/12" />
                <SkeletonBox className="h-4 w-3/4" />
              </div>
            </div>
          ) : (
            <div>
              <div className={`${aspectClass} bg-[#E9E8E4]`}>
                <SkeletonBox className="w-full h-full" />
              </div>
              <div className="p-5 space-y-2.5">
                <SkeletonBox className="h-2.5 w-28" />
                <SkeletonBox className="h-6 w-4/5" />
                <SkeletonBox className="h-3 w-full" />
                <SkeletonBox className="h-3 w-2/3" />
              </div>
            </div>
          )}
          <div className="px-5 py-3 bg-[#FAF9F5] border-t border-[#064E3B]/10 flex items-center justify-between">
            <SkeletonBox className="h-5 w-16" />
            <div className="flex gap-2">
              <SkeletonBox className="h-6 w-6" />
              <SkeletonBox className="h-6 w-6" />
              <SkeletonBox className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const AdminShellSkeleton: React.FC = () => (
  <div
    role="status"
    aria-busy="true"
    aria-label="Loading AVENTRA Admin Atelier"
    className="min-h-screen bg-[#F4F4F0] flex"
  >
    <span className="sr-only">Loading AVENTRA Atelier...</span>
    <aside className="hidden lg:flex w-64 shrink-0 bg-[#022C22] flex-col p-5 space-y-4">
      <div className="pb-4 border-b border-white/10 space-y-2">
        <SkeletonBox dark className="h-6 w-32" />
        <SkeletonBox dark className="h-2.5 w-24" />
      </div>
      <div className="space-y-2.5 pt-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonBox key={i} dark className="h-8 w-full" />
        ))}
      </div>
    </aside>
    <div className="flex-1 flex flex-col min-w-0">
      <header className="h-16 bg-white border-b border-[#064E3B]/10 px-6 flex items-center justify-between">
        <SkeletonBox className="h-8 w-64" />
        <div className="flex items-center gap-3">
          <SkeletonBox className="h-8 w-24" />
          <SkeletonBox className="h-8 w-20" />
        </div>
      </header>
      <main className="p-6 lg:p-8 space-y-6">
        <div className="space-y-2">
          <SkeletonBox className="h-3 w-44" />
          <SkeletonBox className="h-10 w-80 max-w-full" />
        </div>
        <AdminCardGridSkeleton columns={3} count={6} />
      </main>
    </div>
  </div>
);
