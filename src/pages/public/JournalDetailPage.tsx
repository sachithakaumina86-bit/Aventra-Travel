import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export const JournalDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogPosts } = useData();

  const post = blogPosts.find((p) => p.slug === slug && p.isPublished);
  const related = blogPosts.filter((p) => p.isPublished && p.slug !== slug).slice(0, 2);

  if (!post) {
    return (
      <div className="pt-32 pb-24 max-w-3xl mx-auto px-4 text-center space-y-4">
        <h1 className="font-serif text-4xl text-[#064E3B]">Article Not Found</h1>
        <Link
          to="/journal"
          className="inline-flex items-center gap-2 bg-[#064E3B] text-white px-6 py-3 text-xs uppercase tracking-[0.16em]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Journal</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-[#FAF9F5] text-[#18231F]">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
        <Link
          to="/journal"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#745B1C] font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Travel Journal</span>
        </Link>

        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.18em] text-[#7B847F]">
            <span className="text-[#745B1C] font-semibold">{post.category}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {post.readTimeMinutes} Min Read
            </span>
            <span>•</span>
            <span>{post.publishedDateLabel}</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#064E3B] leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-[#404944] leading-relaxed font-light">{post.excerpt}</p>
          <p className="text-xs text-[#7B847F]">By {post.authorName}</p>
        </header>

        <div className="aspect-[16/9] overflow-hidden border border-[#064E3B]/10 bg-[#E9E8E4]">
          <ImageWithFallback src={post.coverImage} alt={post.title} priority className="w-full h-full object-cover" />
        </div>

        <div className="text-base sm:text-lg text-[#18231F] leading-relaxed space-y-5 whitespace-pre-line font-normal">
          {post.content}
        </div>

        <div className="bg-[#022C22] text-[#FAF9F5] p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl">Inspired by This Dispatch?</h3>
            <p className="text-xs text-[#FAF9F5]/75 mt-1">
              Our concierge desk weaves Sri Lanka’s seasonal patterns into your bespoke route.
            </p>
          </div>
          <Link
            to="/plan-your-journey"
            className="bg-[#D6B56D] text-[#18231F] px-6 py-3 text-xs uppercase tracking-[0.16em] font-semibold shrink-0"
          >
            Plan Your Journey
          </Link>
        </div>
      </article>

      {related.length > 0 && (
        <section className="py-14 bg-[#F4F4F0] border-t border-[#064E3B]/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="font-serif text-2xl text-[#064E3B]">More From the Journal</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/journal/${item.slug}`}
                  className="bg-white border border-[#064E3B]/10 p-5 space-y-2 hover:shadow-md transition-all"
                >
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#745B1C] font-semibold">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-xl text-[#064E3B]">{item.title}</h3>
                  <span className="text-xs text-[#064E3B] inline-flex items-center gap-1 font-semibold pt-1">
                    Read <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
