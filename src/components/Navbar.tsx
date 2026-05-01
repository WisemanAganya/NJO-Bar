import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Wine, Calendar, BookOpen, Package, Users, LogIn, LogOut, Menu, X, Briefcase, Camera, CheckCircle2, ChevronRight, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Magnetic from '@/components/ui/magnetic';

interface NavbarProps {
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

export function Navbar({ user, onLogin, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'bookings', label: 'Reservations', path: '/bookings' },
    { id: 'drinks', label: 'Our Cellar', path: '/drinks' },
    { id: 'packages', label: 'Packages', path: '/packages' },
    { id: 'events', label: 'Gallery', path: '/events' },
    { id: 'academy', label: 'Academy', path: '/academy' },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
        scrolled 
          ? "bg-zinc-950/80 backdrop-blur-2xl border-b border-white/5 py-3" 
          : "bg-transparent py-8"
      )}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => navigate('/')}
          >
            <div className="w-12 h-12 bg-amber-500 rounded-[1.25rem] flex items-center justify-center shadow-[0_10px_20px_rgba(255,107,53,0.3)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 overflow-hidden">
              <img 
                src="/logo.jpg" 
                alt="Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-black font-black text-xs">NJO</span>';
                }}
              />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white leading-none">
              NJO<span className="text-amber-500">BAR</span>
            </span>
          </motion.div>

          {/* Desktop Nav - Pill Design */}
          <div className="hidden lg:flex items-center bg-white/5 border border-white/10 backdrop-blur-md rounded-full px-2 py-1.5 shadow-2xl">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => cn(
                  "px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] transition-all rounded-full relative group",
                  isActive 
                    ? "text-black bg-amber-500 shadow-[0_5px_15px_rgba(255,107,53,0.3)]" 
                    : "text-white/40 hover:text-white"
                )}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {user?.role === 'admin' && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/admin')}
                className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/5 font-black text-[10px] uppercase tracking-widest border border-amber-500/20 px-6 rounded-2xl"
              >
                Admin
              </Button>
            )}
            {user ? (
              <div className="flex items-center gap-4 pl-6 border-l border-white/10 group cursor-pointer" onClick={() => navigate('/account')}>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">{user.displayName || 'Client'}</span>
                  <button onClick={(e) => { e.stopPropagation(); onLogout(); }} className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-500/50 hover:text-red-500 transition-colors">Sign Out</button>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 group-hover:border-amber-500/50 transition-all overflow-hidden shadow-inner">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="w-6 h-6 opacity-40" />
                  )}
                </div>
              </div>
            ) : (
              <Magnetic>
                <Button 
                  onClick={() => navigate('/membership')} 
                  className="bg-amber-500 text-black hover:bg-amber-600 font-black px-10 h-12 rounded-2xl shadow-[0_10px_20px_rgba(255,107,53,0.2)] text-[10px] uppercase tracking-widest"
                >
                  Membership
                </Button>
              </Magnetic>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-white hover:bg-white/5 rounded-2xl h-12 w-12 border border-white/5">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-zinc-950 border-b border-white/5 p-6 backdrop-blur-3xl shadow-2xl"
          >
            <div className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => cn(
                    "w-full px-8 py-6 rounded-[2rem] text-sm font-black uppercase tracking-[0.3em] flex items-center justify-between transition-all",
                    isActive ? "bg-amber-500 text-black" : "bg-white/5 text-white/40"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      <ChevronRight className={cn("w-5 h-5", isActive ? "text-black" : "text-white/10")} />
                    </>
                  )}
                </NavLink>
              ))}
              <div className="pt-8 grid grid-cols-1 gap-4">
                {user ? (
                  <Button variant="ghost" className="h-16 rounded-[2rem] bg-red-500/10 text-red-500 font-black uppercase tracking-widest text-xs" onClick={onLogout}>
                    Disconnect Account
                  </Button>
                ) : (
                  <Button className="h-16 rounded-[2rem] bg-amber-500 text-black font-black uppercase tracking-widest text-xs" onClick={onLogin}>
                    Client Access
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

