const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

export interface ContactValidationInput {
  type?: 'contact' | 'newsletter';
  fullName?: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
}

export interface NormalizedContactPayload {
  type: 'contact' | 'newsletter';
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ValidationResult<T> {
  valid: boolean;
  errors?: Record<string, string>;
  normalized?: T;
}

export function validateContactLocally(
  body: ContactValidationInput
): ValidationResult<NormalizedContactPayload> {
  const type = body.type === 'newsletter' ? 'newsletter' : 'contact';
  const fullName = sanitizeText(
    body.fullName || (type === 'newsletter' ? 'Dispatch Subscriber' : ''),
    120
  );
  const email = sanitizeText(body.email, 200).toLowerCase();
  const phone = sanitizeText(body.phone || '', 40);
  const subject = sanitizeText(body.subject || '', 180);
  const message = sanitizeText(body.message || '', 3000);

  const errors: Record<string, string> = {};
  if (fullName.length < 1) {
    errors.fullName = 'Please enter your name.';
  }
  if (email.length < 5 || !EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (type === 'contact' && message.length < 5) {
    errors.message = 'Please share a brief message (at least 5 characters).';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    normalized: {
      type,
      fullName,
      email,
      phone,
      subject:
        subject ||
        (type === 'newsletter'
          ? 'Private Travel Dispatches Subscription'
          : 'General Concierge Inquiry'),
      message,
    },
  };
}

export async function validateContactWithServerFallback(
  input: ContactValidationInput
): Promise<ValidationResult<NormalizedContactPayload>> {
  try {
    const res = await fetch('/api/contact/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json') && (res.ok || res.status === 400)) {
      const data = (await res.json()) as ValidationResult<NormalizedContactPayload>;
      if (typeof data?.valid === 'boolean') {
        return data;
      }
    }
  } catch {
    // Fall back to local validation if the backend validation endpoint is unavailable
  }
  return validateContactLocally(input);
}

export interface InquiryValidationInput {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  partyType?: string;
  durationPreference?: string;
  climatePreference?: string;
  preferredArrivalDate?: string;
  adults: number;
  children?: number;
  selectedDestinations?: string[];
  sanctuaryTier?: string;
  travelCadence?: string;
  selectedExperienceTypes?: string[];
  estimatedBudgetUsd?: string;
  notes?: string;
  preferredContactMethod?: string;
}

export interface NormalizedInquiryPayload {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  partyType: string;
  durationPreference: string;
  climatePreference: string;
  preferredArrivalDate: string;
  adults: number;
  children: number;
  selectedDestinations: string[];
  sanctuaryTier: string;
  travelCadence: string;
  selectedExperienceTypes: string[];
  estimatedBudgetUsd: string;
  notes: string;
  preferredContactMethod: string;
}

export function validateInquiryLocally(
  body: InquiryValidationInput
): ValidationResult<NormalizedInquiryPayload> {
  const fullName = sanitizeText(body.fullName, 120);
  const email = sanitizeText(body.email, 200).toLowerCase();
  const phone = sanitizeText(body.phone, 40);
  const country = sanitizeText(body.country, 80);
  const adults = Number(body.adults);
  const children = Number(body.children || 0);

  const errors: Record<string, string> = {};
  if (fullName.length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  }
  if (email.length < 5 || !EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (phone.length < 5) {
    errors.phone = 'Please provide a valid phone or WhatsApp number.';
  }
  if (country.length < 2) {
    errors.country = 'Please specify your country of residence.';
  }
  if (!Number.isInteger(adults) || adults < 1 || adults > 50) {
    errors.adults = 'Adult travelers must be between 1 and 50.';
  }
  if (!Number.isInteger(children) || children < 0 || children > 30) {
    errors.children = 'Child travelers must be between 0 and 30.';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    normalized: {
      fullName,
      email,
      phone,
      country,
      partyType: sanitizeText(body.partyType, 60),
      durationPreference: sanitizeText(body.durationPreference, 60),
      climatePreference: sanitizeText(body.climatePreference, 80),
      preferredArrivalDate: sanitizeText(body.preferredArrivalDate, 40),
      adults,
      children,
      selectedDestinations: Array.isArray(body.selectedDestinations)
        ? body.selectedDestinations
            .slice(0, 20)
            .map((item) => sanitizeText(item, 80))
            .filter(Boolean)
        : [],
      sanctuaryTier: sanitizeText(body.sanctuaryTier, 80),
      travelCadence: sanitizeText(body.travelCadence, 80),
      selectedExperienceTypes: Array.isArray(body.selectedExperienceTypes)
        ? body.selectedExperienceTypes
            .slice(0, 20)
            .map((item) => sanitizeText(item, 80))
            .filter(Boolean)
        : [],
      estimatedBudgetUsd: sanitizeText(body.estimatedBudgetUsd, 80),
      notes: sanitizeText(body.notes, 2500),
      preferredContactMethod: sanitizeText(body.preferredContactMethod, 40) || 'Email',
    },
  };
}

export async function validateInquiryWithServerFallback(
  input: InquiryValidationInput
): Promise<ValidationResult<NormalizedInquiryPayload>> {
  try {
    const res = await fetch('/api/inquiries/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json') && (res.ok || res.status === 400)) {
      const data = (await res.json()) as ValidationResult<NormalizedInquiryPayload>;
      if (typeof data?.valid === 'boolean') {
        return data;
      }
    }
  } catch {
    // Fall back to local validation if the backend validation endpoint is unavailable
  }
  return validateInquiryLocally(input);
}
