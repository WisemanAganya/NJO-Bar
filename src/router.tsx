import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from './App';
import { CMSLayout } from './components/cms/CMSLayout';
import { AdminDashboard } from './components/AdminDashboard';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { BookingManagerFull } from './components/BookingManagerFull';
import { CocktailManager } from './components/CocktailManager';
import { CourseManager } from './components/CourseManager';
import { InventoryManagerFull } from './components/InventoryManagerFull';
import { UserManager } from './components/UserManager';
import { ReminderManager } from './components/ReminderManager';
import { LeadManager } from './components/LeadManager';
import { BlogManager } from './components/BlogManager';
import { OrdersManager } from './components/OrdersManager';
import { SettingsManager } from './components/SettingsManager';
import { VoucherManager } from './components/VoucherManager';
import { AuditManager } from './components/AuditManager';
import VoucherVerifier from './components/VoucherVerifier';
import { Hero } from './components/Hero';
import { BookingSection } from './components/BookingSection';
import { CourseList } from './components/CourseList';
import { OurDrinks } from './components/OurDrinks';
import { EventHistory } from './components/EventHistory';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { CustomerDashboard } from './components/CustomerDashboard';
import { CocktailGallery } from './components/CocktailGallery';
import { PackageBuilder } from './components/PackageBuilder';
import { MembershipPage } from './components/MembershipPage';
import { VoucherSystem } from './components/VoucherSystem';

import { EventTypesSection } from './components/EventTypesSection';

// Protected Route Wrapper
const ProtectedRoute = ({ children, profile, role }: { children: React.ReactNode, profile: any, role?: string }) => {
  if (!profile) return <Navigate to="/" replace />;
  if (role && profile.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export const createRouter = (user: any, profile: any, onLogout: () => void) => createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <>
            <Hero onStartBooking={() => {}} />
            <EventTypesSection />
            <CourseList />
            <CocktailGallery user={user} />
          </>
        )
      },
      { path: 'bookings', element: <div className="pt-20"><BookingSection user={user} /></div> },
      { path: 'academy', element: <div className="pt-20"><CourseList /></div> },
      { path: 'drinks', element: <div className="pt-20"><OurDrinks user={user} /></div> },
      { path: 'packages', element: <div className="pt-20"><PackageBuilder user={user} /></div> },
      { path: 'events', element: <div className="pt-20"><EventHistory /></div> },
      { path: 'blog', element: <div className="pt-20"><BlogSection /></div> },
      { path: 'contact', element: <div className="pt-20"><ContactSection /></div> },
      { path: 'account', element: <div className="pt-20"><CustomerDashboard user={user} /></div> },
      { path: 'community', element: <div className="pt-20"><CocktailGallery user={user} /></div> },
      { path: 'membership', element: <div className="pt-20"><MembershipPage /></div> },
      { path: 'vouchers', element: <div className="pt-20"><VoucherSystem /></div> },
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
      { 
        path: 'orders', 
        element: <OrdersManager />
      },
      { 
        path: 'settings', 
        element: <SettingsManager />
      },
    ]
  }
]);
