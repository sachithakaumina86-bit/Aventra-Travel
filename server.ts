import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '100kb' }));

  // Health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'AVENTRA Web & Concierge Server',
      timestamp: new Date().toISOString(),
    });
  });

  // Server-side inquiry validation & normalization endpoint
  app.post('/api/inquiries/validate', (req, res) => {
    const body = req.body ?? {};
    const fullName = sanitizeText(body.fullName, 120);
    const email = sanitizeText(body.email, 200);
    const phone = sanitizeText(body.phone, 40);
    const country = sanitizeText(body.country, 80);
    const adults = Number(body.adults);
    const children = Number(body.children || 0);

    const errors: Record<string, string> = {};
    if (fullName.length < 2) errors.fullName = 'Please enter your full name (at least 2 characters).';
    if (email.length < 5 || !EMAIL_REGEX.test(email)) errors.email = 'Please enter a valid email address.';
    if (phone.length < 5) errors.phone = 'Please provide a valid phone or WhatsApp number.';
    if (country.length < 2) errors.country = 'Please specify your country of residence.';
    if (!Number.isInteger(adults) || adults < 1 || adults > 50) {
      errors.adults = 'Adult travelers must be between 1 and 50.';
    }
    if (!Number.isInteger(children) || children < 0 || children > 30) {
      errors.children = 'Child travelers must be between 0 and 30.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ valid: false, errors });
    }

    return res.json({
      valid: true,
      normalized: {
        fullName,
        email: email.toLowerCase(),
        phone,
        country,
        partyType: sanitizeText(body.partyType, 60),
        durationPreference: sanitizeText(body.durationPreference, 60),
        climatePreference: sanitizeText(body.climatePreference, 80),
        preferredArrivalDate: sanitizeText(body.preferredArrivalDate, 40),
        adults,
        children,
        selectedDestinations: Array.isArray(body.selectedDestinations)
          ? body.selectedDestinations.slice(0, 20).map((item: unknown) => sanitizeText(item, 80)).filter(Boolean)
          : [],
        sanctuaryTier: sanitizeText(body.sanctuaryTier, 80),
        travelCadence: sanitizeText(body.travelCadence, 80),
        selectedExperienceTypes: Array.isArray(body.selectedExperienceTypes)
          ? body.selectedExperienceTypes.slice(0, 20).map((item: unknown) => sanitizeText(item, 80)).filter(Boolean)
          : [],
        estimatedBudgetUsd: sanitizeText(body.estimatedBudgetUsd, 80),
        notes: sanitizeText(body.notes, 2500),
        preferredContactMethod: sanitizeText(body.preferredContactMethod, 40) || 'Email',
      },
    });
  });

  // Server-side contact/newsletter validation & normalization endpoint
  app.post('/api/contact/validate', (req, res) => {
    const body = req.body ?? {};
    const type = body.type === 'newsletter' ? 'newsletter' : 'contact';
    const fullName = sanitizeText(body.fullName || (type === 'newsletter' ? 'Dispatch Subscriber' : ''), 120);
    const email = sanitizeText(body.email, 200);
    const phone = sanitizeText(body.phone, 40);
    const subject = sanitizeText(body.subject, 180);
    const message = sanitizeText(body.message, 3000);

    const errors: Record<string, string> = {};
    if (fullName.length < 1) errors.fullName = 'Please enter your name.';
    if (email.length < 5 || !EMAIL_REGEX.test(email)) errors.email = 'Please enter a valid email address.';
    if (type === 'contact' && message.length < 5) {
      errors.message = 'Please share a brief message (at least 5 characters).';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ valid: false, errors });
    }

    return res.json({
      valid: true,
      normalized: {
        type,
        fullName,
        email: email.toLowerCase(),
        phone,
        subject: subject || (type === 'newsletter' ? 'Private Travel Dispatches Subscription' : 'General Concierge Inquiry'),
        message,
      },
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(
      express.static(distPath, {
        maxAge: '1y',
        immutable: true,
        setHeaders(res, filePath) {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
          }
        },
      })
    );
    app.get('*', (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AVENTRA server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start AVENTRA server:', err);
  process.exit(1);
});
