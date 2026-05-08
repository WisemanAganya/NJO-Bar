import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from './App';

// Loading Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-zinc-950">
    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// Lazy Loaded Components
const CMSLayout = lazy(() => import('./components/cms/CMSLayout').then(m => ({ default: m.CMSLayout })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard })));
const BookingManagerFull = lazy(() => import('./components/BookingManagerFull').then(m => ({ default: m.BookingManagerFull })));
const CocktailManager = lazy(() => import('./components/CocktailManager').then(m => ({ default: m.CocktailManager })));
const CourseManager = lazy(() => import('./components/CourseManager').then(m => ({ default: m.CourseManager })));
const InventoryManagerFull = lazy(() => import('./components/InventoryManagerFull').then(m => ({ default: m.InventoryManagerFull })));
const UserManager = lazy(() => import('./components/UserManager').then(m => ({ default: m.UserManager })));
const ReminderManager = lazy(() => import('./components/ReminderManager').then(m => ({ default: m.ReminderManager })));
const LeadManager = lazy(() => import('./components/LeadManager').then(m => ({ default: m.LeadManager })));
const BlogManager = lazy(() => import('./components/BlogManager').then(m => ({ default: m.BlogManager })));
const OrdersManager = lazy(() => import('./components/OrdersManager').then(m => ({ default: m.OrdersManager })));
const SettingsManager = lazy(() => import('./components/SettingsManager').then(m => ({ default: m.SettingsManager })));
const VoucherManager = lazy(() => import('./components/VoucherManager').then(m => ({ default: m.VoucherManager })));
const AuditManager = lazy(() => import('./components/AuditManager').then(m => ({ default: m.AuditManager })));
const MembershipManager = lazy(() => import('./components/MembershipManager').then(m => ({ default: m.MembershipManager })));
const CommunicationManager = lazy(() => import('./components/CommunicationManager').then(m => ({ default: m.CommunicationManager })));
const MeetingManager = lazy(() => import('./components/MeetingManager').then(m => ({ default: m.MeetingManager })));
const VoucherVerifier = lazy(() => import('./components/VoucherVerifier'));

const Hero = lazy(() => import('./components/Hero').then(m => ({ default: m.Hero })));
const BookingSection = lazy(() => import('./components/BookingSection').then(m => ({ default: m.BookingSection })));
const CourseList = lazy(() => import('./components/CourseList').then(m => ({ default: m.CourseList })));
const OurDrinks = lazy(() => import('./components/OurDrinks').then(m => ({ default: m.OurDrinks })));
const EventHistory = lazy(() => import('./components/EventHistory').then(m => ({ default: m.EventHistory })));
const BlogSection = lazy(() => import('./components/BlogSection').then(m => ({ default: m.BlogSection })));
const ContactSection = lazy(() => import('./components/ContactSection').then(m => ({ default: m.ContactSection })));
const CustomerDashboard = lazy(() => import('./components/CustomerDashboard').then(m => ({ default: m.CustomerDashboard })));
const CocktailGallery = lazy(() => import('./components/CocktailGallery').then(m => ({ default: m.CocktailGallery })));
const PackageBuilder = lazy(() => import('./components/PackageBuilder').then(m => ({ default: m.PackageBuilder })));
const MembershipPage = lazy(() => import('./components/MembershipPage').then(m => ({ default: m.MembershipPage })));
const VoucherSystem = lazy(() => import('./components/VoucherSystem').then(m => ({ default: m.VoucherSystem })));
const EventTypesSection = lazy(() => import('./components/EventTypesSection').then(m => ({ default: m.EventTypesSection })));

// Protected Route Wrapper
const ProtectedRoute = ({ children, profile, role }: { children: React.ReactNode, profile: any, role?: string }) => {
  if (!profile) return <Navigate to="/" replace />;
  if (role && profile.role !== role) return <Navigate to="/" replace />;
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
};

export const createRouter = (user: any, profile: any, onLogout: () => void) => createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Hero onStartBooking={() => {}} />
            <EventTypesSection />
            <CourseList />
            <CocktailGallery user={user} />
          </Suspense>
        )
      },
      { path: 'bookings', element: <div className="pt-20"><Suspense fallback={<PageLoader />}><BookingSection user={user} /></Suspense></div> },
      { path: 'academy', element: <div className="pt-20"><Suspense fallback={<PageLoader />}><CourseList /></Suspense></div> },
      { path: 'drinks', element: <div className="pt-20"><Suspense fallback={<PageLoader />}><OurDrinks user={user} /></Suspense></div> },
      { path: 'packages', element: <div className="pt-20"><Suspense fallback={<PageLoader />}><PackageBuilder user={user} /></Suspense></div> },
      { path: 'events', element: <div className="pt-20"><Suspense fallback={<PageLoader />}><EventHistory /></Suspense></div> },
      { path: 'blog', element: <div className="pt-20"><Suspense fallback={<PageLoader />}><BlogSection /></Suspense></div> },
      { path: 'contact', element: <div className="pt-20"><Suspense fallback={<PageLoader />}><ContactSection /></Suspense></div> },
      { path: 'account', element: <div className="pt-20"><Suspense fallback={<PageLoader />}><CustomerDashboard user={user} /></Suspense></div> },
      { path: 'community', element: <div className="pt-20"><Suspense fallback={<PageLoader />}><CocktailGallery user={user} /></Suspense></div> },
      { path: 'membership', element: <div className="pt-20"><Suspense fallback={<PageLoader />}><MembershipPage /></Suspense></div> },
      { path: 'vouchers', element: <div className="pt-20"><Suspense fallback={<PageLoader />}><VoucherSystem /></Suspense></div> },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  },
  {
    path: '/admin/verify/:code',
    element: (
      <ProtectedRoute profile={profile} role="admin">
        <VoucherVerifier />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute profile={profile} role="admin">
        <CMSLayout user={profile} onLogout={onLogout} />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'analytics', element: <AnalyticsDashboard /> },
      { path: 'members', element: <MembershipManager /> },
      { path: 'comms', element: <CommunicationManager /> },
      { path: 'meetings', element: <MeetingManager /> },
      { path: 'bookings', element: <BookingManagerFull /> },
      { path: 'cocktails', element: <CocktailManager /> },
      { path: 'courses', element: <CourseManager /> },
      { path: 'inventory', element: <InventoryManagerFull /> },
      { path: 'users', element: <UserManager /> },
      { path: 'reminders', element: <ReminderManager /> },
      { path: 'leads', element: <LeadManager /> },
      { path: 'blog', element: <BlogManager /> },
      { path: 'vouchers', element: <VoucherManager /> },
      { path: 'audit', element: <AuditManager /> },
      { path: 'orders', element: <OrdersManager /> },
      { path: 'settings', element: <SettingsManager /> },
    ]
  }
]);
