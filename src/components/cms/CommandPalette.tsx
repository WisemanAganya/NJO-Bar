import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  Package, 
  GlassWater, 
  Users, 
  BarChart3, 
  Settings,
  Mail,
  BookOpen,
  LayoutDashboard
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Command } from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { id: 'bookings', label: 'View Bookings', icon: Calendar, path: '/admin/bookings' },
    { id: 'cocktails', label: 'Manage Cocktails', icon: GlassWater, path: '/admin/cocktails' },
    { id: 'inventory', label: 'Inventory Management', icon: Package, path: '/admin/inventory' },
    { id: 'users', label: 'User Directory', icon: Users, path: '/admin/users' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
    { id: 'blog', label: 'Blog Manager', icon: BookOpen, path: '/admin/blog' },
    { id: 'leads', label: 'Lead Management', icon: Mail, path: '/admin/leads' },
  ];

  const filteredItems = items.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const onSelect = (path: string) => {
    navigate(path);
    setOpen(false);
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-2xl top-[20%] translate-y-0">
        <div className="bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
          <div className="flex items-center px-4 py-4 border-b border-white/5">
            <Search className="w-5 h-5 text-white/40 mr-3" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search admin modules... (↑↓ to navigate)"
              className="bg-transparent border-none p-0 focus-visible:ring-0 text-lg h-auto text-white placeholder:text-white/20"
              autoFocus
            />
            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/5 ml-auto">
              <span className="text-[10px] font-bold text-white/40">ESC</span>
            </div>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto p-2">
            {filteredItems.length > 0 ? (
              <div className="space-y-1">
                {filteredItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item.path)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-amber-500 group transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-black/20 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-amber-500 group-hover:text-black" />
                    </div>
                    <span className="text-sm font-medium text-white/70 group-hover:text-black">
                      {item.label}
                    </span>
                    <span className="ml-auto text-[10px] font-bold text-white/20 group-hover:text-black/40 uppercase tracking-widest">
                      Module
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-white/40 text-sm italic">No modules found matching "{query}"</p>
              </div>
            )}
          </div>
          
          <div className="px-4 py-3 border-t border-white/5 bg-black/20 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-white/20">Navigate:</span>
              <div className="flex gap-0.5">
                <span className="text-[10px] bg-white/5 px-1 rounded border border-white/5 text-white/40">↑</span>
                <span className="text-[10px] bg-white/5 px-1 rounded border border-white/5 text-white/40">↓</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-white/20">Select:</span>
              <span className="text-[10px] bg-white/5 px-1 rounded border border-white/5 text-white/40">Enter</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
               <Command className="w-3 h-3 text-white/20" />
               <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Quick Search Enabled</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
