import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, MessageSquare } from 'lucide-react';

export const FloatingConcierge: React.FC = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 520);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col gap-2.5">
      <Link
        to="/plan-your-journey"
        title="Plan Your Bespoke Journey"
        aria-label="Plan Your Bespoke Journey"
        className="w-11 h-11 bg-[#064E3B] hover:bg-[#022C22] text-[#D6B56D] border border-[#D6B56D]/40 shadow-lg flex items-center justify-center transition-transform hover:scale-105"
      >
        <MessageSquare className="w-4 h-4" />
      </Link>
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Back to top"
          aria-label="Back to top"
          className="w-11 h-11 bg-[#FAF9F5] hover:bg-[#F0E9DC] text-[#064E3B] border border-[#064E3B]/20 shadow-md flex items-center justify-center transition-colors cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
