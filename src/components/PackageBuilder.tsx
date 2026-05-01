import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Users, Sparkles, Clock, Gift, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const PACKAGES = [
  {
    id: 'basic',
    title: 'Corporate Essentials',
    subtitle: 'Stylish service for meetings and office celebrations',
    description: 'Perfect for business networking and corporate sundowners in Nairobi.',
    price: 45000,
    guests: '20-50',
    perks: ['Mobile bar setup', 'Two professional bartenders', 'Standard spirits & mixers', 'Premium glassware included'],
  },
  {
    id: 'premium',
    title: 'Lifestyle Soirée',
    subtitle: 'High-energy service for lifestyle and launch events.',
    description: 'Bespoke cocktail menus and premium spirit selection for the elite social scene.',
    price: 85000,
    guests: '50-120',
    perks: ['Custom cocktail menu', 'Premium spirits & liqueurs', 'Brand styling & decor', 'Dedicated table service'],
  },
  {
    id: 'wedding',
    title: 'Wedding Celebration',
    subtitle: 'Elegant beverage coordination for receptions and ceremonies.',
    description: 'White-glove service for your special day, serving guests across Kenya.',
    price: 150000,
    guests: '80-200',
    perks: ['Signature wedding cocktail', 'Champagne toast for VIPs', 'Custom garnish bar', 'Dedicated lead mixologist'],
  },
];

export function PackageBuilder({ user }: { user: any }) {
  const [selectedPackage, setSelectedPackage] = React.useState(PACKAGES[0]);
  const [guestCount, setGuestCount] = React.useState(50);
  const [duration, setDuration] = React.useState(4);
  const [barStyle, setBarStyle] = React.useState('Classic');
  const [staffCount, setStaffCount] = React.useState(2);
  const [customQuote, setCustomQuote] = React.useState(0);
  const [bookingRequested, setBookingRequested] = React.useState(false);

  React.useEffect(() => {
    const tierMultiplier = guestCount > 120 ? 1.5 : guestCount > 80 ? 1.3 : guestCount > 50 ? 1.15 : 1;
    const durationFactor = duration > 4 ? 1 + (duration - 4) * 0.12 : 1;
    const staffFactor = 1 + (staffCount - 2) * 0.15;
    setCustomQuote(Math.round(selectedPackage.price * tierMultiplier * durationFactor * staffFactor));
  }, [guestCount, duration, staffCount, selectedPackage]);

  const requestQuote = async () => {
    if (!user) {
      toast.error('Please login to request a custom package quote.');
      return;
    }
    setBookingRequested(true);
    try {
      await supabase.from('package_requests').insert({
        user_id: user.id,
        package_id: selectedPackage.id,
        guest_count: guestCount,
        duration_hours: duration,
        bar_style: barStyle,
        staff_count: staffCount,
        estimated_price: customQuote,
        submitted_at: new Date().toISOString(),
      });
      toast.success('Your custom package request has been sent! Our team in Nairobi will contact you shortly.');
    } catch (error: any) {
      console.error('Package request error:', error);
      toast.error(error.message || 'Unable to submit request.');
    } finally {
      setBookingRequested(false);
    }
  };

  return (
    <section className="py-24 bg-zinc-950 text-white overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-[0.35em] text-amber-500 mb-4"
          >
            NJO Bar Packages
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tighter"
          >
            Elevated Mixology Experiences
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-2xl mx-auto mt-6 text-lg"
          >
            From Nairobi's corporate halls to private countryside retreats, we bring the premium bar experience to you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {PACKAGES.map((pkg, i) => (
            <motion.div 
              key={pkg.id} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative group rounded-3xl p-8 transition-all duration-500 ${
                selectedPackage.id === pkg.id 
                  ? 'bg-amber-500/10 border-2 border-amber-500 shadow-[0_0_40px_rgba(255,107,53,0.15)]' 
                  : 'bg-white/5 border border-white/10 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-amber-500" />
                </div>
                {selectedPackage.id === pkg.id && (
                  <Badge className="bg-amber-500 text-black font-bold animate-pulse">SELECTED</Badge>
                )}
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">{pkg.title}</h3>
              <p className="text-amber-500/80 text-sm font-medium uppercase tracking-wider mb-4">{pkg.subtitle}</p>
              <p className="text-white/50 text-sm leading-relaxed mb-8">{pkg.description}</p>
              
              <div className="space-y-4 mb-10">
                {pkg.perks.map((perk) => (
                  <div key={perk} className="flex items-center gap-3 text-white/70 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30">Starts From</p>
                  <p className="text-2xl font-black text-white">KSh {pkg.price.toLocaleString()}</p>
                </div>
                <Button 
                  onClick={() => setSelectedPackage(pkg)} 
                  variant={selectedPackage.id === pkg.id ? "default" : "outline"}
                  className="rounded-full font-bold px-6"
                >
                  {selectedPackage.id === pkg.id ? 'Active' : 'Choose'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12">
              <CardHeader className="px-0 pt-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-amber-500" />
                  </div>
                  <CardTitle className="text-3xl font-black tracking-tight">Customize Your Package</CardTitle>
                </div>
                <CardDescription className="text-white/40 text-lg">Adjust the details to match your specific event requirements in Nairobi.</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-10 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <Label className="text-white/60 uppercase tracking-widest text-xs font-bold">Estimated Guests</Label>
                      <span className="text-amber-500 font-bold text-lg">{guestCount} Guests</span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={500}
                      step={10}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-white/60 uppercase tracking-widest text-xs font-bold">Event Duration</Label>
                    <Select value={duration.toString()} onValueChange={(val) => setDuration(Number(val))}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl">
                        <SelectValue placeholder="Select hours" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10">
                        {[3, 4, 5, 6, 8, 12].map((hour) => (
                          <SelectItem key={hour} value={hour.toString()}>{hour} Hours Service</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <Label className="text-white/60 uppercase tracking-widest text-xs font-bold">Bar Setup Style</Label>
                    <Select value={barStyle} onValueChange={setBarStyle}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10">
                        {['Classic Mobile Bar', 'Premium Illuminated Bar', 'Luxury Cocktail Lounge', 'Rustic Garden Bar'].map((style) => (
                          <SelectItem key={style} value={style}>{style}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-white/60 uppercase tracking-widest text-xs font-bold">Staff Complement</Label>
                    <Select value={staffCount.toString()} onValueChange={(val) => setStaffCount(Number(val))}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl">
                        <SelectValue placeholder="Select staff" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10">
                        {[1, 2, 4, 6, 8].map((staff) => (
                          <SelectItem key={staff} value={staff.toString()}>{staff} Professional Bartenders</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-[2rem] bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.4em] text-amber-500 mb-2 font-black">Investment Quote</p>
                      <p className="text-5xl font-black text-white">KSh {customQuote.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="border-amber-500/30 text-amber-500 mb-2">Customized Quote</Badge>
                      <p className="text-white/30 text-xs">Inclusive of logistics within Nairobi</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-0 pb-0 pt-6">
                <Button 
                  size="lg"
                  onClick={requestQuote} 
                  disabled={bookingRequested} 
                  className="w-full bg-amber-500 text-black hover:bg-amber-600 h-16 rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(255,107,53,0.2)]"
                >
                  {bookingRequested ? 'Processing Request...' : 'Send Package Request'}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl p-8 rounded-[2rem]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="uppercase tracking-widest text-amber-500 text-[10px] font-black">Why NJO Bar?</p>
                  <h3 className="text-xl font-bold">Premium Assurance</h3>
                </div>
              </div>
              <ul className="space-y-4 text-white/50 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>Licensed and insured mobile bar services for peace of mind.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>Certified mixologists with international event experience.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>End-to-end inventory management and logistics handling.</span>
                </li>
              </ul>
            </Card>

            <Card className="bg-amber-500 p-8 rounded-[2rem] text-black">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black/10 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="uppercase tracking-widest text-black/60 text-[10px] font-black">Trust Factor</p>
                  <h3 className="text-xl font-bold">Secure Booking</h3>
                </div>
              </div>
              <p className="text-black/80 text-sm leading-relaxed mb-6">
                All bookings are secured via M-Pesa. We provide official receipts and a formal contract for every event.
              </p>
              <div className="flex items-center gap-2 font-bold text-sm">
                <Zap className="w-4 h-4 fill-black" /> 24-Hour Confirmation
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
