import React from 'react';
import { motion } from 'motion/react';
import { Ticket, Star, Sparkles, Gift, ArrowRight, Check, ShieldCheck, Zap, Phone, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface VoucherOption {
  id: string;
  title: string;
  type: 'DRINK' | 'EVENT' | 'CATERING';
  value: number;
  price: number;
  description: string;
  perks: string[];
  color: string;
}

const VOUCHER_OPTIONS: VoucherOption[] = [
  {
    id: 'drink-pass-5k',
    title: 'Elite Drink Pass',
    type: 'DRINK',
    value: 6000,
    price: 5000,
    description: 'Get KSh 6,000 worth of premium spirits and cocktails for just KSh 5,000.',
    perks: ['20% Extra Value', 'Valid for 1 Year', 'Transferable'],
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'event-pass-vip',
    title: 'VIP Event Access',
    type: 'EVENT',
    value: 15000,
    price: 12500,
    description: 'All-access pass for any public NJO Bar mixology event.',
    perks: ['Priority Seating', 'Welcome Drink Included', 'Gift Bag'],
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'catering-gift-25k',
    title: 'Private Bar Credit',
    type: 'CATERING',
    value: 30000,
    price: 25000,
    description: 'Credit towards private event catering or bar management services.',
    perks: ['Free Glassware Hire', 'Consultation Included', 'No Expiry'],
    color: 'from-emerald-500 to-teal-600'
  }
];

export function VoucherSystem() {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = React.useState<VoucherOption | null>(null);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showPurchase, setShowPurchase] = React.useState(false);

  const handlePurchaseInit = (option: VoucherOption) => {
    if (!user) {
      toast.error('Please login to purchase vouchers');
      return;
    }
    setSelectedOption(option);
    setShowPurchase(true);
  };

  const handleFinalPurchase = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid M-Pesa phone number");
      return;
    }
    if (!selectedOption) return;

    setLoading(true);
    try {
      // 1. Generate a temporary voucher code
      const tempCode = `NJO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // 2. Create the voucher in PENDING_PAYMENT status
      const { data, error } = await supabase.from('vouchers').insert({
        code: tempCode,
        type: selectedOption.type,
        value: selectedOption.value,
        description: selectedOption.description,
        status: 'PENDING_PAYMENT',
        issued_to: user?.id,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      }).select().single();

      if (error) throw error;

      // 3. Initiate M-Pesa STK Push
      const response = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phoneNumber.startsWith('0') ? '254' + phoneNumber.slice(1) : phoneNumber,
          amount: 1, // Using 1 KES for demo/testing
          bookingId: data.id, // Reusing the STK push endpoint with voucher ID
        }),
      });

      const result = await response.json();
      if (result.error) throw new Error(result.error);

      toast.success('M-Pesa prompt sent! Check your phone to complete the purchase.');
      setShowPurchase(false);
      setPhoneNumber('');
    } catch (error: any) {
      console.error('Voucher purchase error:', error);
      toast.error(error.message || 'Unable to process purchase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-zinc-950 min-h-screen relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
          >
            <Ticket size={12} /> NJO Gifting & Access
          </motion.div>
          <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
            Vouchers <span className="text-amber-500">&</span> Passes.
          </h2>
          <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto">
            Unlock exclusive access or gift a premium mixology experience. Buy a voucher today and redeem it for drinks, events, or private bar services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {VOUCHER_OPTIONS.map((option, i) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <Card className="bg-white/5 border-white/10 rounded-[3rem] p-1 overflow-hidden transition-all duration-500 hover:border-white/20 hover:shadow-2xl relative">
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-[0.03] group-hover:opacity-[0.08] transition-opacity", option.color)} />
                
                <CardContent className="p-8 space-y-8 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", "bg-gradient-to-br " + option.color)}>
                      <Gift size={28} />
                    </div>
                    <Badge variant="outline" className="border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40">{option.type}</Badge>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-white uppercase group-hover:text-amber-500 transition-colors">{option.title}</h3>
                    <p className="text-xs text-white/40 font-medium mt-2 leading-relaxed">{option.description}</p>
                  </div>

                  <div className="py-6 border-y border-white/5 space-y-4">
                    {option.perks.map((perk, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/60">
                        <Check size={14} className="text-amber-500" />
                        {perk}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-end justify-between pt-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Total Value</p>
                      <p className="text-3xl font-black text-white italic">KSh {option.value.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Buy For</p>
                      <p className="text-2xl font-black text-amber-500">KSh {option.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handlePurchaseInit(option)}
                    className={cn("w-full h-16 rounded-[1.5rem] font-black uppercase tracking-widest text-xs transition-all flex gap-3", "bg-white text-black hover:bg-amber-500")}
                  >
                    Get Voucher Now <ArrowRight size={16} />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 p-12 rounded-[4rem] bg-white/5 border border-white/10 backdrop-blur-3xl text-center space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Sparkles size={120} className="text-amber-500" />
          </div>
          <div className="space-y-4 relative z-10">
            <h3 className="text-3xl font-black tracking-tighter uppercase italic">Redeem a Voucher</h3>
            <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Received a gift? Access your bar credit instantly.</p>
          </div>
          <div className="max-w-md mx-auto flex gap-4 relative z-10">
            <input 
              type="text" 
              placeholder="ENTER VOUCHER CODE" 
              className="flex-1 h-16 bg-zinc-950 border border-white/10 rounded-2xl px-6 text-sm font-black text-white placeholder:text-white/10 focus:border-amber-500/50 outline-none transition-all"
            />
            <Button className="h-16 px-10 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-widest hover:bg-amber-600">
              Redeem
            </Button>
          </div>
          <div className="flex items-center justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-white/20">
            <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-500" /> Secure Encryption</span>
            <span className="flex items-center gap-2"><Zap size={14} className="text-amber-500" /> Instant Activation</span>
          </div>
        </div>
      </div>

      {/* Purchase Dialog */}
      <Dialog open={showPurchase} onOpenChange={setShowPurchase}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-md rounded-[2.5rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black tracking-tight flex items-center gap-3">
              <Gift className="text-amber-500 w-8 h-8" /> Purchase Voucher
            </DialogTitle>
            <DialogDescription className="text-white/40 text-base">
              Secure your <span className="text-white font-bold">{selectedOption?.title}</span> and unlock premium benefits.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Voucher Value</span>
                <span className="text-xl font-black text-white">KSh {selectedOption?.value.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Purchase Price</span>
                <span className="text-3xl font-black text-amber-500">KSh {selectedOption?.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-white/30">M-Pesa Phone Number</Label>
              <div className="relative">
                <Input 
                  placeholder="2547XXXXXXXX" 
                  className="bg-white/5 border-white/10 h-14 rounded-2xl pl-12 focus:ring-amber-500/50" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              </div>
              <p className="text-[10px] text-white/30 font-medium italic">You will receive a prompt on this number.</p>
            </div>

            <div className="flex gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <ShieldCheck className="text-emerald-500 w-6 h-6 shrink-0" />
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider leading-relaxed">
                Secure 256-bit encrypted transaction via Safaricom M-Pesa.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowPurchase(false)}
              className="border-white/10 text-white h-14 rounded-2xl flex-1 font-bold"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleFinalPurchase}
              disabled={loading}
              className="bg-amber-500 text-black hover:bg-amber-600 font-black h-14 rounded-2xl flex-1 shadow-[0_10px_30px_rgba(255,107,53,0.3)]"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>

  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
