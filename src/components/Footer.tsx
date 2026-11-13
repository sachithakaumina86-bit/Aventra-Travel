import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { STITCH_IMAGES } from '../data/initialSeedData';
import { useData } from '../context/DataContext';

export const Footer: React.FC = () => {
  const { settings, submitContactMessage } = useData();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const validateRes = await fetch('/api/contact/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'newsletter',
          fullName: 'Dispatch Subscriber',
          email: trimmed,
        }),
      });
      if (!validateRes.ok) {
        setError('Please verify your email format and try again.');
        setSubmitting(false);
        return;
      }
      await submitContactMessage({
        type: 'newsletter',
        fullName: 'Dispatch Subscriber',
        email: trimmed,
        subject: 'Private Travel Dispatches Subscription',
        message: 'Subscribed via footer newsletter dispatch form.',
      });
      setSubscribed(true);
      setEmail('');
    } catch {
      setError('Subscription could not be saved right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#022C22] text-[#FAF9F5] pt-16 pb-10 border-t border-[#D6B56D]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-[#FAF9F5]/10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <img
                src={STITCH_IMAGES.logo}
                alt="AVENTRA Logo"
                className="h-11 w-auto object-contain bg-[#FAF9F5] p-1 rounded-xs"
              />
              <div>
                <h3 className="font-serif text-xl font-bold tracking-[0.16em] text-[#FAF9F5]">
                  {settings.brandName || 'AVENTRA'}
                </h3>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#D6B56D]">
                  {settings.tagline || 'Discover Beyond Ordinary.'}
                </p>
              </div>
            </div>
            <p className="text-sm text-[#FAF9F5]/75 leading-relaxed max-w-md">
              {settings.footerDescription}
            </p>
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#D6B56D]/90 border border-[#D6B56D]/30 px-3 py-1.5">
              <span>Bespoke Sri Lanka Curations</span>
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.22em] text-[#D6B56D] font-semibold">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#FAF9F5]/75">
              <li>
                <Link to="/" className="hover:text-[#D6B56D] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-[#D6B56D] transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/experiences" className="hover:text-[#D6B56D] transition-colors">
                  Experiences
                </Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-[#D6B56D] transition-colors">
                  Tour Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* About & Support */}
          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.22em] text-[#D6B56D] font-semibold">
              Atelier & Journal
            </h4>
            <ul className="space-y-2.5 text-sm text-[#FAF9F5]/75">
              <li>
                <Link to="/about" className="hover:text-[#D6B56D] transition-colors">
                  About AVENTRA
                </Link>
              </li>
              <li>
                <Link to="/journal" className="hover:text-[#D6B56D] transition-colors">
                  Travel Journal
                </Link>
              </li>
              <li>
                <Link to="/plan-your-journey" className="hover:text-[#D6B56D] transition-colors">
                  Plan Your Journey
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#D6B56D] transition-colors">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#D6B56D] transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Concierge */}
          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.22em] text-[#D6B56D] font-semibold">
              Contact & Desk
            </h4>
            <div className="space-y-2.5 text-sm text-[#FAF9F5]/75">
              <p className="font-medium text-[#FAF9F5]">Colombo Concierge Desk</p>
              <p className="text-xs leading-relaxed text-[#FAF9F5]/70">
                {settings.officeAddress}
              </p>
              <p className="text-xs text-[#D6B56D]">
                WhatsApp: {settings.whatsappNumber || settings.contactPhone}
              </p>
              <p className="text-xs break-all text-[#FAF9F5]/80">{settings.contactEmail}</p>
            </div>
          </div>
        </div>

        {/* Newsletter Bar */}
        <div className="my-10 bg-[#064E3B]/45 border border-[#D6B56D]/25 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h4 className="font-serif text-xl sm:text-2xl text-[#FAF9F5]">
              Private Travel Dispatches
            </h4>
            <p className="text-sm text-[#FAF9F5]/75 mt-1">{settings.newsletterPrompt}</p>
          </div>
          {subscribed ? (
            <div className="flex items-center gap-2 text-sm text-[#B0F0D6] bg-[#022C22]/70 px-4 py-3 border border-[#D6B56D]/30">
              <Check className="w-4 h-4" />
              <span>Thank you — your email has been registered for seasonal dispatches.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address for private travel dispatches"
                className="bg-[#022C22]/90 border border-[#FAF9F5]/20 px-4 py-3 text-sm text-[#FAF9F5] placeholder:text-[#FAF9F5]/45 focus:outline-none focus:border-[#D6B56D] min-w-[260px]"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#D6B56D] hover:bg-[#e4c279] text-[#18231F] px-6 py-3 text-xs uppercase tracking-[0.18em] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Subscribe
              </button>
            </form>
          )}
        </div>
        {error && <p className="text-xs text-[#ffdad6] -mt-6 mb-6">{error}</p>}

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em] text-[#FAF9F5]/55">
          <p>© {new Date().getFullYear()} {settings.brandName || 'AVENTRA'}. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            {settings.instagramUrl ? (
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-[#D6B56D]">
                Instagram
              </a>
            ) : (
              <span>Instagram</span>
            )}
            {settings.facebookUrl ? (
              <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-[#D6B56D]">
                Facebook
              </a>
            ) : (
              <span>Facebook</span>
            )}
            {settings.youtubeUrl ? (
              <a href={settings.youtubeUrl} target="_blank" rel="noreferrer" className="hover:text-[#D6B56D]">
                YouTube
              </a>
            ) : (
              <span>YouTube</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
