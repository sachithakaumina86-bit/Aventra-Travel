export type TimestampLike = unknown;

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'concierge_admin';
  createdAt?: TimestampLike;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  region: string;
  microclimate: string;
  elevation: string;
  bestSeason: string;
  tagline: string;
  summary: string;
  description: string;
  heroImage: string;
  galleryImages: string[];
  highlights: string[];
  tags: string[];
  startingRateUsd: number;
  journeysRouted: number;
  isFeatured: boolean;
  isPublished: boolean;
  isSample?: boolean;
  sortOrder?: number;
  createdAt?: TimestampLike;
  updatedAt?: TimestampLike;
}

export interface Experience {
  id: string;
  slug: string;
  title: string;
  realmCategory: string;
  region: string;
  duration: string;
  badgeText: string;
  summary: string;
  description: string;
  heroImage: string;
  highlights: string[];
  equipmentOrSetting: string;
  fieldNote?: string;
  fieldNoteAuthor?: string;
  tags: string[];
  isSpotlight?: boolean;
  isPublished: boolean;
  isSample?: boolean;
  sortOrder?: number;
  createdAt?: TimestampLike;
  updatedAt?: TimestampLike;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  location: string;
  sanctuary?: string;
  description: string;
  highlights: string[];
}

export interface PackageSanctuary {
  name: string;
  region: string;
  nightsLabel: string;
  suiteType: string;
  description: string;
  imageUrl: string;
}

export interface PackageFaq {
  question: string;
  answer: string;
}

export interface TourPackage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  durationDays: number;
  durationNights: number;
  durationLabel: string;
  indicativePriceUsd: number;
  priceDisclaimer: string;
  seasonWindow: string;
  heroImage: string;
  mosaicImages: string[];
  summary: string;
  overviewQuote: string;
  overviewNarrative: string;
  highlights: string[];
  itineraryDays: ItineraryDay[];
  sanctuaries: PackageSanctuary[];
  inclusions: string[];
  exclusions: string[];
  faqs: PackageFaq[];
  isFeatured: boolean;
  isPublished: boolean;
  isSample?: boolean;
  sortOrder?: number;
  createdAt?: TimestampLike;
  updatedAt?: TimestampLike;
}

export type InquiryStatus = 'pending' | 'reviewing' | 'quoted' | 'converted' | 'archived';

export interface Inquiry {
  id: string;
  referenceCode: string;
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
  status: InquiryStatus;
  adminNotes?: string;
  convertedBookingId?: string;
  createdAt?: TimestampLike;
  updatedAt?: TimestampLike;
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'deposit_paid' | 'paid_full' | 'refunded';

export interface Booking {
  id: string;
  referenceCode: string;
  inquiryId?: string;
  customerId?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry: string;
  guestTier: string;
  packageId?: string;
  packageTitle?: string;
  customRouteTitle?: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  assignedChauffeur?: string;
  vehicleInfo?: string;
  sanctuariesSummary: string[];
  dietaryAndNotes?: string;
  totalAmountUsd: number;
  depositAmountUsd: number;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  adminNotes?: string;
  createdAt?: TimestampLike;
  updatedAt?: TimestampLike;
}

export type CustomerTier = 'Standard' | 'Collector' | 'VIP Patron';

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  tier: CustomerTier;
  preferredStyle?: string;
  notes?: string;
  createdAt?: TimestampLike;
  updatedAt?: TimestampLike;
}

export interface Testimonial {
  id: string;
  guestName: string;
  guestOrigin: string;
  journeyTitle: string;
  quote: string;
  rating: number;
  stayDateLabel: string;
  isFeatured: boolean;
  isPublished: boolean;
  isSample?: boolean;
  createdAt?: TimestampLike;
  updatedAt?: TimestampLike;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorName: string;
  readTimeMinutes: number;
  publishedDateLabel: string;
  isFeatured: boolean;
  isPublished: boolean;
  isSample?: boolean;
  createdAt?: TimestampLike;
  updatedAt?: TimestampLike;
}

export interface GalleryItem {
  id: string;
  title: string;
  region: string;
  category: string;
  imageUrl: string;
  caption: string;
  isPublished: boolean;
  isSample?: boolean;
  createdAt?: TimestampLike;
  updatedAt?: TimestampLike;
}

export type ContactMessageStatus = 'unread' | 'read' | 'replied' | 'archived';

export interface ContactMessage {
  id: string;
  type: 'contact' | 'newsletter';
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  status: ContactMessageStatus;
  adminNotes?: string;
  createdAt?: TimestampLike;
  updatedAt?: TimestampLike;
}

export interface WebsiteSettings {
  brandName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImageUrl: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  officeAddress: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  founderName: string;
  founderRole: string;
  founderLetterTitle: string;
  founderLetterBody: string;
  founderQuote: string;
  heritageEstablishedNote: string;
  accreditationsNote: string;
  footerDescription: string;
  newsletterPrompt: string;
  updatedAt?: TimestampLike;
}
