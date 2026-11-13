import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  AdminUser,
  BlogPost,
  Booking,
  BookingStatus,
  ContactMessage,
  ContactMessageStatus,
  Customer,
  Destination,
  Experience,
  GalleryItem,
  Inquiry,
  InquiryStatus,
  PaymentStatus,
  Testimonial,
  TourPackage,
  WebsiteSettings,
} from '../types/aventra';
import {
  INITIAL_BLOG_POSTS,
  INITIAL_DESTINATIONS,
  INITIAL_EXPERIENCES,
  INITIAL_GALLERY,
  INITIAL_SETTINGS,
  INITIAL_TESTIMONIALS,
  INITIAL_TOUR_PACKAGES,
} from '../data/initialSeedData';
import { useAuth } from './AuthContext';

function makeSafeId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}_${random}`.replace(/[^a-zA-Z0-9_-]/g, '');
}

function makeReferenceCode(prefix: string): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `#${prefix}-${num}`;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function trimStr(val: unknown, max: number): string {
  return typeof val === 'string' ? val.trim().slice(0, max) : '';
}

interface DataContextValue {
  loadingPublic: boolean;
  loadingAdmin: boolean;
  hasLiveCatalog: boolean;
  seeding: boolean;
  destinations: Destination[];
  experiences: Experience[];
  tourPackages: TourPackage[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
  gallery: GalleryItem[];
  settings: WebsiteSettings;
  inquiries: Inquiry[];
  bookings: Booking[];
  customers: Customer[];
  contactMessages: ContactMessage[];
  admins: AdminUser[];
  seedSampleCatalog: () => Promise<void>;
  saveDestination: (item: Partial<Destination> & { id?: string }) => Promise<string>;
  deleteDestination: (id: string) => Promise<void>;
  saveExperience: (item: Partial<Experience> & { id?: string }) => Promise<string>;
  deleteExperience: (id: string) => Promise<void>;
  saveTourPackage: (item: Partial<TourPackage> & { id?: string }) => Promise<string>;
  deleteTourPackage: (id: string) => Promise<void>;
  submitInquiry: (payload: Omit<Inquiry, 'id' | 'referenceCode' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<{ id: string; referenceCode: string }>;
  updateInquiry: (id: string, updates: Partial<Inquiry>) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  convertInquiryToBooking: (inquiry: Inquiry, bookingDetails: { startDate: string; endDate: string; totalAmountUsd: number; depositAmountUsd?: number; packageTitle?: string; assignedChauffeur?: string; vehicleInfo?: string }) => Promise<string>;
  saveBooking: (item: Partial<Booking> & { id?: string }) => Promise<string>;
  updateBookingStatus: (id: string, status: BookingStatus, paymentStatus?: PaymentStatus) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  saveCustomer: (item: Partial<Customer> & { id?: string }) => Promise<string>;
  deleteCustomer: (id: string) => Promise<void>;
  saveTestimonial: (item: Partial<Testimonial> & { id?: string }) => Promise<string>;
  deleteTestimonial: (id: string) => Promise<void>;
  saveBlogPost: (item: Partial<BlogPost> & { id?: string }) => Promise<string>;
  deleteBlogPost: (id: string) => Promise<void>;
  saveGalleryItem: (item: Partial<GalleryItem> & { id?: string }) => Promise<string>;
  deleteGalleryItem: (id: string) => Promise<void>;
  submitContactMessage: (payload: { type: 'contact' | 'newsletter'; fullName: string; email: string; phone?: string; subject?: string; message?: string }) => Promise<string>;
  updateContactMessage: (id: string, status: ContactMessageStatus, adminNotes?: string) => Promise<void>;
  deleteContactMessage: (id: string) => Promise<void>;
  saveWebsiteSettings: (updates: Partial<WebsiteSettings>) => Promise<void>;
  addAdminUser: (uid: string, email: string, name: string, role: 'super_admin' | 'concierge_admin') => Promise<void>;
  removeAdminUser: (uid: string) => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authReady, isAdmin } = useAuth();

  const [loadingPublic, setLoadingPublic] = useState(true);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [hasLiveCatalog, setHasLiveCatalog] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [experiences, setExperiences] = useState<Experience[]>(INITIAL_EXPERIENCES);
  const [tourPackages, setTourPackages] = useState<TourPackage[]>(INITIAL_TOUR_PACKAGES);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [settings, setSettings] = useState<WebsiteSettings>(INITIAL_SETTINGS);

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);

  // Public Firestore sync (runs immediately for public visitors)
  useEffect(() => {
    if (!authReady) return;
    if (isAdmin) return; // Admin effect handles full collections in real time

    let cancelled = false;
    async function loadPublicData() {
      setLoadingPublic(true);
      try {
        const [
          destSnap,
          expSnap,
          pkgSnap,
          testSnap,
          blogSnap,
          galSnap,
          settingsSnap,
        ] = await Promise.all([
          getDocs(query(collection(db, 'destinations'), where('isPublished', '==', true))),
          getDocs(query(collection(db, 'experiences'), where('isPublished', '==', true))),
          getDocs(query(collection(db, 'tourPackages'), where('isPublished', '==', true))),
          getDocs(query(collection(db, 'testimonials'), where('isPublished', '==', true))),
          getDocs(query(collection(db, 'blogPosts'), where('isPublished', '==', true))),
          getDocs(query(collection(db, 'gallery'), where('isPublished', '==', true))),
          getDoc(doc(db, 'websiteSettings', 'public')),
        ]);

        if (cancelled) return;

        const hasLive = !destSnap.empty || !pkgSnap.empty || !expSnap.empty;
        setHasLiveCatalog(hasLive);

        if (!destSnap.empty) {
          const list = destSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Destination, 'id'>) }));
          list.sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
          setDestinations(list);
        }
        if (!expSnap.empty) {
          const list = expSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Experience, 'id'>) }));
          list.sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
          setExperiences(list);
        }
        if (!pkgSnap.empty) {
          const list = pkgSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<TourPackage, 'id'>) }));
          list.sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
          setTourPackages(list);
        }
        if (!testSnap.empty) {
          setTestimonials(testSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Testimonial, 'id'>) })));
        }
        if (!blogSnap.empty) {
          setBlogPosts(blogSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<BlogPost, 'id'>) })));
        }
        if (!galSnap.empty) {
          setGallery(galSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryItem, 'id'>) })));
        }
        if (settingsSnap.exists()) {
          setSettings({ ...INITIAL_SETTINGS, ...(settingsSnap.data() as Partial<WebsiteSettings>) });
        }
      } catch (err) {
        console.warn('Public Firestore fetch fell back cleanly:', err);
      } finally {
        if (!cancelled) setLoadingPublic(false);
      }
    }

    void loadPublicData();
    return () => {
      cancelled = true;
    };
  }, [authReady, isAdmin]);

  // Admin real-time listeners (strictly attached ONLY after verified admin auth)
  useEffect(() => {
    if (!authReady || !isAdmin) {
      setInquiries([]);
      setBookings([]);
      setCustomers([]);
      setContactMessages([]);
      setAdmins([]);
      return;
    }

    setLoadingAdmin(true);
    const unsubs: Array<() => void> = [];

    unsubs.push(
      onSnapshot(
        collection(db, 'destinations'),
        (snap) => {
          if (!snap.empty) {
            setHasLiveCatalog(true);
            const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Destination, 'id'>) }));
            list.sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
            setDestinations(list);
          } else {
            setDestinations([]);
          }
          setLoadingPublic(false);
          setLoadingAdmin(false);
        },
        (error) => handleFirestoreError(error, OperationType.LIST, 'destinations')
      )
    );

    unsubs.push(
      onSnapshot(
        collection(db, 'experiences'),
        (snap) => {
          const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Experience, 'id'>) }));
          list.sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
          setExperiences(list);
        },
        (error) => handleFirestoreError(error, OperationType.LIST, 'experiences')
      )
    );

    unsubs.push(
      onSnapshot(
        collection(db, 'tourPackages'),
        (snap) => {
          const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<TourPackage, 'id'>) }));
          list.sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
          setTourPackages(list);
        },
        (error) => handleFirestoreError(error, OperationType.LIST, 'tourPackages')
      )
    );

    unsubs.push(
      onSnapshot(
        collection(db, 'testimonials'),
        (snap) => {
          setTestimonials(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Testimonial, 'id'>) })));
        },
        (error) => handleFirestoreError(error, OperationType.LIST, 'testimonials')
      )
    );

    unsubs.push(
      onSnapshot(
        collection(db, 'blogPosts'),
        (snap) => {
          setBlogPosts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<BlogPost, 'id'>) })));
        },
        (error) => handleFirestoreError(error, OperationType.LIST, 'blogPosts')
      )
    );

    unsubs.push(
      onSnapshot(
        collection(db, 'gallery'),
        (snap) => {
          setGallery(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryItem, 'id'>) })));
        },
        (error) => handleFirestoreError(error, OperationType.LIST, 'gallery')
      )
    );

    unsubs.push(
      onSnapshot(
        doc(db, 'websiteSettings', 'public'),
        (snap) => {
          if (snap.exists()) {
            setSettings({ ...INITIAL_SETTINGS, ...(snap.data() as Partial<WebsiteSettings>) });
          }
        },
        (error) => handleFirestoreError(error, OperationType.GET, 'websiteSettings/public')
      )
    );

    unsubs.push(
      onSnapshot(
        collection(db, 'inquiries'),
        (snap) => {
          setInquiries(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Inquiry, 'id'>) })));
        },
        (error) => handleFirestoreError(error, OperationType.LIST, 'inquiries')
      )
    );

    unsubs.push(
      onSnapshot(
        collection(db, 'bookings'),
        (snap) => {
          setBookings(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Booking, 'id'>) })));
        },
        (error) => handleFirestoreError(error, OperationType.LIST, 'bookings')
      )
    );

    unsubs.push(
      onSnapshot(
        collection(db, 'customers'),
        (snap) => {
          setCustomers(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Customer, 'id'>) })));
        },
        (error) => handleFirestoreError(error, OperationType.LIST, 'customers')
      )
    );

    unsubs.push(
      onSnapshot(
        collection(db, 'contactMessages'),
        (snap) => {
          setContactMessages(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ContactMessage, 'id'>) })));
        },
        (error) => handleFirestoreError(error, OperationType.LIST, 'contactMessages')
      )
    );

    unsubs.push(
      onSnapshot(
        collection(db, 'admins'),
        (snap) => {
          setAdmins(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AdminUser, 'id'>) })));
        },
        (error) => handleFirestoreError(error, OperationType.LIST, 'admins')
      )
    );

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [authReady, isAdmin]);

  const seedSampleCatalog = async () => {
    setSeeding(true);
    try {
      const batch = writeBatch(db);
      for (const dest of INITIAL_DESTINATIONS) {
        const { id, ...rest } = dest;
        batch.set(doc(db, 'destinations', id), {
          ...rest,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      for (const exp of INITIAL_EXPERIENCES) {
        const { id, ...rest } = exp;
        batch.set(doc(db, 'experiences', id), {
          ...rest,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      for (const pkg of INITIAL_TOUR_PACKAGES) {
        const { id, ...rest } = pkg;
        batch.set(doc(db, 'tourPackages', id), {
          ...rest,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      for (const test of INITIAL_TESTIMONIALS) {
        const { id, ...rest } = test;
        batch.set(doc(db, 'testimonials', id), {
          ...rest,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      for (const post of INITIAL_BLOG_POSTS) {
        const { id, ...rest } = post;
        batch.set(doc(db, 'blogPosts', id), {
          ...rest,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      for (const gal of INITIAL_GALLERY) {
        const { id, ...rest } = gal;
        batch.set(doc(db, 'gallery', id), {
          ...rest,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      batch.set(doc(db, 'websiteSettings', 'public'), {
        ...INITIAL_SETTINGS,
        updatedAt: serverTimestamp(),
      });
      await batch.commit();
      setHasLiveCatalog(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'seedSampleCatalog');
    } finally {
      setSeeding(false);
    }
  };

  const saveDestination = async (item: Partial<Destination> & { id?: string }) => {
    const id = item.id || slugify(item.slug || item.name || '') || makeSafeId('dest');
    const existingItem = destinations.find((d) => d.id === id);
    const payload = {
      slug: slugify(item.slug || item.name || id) || 'destination',
      name: trimStr(item.name, 120),
      region: trimStr(item.region || 'Cultural Triangle', 80),
      microclimate: trimStr(item.microclimate || 'Tropical Plains', 80),
      elevation: trimStr(item.elevation || 'Sea Level', 40),
      bestSeason: trimStr(item.bestSeason || 'Dec – Apr', 60),
      tagline: trimStr(item.tagline || '', 180),
      summary: trimStr(item.summary || '', 500),
      description: trimStr(item.description || '', 5000),
      heroImage: trimStr(item.heroImage || INITIAL_DESTINATIONS[0].heroImage, 1000),
      galleryImages: (item.galleryImages || []).slice(0, 10),
      highlights: (item.highlights || []).slice(0, 12),
      tags: (item.tags || []).slice(0, 10),
      startingRateUsd: Number(item.startingRateUsd) || 0,
      journeysRouted: Number(item.journeysRouted) || 0,
      isFeatured: Boolean(item.isFeatured),
      isPublished: item.isPublished ?? true,
      isSample: Boolean(item.isSample),
      sortOrder: Number(item.sortOrder) || 99,
      updatedAt: serverTimestamp(),
    };
    try {
      const ref = doc(db, 'destinations', id);
      const snap = await getDoc(ref);
      if (snap.exists() && existingItem) {
        await updateDoc(ref, { ...payload, createdAt: snap.data().createdAt });
      } else {
        await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
      }
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `destinations/${id}`);
    }
  };

  const deleteDestination = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'destinations', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `destinations/${id}`);
    }
  };

  const saveExperience = async (item: Partial<Experience> & { id?: string }) => {
    const id = item.id || slugify(item.slug || item.title || '') || makeSafeId('exp');
    const payload = {
      slug: slugify(item.slug || item.title || id) || 'experience',
      title: trimStr(item.title, 140),
      realmCategory: trimStr(item.realmCategory || 'Wildlife & Big Game Safaris', 80),
      region: trimStr(item.region || 'Sri Lanka', 80),
      duration: trimStr(item.duration || 'Half Day', 60),
      badgeText: trimStr(item.badgeText || 'Signature Realm', 60),
      summary: trimStr(item.summary || '', 500),
      description: trimStr(item.description || '', 4000),
      heroImage: trimStr(item.heroImage || INITIAL_EXPERIENCES[0].heroImage, 1000),
      highlights: (item.highlights || []).slice(0, 12),
      equipmentOrSetting: trimStr(item.equipmentOrSetting || '', 160),
      fieldNote: trimStr(item.fieldNote || '', 600),
      fieldNoteAuthor: trimStr(item.fieldNoteAuthor || '', 120),
      tags: (item.tags || []).slice(0, 10),
      isSpotlight: Boolean(item.isSpotlight),
      isPublished: item.isPublished ?? true,
      isSample: Boolean(item.isSample),
      sortOrder: Number(item.sortOrder) || 99,
      updatedAt: serverTimestamp(),
    };
    try {
      const ref = doc(db, 'experiences', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, { ...payload, createdAt: snap.data().createdAt });
      } else {
        await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
      }
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `experiences/${id}`);
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'experiences', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `experiences/${id}`);
    }
  };

  const saveTourPackage = async (item: Partial<TourPackage> & { id?: string }) => {
    const id = item.id || slugify(item.slug || item.title || '') || makeSafeId('pkg');
    const days = Math.max(1, Math.min(60, Number(item.durationDays) || 7));
    const nights = Math.max(0, Math.min(60, Number(item.durationNights) ?? days - 1));
    const payload = {
      slug: slugify(item.slug || item.title || id) || 'package',
      title: trimStr(item.title, 140),
      subtitle: trimStr(item.subtitle || '', 200),
      category: trimStr(item.category || 'Signature Circuit', 80),
      durationDays: days,
      durationNights: nights,
      durationLabel: trimStr(item.durationLabel || `${days} Days / ${nights} Nights`, 60),
      indicativePriceUsd: Math.max(0, Number(item.indicativePriceUsd) || 0),
      priceDisclaimer: trimStr(item.priceDisclaimer || 'Indicative sample tariff — editable in Admin.', 200),
      seasonWindow: trimStr(item.seasonWindow || 'Year-Round', 80),
      heroImage: trimStr(item.heroImage || INITIAL_TOUR_PACKAGES[0].heroImage, 1000),
      mosaicImages: (item.mosaicImages || []).slice(0, 6),
      summary: trimStr(item.summary || '', 600),
      overviewQuote: trimStr(item.overviewQuote || '', 400),
      overviewNarrative: trimStr(item.overviewNarrative || '', 5000),
      highlights: (item.highlights || []).slice(0, 12),
      itineraryDays: (item.itineraryDays || []).slice(0, 30),
      sanctuaries: (item.sanctuaries || []).slice(0, 15),
      inclusions: (item.inclusions || []).slice(0, 20),
      exclusions: (item.exclusions || []).slice(0, 20),
      faqs: (item.faqs || []).slice(0, 15),
      isFeatured: Boolean(item.isFeatured),
      isPublished: item.isPublished ?? true,
      isSample: Boolean(item.isSample),
      sortOrder: Number(item.sortOrder) || 99,
      updatedAt: serverTimestamp(),
    };
    try {
      const ref = doc(db, 'tourPackages', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, { ...payload, createdAt: snap.data().createdAt });
      } else {
        await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
      }
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `tourPackages/${id}`);
    }
  };

  const deleteTourPackage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tourPackages', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tourPackages/${id}`);
    }
  };

  const submitInquiry = async (
    payload: Omit<Inquiry, 'id' | 'referenceCode' | 'status' | 'createdAt' | 'updatedAt'>
  ) => {
    const id = makeSafeId('inq');
    const referenceCode = makeReferenceCode('INQ');
    const docData = {
      referenceCode,
      fullName: trimStr(payload.fullName, 120),
      email: trimStr(payload.email, 200).toLowerCase(),
      phone: trimStr(payload.phone, 40),
      country: trimStr(payload.country, 80),
      partyType: trimStr(payload.partyType || 'Couple', 60),
      durationPreference: trimStr(payload.durationPreference || '7–10 Days', 60),
      climatePreference: trimStr(payload.climatePreference || 'All-Island Blend', 80),
      preferredArrivalDate: trimStr(payload.preferredArrivalDate || '', 40),
      adults: Math.max(1, Math.min(50, Number(payload.adults) || 2)),
      children: Math.max(0, Math.min(30, Number(payload.children) || 0)),
      selectedDestinations: (payload.selectedDestinations || []).slice(0, 20).map((s) => trimStr(s, 80)),
      sanctuaryTier: trimStr(payload.sanctuaryTier || 'Boutique Luxury', 80),
      travelCadence: trimStr(payload.travelCadence || 'Balanced & Unhurried', 80),
      selectedExperienceTypes: (payload.selectedExperienceTypes || []).slice(0, 20).map((s) => trimStr(s, 80)),
      estimatedBudgetUsd: trimStr(payload.estimatedBudgetUsd || '', 80),
      notes: trimStr(payload.notes || '', 2500),
      preferredContactMethod: trimStr(payload.preferredContactMethod || 'Email', 40),
      status: 'pending' as InquiryStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    try {
      await setDoc(doc(db, 'inquiries', id), docData);
      return { id, referenceCode };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `inquiries/${id}`);
    }
  };

  const updateInquiry = async (id: string, updates: Partial<Inquiry>) => {
    try {
      const ref = doc(db, 'inquiries', id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const existing = snap.data();
      await updateDoc(ref, {
        ...existing,
        ...updates,
        adminNotes: trimStr(updates.adminNotes ?? existing.adminNotes ?? '', 2500),
        createdAt: existing.createdAt,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `inquiries/${id}`);
    }
  };

  const deleteInquiry = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'inquiries', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `inquiries/${id}`);
    }
  };

  const convertInquiryToBooking = async (
    inquiry: Inquiry,
    bookingDetails: {
      startDate: string;
      endDate: string;
      totalAmountUsd: number;
      depositAmountUsd?: number;
      packageTitle?: string;
      assignedChauffeur?: string;
      vehicleInfo?: string;
    }
  ) => {
    const bookingId = makeSafeId('bkg');
    const customerId = makeSafeId('cust');
    const refCode = makeReferenceCode('AV');
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'customers', customerId), {
        fullName: trimStr(inquiry.fullName, 120),
        email: trimStr(inquiry.email, 200).toLowerCase(),
        phone: trimStr(inquiry.phone, 40),
        country: trimStr(inquiry.country, 80),
        tier: 'Collector',
        preferredStyle: trimStr(inquiry.sanctuaryTier || 'Bespoke', 160),
        notes: trimStr(`Converted from inquiry ${inquiry.referenceCode}`, 2000),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      batch.set(doc(db, 'bookings', bookingId), {
        referenceCode: refCode,
        inquiryId: inquiry.id,
        customerId,
        guestName: trimStr(inquiry.fullName, 120),
        guestEmail: trimStr(inquiry.email, 200).toLowerCase(),
        guestPhone: trimStr(inquiry.phone, 40),
        guestCountry: trimStr(inquiry.country, 80),
        guestTier: trimStr(inquiry.sanctuaryTier || 'Bespoke Patron', 40),
        packageId: '',
        packageTitle: trimStr(bookingDetails.packageTitle || 'Bespoke Sri Lanka Expedition', 140),
        customRouteTitle: trimStr((inquiry.selectedDestinations || []).join(' • '), 160),
        startDate: trimStr(bookingDetails.startDate, 40),
        endDate: trimStr(bookingDetails.endDate, 40),
        adults: Math.max(1, inquiry.adults || 2),
        children: Math.max(0, inquiry.children || 0),
        assignedChauffeur: trimStr(bookingDetails.assignedChauffeur || 'Pending Assignment', 120),
        vehicleInfo: trimStr(bookingDetails.vehicleInfo || 'Private Chauffeur Vehicle', 120),
        sanctuariesSummary: (inquiry.selectedDestinations || []).slice(0, 15),
        dietaryAndNotes: trimStr(inquiry.notes || '', 2000),
        totalAmountUsd: Math.max(0, Number(bookingDetails.totalAmountUsd) || 0),
        depositAmountUsd: Math.max(0, Number(bookingDetails.depositAmountUsd) || 0),
        paymentStatus: 'unpaid',
        status: 'confirmed',
        adminNotes: trimStr(`Converted from ${inquiry.referenceCode}`, 2500),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const inqSnap = await getDoc(doc(db, 'inquiries', inquiry.id));
      if (inqSnap.exists()) {
        batch.update(doc(db, 'inquiries', inquiry.id), {
          ...inqSnap.data(),
          status: 'converted',
          convertedBookingId: bookingId,
          updatedAt: serverTimestamp(),
        });
      }

      await batch.commit();
      return bookingId;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `bookings/${bookingId}`);
    }
  };

  const saveBooking = async (item: Partial<Booking> & { id?: string }) => {
    const id = item.id || makeSafeId('bkg');
    const payload = {
      referenceCode: trimStr(item.referenceCode || makeReferenceCode('AV'), 30),
      inquiryId: trimStr(item.inquiryId || '', 128),
      customerId: trimStr(item.customerId || '', 128),
      guestName: trimStr(item.guestName || '', 120),
      guestEmail: trimStr(item.guestEmail || '', 200).toLowerCase(),
      guestPhone: trimStr(item.guestPhone || '', 40),
      guestCountry: trimStr(item.guestCountry || '', 80),
      guestTier: trimStr(item.guestTier || 'Private Patron', 40),
      packageId: trimStr(item.packageId || '', 128),
      packageTitle: trimStr(item.packageTitle || 'Bespoke Expedition', 140),
      customRouteTitle: trimStr(item.customRouteTitle || '', 160),
      startDate: trimStr(item.startDate || '', 40),
      endDate: trimStr(item.endDate || '', 40),
      adults: Math.max(1, Math.min(50, Number(item.adults) || 2)),
      children: Math.max(0, Math.min(30, Number(item.children) || 0)),
      assignedChauffeur: trimStr(item.assignedChauffeur || 'Pending Assignment', 120),
      vehicleInfo: trimStr(item.vehicleInfo || '', 120),
      sanctuariesSummary: (item.sanctuariesSummary || []).slice(0, 15),
      dietaryAndNotes: trimStr(item.dietaryAndNotes || '', 2000),
      totalAmountUsd: Math.max(0, Number(item.totalAmountUsd) || 0),
      depositAmountUsd: Math.max(0, Number(item.depositAmountUsd) || 0),
      paymentStatus: (item.paymentStatus || 'unpaid') as PaymentStatus,
      status: (item.status || 'pending') as BookingStatus,
      adminNotes: trimStr(item.adminNotes || '', 2500),
      updatedAt: serverTimestamp(),
    };
    try {
      const ref = doc(db, 'bookings', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, { ...payload, createdAt: snap.data().createdAt });
      } else {
        await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
      }
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `bookings/${id}`);
    }
  };

  const updateBookingStatus = async (id: string, status: BookingStatus, paymentStatus?: PaymentStatus) => {
    try {
      const ref = doc(db, 'bookings', id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const existing = snap.data();
      await updateDoc(ref, {
        ...existing,
        status,
        paymentStatus: paymentStatus || existing.paymentStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${id}`);
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'bookings', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `bookings/${id}`);
    }
  };

  const saveCustomer = async (item: Partial<Customer> & { id?: string }) => {
    const id = item.id || makeSafeId('cust');
    const payload = {
      fullName: trimStr(item.fullName, 120),
      email: trimStr(item.email, 200).toLowerCase(),
      phone: trimStr(item.phone || '', 40),
      country: trimStr(item.country || '', 80),
      tier: (item.tier || 'Standard') as Customer['tier'],
      preferredStyle: trimStr(item.preferredStyle || '', 160),
      notes: trimStr(item.notes || '', 2000),
      updatedAt: serverTimestamp(),
    };
    try {
      const ref = doc(db, 'customers', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, { ...payload, createdAt: snap.data().createdAt });
      } else {
        await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
      }
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `customers/${id}`);
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'customers', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `customers/${id}`);
    }
  };

  const saveTestimonial = async (item: Partial<Testimonial> & { id?: string }) => {
    const id = item.id || makeSafeId('test');
    const payload = {
      guestName: trimStr(item.guestName, 100),
      guestOrigin: trimStr(item.guestOrigin || '', 100),
      journeyTitle: trimStr(item.journeyTitle || '', 140),
      quote: trimStr(item.quote, 1200),
      rating: Math.max(1, Math.min(5, Number(item.rating) || 5)),
      stayDateLabel: trimStr(item.stayDateLabel || '', 60),
      isFeatured: Boolean(item.isFeatured),
      isPublished: item.isPublished ?? true,
      isSample: Boolean(item.isSample),
      updatedAt: serverTimestamp(),
    };
    try {
      const ref = doc(db, 'testimonials', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, { ...payload, createdAt: snap.data().createdAt });
      } else {
        await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
      }
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `testimonials/${id}`);
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `testimonials/${id}`);
    }
  };

  const saveBlogPost = async (item: Partial<BlogPost> & { id?: string }) => {
    const id = item.id || slugify(item.slug || item.title || '') || makeSafeId('post');
    const payload = {
      slug: slugify(item.slug || item.title || id) || 'dispatch',
      title: trimStr(item.title, 160),
      category: trimStr(item.category || 'Field Notes', 60),
      excerpt: trimStr(item.excerpt, 500),
      content: trimStr(item.content, 15000),
      coverImage: trimStr(item.coverImage || INITIAL_BLOG_POSTS[0].coverImage, 1000),
      authorName: trimStr(item.authorName || 'AVENTRA Editorial Desk', 100),
      readTimeMinutes: Math.max(1, Math.min(120, Number(item.readTimeMinutes) || 5)),
      publishedDateLabel: trimStr(item.publishedDateLabel || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), 60),
      isFeatured: Boolean(item.isFeatured),
      isPublished: item.isPublished ?? true,
      isSample: Boolean(item.isSample),
      updatedAt: serverTimestamp(),
    };
    try {
      const ref = doc(db, 'blogPosts', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, { ...payload, createdAt: snap.data().createdAt });
      } else {
        await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
      }
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `blogPosts/${id}`);
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'blogPosts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `blogPosts/${id}`);
    }
  };

  const saveGalleryItem = async (item: Partial<GalleryItem> & { id?: string }) => {
    const id = item.id || makeSafeId('gal');
    const payload = {
      title: trimStr(item.title, 120),
      region: trimStr(item.region || 'Sri Lanka', 80),
      category: trimStr(item.category || 'Landscapes', 60),
      imageUrl: trimStr(item.imageUrl, 1000),
      caption: trimStr(item.caption || '', 300),
      isPublished: item.isPublished ?? true,
      isSample: Boolean(item.isSample),
      updatedAt: serverTimestamp(),
    };
    try {
      const ref = doc(db, 'gallery', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, { ...payload, createdAt: snap.data().createdAt });
      } else {
        await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
      }
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `gallery/${id}`);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `gallery/${id}`);
    }
  };

  const submitContactMessage = async (payload: {
    type: 'contact' | 'newsletter';
    fullName: string;
    email: string;
    phone?: string;
    subject?: string;
    message?: string;
  }) => {
    const id = makeSafeId('msg');
    const docData = {
      type: payload.type,
      fullName: trimStr(payload.fullName || 'Guest', 120),
      email: trimStr(payload.email, 200).toLowerCase(),
      phone: trimStr(payload.phone || '', 40),
      subject: trimStr(payload.subject || '', 180),
      message: trimStr(payload.message || '', 3000),
      status: 'unread' as ContactMessageStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    try {
      await setDoc(doc(db, 'contactMessages', id), docData);
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `contactMessages/${id}`);
    }
  };

  const updateContactMessage = async (id: string, status: ContactMessageStatus, adminNotes?: string) => {
    try {
      const ref = doc(db, 'contactMessages', id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const existing = snap.data();
      await updateDoc(ref, {
        ...existing,
        status,
        adminNotes: trimStr(adminNotes ?? existing.adminNotes ?? '', 2000),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `contactMessages/${id}`);
    }
  };

  const deleteContactMessage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'contactMessages', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `contactMessages/${id}`);
    }
  };

  const saveWebsiteSettings = async (updates: Partial<WebsiteSettings>) => {
    const merged: WebsiteSettings = {
      ...settings,
      ...updates,
      brandName: trimStr(updates.brandName ?? settings.brandName, 80),
      tagline: trimStr(updates.tagline ?? settings.tagline, 160),
      heroHeadline: trimStr(updates.heroHeadline ?? settings.heroHeadline, 200),
      heroSubheadline: trimStr(updates.heroSubheadline ?? settings.heroSubheadline, 600),
      heroImageUrl: trimStr(updates.heroImageUrl ?? settings.heroImageUrl, 1000),
      contactEmail: trimStr(updates.contactEmail ?? settings.contactEmail, 200),
      contactPhone: trimStr(updates.contactPhone ?? settings.contactPhone, 60),
      whatsappNumber: trimStr(updates.whatsappNumber ?? settings.whatsappNumber, 60),
      officeAddress: trimStr(updates.officeAddress ?? settings.officeAddress, 300),
      instagramUrl: trimStr(updates.instagramUrl ?? settings.instagramUrl, 300),
      facebookUrl: trimStr(updates.facebookUrl ?? settings.facebookUrl, 300),
      youtubeUrl: trimStr(updates.youtubeUrl ?? settings.youtubeUrl, 300),
      tiktokUrl: trimStr(updates.tiktokUrl ?? settings.tiktokUrl, 300),
      founderName: trimStr(updates.founderName ?? settings.founderName, 120),
      founderRole: trimStr(updates.founderRole ?? settings.founderRole, 160),
      founderLetterTitle: trimStr(updates.founderLetterTitle ?? settings.founderLetterTitle, 180),
      founderLetterBody: trimStr(updates.founderLetterBody ?? settings.founderLetterBody, 4000),
      founderQuote: trimStr(updates.founderQuote ?? settings.founderQuote, 500),
      heritageEstablishedNote: trimStr(updates.heritageEstablishedNote ?? settings.heritageEstablishedNote, 200),
      accreditationsNote: trimStr(updates.accreditationsNote ?? settings.accreditationsNote, 400),
      footerDescription: trimStr(updates.footerDescription ?? settings.footerDescription, 500),
      newsletterPrompt: trimStr(updates.newsletterPrompt ?? settings.newsletterPrompt, 300),
    };
    try {
      await setDoc(doc(db, 'websiteSettings', 'public'), {
        ...merged,
        updatedAt: serverTimestamp(),
      });
      setSettings(merged);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'websiteSettings/public');
    }
  };

  const addAdminUser = async (
    uid: string,
    email: string,
    name: string,
    role: 'super_admin' | 'concierge_admin'
  ) => {
    try {
      await setDoc(doc(db, 'admins', uid.trim()), {
        email: trimStr(email, 200).toLowerCase(),
        name: trimStr(name, 120),
        role,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `admins/${uid}`);
    }
  };

  const removeAdminUser = async (uid: string) => {
    try {
      await deleteDoc(doc(db, 'admins', uid));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `admins/${uid}`);
    }
  };

  return (
    <DataContext.Provider
      value={{
        loadingPublic,
        loadingAdmin,
        hasLiveCatalog,
        seeding,
        destinations,
        experiences,
        tourPackages,
        testimonials,
        blogPosts,
        gallery,
        settings,
        inquiries,
        bookings,
        customers,
        contactMessages,
        admins,
        seedSampleCatalog,
        saveDestination,
        deleteDestination,
        saveExperience,
        deleteExperience,
        saveTourPackage,
        deleteTourPackage,
        submitInquiry,
        updateInquiry,
        deleteInquiry,
        convertInquiryToBooking,
        saveBooking,
        updateBookingStatus,
        deleteBooking,
        saveCustomer,
        deleteCustomer,
        saveTestimonial,
        deleteTestimonial,
        saveBlogPost,
        deleteBlogPost,
        saveGalleryItem,
        deleteGalleryItem,
        submitContactMessage,
        updateContactMessage,
        deleteContactMessage,
        saveWebsiteSettings,
        addAdminUser,
        removeAdminUser,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
