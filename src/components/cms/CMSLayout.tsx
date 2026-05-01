import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate, Link, Outlet } from 'react-router-dom';
import { CommandPalette } from './CommandPalette';
import { 
  LayoutDashboard, 
  GlassWater, 
  GraduationCap, 
  Calendar, 
  Package, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  BarChart3,
  Mail,
  BookOpen,
  ShoppingCart,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CMSLayoutProps {
  onLogout: () => void;
  user: any;
  children?: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export function CMSLayout({ onLogout, user, children }: CMSLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/admin/bookings' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { id: 'reminders', label: 'Reminders', icon: Bell, path: '/admin/reminders' },
    { id: 'leads', label: 'Leads', icon: Mail, path: '/admin/leads' },
    { id: 'cocktails', label: 'Our Drinks', icon: GlassWater, path: '/admin/cocktails' },
    { id: 'courses', label: 'Courses', icon: GraduationCap, path: '/admin/courses' },
    { id: 'inventory', label: 'Inventory', icon: Package, path: '/admin/inventory' },
    { id: 'blog', label: 'Blog', icon: BookOpen, path: '/admin/blog' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const currentPath = location.pathname;
  const activeTab = menuItems.find(item => item.path === currentPath)?.id || 'dashboard';

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      <CommandPalette />
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-zinc-900/50 backdrop-blur-xl border-r border-white/5 transition-all duration-300 flex flex-col z-50",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,107,53,0.4)]">
                <span className="text-black font-bold text-xs">NJO</span>
              </div>
              <span className="font-bold tracking-tighter">CMS<span className="text-amber-500">BAR</span></span>
            </motion.div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white/40 hover:text-white hover:bg-white/5"
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-8 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative",
                activeTab === item.id 
                  ? "bg-amber-500 text-black font-bold shadow-[0_4px_20px_rgba(255,107,53,0.25)]" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", activeTab === item.id ? "text-black" : "text-amber-500/60 group-hover:text-amber-500")} />
              {isSidebarOpen && <span className="text-sm">{item.label}</span>}
              {activeTab === item.id && isSidebarOpen && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute right-2 w-1 h-5 bg-black/20 rounded-full"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-4">
          <div className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5",
            !isSidebarOpen && "justify-center p-2"
          )}>
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold text-sm shrink-0">
              {user?.displayName?.[0] || 'A'}
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user?.displayName || 'Administrator'}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">{user?.role || 'Admin'}</p>
              </div>
            )}
          </div>
          <Button 
            onClick={onLogout}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl"
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isSidebarOpen && 'Logout'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col relative bg-zinc-950">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px]" />
        </div>

        {/* Top Header */}
        <header className="h-16 border-b border-white/5 bg-zinc-900/50 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-medium text-white/60 flex items-center gap-2">
              Admin <ChevronRight className="w-4 h-4" /> 
              <span className="text-white capitalize">{activeTab}</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-white/40 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-zinc-900" />
            </Button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 relative z-10 scroll-smooth">
          <div className="max-w-7xl mx-auto min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {children || <Outlet />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
