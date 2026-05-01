import React, { useState } from 'react';
import { CMSLayout } from './cms/CMSLayout';
import { AdminDashboard } from './AdminDashboard';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { BookingManagerFull } from './BookingManagerFull';
import { CocktailManager } from './CocktailManager';
import { CourseManager } from './CourseManager';
import { InventoryManagerFull } from './InventoryManagerFull';
import { UserManager } from './UserManager';
import { ReminderManager } from './ReminderManager';
import { LeadManager } from './LeadManager';
import { BlogManager } from './BlogManager';

interface CMSRouterProps {
  user: any;
  onLogout: () => void;
}

export function CMSRouter({ user, onLogout }: CMSRouterProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'bookings':
        return <BookingManagerFull />;
      case 'cocktails':
        return <CocktailManager />;
      case 'courses':
        return <CourseManager />;
      case 'inventory':
        return <InventoryManagerFull />;
      case 'users':
        return <UserManager />;
      case 'reminders':
        return <ReminderManager />;
      case 'leads':
        return <LeadManager />;
      case 'blog':
        return <BlogManager />;
      case 'orders':
        return (
          <div className="text-white">
            <h2 className="text-3xl font-bold tracking-tight">Orders Manager</h2>
            <p className="text-white/50 mt-2">Coming soon: Full order management interface</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-white">
            <h2 className="text-3xl font-bold tracking-tight">CMS Settings</h2>
            <p className="text-white/50 mt-2">Coming soon: Application settings and configuration</p>
          </div>
        );
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <CMSLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={onLogout}
      user={user}
    >
      {renderContent()}
    </CMSLayout>
  );
}
