import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Star, Zap, Crown, CheckCircle2, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Magnetic from '@/components/ui/magnetic';
import { useAuth } from '@/contexts/AuthContext';

export function MembershipPage() {
  const { setShowLogin } = useAuth();
  const benefits = [
    {
      icon: Crown,
      title: 'Priority Booking',
      desc: 'Skip the queue for Kenya\'s most exclusive event dates and private concierge support.'
    },
    {
      icon: Star,
      title: 'Member Rates',
      desc: 'Access artisanal spirits and premium mixology packages at exclusive community pricing.'
    },
    {
      icon: Zap,
      title: 'Early Access',
      desc: 'Be the first to know about our signature workshops, academy openings, and secret pop-ups.'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Wallet',
      desc: 'Manage your event deposits and recurring bookings with our encrypted payment vault.'
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-24 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-6"
          >
            NJO BAR Private Access
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8 text-white"
          >
            Join the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-800">Elite Circle.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/40 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Elevate your mixology experience. Membership at NJO BAR isn't just about drinks; it's about belonging to Nairobi's most artisanal service community.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-amber-500/50 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-8 border border-amber-500/20 group-hover:scale-110 transition-transform">
                <benefit.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">{benefit.title}</h3>
              <p className="text-sm text-white/40 font-medium leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="max-w-5xl mx-auto rounded-[4rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10 p-12 lg:p-24 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10" />
          
          <div className="relative z-10 space-y-12">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
              Ready to <span className="text-amber-500">Initialize</span> Your Status?
            </h2>
            <p className="text-lg text-white/60 font-bold max-w-xl mx-auto uppercase tracking-widest leading-loose">
              Access the portal and start your premium journey today.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
              <Magnetic>
                <Button 
                  onClick={() => setShowLogin(true)}
                  className="bg-amber-500 text-black font-black px-12 h-20 rounded-[2rem] text-sm uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(255,107,53,0.3)] w-full md:w-auto"
                >
                  Sign In to Access <ArrowRight className="ml-3 w-5 h-5" />
                </Button>
              </Magnetic>
              <Magnetic>
                <Button 
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5 font-black px-12 h-20 rounded-[2rem] text-sm uppercase tracking-[0.2em] w-full md:w-auto"
                >
                  Learn More <CheckCircle2 className="ml-3 w-5 h-5 text-amber-500" />
                </Button>
              </Magnetic>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
