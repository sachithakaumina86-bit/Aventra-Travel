import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Link, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingConcierge } from './components/FloatingConcierge';
import { AdminGuard } from './components/AdminGuard';
import { SeoHeadSync } from './components/SeoHeadSync';
import { PageTransitionShell } from './components/MotionPrimitives';
import {
  AdminShellSkeleton,
  DestinationDirectorySkeleton,
  DestinationsPageFallbackSkeleton,
  ExperiencesPageFallbackSkeleton,
  JournalPageFallbackSkeleton,
  PackagesPageFallbackSkeleton,
} from './components/CardSkeletons';
import { HomePage } from './pages/public/HomePage';

// Lazy-loaded Public Pages (keeps initial "/" bundle lean while HomePage renders immediately)
const DestinationsPage = lazy(() =>
  import('./pages/public/DestinationsPage').then((m) => ({ default: m.DestinationsPage }))
);
const DestinationDetailPage = lazy(() =>
  import('./pages/public/DestinationDetailPage').then((m) => ({ default: m.DestinationDetailPage }))
);
const ExperiencesPage = lazy(() =>
  import('./pages/public/ExperiencesPage').then((m) => ({ default: m.ExperiencesPage }))
);
const ExperienceDetailPage = lazy(() =>
  import('./pages/public/ExperienceDetailPage').then((m) => ({ default: m.ExperienceDetailPage }))
);
const AboutPage = lazy(() =>
  import('./pages/public/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const PackagesPage = lazy(() =>
  import('./pages/public/PackagesPage').then((m) => ({ default: m.PackagesPage }))
);
const PackageDetailPage = lazy(() =>
  import('./pages/public/PackageDetailPage').then((m) => ({ default: m.PackageDetailPage }))
);
const PlanJourneyPage = lazy(() =>
  import('./pages/public/PlanJourneyPage').then((m) => ({ default: m.PlanJourneyPage }))
);
const ContactPage = lazy(() =>
  import('./pages/public/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const JournalPage = lazy(() =>
  import('./pages/public/JournalPage').then((m) => ({ default: m.JournalPage }))
);
const JournalDetailPage = lazy(() =>
  import('./pages/public/JournalDetailPage').then((m) => ({ default: m.JournalDetailPage }))
);

// Lazy-loaded Admin Portal Pages (isolated from public visitor payload)
const AdminLoginPage = lazy(() =>
  import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage }))
);
const AdminDashboardPage = lazy(() =>
  import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
);
const AdminDestinationsPage = lazy(() =>
  import('./pages/admin/AdminDestinationsPage').then((m) => ({ default: m.AdminDestinationsPage }))
);
const AdminPackagesPage = lazy(() =>
  import('./pages/admin/AdminPackagesPage').then((m) => ({ default: m.AdminPackagesPage }))
);
const AdminExperiencesPage = lazy(() =>
  import('./pages/admin/AdminExperiencesPage').then((m) => ({ default: m.AdminExperiencesPage }))
);
const AdminBookingsInquiriesPage = lazy(() =>
  import('./pages/admin/AdminBookingsInquiriesPage').then((m) => ({
    default: m.AdminBookingsInquiriesPage,
  }))
);
const AdminCustomersPage = lazy(() =>
  import('./pages/admin/AdminCustomersPage').then((m) => ({ default: m.AdminCustomersPage }))
);
const AdminTestimonialsPage = lazy(() =>
  import('./pages/admin/AdminTestimonialsPage').then((m) => ({ default: m.AdminTestimonialsPage }))
);
const AdminBlogPage = lazy(() =>
  import('./pages/admin/AdminBlogPage').then((m) => ({ default: m.AdminBlogPage }))
);
const AdminGalleryPage = lazy(() =>
  import('./pages/admin/AdminGalleryPage').then((m) => ({ default: m.AdminGalleryPage }))
);
const AdminMessagesPage = lazy(() =>
  import('./pages/admin/AdminMessagesPage').then((m) => ({ default: m.AdminMessagesPage }))
);
const AdminSettingsPage = lazy(() =>
  import('./pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage }))
);
const AdminProfilePage = lazy(() =>
  import('./pages/admin/AdminProfilePage').then((m) => ({ default: m.AdminProfilePage }))
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function RouteFallback() {
  const { pathname } = useLocation();

  if (pathname === '/destinations') {
    return <DestinationsPageFallbackSkeleton />;
  }
  if (pathname === '/experiences') {
    return <ExperiencesPageFallbackSkeleton />;
  }
  if (pathname === '/packages') {
    return <PackagesPageFallbackSkeleton />;
  }
  if (pathname === '/journal') {
    return <JournalPageFallbackSkeleton />;
  }
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    return <AdminShellSkeleton />;
  }

  return (
    <div
      className="pt-28 pb-20 bg-[#FAF9F5] min-h-[75vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10"
      role="status"
      aria-busy="true"
      aria-label="Loading page content"
    >
      <span className="sr-only">Loading page content...</span>
      <div className="space-y-4 max-w-2xl">
        <div className="skeleton-block h-3 w-48" aria-hidden="true" />
        <div className="skeleton-block h-12 w-4/5" aria-hidden="true" />
        <div className="skeleton-block h-4 w-full" aria-hidden="true" />
      </div>
      <DestinationDirectorySkeleton count={3} />
    </div>
  );
}

function PublicLayout() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
      <Navbar />
      <main className="flex-1">
        <PageTransitionShell routeKey={pathname}>
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </PageTransitionShell>
      </main>
      <Footer />
      <FloatingConcierge />
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="pt-36 pb-28 text-center px-4 space-y-5">
      <span className="text-[11px] uppercase tracking-[0.26em] text-[#745B1C] font-semibold">
        404 • Route Not Found
      </span>
      <h1 className="font-serif text-4xl sm:text-6xl text-[#064E3B]">
        Beyond Our Mapped Coordinates
      </h1>
      <p className="text-sm text-[#404944] max-w-md mx-auto">
        The page you are looking for may have moved or been archived. Return to AVENTRA’s curated Sri Lanka sanctuaries.
      </p>
      <Link
        to="/"
        className="inline-flex items-center min-h-[44px] bg-[#064E3B] hover:bg-[#022C22] text-[#FAF9F5] px-7 py-3.5 text-xs uppercase tracking-[0.18em] font-semibold transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <ScrollToTop />
            <SeoHeadSync />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                {/* Public Website */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/destinations" element={<DestinationsPage />} />
                  <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
                  <Route path="/experiences" element={<ExperiencesPage />} />
                  <Route path="/experiences/:slug" element={<ExperienceDetailPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/packages" element={<PackagesPage />} />
                  <Route path="/packages/:slug" element={<PackageDetailPage />} />
                  <Route path="/plan-your-journey" element={<PlanJourneyPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/journal" element={<JournalPage />} />
                  <Route path="/journal/:slug" element={<JournalDetailPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* Admin Auth */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Protected Admin Portal */}
                <Route
                  path="/admin"
                  element={
                    <AdminGuard>
                      <AdminDashboardPage />
                    </AdminGuard>
                  }
                />
                <Route
                  path="/admin/destinations"
                  element={
                    <AdminGuard>
                      <AdminDestinationsPage />
                    </AdminGuard>
                  }
                />
                <Route
                  path="/admin/packages"
                  element={
                    <AdminGuard>
                      <AdminPackagesPage />
                    </AdminGuard>
                  }
                />
                <Route
                  path="/admin/experiences"
                  element={
                    <AdminGuard>
                      <AdminExperiencesPage />
                    </AdminGuard>
                  }
                />
                <Route
                  path="/admin/bookings"
                  element={
                    <AdminGuard>
                      <AdminBookingsInquiriesPage initialTab="bookings" />
                    </AdminGuard>
                  }
                />
                <Route
                  path="/admin/inquiries"
                  element={
                    <AdminGuard>
                      <AdminBookingsInquiriesPage initialTab="inquiries" />
                    </AdminGuard>
                  }
                />
                <Route
                  path="/admin/customers"
                  element={
                    <AdminGuard>
                      <AdminCustomersPage />
                    </AdminGuard>
                  }
                />
                <Route
                  path="/admin/testimonials"
                  element={
                    <AdminGuard>
                      <AdminTestimonialsPage />
                    </AdminGuard>
                  }
                />
                <Route
                  path="/admin/blog"
                  element={
                    <AdminGuard>
                      <AdminBlogPage />
                    </AdminGuard>
                  }
                />
                <Route
                  path="/admin/gallery"
                  element={
                    <AdminGuard>
                      <AdminGalleryPage />
                    </AdminGuard>
                  }
                />
                <Route
                  path="/admin/messages"
                  element={
                    <AdminGuard>
                      <AdminMessagesPage />
                    </AdminGuard>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <AdminGuard>
                      <AdminSettingsPage />
                    </AdminGuard>
                  }
                />
                <Route
                  path="/admin/profile"
                  element={
                    <AdminGuard>
                      <AdminProfilePage />
                    </AdminGuard>
                  }
                />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
