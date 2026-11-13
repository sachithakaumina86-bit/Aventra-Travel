import React, { useState } from 'react';
import { CheckCircle2, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { validateContactWithServerFallback } from '../../utils/formValidation';

export const ContactPage: React.FC = () => {
  const { settings, submitContactMessage } = useData();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);
    setSubmitting(true);

    try {
      const validationData = await validateContactWithServerFallback({
        type: 'contact',
        fullName,
        email,
        phone,
        subject,
        message,
      });
      if (!validationData.valid || !validationData.normalized) {
        setErrors(validationData.errors || {});
        setSubmitError('Please review the highlighted fields before sending.');
        setSubmitting(false);
        return;
      }

      await submitContactMessage({
        type: 'contact',
        fullName: validationData.normalized.fullName,
        email: validationData.normalized.email,
        phone: validationData.normalized.phone,
        subject: validationData.normalized.subject,
        message: validationData.normalized.message,
      });

      setSent(true);
      setFullName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error('Contact Us submission failed:', err);
      const messageText = err instanceof Error ? err.message : String(err);
      if (messageText.toLowerCase().includes('quota exceeded')) {
        setSubmitError(
          'Our inquiry inbox has reached its daily capacity. Please reach us directly at Aventra@hotmail.com or 073 123 4567.'
        );
      } else {
        setSubmitError('Could not deliver your message right now. Please try again shortly.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 bg-[#FAF9F5] text-[#18231F]">
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#064E3B]/10">
        <span className="text-[11px] uppercase tracking-[0.26em] text-[#745B1C] font-semibold">
          Direct Concierge Correspondence
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#064E3B] mt-3">
          Speak With Our Atelier Desk
        </h1>
        <p className="text-base text-[#404944] max-w-2xl mt-4 leading-relaxed">
          Have questions about monsoon seasons, boutique sanctuary availability, or bespoke travel logistics? Send a direct note to our concierge team.
        </p>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#022C22] text-[#FAF9F5] p-8 space-y-6 border border-[#D6B56D]/25">
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#D6B56D] font-semibold">
                Desk Coordinates
              </span>
              <h2 className="font-serif text-3xl mt-1">AVENTRA Concierge</h2>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D6B56D] shrink-0 mt-1" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#FAF9F5]/60 block">
                    Atelier Location
                  </span>
                  <p className="text-[#FAF9F5]/90">{settings.officeAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#D6B56D] shrink-0 mt-1" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#FAF9F5]/60 block">
                    Email Desk
                  </span>
                  <p className="text-[#FAF9F5]/90 break-all">{settings.contactEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#D6B56D] shrink-0 mt-1" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#FAF9F5]/60 block">
                    Telephone / WhatsApp
                  </span>
                  <p className="text-[#FAF9F5]/90">{settings.contactPhone}</p>
                  {settings.whatsappNumber && settings.whatsappNumber !== settings.contactPhone && (
                    <p className="text-xs text-[#D6B56D] mt-0.5">WhatsApp: {settings.whatsappNumber}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-[#064E3B]/12 p-8 shadow-xs">
          {sent ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-10 h-10 text-[#064E3B] mx-auto" />
              <h2 className="font-serif text-3xl text-[#064E3B]">Message Received</h2>
              <p className="text-sm text-[#404944] max-w-md mx-auto">
                Thank you for reaching out. Your note has been logged in our concierge inbox and will be reviewed shortly.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="bg-[#064E3B] text-white px-6 py-2.5 text-xs uppercase tracking-[0.16em] font-semibold cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="font-serif text-3xl text-[#064E3B]">Send a Direct Inquiry</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3.5 py-2.5 text-sm"
                  />
                  {errors.fullName && <p className="text-xs text-[#BA1A1A] mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3.5 py-2.5 text-sm"
                  />
                  {errors.email && <p className="text-xs text-[#BA1A1A] mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-1.5">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="073 123 4567"
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Private itinerary question..."
                    className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#404944] font-semibold mb-1.5">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How may our curators assist your Sri Lanka plans?"
                  className="w-full bg-[#FAF9F5] border border-[#064E3B]/15 px-3.5 py-2.5 text-sm"
                />
                {errors.message && <p className="text-xs text-[#BA1A1A] mt-1">{errors.message}</p>}
              </div>

              {submitError && (
                <div className="bg-[#ffdad6] text-[#93000a] px-4 py-3 text-xs">{submitError}</div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#064E3B] hover:bg-[#022C22] active:scale-[0.98] text-[#FAF9F5] px-7 py-3.5 min-h-[44px] text-xs uppercase tracking-[0.18em] font-semibold inline-flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-[#D6B56D]" />}
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
