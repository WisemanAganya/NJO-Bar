import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, GlassWater, ShieldCheck, Zap, Sparkles, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Magnetic from '@/components/ui/magnetic';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1596394516093-501ba68352ba?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1504642328773-d3f82f0f8e65?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1543269865-cbdf26861551?auto=format&fit=crop&q=80&w=1920'
];

export function Hero({ onStartBooking }: { onStartBooking: () => void }) {
  const [currentImage, setCurrentImage] = React.useState(0);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 10000);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950 pt-20">
      {/* Background Slideshow with Ken Burns Effect */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: 0.6, 
              scale: 1.25,
              transition: { duration: 15, ease: "linear" } 
            }}
            exit={{ opacity: 0, transition: { duration: 3 } }}
            className="absolute inset-0"
          >
            <img 
              src={HERO_IMAGES[currentImage]} 
              alt="Luxury Bar" 
              className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.1] saturate-[1.1]"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Advanced Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/20 to-zinc-950 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-10" />
        
        {/* Animated Grid lines for tech feel */}
        <div className="absolute inset-0 z-10 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="container mx-auto px-4 z-30 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl mx-auto"
        >
          {/* Floating Live Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12 backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Live: Now Booking for May 2026
          </motion.div>

          <div className="relative mb-16">
            <h1 className="text-6xl md:text-[10rem] font-black tracking-tighter text-white leading-[0.85] uppercase">
              Nairobi's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-800 drop-shadow-[0_10px_30px_rgba(255,107,53,0.3)]">
                Elite Pour.
              </span>
            </h1>
            
            {/* Absolute positioned floating elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="hidden xl:flex absolute -right-12 top-0 w-48 p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl flex-col items-center gap-2"
            >
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
              </div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Top Rated 2025</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-end">
            <div className="text-left space-y-10">
              <p className="text-xl md:text-2xl text-white/40 font-medium max-w-2xl leading-relaxed">
                Elevating Westlands and beyond. We bring world-class mixology, artisanal spirits, and precision event management to Kenya's most exclusive gatherings.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Magnetic>
                  <Button 
                    size="lg" 
                    onClick={onStartBooking}
                    className="bg-amber-500 text-black hover:bg-amber-600 h-20 px-12 text-xl font-black rounded-3xl group shadow-[0_20px_40px_rgba(255,107,53,0.4)] transition-all"
                  >
                    RESERVE NOW <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform stroke-[3px]" />
                  </Button>
                </Magnetic>
                <div className="flex items-center gap-4 text-white/40">
                  <div className="w-px h-12 bg-white/10 hidden sm:block" />
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Trusted By</p>
                    <p className="text-sm font-bold text-white/60 uppercase tracking-tighter">Corporate Elite & Private Hosts</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl text-left space-y-4 hover:border-amber-500/50 transition-colors cursor-default group">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all">
                  <GlassWater className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Bespoke Recipes</h3>
              </div>
              <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl text-left space-y-4 hover:border-amber-500/50 transition-colors cursor-default group">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Full Concierge</h3>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-amber-500/10 blur-[160px] rounded-full pointer-events-none" />
    </div>
  );
}
