import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp, MessageSquare } from 'lucide-react';
import { LUXURY_EASE } from './MotionPrimitives';

export const FloatingConcierge: React.FC = memo(() => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 520;
      setShowTop((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-5 z-40 flex flex-col gap-2.5">
      <Link
        to="/plan-your-journey"
        title="Plan Your Bespoke Journey"
        aria-label="Plan Your Bespoke Journey"
        className="w-11 h-11 bg-[#064E3B] hover:bg-[#022C22] active:scale-95 text-[#D6B56D] border border-[#D6B56D]/40 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
      >
        <MessageSquare className="w-4 h-4" />
      </Link>
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.88, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 8 }}
            transition={{ duration: 0.2, ease: LUXURY_EASE }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            title="Back to top"
            aria-label="Back to top"
            className="w-11 h-11 bg-[#FAF9F5] hover:bg-[#F0E9DC] active:scale-95 text-[#064E3B] border border-[#064E3B]/20 shadow-md flex items-center justify-center transition-colors cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
});

FloatingConcierge.displayName = 'FloatingConcierge';
