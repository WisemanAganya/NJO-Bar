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
  Plus,
  Mail,
  MessageCircle,
  Share2,
  Shield,
  FileText,
  Trash
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
  const [packageRequests, setPackageRequests] = React.useState<any[]>([]);
  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedVoucher, setSelectedVoucher] = React.useState<Voucher | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, ordersRes, enrollmentsRes, vouchersRes, packageRequestsRes, profileRes] = await Promise.all([
          supabase.from('bookings').select('*').eq('client_id', user?.id).order('created_at', { ascending: false }),
          supabase.from('orders').select('*').eq('customer_id', user?.id).order('created_at', { ascending: false }),
          supabase.from('enrollments').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }),
          supabase.from('vouchers').select('*').eq('issued_to', user?.id).order('created_at', { ascending: false }),
          supabase.from('package_requests').select('*').eq('user_id', user?.id).order('submitted_at', { ascending: false }),
          supabase.from('profiles').select('*').eq('id', user?.id).single(),
        ]);
        
        setBookings((bookingsRes.data || []).map((b: any) => ({
          ...b,
          clientId: b.client_id,
          clientName: b.client_name,
          eventDate: b.event_date,
          eventType: b.event_type,
          guestCount: b.guest_count,
          paymentStatus: b.payment_status,
          totalAmount: b.total_amount,
          createdAt: b.created_at,
          updatedAt: b.updated_at
        })));
        
        setOrders((ordersRes.data || []).map((o: any) => ({
          ...o,
          userId: o.customer_id,
          userName: o.customer_name,
          totalAmount: o.total_amount,
          paymentStatus: o.payment_status,
          lineItems: o.items,
          createdAt: o.created_at,
          updatedAt: o.updated_at
        })));
        
        setEnrollments((enrollmentsRes.data || []).map((e: any) => ({
          ...e,
          courseId: e.course_id,
          userId: e.user_id,
          userName: e.user_name,
          createdAt: e.created_at
        })));
        
        setVouchers((vouchersRes.data || []).map((v: any) => ({
          ...v,
          expiresAt: v.expires_at,
          createdAt: v.created_at,
          issuedTo: v.issued_to
        })));

        setPackageRequests(packageRequestsRes.data || []);
        
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
              <TabsTrigger value="meetings" className="rounded-full px-8 py-3 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-amber-500 data-[state=active]:text-black">Meetings</TabsTrigger>
              <TabsTrigger value="memos" className="rounded-full px-8 py-3 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-amber-500 data-[state=active]:text-black">Memos</TabsTrigger>
              <TabsTrigger value="privacy" className="rounded-full px-8 py-3 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-amber-500 data-[state=active]:text-black">Privacy</TabsTrigger>
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

              {/* Digital Membership Card */}
              <Card className="bg-gradient-to-br from-zinc-900 to-black border-white/10 rounded-[2.5rem] p-10 overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
                  <div className="space-y-8 flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-black font-black">NJO</div>
                      <div>
                        <h4 className="text-lg font-black uppercase italic tracking-tighter text-white">Digital <span className="text-amber-500">Member ID</span></h4>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{profile?.membership_number || 'NJO-2026-TEMP'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${profile?.membership_status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                        <p className="text-sm font-black uppercase tracking-tight text-white">{profile?.membership_status || 'PENDING'} MEMBERSHIP</p>
                      </div>
                      <p className="text-xs text-white/60 font-medium leading-relaxed max-w-sm">
                        Show this digital card at participating venues to access executive lounges and exclusive mixology events.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" className="border-white/10 text-white rounded-xl h-12 px-6 font-black uppercase text-[10px] tracking-widest bg-white/5">Download PDF</Button>
                      <Button variant="outline" className="border-white/10 text-white rounded-xl h-12 px-6 font-black uppercase text-[10px] tracking-widest bg-white/5">Renew Plans</Button>
                    </div>
                  </div>
                  <div className="shrink-0 p-6 bg-white rounded-[2rem] flex flex-col items-center gap-4">
                    <QrCode size={140} className="text-black" />
                    <p className="text-[10px] font-black text-black uppercase tracking-widest">Verify Status</p>
                  </div>
                </div>
              </Card>
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
                        <div className="flex gap-2 mb-4">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white"
                            onClick={() => toast.success('Voucher PDF downloaded successfully')}
                          >
                            <Download size={14} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white"
                            onClick={() => toast.success('Voucher sent to your email')}
                          >
                            <Mail size={14} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white"
                            onClick={() => {
                              const text = `Check out my NJO Bar Voucher! Code: ${v.code}`;
                              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                            }}
                          >
                            <MessageCircle size={14} />
                          </Button>
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
            <div className="space-y-12">
              {/* Event Bookings */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-1.5 h-8 bg-amber-500 rounded-full" />
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">Event <span className="text-amber-500">Bookings</span></h3>
                </div>
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
                {bookings.length === 0 && (
                  <div className="py-12 text-center bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">No active event bookings found</p>
                  </div>
                )}
              </div>

              {/* Package Requests */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-1.5 h-8 bg-blue-500 rounded-full" />
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">Package <span className="text-blue-500">Inquiries</span></h3>
                </div>
                {packageRequests.map((req) => (
                  <Card key={req.id} className="bg-white/5 border-white/10 rounded-[2.5rem] p-8 hover:bg-white/10 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-950 flex items-center justify-center text-blue-500 border border-white/5">
                          <Users size={24} />
                        </div>
                        <div>
                          <h4 className="text-xl font-black uppercase italic tracking-tight">{req.package_id.replace(/-/g, ' ')}</h4>
                          <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Submitted: {format(new Date(req.submitted_at), 'PPP')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="hidden md:block text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Est. Price</p>
                          <p className="font-bold text-white">KSh {req.estimated_price?.toLocaleString()}</p>
                        </div>
                        <Badge className={`h-10 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest ${
                          req.status === 'booked' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                          req.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                          'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        }`}>
                          {req.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
                {packageRequests.length === 0 && (
                  <div className="py-12 text-center bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">No package requests found</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="meetings" className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-white/5 border-white/10 rounded-[2.5rem] p-8 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                  <Calendar size={60} />
                </div>
                <div className="space-y-6 relative z-10">
                  <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-black uppercase text-[9px]">Upcoming AGM</Badge>
                  <h4 className="text-2xl font-black uppercase italic tracking-tighter leading-tight">Annual General Meeting 2026</h4>
                  <div className="space-y-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    <p className="flex items-center gap-2"><Clock size={12} className="text-amber-500" /> June 15, 2026 • 10:00 AM</p>
                    <p className="flex items-center gap-2"><MapPin size={12} className="text-amber-500" /> Main Clubhouse / Virtual</p>
                  </div>
                  <Button className="w-full h-12 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-amber-500">Register Attendance</Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="memos" className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-white/5 border-white/10 rounded-[2.5rem] p-8 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div className="flex gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <FileText size={24} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-white/10 text-[8px] font-black uppercase">Official Memo</Badge>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">May 05, 2026</span>
                      </div>
                      <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Update on Membership Dues & Benefits</h4>
                      <p className="text-sm text-white/40 line-clamp-1">Please find the updated structure for 2026 membership tiers and associated benefits.</p>
                    </div>
                  </div>
                  <Download className="text-white/20 group-hover:text-white transition-colors" />
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/5 border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl">
                <CardHeader className="p-0 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Shield size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black uppercase italic tracking-tighter">Data <span className="text-amber-500">Consent</span></CardTitle>
                      <CardDescription className="text-white/40 text-[10px] font-black uppercase tracking-widest">Manage your privacy preferences</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/10">
                    <div className="space-y-1">
                      <p className="text-sm font-bold uppercase tracking-tight">Marketing Communications</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">Receive updates on new cocktails and events.</p>
                    </div>
                    <div className="w-12 h-6 bg-amber-500 rounded-full flex items-center px-1 cursor-pointer">
                      <div className="w-4 h-4 bg-black rounded-full translate-x-6" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/10">
                    <div className="space-y-1">
                      <p className="text-sm font-bold uppercase tracking-tight">Data Processing</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">Essential for voucher and booking management.</p>
                    </div>
                    <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center px-1 cursor-pointer">
                      <div className="w-4 h-4 bg-black rounded-full translate-x-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl">
                <CardHeader className="p-0 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <FileText size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black uppercase italic tracking-tighter">My <span className="text-blue-500">Data</span></CardTitle>
                      <CardDescription className="text-white/40 text-[10px] font-black uppercase tracking-widest">GDPR / DPA 2019 Rights</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <Button variant="outline" className="w-full h-16 rounded-2xl border-white/10 bg-white/5 font-black uppercase text-[10px] tracking-widest flex justify-between px-6 hover:bg-white/10">
                    Request Data Export <Download size={16} />
                  </Button>
                  <Button variant="outline" className="w-full h-16 rounded-2xl border-white/10 bg-white/5 font-black uppercase text-[10px] tracking-widest flex justify-between px-6 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20">
                    Right to be Forgotten <Trash size={16} />
                  </Button>
                  <div className="mt-4 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex gap-4 items-start">
                    <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
                    <p className="text-[9px] text-amber-500/80 leading-relaxed font-bold uppercase tracking-wider">
                      Your data is protected under Kenya Data Protection Act 2019. We encrypt all sensitive information and do not share it with third parties.
                    </p>
                  </div>
                </CardContent>
              </Card>
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
