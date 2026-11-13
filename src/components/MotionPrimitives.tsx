import React from 'react';
import { AnimatePresence, motion } from 'motion/react';

export const LUXURY_EASE = [0.22, 1, 0.36, 1] as const;

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export const RevealSection: React.FC<RevealSectionProps> = ({
  children,
  className = '',
  delay = 0,
  y = 14,
}) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.08 }}
    transition={{ duration: 0.5, delay, ease: LUXURY_EASE }}
    className={className}
  >
    {children}
  </motion.div>
);

interface RevealStaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const RevealStagger: React.FC<RevealStaggerProps> = ({
  children,
  className = '',
  staggerDelay = 0.045,
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.05 }}
    variants={{
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const RevealItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 14 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.42, ease: LUXURY_EASE },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const PageTransitionShell: React.FC<{
  children: React.ReactNode;
  routeKey: string;
}> = ({ children, routeKey }) => (
  <motion.div
    key={routeKey}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.24, ease: LUXURY_EASE }}
  >
    {children}
  </motion.div>
);

export const AccordionContent: React.FC<{
  isOpen: boolean;
  id?: string;
  children: React.ReactNode;
}> = ({ isOpen, id, children }) => (
  <AnimatePresence initial={false}>
    {isOpen && (
      <motion.div
        id={id}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.26, ease: LUXURY_EASE }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);
