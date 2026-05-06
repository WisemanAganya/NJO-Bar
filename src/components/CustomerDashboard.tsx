import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  ShoppingBag, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  GraduationCap, 
  Ticket, 
  Building2, 
  User, 
  ArrowRight,
  ShieldCheck,
  QrCode,
  Download,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { Booking, Order, Voucher } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function CustomerDashboard({ user }: { user: any }) {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [enrollments, setEnrollments] = React.useState<any[]>([]);
  const [vouchers, setVouchers] = React.useState<Voucher[]>([]);
  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedVoucher, setSelectedVoucher] = React.useState<Voucher | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, ordersRes, enrollmentsRes, vouchersRes, profileRes] = await Promise.all([
          supabase.from('bookings').select('*').eq('client_id', user?.id).order('created_at', { ascending: false }),
          supabase.from('orders').select('*').eq('customer_id', user?.id).order('created_at', { ascending: false }),
          supabase.from('enrollments').select('*').eq('phone', user?.user_metadata?.phone || '').order('created_at', { ascending: false }),
          supabase.from('vouchers').select('*').eq('issued_to', user?.id).order('created_at', { ascending: false }),
          supabase.from('profiles').select('*').eq('id', user?.id).single(),
        ]);
        
        setBookings(bookingsRes.data || []);
        setOrders(ordersRes.data || []);
        setEnrollments(enrollmentsRes.data || []);
        setVouchers(vouchersRes.data || []);
        setProfile(profileRes.data || null);
      } catch (error: any) {
        console.error('Dashboard fetch error:', error);
        toast.error('Unable to load your dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchData();
  }, [user]);

  const handleUpdateProfile = async (type: 'CORPORATE' | 'EVENT_HOST' | 'INDIVIDUAL') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ account_type: type })
        .eq('id', user.id);
      
      if (error) throw error;
      setProfile({ ...profile, account_type: type });
      toast.success(`Account upgraded to ${type.replace('_', ' ')}`);
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 font-black uppercase tracking-widest text-xs">Accessing Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Profile Summary Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[2rem] bg-amber-500 flex items-center justify-center shadow-[0_10px_40px_rgba(255,107,53,0.3)]">
              {profile?.account_type === 'CORPORATE' ? <Building2 className="w-10 h-10 text-black" /> : <User className="w-10 h-10 text-black" />}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-amber-500 mb-1">
                {profile?.account_type || 'Individual'} Member
              </p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
                {user?.user_metadata?.display_name || 'Mixology Enthusiast'}
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-white/10 text-white rounded-2xl h-14 px-8 font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-all">
                  Manage Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-950 border-white/10 text-white rounded-[3rem] p-10 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-black tracking-tighter uppercase italic">Profile <span className="text-amber-500">Settings</span></DialogTitle>
                  <DialogDescription className="text-white/40">Choose your membership type to unlock corporate features.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 py-8">
                  <Button 
                    onClick={() => handleUpdateProfile('CORPORATE')}
                    className={`h-20 rounded-2xl flex items-center justify-between px-6 transition-all ${profile?.account_type === 'CORPORATE' ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                  >
                    <div className="text-left">
                      <p className="font-black uppercase tracking-widest text-xs">Corporate Account</p>
                      <p className="text-[10px] font-bold opacity-60">Ideal for companies & event hostings</p>
                    </div>
                    <Building2 />
                  </Button>
                  <Button 
                    onClick={() => handleUpdateProfile('EVENT_HOST')}
                    className={`h-20 rounded-2xl flex items-center justify-between px-6 transition-all ${profile?.account_type === 'EVENT_HOST' ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                  >
                    <div className="text-left">
                      <p className="font-black uppercase tracking-widest text-xs">Event Host</p>
                      <p className="text-[10px] font-bold opacity-60">Managing multiple events & venues</p>
                    </div>
                    <Calendar />
                  </Button>
                  <Button 
                    onClick={() => handleUpdateProfile('INDIVIDUAL')}
                    className={`h-20 rounded-2xl flex items-center justify-between px-6 transition-all ${profile?.account_type === 'INDIVIDUAL' || !profile?.account_type ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                  >
                    <div className="text-left">
                      <p className="font-black uppercase tracking-widest text-xs">Individual</p>
                      <p className="text-[10px] font-bold opacity-60">Personal bookings & experiences</p>
                    </div>
                    <User />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button className="bg-amber-500 text-black hover:bg-amber-600 rounded-2xl h-14 px-8 font-black uppercase text-xs tracking-widest shadow-[0_10px_30px_rgba(255,107,53,0.2)]">
              Quick Booking <Plus className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-12">
          <div className="flex overflow-x-auto pb-4 scrollbar-hide">
            <TabsList className="bg-white/5 border border-white/10 p-1.5 rounded-[2rem] h-auto flex-nowrap">
              <TabsTrigger value="overview" className="rounded-full px-8 py-3 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-amber-500 data-[state=active]:text-black">Overview</TabsTrigger>
              <TabsTrigger value="bookings" className="rounded-full px-8 py-3 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-amber-500 data-[state=active]:text-black">Bookings</TabsTrigger>
              <TabsTrigger value="vouchers" className="rounded-full px-8 py-3 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-amber-500 data-[state=active]:text-black">Vouchers</TabsTrigger>
              <TabsTrigger value="academy" className="rounded-full px-8 py-3 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-amber-500 data-[state=active]:text-black">Academy</TabsTrigger>
              <TabsTrigger value="orders" className="rounded-full px-8 py-3 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-amber-500 data-[state=active]:text-black">Drink Orders</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-12">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Active Bookings', value: bookings.filter(b => b.status === 'confirmed').length, icon: Calendar, color: 'text-amber-500' },
                { label: 'Stored Vouchers', value: vouchers.filter(v => v.status === 'ACTIVE').length, icon: Ticket, color: 'text-emerald-500' },
                { label: 'Academy Courses', value: enrollments.length, icon: GraduationCap, color: 'text-blue-500' },
                { label: 'Total Spent', value: `KSh ${(orders.reduce((acc, curr) => acc + curr.totalAmount, 0) + bookings.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0)).toLocaleString()}`, icon: CreditCard, color: 'text-white' },
              ].map((kpi, i) => (
                <Card key={i} className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden p-8 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-white/5 ${kpi.color}`}>
                      <kpi.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{kpi.label}</p>
                  <p className="text-3xl font-black mt-1">{kpi.value}</p>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <Card className="bg-white/5 border-white/10 rounded-[2.5rem] p-10 overflow-hidden">
                <CardHeader className="p-0 mb-8">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">Upcoming <span className="text-amber-500">Event</span></CardTitle>
                    <Calendar className="text-white/20" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {bookings.filter(b => b.status === 'confirmed')[0] ? (
                    <div className="space-y-6">
                      <div className="p-8 rounded-[2rem] bg-amber-500 text-black shadow-2xl shadow-amber-500/20">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status: Confirmed</p>
                            <h4 className="text-2xl font-black uppercase italic">{bookings.filter(b => b.status === 'confirmed')[0].eventType}</h4>
                          </div>
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div className="flex gap-8 text-sm">
                          <div>
                            <p className="font-black">Date</p>
                            <p className="font-bold opacity-80">{format(new Date(bookings.filter(b => b.status === 'confirmed')[0].eventDate), 'MMM dd, yyyy')}</p>
                          </div>
                          <div>
                            <p className="font-black">Location</p>
                            <p className="font-bold opacity-80">{bookings.filter(b => b.status === 'confirmed')[0].location}</p>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" className="w-full text-white/40 hover:text-white font-black uppercase text-[10px] tracking-[0.3em]">View Full Details</Button>
                    </div>
                  ) : (
                    <div className="py-12 text-center bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20">No confirmed events found</p>
                      <Button variant="link" className="text-amber-500 font-bold mt-2">Book an Experience</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-amber-500/5 border border-amber-500/20 rounded-[2.5rem] p-8 hover:bg-amber-500/10 transition-colors cursor-pointer group">
                  <Ticket className="w-10 h-10 text-amber-500 mb-6 group-hover:scale-110 transition-transform" />
                  <h4 className="text-lg font-black uppercase italic mb-2">Claim Voucher</h4>
                  <p className="text-xs text-white/40 leading-relaxed">Enter a gift code to add credit to your account balance.</p>
                  <ArrowRight className="mt-6 text-amber-500" />
                </Card>
                <Card className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 hover:bg-emerald-500/10 transition-colors cursor-pointer group">
                  <ShieldCheck className="w-10 h-10 text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />
                  <h4 className="text-lg font-black uppercase italic mb-2">Corporate Perks</h4>
                  <p className="text-xs text-white/40 leading-relaxed">Unlock volume discounts for company networking events.</p>
                  <ArrowRight className="mt-6 text-emerald-500" />
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vouchers">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {vouchers.map((v) => (
                <motion.div 
                  key={v.id}
                  whileHover={{ y: -5 }}
                  className="relative"
                >
                  <Card className={`rounded-[2.5rem] overflow-hidden border-white/10 transition-all ${v.status === 'REDEEMED' ? 'bg-zinc-900 opacity-50 grayscale' : 'bg-white/5 hover:border-amber-500/50'}`}>
                    <div className="h-4 bg-amber-500" />
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <Badge className="bg-amber-500/10 text-amber-500 font-black border-amber-500/20 text-[10px] tracking-widest uppercase">{v.type}</Badge>
                        <p className="text-xs font-black text-white/20 uppercase tracking-widest">{v.status}</p>
                      </div>
                      <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">KSh {v.value.toLocaleString()}</h3>
                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                          <span>Voucher Code</span>
                          <span className="text-white select-all">{v.code}</span>
                        </div>
                        <Button 
                          onClick={() => setSelectedVoucher(v)}
                          disabled={v.status === 'REDEEMED'}
                          className="w-full h-12 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-amber-500 transition-colors"
                        >
                          {v.status === 'REDEEMED' ? 'Redeemed' : 'Redeem Now'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
              {vouchers.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                  <Ticket size={48} className="text-white/5 mx-auto mb-4" />
                  <p className="text-xs font-black text-white/20 uppercase tracking-[0.4em]">No vouchers in your wallet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <div className="space-y-6">
              {bookings.map((booking) => (
                <Card key={booking.id} className="bg-white/5 border-white/10 rounded-[2.5rem] p-8 hover:bg-white/10 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-zinc-950 flex items-center justify-center text-amber-500 border border-white/5">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black uppercase italic tracking-tight">{booking.eventType}</h4>
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{format(new Date(booking.eventDate), 'PPPP')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="hidden md:block text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Guest Count</p>
                        <p className="font-bold text-white">{booking.guestCount} People</p>
                      </div>
                      <Badge className={`h-10 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest ${
                        booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                        booking.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {booking.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="text-white/20 hover:text-white rounded-full">
                        <ArrowRight size={20} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Secure Redemption Dialog (Fraud Prevention) */}
      <Dialog open={!!selectedVoucher} onOpenChange={(open) => !open && setSelectedVoucher(null)}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white rounded-[3rem] p-0 overflow-hidden max-w-sm">
          <div className="p-10 space-y-8 text-center">
            <div className="flex justify-center">
              <div className="p-6 rounded-[2.5rem] bg-white text-black shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                {/* Mock QR Code for Redemption */}
                <QrCode size={180} />
              </div>
            </div>
            
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mb-2">Secure Redemption Code</h3>
              <p className="text-3xl font-black tracking-tighter uppercase italic">{selectedVoucher?.code}</p>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-4">Show this QR code to the NJO Bar staff at the event.</p>
            </div>

            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex gap-4 items-start text-left">
              <ShieldCheck className="w-6 h-6 text-amber-500 shrink-0" />
              <p className="text-[10px] text-amber-500/80 leading-relaxed font-bold uppercase tracking-wider">
                This code is encrypted and linked to your biometric session. It will expire in 15 minutes.
              </p>
            </div>

            <Button onClick={() => setSelectedVoucher(null)} className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10">
              Close Scanner
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
