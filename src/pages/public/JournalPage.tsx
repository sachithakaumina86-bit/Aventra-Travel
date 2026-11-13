import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export const JournalPage: React.FC = () => {
  const { blogPosts } = useData();
  const [category, setCategory] = useState('All');

  const published = useMemo(() => blogPosts.filter((p) => p.isPublished), [blogPosts]);
  const categories = ['All', ...Array.from(new Set(published.map((p) => p.category)))];

  const filtered = useMemo(() => {
    return category === 'All' ? published : published.filter((p) => p.category === category);
  }, [published, category]);

  const featured = filtered.find((p) => p.isFeatured) || filtered[0];
  const rest = filtered.filter((p) => p.id !== featured?.id);

  return (
    <div className="pt-20 bg-[#FAF9F5] text-[#18231F]">
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#064E3B]/10">
        <span className="text-[11px] uppercase tracking-[0.26em] text-[#745B1C] font-semibold">
          Editorial Dispatches • Sample Travel Journal
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#064E3B] mt-3">
          The Ceylon Travel Journal
        </h1>
        <p className="text-base text-[#404944] max-w-2xl mt-4 leading-relaxed">
          Seasonal monsoon notes, architectural reflections, and regional field guides for discerning Sri Lanka travelers.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-semibold cursor-pointer ${
                category === cat
                  ? 'bg-[#064E3B] text-[#FAF9F5]'
                  : 'bg-white border border-[#064E3B]/15 text-[#404944]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {featured && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to={`/journal/${featured.slug}`}
            className="grid grid-cols-1 lg:grid-cols-12 bg-white border border-[#064E3B]/12 overflow-hidden group hover:shadow-xl transition-all"
          >
            <div className="lg:col-span-7 aspect-[16/10] overflow-hidden">
              <ImageWithFallback
                src={featured.coverImage}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#745B1C] font-semibold">
                  Featured Dispatch • {featured.category}
                </span>
                <h2 className="font-serif text-3xl text-[#064E3B] leading-snug">
                  {featured.title}
                </h2>
                <p className="text-sm text-[#404944] leading-relaxed">{featured.excerpt}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#064E3B]/10 text-xs">
                <span className="text-[#7B847F]">
                  {featured.authorName} • {featured.readTimeMinutes} Min Read
                </span>
                <span className="text-[#064E3B] uppercase tracking-[0.16em] font-semibold inline-flex items-center gap-1">
                  Read Story <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {rest.length === 0 && !featured ? (
          <div className="py-12 text-center text-[#7B847F] space-y-2">
            <BookOpen className="w-8 h-8 mx-auto opacity-50" />
            <p>No journal dispatches published in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {rest.map((post) => (
              <Link
                key={post.id}
                to={`/journal/${post.slug}`}
                className="bg-white border border-[#064E3B]/12 overflow-hidden flex flex-col justify-between group hover:shadow-lg transition-all"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden">
                    <ImageWithFallback
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#745B1C] font-semibold">
                      {post.category} • {post.readTimeMinutes} Min
                    </span>
                    <h3 className="font-serif text-2xl text-[#064E3B]">{post.title}</h3>
                    <p className="text-xs text-[#404944] line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-[#064E3B]/10 flex items-center justify-between text-xs text-[#064E3B] font-semibold">
                  <span>Read Dispatch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
