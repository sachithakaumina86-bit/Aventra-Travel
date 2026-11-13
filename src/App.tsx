import React, { useEffect } from 'react';
import { BrowserRouter, Link, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingConcierge } from './components/FloatingConcierge';
import { AdminGuard } from './components/AdminGuard';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { DestinationsPage } from './pages/public/DestinationsPage';
import { DestinationDetailPage } from './pages/public/DestinationDetailPage';
import { ExperiencesPage } from './pages/public/ExperiencesPage';
import { ExperienceDetailPage } from './pages/public/ExperienceDetailPage';
import { AboutPage } from './pages/public/AboutPage';
import { PackagesPage } from './pages/public/PackagesPage';
import { PackageDetailPage } from './pages/public/PackageDetailPage';
import { PlanJourneyPage } from './pages/public/PlanJourneyPage';
import { ContactPage } from './pages/public/ContactPage';
import { JournalPage } from './pages/public/JournalPage';
import { JournalDetailPage } from './pages/public/JournalDetailPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminDestinationsPage } from './pages/admin/AdminDestinationsPage';
import { AdminPackagesPage } from './pages/admin/AdminPackagesPage';
import { AdminExperiencesPage } from './pages/admin/AdminExperiencesPage';
import { AdminBookingsInquiriesPage } from './pages/admin/AdminBookingsInquiriesPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage';
import { AdminBlogPage } from './pages/admin/AdminBlogPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
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
        className="inline-block bg-[#064E3B] text-[#FAF9F5] px-7 py-3.5 text-xs uppercase tracking-[0.18em] font-semibold"
      >
        Return Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <ScrollToTop />
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
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
